import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, paddle-signature',
};

// Verify Paddle webhook signature
async function verifySignature(payload: string, signature: string, secret: string): Promise<boolean> {
  try {
    const parts = signature.split(';');
    const tsHeader = parts.find(p => p.startsWith('ts='));
    const h1Header = parts.find(p => p.startsWith('h1='));
    
    if (!tsHeader || !h1Header) {
      console.error('Missing ts or h1 in signature');
      return false;
    }
    
    const ts = tsHeader.split('=')[1];
    const h1 = h1Header.split('=')[1];
    
    const signedPayload = `${ts}:${payload}`;
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    
    const signatureBuffer = await crypto.subtle.sign(
      'HMAC',
      key,
      encoder.encode(signedPayload)
    );
    
    const computedSignature = Array.from(new Uint8Array(signatureBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    
    return computedSignature === h1;
  } catch (error) {
    console.error('Signature verification error:', error);
    return false;
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const webhookSecret = Deno.env.get('PADDLE_WEBHOOK_SECRET');
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    if (!webhookSecret) {
      console.error('Missing PADDLE_WEBHOOK_SECRET');
      return new Response(JSON.stringify({ error: 'Server configuration error' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const signature = req.headers.get('paddle-signature');
    const rawBody = await req.text();
    
    console.log('Received Paddle webhook');
    console.log('Signature present:', !!signature);
    
    if (signature) {
      const isValid = await verifySignature(rawBody, signature, webhookSecret);
      if (!isValid) {
        console.error('Invalid webhook signature');
        return new Response(JSON.stringify({ error: 'Invalid signature' }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      console.log('Signature verified successfully');
    }

    const event = JSON.parse(rawBody);
    const eventType = event.event_type;
    const data = event.data;
    
    console.log('Event type:', eventType);
    console.log('Event data:', JSON.stringify(data, null, 2));

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // Extract user_id from custom_data
    const userId = data.custom_data?.user_id;
    if (!userId) {
      console.error('No user_id in custom_data');
      return new Response(JSON.stringify({ error: 'Missing user_id in custom_data' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const subscriptionId = data.id;
    const customerId = data.customer_id;
    const status = data.status;
    const planType = data.items?.[0]?.price?.billing_cycle?.interval === 'year' ? 'yearly' : 'monthly';
    const currentPeriodStart = data.current_billing_period?.starts_at;
    const currentPeriodEnd = data.current_billing_period?.ends_at;
    const scheduledChange = data.scheduled_change;

    switch (eventType) {
      case 'subscription.activated':
      case 'subscription.created': {
        console.log(`Processing ${eventType} for user ${userId}`);
        
        // Upsert subscription record
        const { error: subError } = await supabase
          .from('subscriptions')
          .upsert({
            user_id: userId,
            paddle_subscription_id: subscriptionId,
            paddle_customer_id: customerId,
            status: 'active',
            plan_type: planType,
            current_period_start: currentPeriodStart,
            current_period_end: currentPeriodEnd,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'paddle_subscription_id'
          });

        if (subError) {
          console.error('Error upserting subscription:', subError);
        }

        // Update user_usage to premium
        const { error: usageError } = await supabase
          .from('user_usage')
          .update({ is_premium: true, updated_at: new Date().toISOString() })
          .eq('user_id', userId);

        if (usageError) {
          console.error('Error updating user_usage:', usageError);
        }

        console.log(`User ${userId} upgraded to premium`);
        break;
      }

      case 'subscription.updated': {
        console.log(`Processing subscription.updated for user ${userId}`);
        
        const updateData: Record<string, unknown> = {
          status: status,
          plan_type: planType,
          current_period_start: currentPeriodStart,
          current_period_end: currentPeriodEnd,
          updated_at: new Date().toISOString()
        };

        if (scheduledChange?.action === 'cancel') {
          updateData.cancel_at = scheduledChange.effective_at;
        }

        const { error: subError } = await supabase
          .from('subscriptions')
          .update(updateData)
          .eq('paddle_subscription_id', subscriptionId);

        if (subError) {
          console.error('Error updating subscription:', subError);
        }

        // Update premium status based on subscription status
        const isPremium = status === 'active' || status === 'trialing';
        const { error: usageError } = await supabase
          .from('user_usage')
          .update({ is_premium: isPremium, updated_at: new Date().toISOString() })
          .eq('user_id', userId);

        if (usageError) {
          console.error('Error updating user_usage:', usageError);
        }

        console.log(`Subscription updated for user ${userId}, premium: ${isPremium}`);
        break;
      }

      case 'subscription.canceled':
      case 'subscription.paused': {
        console.log(`Processing ${eventType} for user ${userId}`);
        
        const { error: subError } = await supabase
          .from('subscriptions')
          .update({
            status: status === 'canceled' ? 'canceled' : 'paused',
            updated_at: new Date().toISOString()
          })
          .eq('paddle_subscription_id', subscriptionId);

        if (subError) {
          console.error('Error updating subscription:', subError);
        }

        // Only remove premium if actually canceled (not just scheduled)
        if (status === 'canceled') {
          const { error: usageError } = await supabase
            .from('user_usage')
            .update({ is_premium: false, updated_at: new Date().toISOString() })
            .eq('user_id', userId);

          if (usageError) {
            console.error('Error updating user_usage:', usageError);
          }

          console.log(`User ${userId} downgraded to free`);
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${eventType}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});