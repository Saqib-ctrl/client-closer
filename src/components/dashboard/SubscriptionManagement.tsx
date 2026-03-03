import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Crown, Calendar, CreditCard, Shield, Zap, Check, Loader2, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { usePaddleCheckout } from "@/components/PaddleCheckout";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface SubscriptionManagementProps {
  userId: string;
  userEmail?: string;
  isPremium: boolean;
  onStatusChange?: () => void;
}

interface Subscription {
  id: string;
  status: string;
  plan_type: string | null;
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at: string | null;
  paddle_subscription_id: string | null;
  created_at: string | null;
}

interface Usage {
  proposals_generated: number | null;
  proposals_limit: number | null;
  mockups_generated: number | null;
  mockups_limit: number | null;
  cover_letters_generated: number | null;
  cover_letters_limit: number | null;
  emails_generated: number | null;
  emails_limit: number | null;
}

export const SubscriptionManagement = ({ userId, userEmail, isPremium, onStatusChange }: SubscriptionManagementProps) => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [usage, setUsage] = useState<Usage | null>(null);
  const [loading, setLoading] = useState(true);
  const [canceling, setCanceling] = useState(false);
  const { openCheckout } = usePaddleCheckout({ userId, userEmail: userEmail || "" });

  useEffect(() => {
    fetchData();
  }, [userId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [subRes, usageRes] = await Promise.all([
        supabase.from("subscriptions").select("*").eq("user_id", userId).eq("status", "active").maybeSingle(),
        supabase.from("user_usage").select("proposals_generated,proposals_limit,mockups_generated,mockups_limit,cover_letters_generated,cover_letters_limit,emails_generated,emails_limit").eq("user_id", userId).single(),
      ]);
      if (subRes.data) setSubscription(subRes.data);
      if (usageRes.data) setUsage(usageRes.data);
    } catch (error) {
      console.error("Error fetching subscription data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    setCanceling(true);
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) throw new Error("Not authenticated");
      const response = await supabase.functions.invoke("cancel-subscription", {
        headers: { Authorization: `Bearer ${session.session.access_token}` },
      });
      if (response.error) throw new Error(response.error.message);
      toast({ title: "Subscription canceled", description: "Access continues until the end of your billing period." });
      await fetchData();
      onStatusChange?.();
    } catch {
      toast({ title: "Error", description: "Failed to cancel. Please try again.", variant: "destructive" });
    } finally {
      setCanceling(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const isCanceled = !!subscription?.cancel_at;
  const nextBilling = subscription?.current_period_end ? new Date(subscription.current_period_end).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : null;
  const cancelDate = subscription?.cancel_at ? new Date(subscription.cancel_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : null;
  const memberSince = subscription?.created_at ? new Date(subscription.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : null;

  const proFeatures = [
    "Unlimited proposals, mockups & cover letters",
    "Unlimited email generation",
    "Full history access",
    "PDF export for proposals & invoices",
    "Save as Template functionality",
    "Priority support",
  ];

  const usageItems = [
    { label: "Proposals", used: usage?.proposals_generated ?? 0, limit: isPremium ? "∞" : (usage?.proposals_limit ?? 5) },
    { label: "Mockups", used: usage?.mockups_generated ?? 0, limit: isPremium ? "∞" : (usage?.mockups_limit ?? 3) },
    { label: "Cover Letters", used: usage?.cover_letters_generated ?? 0, limit: isPremium ? "∞" : (usage?.cover_letters_limit ?? 3) },
    { label: "Emails", used: usage?.emails_generated ?? 0, limit: isPremium ? "∞" : (usage?.emails_limit ?? 5) },
  ];

  return (
    <div className="space-y-6">
      {/* Current Plan */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isPremium ? "bg-primary/10" : "bg-muted"}`}>
              {isPremium ? <Crown className="w-6 h-6 text-primary" /> : <Shield className="w-6 h-6 text-muted-foreground" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold">{isPremium ? "Pro Plan" : "Free Plan"}</h3>
                {isPremium && (
                  <Badge className="bg-primary/90 text-[10px]">
                    <Crown className="w-2.5 h-2.5 mr-0.5" />
                    ACTIVE
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {isPremium
                  ? `$19/month · ${subscription?.plan_type === "yearly" ? "Yearly billing" : "Monthly billing"}`
                  : "Limited access to AI tools"}
              </p>
            </div>
          </div>
          {!isPremium && (
            <Button onClick={() => openCheckout("monthly")} className="gap-2">
              <Zap className="w-4 h-4" />
              Upgrade to Pro
            </Button>
          )}
        </div>

        {isPremium && subscription && (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {memberSince && (
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-xs text-muted-foreground">Member since</p>
                <p className="text-sm font-medium mt-0.5">{memberSince}</p>
              </div>
            )}
            {isCanceled ? (
              <div className="rounded-lg bg-destructive/10 p-3">
                <p className="text-xs text-destructive">Cancels on</p>
                <p className="text-sm font-medium mt-0.5 text-destructive">{cancelDate}</p>
              </div>
            ) : nextBilling ? (
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-xs text-muted-foreground">Next billing</p>
                <p className="text-sm font-medium mt-0.5">{nextBilling}</p>
              </div>
            ) : null}
            <div className="rounded-lg bg-muted/50 p-3">
              <p className="text-xs text-muted-foreground">Payment method</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <CreditCard className="w-3.5 h-3.5 text-muted-foreground" />
                <p className="text-sm font-medium">Managed via Paddle</p>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Usage This Month */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-xl border border-border bg-card p-6">
        <h3 className="text-lg font-semibold mb-4">Usage This Month</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {usageItems.map((item) => (
            <div key={item.label} className="text-center p-4 rounded-lg bg-muted/30">
              <p className="text-2xl font-bold">{item.used}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {item.label} · {typeof item.limit === "string" ? item.limit : `${item.used}/${item.limit}`}
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Pro Features */}
      {!isPremium && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-xl border border-primary/20 bg-primary/5 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Crown className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">Unlock Pro</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
            {proFeatures.map((f) => (
              <div key={f} className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-primary shrink-0" />
                <span>{f}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <Button onClick={() => openCheckout("monthly")} className="gap-2">
              <Zap className="w-4 h-4" /> $19/month
            </Button>
            <Button variant="outline" onClick={() => openCheckout("yearly")} className="gap-2">
              $190/year <Badge variant="secondary" className="text-[10px] ml-1">Save 17%</Badge>
            </Button>
          </div>
        </motion.div>
      )}

      {/* Cancel Subscription */}
      {isPremium && !isCanceled && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-xl border border-border bg-card p-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Manage Subscription</h3>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                Cancel Subscription
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Cancel your Pro subscription?</AlertDialogTitle>
                <AlertDialogDescription>
                  Your access will continue until {nextBilling}. After that, you'll revert to the Free plan with limited usage.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Keep Pro</AlertDialogCancel>
                <AlertDialogAction onClick={handleCancel} disabled={canceling} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  {canceling ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Canceling...</> : "Yes, Cancel"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </motion.div>
      )}

      {/* Canceled notice */}
      {isPremium && isCanceled && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-xl border border-destructive/20 bg-destructive/5 p-6 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-sm">Subscription ending {cancelDate}</p>
            <p className="text-sm text-muted-foreground mt-1">Your Pro features will remain active until then. You can resubscribe anytime.</p>
            <Button size="sm" className="mt-3 gap-2" onClick={() => openCheckout("monthly")}>
              <Zap className="w-3.5 h-3.5" /> Resubscribe
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
};
