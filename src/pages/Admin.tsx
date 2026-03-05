import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import {
  Shield, Users, Crown, BarChart3, Loader2, ArrowLeft,
  FileText, ImageIcon, Mail, Send, Receipt, BookTemplate,
  Briefcase, Layout, RefreshCw, Trash2, UserPlus, UserMinus,
  ChevronDown, ChevronUp, Search, TrendingUp
} from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface AdminStats {
  totalUsers: number;
  premiumUsers: number;
  totalProposals: number;
  totalMockups: number;
  totalCoverLetters: number;
  totalEmails: number;
  totalInvoices: number;
  totalTemplates: number;
  totalClients: number;
  totalProjects: number;
  totalPortfolios: number;
}

interface UserData {
  id: string;
  email?: string;
  created_at: string;
  last_sign_in_at?: string;
}

interface UsageData {
  user_id: string;
  is_premium: boolean;
  proposals_generated: number;
  proposals_limit: number;
  mockups_generated: number;
  mockups_limit: number;
  cover_letters_generated: number;
  cover_letters_limit: number;
  emails_generated: number;
  emails_limit: number;
}

interface UserRole {
  user_id: string;
  role: string;
}

const Admin = () => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<UserData[]>([]);
  const [usageData, setUsageData] = useState<UsageData[]>([]);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkAdmin();
  }, []);

  const checkAdmin = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke("check-admin", {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (error || !data?.is_admin) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }
      setIsAdmin(true);
      fetchDashboard(session.access_token);
    } catch {
      setIsAdmin(false);
      setLoading(false);
    }
  };

  const fetchDashboard = async (token?: string) => {
    if (!token) {
      const { data: { session } } = await supabase.auth.getSession();
      token = session?.access_token;
    }
    if (!token) return;

    try {
      const { data, error } = await supabase.functions.invoke("admin-data", {
        body: { action: "get_dashboard" },
        headers: { Authorization: `Bearer ${token}` },
      });
      if (error) throw error;
      setStats(data.stats);
      setUsers(data.users);
      setUsageData(data.usageData);
      setUserRoles(data.userRoles);
    } catch (e: any) {
      toast({ title: "Error loading admin data", description: e.message, variant: "destructive" });
    }
    setLoading(false);
  };

  const adminAction = async (action: string, body: Record<string, any>) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    setActionLoading(body.target_user_id || action);
    try {
      const { data, error } = await supabase.functions.invoke("admin-data", {
        body: { action, ...body },
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (error) throw error;
      if (data.error) throw new Error(data.error);
      toast({ title: "Action completed ✅" });
      fetchDashboard();
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
    setActionLoading(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto" />
          <p className="text-sm text-muted-foreground">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4 max-w-md px-6">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
            <Shield className="w-8 h-8 text-destructive" />
          </div>
          <h1 className="text-2xl font-bold">Access Denied</h1>
          <p className="text-muted-foreground">You don't have permission to access this page.</p>
          <Button onClick={() => navigate("/dashboard")} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const filteredUsers = users.filter((u) =>
    u.email?.toLowerCase().includes(searchQuery.toLowerCase()) || u.id.includes(searchQuery)
  );

  const getUserUsage = (userId: string) => usageData.find((u) => u.user_id === userId);
  const isUserAdmin = (userId: string) => userRoles.some((r) => r.user_id === userId && r.role === "admin");

  const statCards = [
    { label: "Total Users", value: stats?.totalUsers || 0, icon: Users, color: "text-primary" },
    { label: "Pro Users", value: stats?.premiumUsers || 0, icon: Crown, color: "text-yellow-500" },
    { label: "Proposals", value: stats?.totalProposals || 0, icon: FileText, color: "text-blue-500" },
    { label: "Mockups", value: stats?.totalMockups || 0, icon: ImageIcon, color: "text-purple-500" },
    { label: "Cover Letters", value: stats?.totalCoverLetters || 0, icon: Mail, color: "text-green-500" },
    { label: "Emails", value: stats?.totalEmails || 0, icon: Send, color: "text-orange-500" },
    { label: "Invoices", value: stats?.totalInvoices || 0, icon: Receipt, color: "text-pink-500" },
    { label: "Templates", value: stats?.totalTemplates || 0, icon: BookTemplate, color: "text-cyan-500" },
    { label: "Clients", value: stats?.totalClients || 0, icon: Briefcase, color: "text-teal-500" },
    { label: "Projects", value: stats?.totalProjects || 0, icon: TrendingUp, color: "text-indigo-500" },
    { label: "Portfolios", value: stats?.totalPortfolios || 0, icon: Layout, color: "text-rose-500" },
  ];

  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "users", label: "Users", icon: Users },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center">
                <Shield className="w-4 h-4 text-destructive" />
              </div>
              <span className="font-bold text-lg">Admin Dashboard</span>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => fetchDashboard()}>
            <RefreshCw className="w-4 h-4 mr-2" /> Refresh
          </Button>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b border-border bg-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all ${
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="w-4 h-4" /> {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {statCards.map((card, i) => {
                const Icon = card.icon;
                return (
                  <motion.div
                    key={card.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="rounded-xl border border-border bg-card p-4"
                  >
                    <Icon className={`w-5 h-5 ${card.color} mb-2`} />
                    <p className="text-2xl font-bold">{card.value}</p>
                    <p className="text-xs text-muted-foreground">{card.label}</p>
                  </motion.div>
                );
              })}
            </div>

            {/* Business Metrics */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="font-semibold mb-4">Business Metrics</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground">Estimated MRR</p>
                  <p className="text-3xl font-bold text-primary">
                    ${stats ? (stats.premiumUsers * 19).toLocaleString() : 0}
                  </p>
                  <p className="text-xs text-muted-foreground">Pro users × $19/mo</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Estimated ARR</p>
                  <p className="text-3xl font-bold">
                    ${stats ? (stats.premiumUsers * 19 * 12).toLocaleString() : 0}
                  </p>
                  <p className="text-xs text-muted-foreground">Projected annual revenue</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Conversion Rate</p>
                  <p className="text-3xl font-bold text-primary">
                    {stats && stats.totalUsers > 0 ? ((stats.premiumUsers / stats.totalUsers) * 100).toFixed(1) : 0}%
                  </p>
                  <p className="text-xs text-muted-foreground">Free → Pro</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg Content / User</p>
                  <p className="text-3xl font-bold">
                    {stats && stats.totalUsers > 0
                      ? (
                          (stats.totalProposals + stats.totalCoverLetters + stats.totalEmails + stats.totalMockups) /
                          stats.totalUsers
                        ).toFixed(1)
                      : 0}
                  </p>
                  <p className="text-xs text-muted-foreground">Generations per user</p>
                </div>
              </div>
            </div>

            {/* Platform Health */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="font-semibold mb-4">Platform Health</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground">Total Generations</p>
                  <p className="text-3xl font-bold">
                    {stats
                      ? stats.totalProposals + stats.totalCoverLetters + stats.totalEmails + stats.totalMockups
                      : 0}
                  </p>
                  <p className="text-xs text-muted-foreground">All tools combined</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Revenue per User</p>
                  <p className="text-3xl font-bold">
                    ${stats && stats.totalUsers > 0 ? ((stats.premiumUsers * 19) / stats.totalUsers).toFixed(2) : "0.00"}
                  </p>
                  <p className="text-xs text-muted-foreground">ARPU (monthly)</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Free Users</p>
                  <p className="text-3xl font-bold">
                    {stats ? stats.totalUsers - stats.premiumUsers : 0}
                  </p>
                  <p className="text-xs text-muted-foreground">Conversion opportunity</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by email or user ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <p className="text-sm text-muted-foreground">{filteredUsers.length} users found</p>

            <div className="space-y-2">
              {filteredUsers.map((user) => {
                const usage = getUserUsage(user.id);
                const admin = isUserAdmin(user.id);
                const isExpanded = expandedUser === user.id;

                return (
                  <div key={user.id} className="rounded-xl border border-border bg-card overflow-hidden">
                    <div
                      className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/30 transition-colors"
                      onClick={() => setExpandedUser(isExpanded ? null : user.id)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-semibold text-primary">
                            {user.email?.charAt(0).toUpperCase() || "?"}
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-sm">{user.email || "No email"}</p>
                            {usage?.is_premium && (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-600 font-medium">
                                PRO
                              </span>
                            )}
                            {admin && (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-destructive/10 text-destructive font-medium">
                                ADMIN
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Joined {new Date(user.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {usage && (
                          <span className="text-xs text-muted-foreground hidden sm:inline">
                            {(usage.proposals_generated || 0) + (usage.mockups_generated || 0) + (usage.cover_letters_generated || 0) + (usage.emails_generated || 0)} generations
                          </span>
                        )}
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="border-t border-border p-4 space-y-4 bg-muted/20">
                        {/* Usage Stats */}
                        {usage && (
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {[
                              { label: "Proposals", used: usage.proposals_generated, limit: usage.proposals_limit },
                              { label: "Mockups", used: usage.mockups_generated, limit: usage.mockups_limit },
                              { label: "Cover Letters", used: usage.cover_letters_generated, limit: usage.cover_letters_limit },
                              { label: "Emails", used: usage.emails_generated, limit: usage.emails_limit },
                            ].map((item) => (
                              <div key={item.label} className="rounded-lg border border-border bg-card p-3">
                                <p className="text-xs text-muted-foreground">{item.label}</p>
                                <p className="text-lg font-bold">
                                  {item.used || 0}<span className="text-xs text-muted-foreground font-normal">/{usage.is_premium ? "∞" : item.limit}</span>
                                </p>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex flex-wrap gap-2">
                          <Button
                            size="sm"
                            variant={usage?.is_premium ? "destructive" : "default"}
                            onClick={() =>
                              adminAction("update_user_premium", {
                                target_user_id: user.id,
                                is_premium: !usage?.is_premium,
                              })
                            }
                            disabled={actionLoading === user.id}
                          >
                            <Crown className="w-3.5 h-3.5 mr-1" />
                            {usage?.is_premium ? "Remove Pro" : "Grant Pro"}
                          </Button>

                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => adminAction("reset_user_usage", { target_user_id: user.id })}
                            disabled={actionLoading === user.id}
                          >
                            <RefreshCw className="w-3.5 h-3.5 mr-1" /> Reset Usage
                          </Button>

                          <Button
                            size="sm"
                            variant={admin ? "outline" : "secondary"}
                            onClick={() =>
                              adminAction(admin ? "remove_admin_role" : "add_admin_role", {
                                target_user_id: user.id,
                              })
                            }
                            disabled={actionLoading === user.id}
                          >
                            {admin ? <UserMinus className="w-3.5 h-3.5 mr-1" /> : <UserPlus className="w-3.5 h-3.5 mr-1" />}
                            {admin ? "Remove Admin" : "Make Admin"}
                          </Button>

                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => {
                              if (confirm(`Delete user ${user.email}? This cannot be undone.`)) {
                                adminAction("delete_user", { target_user_id: user.id });
                              }
                            }}
                            disabled={actionLoading === user.id}
                          >
                            <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete User
                          </Button>
                        </div>

                        <p className="text-xs text-muted-foreground">
                          ID: {user.id} · Last sign in:{" "}
                          {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : "Never"}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Admin;
