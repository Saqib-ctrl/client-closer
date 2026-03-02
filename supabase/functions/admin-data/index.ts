import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseClient = createClient(supabaseUrl, supabaseServiceKey);

    // Verify admin
    const token = req.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const { data: { user } } = await createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!).auth.getUser(token);
    if (!user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const { data: roleData } = await supabaseClient.from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin").single();
    if (!roleData) return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const { action } = await req.json();

    if (action === "get_dashboard") {
      // Get all users from auth
      const { data: { users }, error: usersError } = await supabaseClient.auth.admin.listUsers({ perPage: 1000 });
      
      // Get all usage data
      const { data: usageData } = await supabaseClient.from("user_usage").select("*");
      
      // Get all subscriptions
      const { data: subscriptions } = await supabaseClient.from("subscriptions").select("*");
      
      // Get all profiles
      const { data: profiles } = await supabaseClient.from("profiles").select("*");

      // Get counts
      const { count: proposalCount } = await supabaseClient.from("proposals").select("*", { count: "exact", head: true });
      const { count: mockupCount } = await supabaseClient.from("mockups").select("*", { count: "exact", head: true });
      const { count: coverLetterCount } = await supabaseClient.from("cover_letters").select("*", { count: "exact", head: true });
      const { count: emailCount } = await supabaseClient.from("emails").select("*", { count: "exact", head: true });
      const { count: invoiceCount } = await supabaseClient.from("invoices").select("*", { count: "exact", head: true });
      const { count: templateCount } = await supabaseClient.from("templates").select("*", { count: "exact", head: true });
      const { count: clientCount } = await supabaseClient.from("clients").select("*", { count: "exact", head: true });
      const { count: projectCount } = await supabaseClient.from("projects").select("*", { count: "exact", head: true });
      const { count: portfolioCount } = await supabaseClient.from("portfolios").select("*", { count: "exact", head: true });

      // Get user roles
      const { data: userRoles } = await supabaseClient.from("user_roles").select("*");

      return new Response(JSON.stringify({
        users: users || [],
        usageData: usageData || [],
        subscriptions: subscriptions || [],
        profiles: profiles || [],
        userRoles: userRoles || [],
        stats: {
          totalUsers: users?.length || 0,
          premiumUsers: usageData?.filter((u: any) => u.is_premium).length || 0,
          totalProposals: proposalCount || 0,
          totalMockups: mockupCount || 0,
          totalCoverLetters: coverLetterCount || 0,
          totalEmails: emailCount || 0,
          totalInvoices: invoiceCount || 0,
          totalTemplates: templateCount || 0,
          totalClients: clientCount || 0,
          totalProjects: projectCount || 0,
          totalPortfolios: portfolioCount || 0,
        },
      }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }


    if (action === "update_user_premium") {
      const body = await req.clone().json();
      const { target_user_id, is_premium } = body;
      
      const { error } = await supabaseClient
        .from("user_usage")
        .update({ is_premium })
        .eq("user_id", target_user_id);
      
      if (error) return new Response(JSON.stringify({ error: error.message }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (action === "update_user_limits") {
      const body = await req.clone().json();
      const { target_user_id, proposals_limit, mockups_limit, cover_letters_limit, emails_limit } = body;
      
      const { error } = await supabaseClient
        .from("user_usage")
        .update({ proposals_limit, mockups_limit, cover_letters_limit, emails_limit })
        .eq("user_id", target_user_id);
      
      if (error) return new Response(JSON.stringify({ error: error.message }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (action === "reset_user_usage") {
      const body = await req.clone().json();
      const { target_user_id } = body;
      
      const { error } = await supabaseClient
        .from("user_usage")
        .update({ proposals_generated: 0, mockups_generated: 0, cover_letters_generated: 0, emails_generated: 0 })
        .eq("user_id", target_user_id);
      
      if (error) return new Response(JSON.stringify({ error: error.message }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (action === "delete_user") {
      const body = await req.clone().json();
      const { target_user_id } = body;
      
      const { error } = await supabaseClient.auth.admin.deleteUser(target_user_id);
      if (error) return new Response(JSON.stringify({ error: error.message }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (action === "add_admin_role") {
      const body = await req.clone().json();
      const { target_user_id } = body;
      
      const { error } = await supabaseClient
        .from("user_roles")
        .insert({ user_id: target_user_id, role: "admin" });
      
      if (error) return new Response(JSON.stringify({ error: error.message }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (action === "remove_admin_role") {
      const body = await req.clone().json();
      const { target_user_id } = body;
      
      const { error } = await supabaseClient
        .from("user_roles")
        .delete()
        .eq("user_id", target_user_id)
        .eq("role", "admin");
      
      if (error) return new Response(JSON.stringify({ error: error.message }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify({ error: "Unknown action" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
