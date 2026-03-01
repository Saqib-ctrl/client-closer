import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut, Loader2, FileText, ImageIcon, Clock } from "lucide-react";
import { User, Session } from "@supabase/supabase-js";
import { MockupGenerator } from "@/components/dashboard/MockupGenerator";
import { ProposalGenerator } from "@/components/dashboard/ProposalGenerator";
import { HistoryPanel } from "@/components/dashboard/HistoryPanel";
import { SubscriptionStatus } from "@/components/dashboard/SubscriptionStatus";
import { toast } from "@/hooks/use-toast";

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [historyRefresh, setHistoryRefresh] = useState(0);
  const [isPremium, setIsPremium] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (!session?.user) {
        navigate("/auth");
      } else {
        fetchUserUsage(session.user.id);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (!session?.user) {
        navigate("/auth");
      } else {
        fetchUserUsage(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  // Check for upgrade success
  useEffect(() => {
    if (searchParams.get("upgraded") === "true") {
      toast({
        title: "Welcome to Pro!",
        description: "Your subscription is now active. Enjoy unlimited proposals!"
      });
      // Clean up URL
      window.history.replaceState({}, "", "/dashboard");
      // Refresh user status
      if (user) {
        fetchUserUsage(user.id);
      }
    }
  }, [searchParams, user]);

  const fetchUserUsage = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("user_usage")
        .select("is_premium")
        .eq("user_id", userId)
        .single();

      if (!error && data) {
        setIsPremium(data.is_premium || false);
      }
    } catch (error) {
      console.error("Error fetching user usage:", error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const triggerHistoryRefresh = () => {
    setHistoryRefresh((prev) => prev + 1);
  };

  const handleSubscriptionChange = () => {
    if (user) {
      fetchUserUsage(user.id);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="container-wide flex items-center justify-between h-16">
          <a href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">P</span>
            </div>
            <span className="font-semibold text-lg">Propel</span>
          </a>
          
          <div className="flex items-center gap-4">
            <SubscriptionStatus 
              userId={user.id} 
              isPremium={isPremium}
              onStatusChange={handleSubscriptionChange}
            />
            <span className="text-sm text-muted-foreground hidden sm:block">
              {user.email}
            </span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Log out
            </Button>
          </div>
        </div>
      </header>

      <main className="container-wide py-8">
        <Tabs defaultValue="proposal" className="space-y-8">
          <TabsList className="grid w-full max-w-lg grid-cols-3">
            <TabsTrigger value="proposal" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Proposals</span>
            </TabsTrigger>
            <TabsTrigger value="mockup" className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Mockups</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span className="hidden sm:inline">History</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="proposal" className="space-y-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Create Your Proposal</h1>
              <p className="text-muted-foreground">
                Paste the job description and your portfolio content to generate a winning proposal.
              </p>
            </div>

            <ProposalGenerator 
              userId={user.id} 
              onProposalSaved={triggerHistoryRefresh} 
            />
          </TabsContent>

          <TabsContent value="mockup" className="space-y-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Create Beautiful Mockups</h1>
              <p className="text-muted-foreground">
                Upload screenshots or images and let AI transform them into stunning presentations.
              </p>
            </div>

            <MockupGenerator 
              userId={user.id} 
              userEmail={user.email}
              onMockupSaved={triggerHistoryRefresh} 
            />
          </TabsContent>

          <TabsContent value="history" className="space-y-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Your History</h1>
              <p className="text-muted-foreground">
                View and manage your saved proposals and mockups.
              </p>
            </div>

            <HistoryPanel userId={user.id} refreshTrigger={historyRefresh} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;