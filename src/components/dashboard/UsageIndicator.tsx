import { motion } from "framer-motion";
import { Zap, Crown } from "lucide-react";

interface UsageIndicatorProps {
  used: number;
  limit: number;
  isPremium: boolean;
  onUpgrade?: () => void;
}

export const UsageIndicator = ({ used, limit, isPremium, onUpgrade }: UsageIndicatorProps) => {
  const remaining = Math.max(0, limit - used);
  const percentage = isPremium ? 0 : (used / limit) * 100;
  const isLow = remaining <= 2 && !isPremium;
  const isExhausted = remaining === 0 && !isPremium;

  if (isPremium) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 border border-primary/20">
        <Crown className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium text-primary">Pro — Unlimited Proposals</span>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className={`w-4 h-4 ${isLow ? "text-yellow-500" : "text-primary"}`} />
          <span className="text-sm font-medium">
            {isExhausted ? (
              <span className="text-destructive">No proposals remaining</span>
            ) : (
              <>
                <span className={isLow ? "text-yellow-500" : "text-foreground"}>
                  {remaining}
                </span>
                <span className="text-muted-foreground"> / {limit} free proposals left</span>
              </>
            )}
          </span>
        </div>
        {(isLow || isExhausted) && onUpgrade && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onUpgrade}
            className="text-xs font-medium text-primary hover:text-primary/80 transition-colors"
          >
            Upgrade to Pro →
          </motion.button>
        )}
      </div>
      
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`h-full rounded-full ${
            isExhausted 
              ? "bg-destructive" 
              : isLow 
                ? "bg-yellow-500" 
                : "bg-primary"
          }`}
        />
      </div>
      
      {isExhausted && onUpgrade && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-lg bg-primary/5 border border-primary/20"
        >
          <p className="text-sm text-muted-foreground mb-3">
            You've used all your free proposals. Upgrade to Pro for unlimited access.
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onUpgrade}
            className="btn-primary w-full"
          >
            <Crown className="w-4 h-4 mr-2" />
            Upgrade to Pro — $19/month
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};