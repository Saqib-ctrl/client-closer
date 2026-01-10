import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const paddleApiKey = Deno.env.get('PADDLE_API_KEY');
    const paddleEnvironment = Deno.env.get('PADDLE_ENVIRONMENT') || 'sandbox';
    
    if (!paddleApiKey) {
      return new Response(JSON.stringify({ error: 'Server configuration error' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Verify user authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    console.log(`Cancel subscription request from user: ${user.id}`);

    // Get user's subscription using service role
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);
    const { data: subscription, error: subError } = await supabaseAdmin
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single();

    if (subError || !subscription) {
      console.error('No active subscription found:', subError);
      return new Response(JSON.stringify({ error: 'No active subscription found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const paddleSubscriptionId = subscription.paddle_subscription_id;
    console.log(`Canceling Paddle subscription: ${paddleSubscriptionId}`);

    // Cancel subscription in Paddle (schedule cancellation at period end)
    const paddleBaseUrl = paddleEnvironment === 'production' 
      ? 'https://api.paddle.com'
      : 'https://sandbox-api.paddle.com';

    const paddleResponse = await fetch(
      `${paddleBaseUrl}/subscriptions/${paddleSubscriptionId}/cancel`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${paddleApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          effective_from: 'next_billing_period'
        })
      }
    );

    if (!paddleResponse.ok) {
      const errorText = await paddleResponse.text();
      console.error('Paddle API error:', errorText);
      return new Response(JSON.stringify({ error: 'Failed to cancel subscription' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const paddleData = await paddleResponse.json();
    console.log('Paddle cancellation response:', JSON.stringify(paddleData, null, 2));

    // Update local subscription record
    const cancelAt = paddleData.data?.scheduled_change?.effective_at || subscription.current_period_end;
    
    const { error: updateError } = await supabaseAdmin
      .from('subscriptions')
      .update({
        cancel_at: cancelAt,
        updated_at: new Date().toISOString()
      })
      .eq('id', subscription.id);

    if (updateError) {
      console.error('Error updating subscription:', updateError);
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Subscription will be canceled at the end of the billing period',
      cancel_at: cancelAt
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});