import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Crown, Calendar, AlertCircle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
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

interface Subscription {
  id: string;
  status: string;
  plan_type: string;
  current_period_end: string | null;
  cancel_at: string | null;
}

interface SubscriptionStatusProps {
  userId: string;
  isPremium: boolean;
  onStatusChange?: () => void;
}

export const SubscriptionStatus = ({ userId, isPremium, onStatusChange }: SubscriptionStatusProps) => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [canceling, setCanceling] = useState(false);

  useEffect(() => {
    fetchSubscription();
  }, [userId]);

  const fetchSubscription = async () => {
    try {
      const { data, error } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", userId)
        .eq("status", "active")
        .maybeSingle();

      if (error) throw error;
      setSubscription(data);
    } catch (error) {
      console.error("Error fetching subscription:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    setCanceling(true);
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        throw new Error("Not authenticated");
      }

      const response = await supabase.functions.invoke("cancel-subscription", {
        headers: {
          Authorization: `Bearer ${session.session.access_token}`
        }
      });

      if (response.error) {
        throw new Error(response.error.message || "Failed to cancel subscription");
      }

      toast({
        title: "Subscription canceled",
        description: "Your subscription will remain active until the end of the billing period."
      });

      // Refresh subscription data
      await fetchSubscription();
      onStatusChange?.();
    } catch (error) {
      console.error("Cancel error:", error);
      toast({
        title: "Error",
        description: "Failed to cancel subscription. Please try again.",
        variant: "destructive"
      });
    } finally {
      setCanceling(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 px-4 py-2">
        <Loader2 className="w-4 h-4 animate-spin" />
      </div>
    );
  }

  if (!isPremium || !subscription) {
    return null;
  }

  const isCanceled = !!subscription.cancel_at;
  const nextBillingDate = subscription.current_period_end 
    ? new Date(subscription.current_period_end).toLocaleDateString()
    : null;
  const cancelDate = subscription.cancel_at 
    ? new Date(subscription.cancel_at).toLocaleDateString()
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-4"
    >
      <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 border border-primary/20">
        <Crown className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium text-primary">
          Pro {subscription.plan_type === "yearly" ? "(Yearly)" : "(Monthly)"}
        </span>
      </div>

      {isCanceled ? (
        <div className="flex items-center gap-2 text-sm text-yellow-500">
          <AlertCircle className="w-4 h-4" />
          <span>Cancels {cancelDate}</span>
        </div>
      ) : (
        <>
          {nextBillingDate && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>Renews {nextBillingDate}</span>
            </div>
          )}

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive">
                Cancel
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Cancel Subscription?</AlertDialogTitle>
                <AlertDialogDescription>
                  Your subscription will remain active until {nextBillingDate}. After that, you'll be downgraded to the free plan with 5 proposals per month.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Keep Subscription</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleCancelSubscription}
                  disabled={canceling}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {canceling ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Canceling...
                    </>
                  ) : (
                    "Cancel Subscription"
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </motion.div>
  );
};