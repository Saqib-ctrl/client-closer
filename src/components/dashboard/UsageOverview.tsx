import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { 
  FileText, ImageIcon, Mail, Crown, Zap, 
  BarChart3, TrendingUp, Send
} from "lucide-react";

interface UsageOverviewProps {
  userId: string;
  isPremium: boolean;
}

interface AllUsage {
  proposals: { used: number; limit: number };
  mockups: { used: number; limit: number };
  coverLetters: { used: number; limit: number };
  emails: { used: number; limit: number };
}

export const UsageOverview = ({ userId, isPremium }: UsageOverviewProps) => {
  const [usage, setUsage] = useState<AllUsage>({
    proposals: { used: 0, limit: 5 },
    mockups: { used: 0, limit: 5 },
    coverLetters: { used: 0, limit: 3 },
    emails: { used: 0, limit: 5 },
  });

  useEffect(() => {
    const fetchUsage = async () => {
      const { data } = await supabase
        .from("user_usage")
        .select("proposals_generated, proposals_limit, mockups_generated, mockups_limit, cover_letters_generated, cover_letters_limit, emails_generated, emails_limit, is_premium")
        .eq("user_id", userId)
        .single();

      if (data) {
        setUsage({
          proposals: { used: data.proposals_generated ?? 0, limit: data.proposals_limit ?? 5 },
          mockups: { used: (data as any).mockups_generated ?? 0, limit: (data as any).mockups_limit ?? 5 },
          coverLetters: { used: (data as any).cover_letters_generated ?? 0, limit: (data as any).cover_letters_limit ?? 3 },
          emails: { used: (data as any).emails_generated ?? 0, limit: (data as any).emails_limit ?? 5 },
        });
      }
    };
    fetchUsage();
  }, [userId]);

  const tools = [
    { 
      name: "Proposals", 
      icon: FileText, 
      ...usage.proposals, 
      color: "hsl(var(--primary))",
      bgColor: "bg-primary/10",
      iconColor: "text-primary"
    },
    { 
      name: "Mockups", 
      icon: ImageIcon, 
      ...usage.mockups, 
      color: "hsl(166 72% 45%)",
      bgColor: "bg-primary/10",
      iconColor: "text-primary"
    },
    { 
      name: "Cover Letters", 
      icon: Mail, 
      ...usage.coverLetters, 
      color: "hsl(166 72% 35%)",
      bgColor: "bg-primary/10",
      iconColor: "text-primary"
    },
    { 
      name: "Emails", 
      icon: Send, 
      ...usage.emails, 
      color: "hsl(166 72% 30%)",
      bgColor: "bg-primary/10",
      iconColor: "text-primary"
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {tools.map((tool, i) => {
        const Icon = tool.icon;
        const percentage = isPremium ? 100 : Math.min((tool.used / tool.limit) * 100, 100);
        
        return (
          <motion.div
            key={tool.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="rounded-xl border border-border bg-card p-5 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-lg ${tool.bgColor} flex items-center justify-center`}>
                  <Icon className={`w-4.5 h-4.5 ${tool.iconColor}`} />
                </div>
                <div>
                  <p className="text-sm font-medium">{tool.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {isPremium ? "Unlimited" : `${tool.used}/${tool.limit} used`}
                  </p>
                </div>
              </div>
              {isPremium && <Crown className="w-4 h-4 text-primary" />}
            </div>
            
            {!isPremium && (
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className={`h-full rounded-full ${
                    percentage >= 100 ? "bg-destructive" : percentage >= 80 ? "bg-yellow-500" : "bg-primary"
                  }`}
                />
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
};
