import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { 
  LogOut, Loader2, FileText, ImageIcon, Clock, Mail, 
  Crown, LayoutDashboard, ChevronRight, Sparkles,
  Menu, X, Send, BookTemplate, Sun, Moon,
  Receipt, BarChart3, Users
} from "lucide-react";
import { User, Session } from "@supabase/supabase-js";
import { motion, AnimatePresence } from "framer-motion";
import { MockupGenerator } from "@/components/dashboard/MockupGenerator";
import { ProposalGenerator } from "@/components/dashboard/ProposalGenerator";
import { CoverLetterGenerator } from "@/components/dashboard/CoverLetterGenerator";
import { HistoryPanel } from "@/components/dashboard/HistoryPanel";
import { SubscriptionStatus } from "@/components/dashboard/SubscriptionStatus";
import { UsageOverview } from "@/components/dashboard/UsageOverview";
import { EmailAssistant } from "@/components/dashboard/EmailAssistant";
import { TemplatesLibrary } from "@/components/dashboard/TemplatesLibrary";
import { InvoiceGenerator } from "@/components/dashboard/InvoiceGenerator";
import { AnalyticsDashboard } from "@/components/dashboard/AnalyticsDashboard";
import { ClientCRM } from "@/components/dashboard/ClientCRM";
import { toast } from "@/hooks/use-toast";
import { usePaddleCheckout } from "@/components/PaddleCheckout";
import { useTheme } from "next-themes";

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [historyRefresh, setHistoryRefresh] = useState(0);
  const [isPremium, setIsPremium] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (!session?.user) navigate("/auth");
      else fetchUserUsage(session.user.id);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (!session?.user) navigate("/auth");
      else fetchUserUsage(session.user.id);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (searchParams.get("upgraded") === "true") {
      toast({ title: "Welcome to Pro! 🎉", description: "Your subscription is now active. Enjoy unlimited access to all tools!" });
      window.history.replaceState({}, "", "/dashboard");
      if (user) fetchUserUsage(user.id);
    }
  }, [searchParams, user]);

  const fetchUserUsage = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("user_usage")
        .select("is_premium")
        .eq("user_id", userId)
        .single();
      if (!error && data) setIsPremium(data.is_premium || false);
    } catch (error) {
      console.error("Error fetching user usage:", error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const triggerHistoryRefresh = () => setHistoryRefresh((prev) => prev + 1);
  const handleSubscriptionChange = () => { if (user) fetchUserUsage(user.id); };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto" />
          <p className="text-sm text-muted-foreground">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  const { theme, setTheme } = useTheme();

  const navItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "proposal", label: "Proposals", icon: FileText },
    { id: "mockup", label: "Mockups", icon: ImageIcon },
    { id: "cover-letter", label: "Cover Letters", icon: Mail },
    { id: "email", label: "Email Assistant", icon: Send },
    { id: "invoices", label: "Invoices", icon: Receipt },
    { id: "clients", label: "Clients & CRM", icon: Users },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "templates", label: "Templates", icon: BookTemplate },
    { id: "history", label: "History", icon: Clock },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-border bg-card/50 backdrop-blur-sm">
        <div className="p-6 border-b border-border">
          <a href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/25">
              <span className="text-primary-foreground font-bold text-sm">P</span>
            </div>
            <span className="font-bold text-xl tracking-tight">Propel</span>
          </a>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-sm" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <Icon className="w-4.5 h-4.5" />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border space-y-3">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
          >
            {theme === "dark" ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
            {theme === "dark" ? "Light Mode" : "Dark Mode"}
          </button>
          {!isPremium && (
            <div className="rounded-xl bg-primary/5 border border-primary/20 p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold">Upgrade to Pro</span>
              </div>
              <p className="text-xs text-muted-foreground">Unlimited access to all AI tools for $19/mo</p>
              <UpgradeButton userId={user.id} userEmail={user.email} />
            </div>
          )}
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-xs font-semibold text-primary">
                {user.email?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.email}</p>
              <p className="text-xs text-muted-foreground">{isPremium ? "Pro Plan" : "Free Plan"}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout} className="shrink-0">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg">
        <div className="flex items-center justify-between h-14 px-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <a href="/" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xs">P</span>
              </div>
              <span className="font-bold text-lg">Propel</span>
            </a>
          </div>
          <div className="flex items-center gap-2">
            {isPremium && <Crown className="w-4 h-4 text-primary" />}
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-border bg-card overflow-hidden"
            >
              <nav className="p-3 space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        activeTab === item.id 
                          ? "bg-primary text-primary-foreground" 
                          : "text-muted-foreground hover:bg-muted/50"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </button>
                  );
                })}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main Content */}
      <main className="flex-1 lg:overflow-y-auto">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 mt-14 lg:mt-0">
          {/* Header bar */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
                {navItems.find(n => n.id === activeTab)?.label || "Dashboard"}
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                {activeTab === "overview" && "Your AI toolkit at a glance"}
                {activeTab === "proposal" && "Generate winning freelance proposals"}
                {activeTab === "mockup" && "Transform screenshots into stunning presentations"}
                {activeTab === "cover-letter" && "Create personalized cover letters in seconds"}
                {activeTab === "email" && "Generate professional emails for any situation"}
                {activeTab === "invoices" && "Create and manage professional invoices"}
                {activeTab === "clients" && "Track clients, projects, and earnings"}
                {activeTab === "analytics" && "Visualize your usage trends and activity"}
                {activeTab === "templates" && "Save and reuse your best content"}
                {activeTab === "history" && "View and manage your saved content"}
              </p>
            </div>
            <div className="hidden lg:block">
              <SubscriptionStatus 
                userId={user.id} 
                isPremium={isPremium}
                onStatusChange={handleSubscriptionChange}
              />
            </div>
          </div>

          {/* Overview Tab */}
          {activeTab === "overview" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              <UsageOverview userId={user.id} isPremium={isPremium} />
              
              {/* Quick Actions */}
              <div>
                <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { id: "proposal", icon: FileText, title: "New Proposal", desc: "Generate a tailored proposal", color: "bg-primary/10", iconColor: "text-primary" },
                    { id: "mockup", icon: ImageIcon, title: "New Mockup", desc: "Create a beautiful presentation", color: "bg-primary/10", iconColor: "text-primary" },
                    { id: "cover-letter", icon: Mail, title: "New Cover Letter", desc: "Write a personalized letter", color: "bg-primary/10", iconColor: "text-primary" },
                    { id: "email", icon: Send, title: "New Email", desc: "Generate professional emails", color: "bg-primary/10", iconColor: "text-primary" },
                  ].map((action) => {
                    const Icon = action.icon;
                    return (
                      <motion.button
                        key={action.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setActiveTab(action.id)}
                        className="flex items-center gap-4 p-5 rounded-xl border border-border bg-card hover:shadow-md transition-all text-left group"
                      >
                        <div className={`w-11 h-11 rounded-xl ${action.color} flex items-center justify-center`}>
                          <Icon className={`w-5 h-5 ${action.iconColor}`} />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{action.title}</p>
                          <p className="text-xs text-muted-foreground">{action.desc}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Recent Activity */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Recent Activity</h2>
                  <button 
                    onClick={() => setActiveTab("history")}
                    className="text-sm text-primary hover:text-primary/80 font-medium"
                  >
                    View all →
                  </button>
                </div>
                <HistoryPanel userId={user.id} refreshTrigger={historyRefresh} compact />
              </div>
            </motion.div>
          )}

          {/* Proposal Tab */}
          {activeTab === "proposal" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ProposalGenerator userId={user.id} onProposalSaved={triggerHistoryRefresh} />
            </motion.div>
          )}

          {/* Mockup Tab */}
          {activeTab === "mockup" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <MockupGenerator userId={user.id} userEmail={user.email} onMockupSaved={triggerHistoryRefresh} />
            </motion.div>
          )}

          {/* Cover Letter Tab */}
          {activeTab === "cover-letter" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <CoverLetterGenerator userId={user.id} userEmail={user.email} onCoverLetterSaved={triggerHistoryRefresh} />
            </motion.div>
          )}

          {/* Email Tab */}
          {activeTab === "email" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <EmailAssistant userId={user.id} userEmail={user.email} onEmailSaved={triggerHistoryRefresh} />
            </motion.div>
          )}

          {/* Templates Tab */}
          {activeTab === "templates" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <TemplatesLibrary userId={user.id} />
            </motion.div>
          )}

          {/* Invoices Tab */}
          {activeTab === "invoices" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <InvoiceGenerator userId={user.id} />
            </motion.div>
          )}

          {/* Clients Tab */}
          {activeTab === "clients" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ClientCRM userId={user.id} />
            </motion.div>
          )}

          {/* Analytics Tab */}
          {activeTab === "analytics" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <AnalyticsDashboard userId={user.id} isPremium={isPremium} />
            </motion.div>
          )}

          {/* History Tab */}
          {activeTab === "history" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <HistoryPanel userId={user.id} refreshTrigger={historyRefresh} />
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};

// Small upgrade button component
function UpgradeButton({ userId, userEmail }: { userId: string; userEmail?: string }) {
  const { openCheckout, isReady } = usePaddleCheckout({ userId, userEmail });
  return (
    <button
      onClick={() => openCheckout("monthly")}
      disabled={!isReady}
      className="w-full text-center py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
    >
      <Crown className="w-3.5 h-3.5 inline mr-1.5" />
      Upgrade — $19/mo
    </button>
  );
}

export default Dashboard;
