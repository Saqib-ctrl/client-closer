import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, FileText, ImageIcon, Mail, Send } from "lucide-react";

interface AnalyticsDashboardProps {
  userId: string;
  isPremium: boolean;
}

interface ActivityItem {
  type: string;
  date: string;
}

export const AnalyticsDashboard = ({ userId, isPremium }: AnalyticsDashboardProps) => {
  const [toolBreakdown, setToolBreakdown] = useState<{ name: string; value: number; color: string }[]>([]);
  const [weeklyData, setWeeklyData] = useState<{ day: string; count: number }[]>([]);
  const [totalGenerations, setTotalGenerations] = useState(0);

  useEffect(() => {
    fetchAnalytics();
  }, [userId]);

  const fetchAnalytics = async () => {
    // Fetch usage data
    const { data: usage } = await supabase
      .from("user_usage")
      .select("proposals_generated, mockups_generated, cover_letters_generated, emails_generated")
      .eq("user_id", userId)
      .single();

    if (usage) {
      const proposals = (usage as any).proposals_generated ?? 0;
      const mockups = (usage as any).mockups_generated ?? 0;
      const coverLetters = (usage as any).cover_letters_generated ?? 0;
      const emails = (usage as any).emails_generated ?? 0;

      setTotalGenerations(proposals + mockups + coverLetters + emails);
      setToolBreakdown([
        { name: "Proposals", value: proposals, color: "hsl(var(--primary))" },
        { name: "Mockups", value: mockups, color: "hsl(210 80% 55%)" },
        { name: "Cover Letters", value: coverLetters, color: "hsl(280 70% 55%)" },
        { name: "Emails", value: emails, color: "hsl(30 80% 55%)" },
      ]);
    }

    // Fetch recent activity for weekly chart
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 6);
    const isoWeekAgo = weekAgo.toISOString();

    const [proposals, coverLetters, emails] = await Promise.all([
      supabase.from("proposals").select("created_at").eq("user_id", userId).gte("created_at", isoWeekAgo),
      supabase.from("cover_letters").select("created_at").eq("user_id", userId).gte("created_at", isoWeekAgo),
      supabase.from("emails").select("created_at").eq("user_id", userId).gte("created_at", isoWeekAgo),
    ]);

    const allDates: string[] = [
      ...(proposals.data || []).map((r) => r.created_at),
      ...(coverLetters.data || []).map((r) => r.created_at),
      ...(emails.data || []).map((r) => r.created_at),
    ];

    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dayCounts: Record<string, number> = {};
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      dayCounts[dayNames[d.getDay()]] = 0;
    }
    allDates.forEach((dt) => {
      const day = dayNames[new Date(dt).getDay()];
      if (day in dayCounts) dayCounts[day]++;
    });

    setWeeklyData(Object.entries(dayCounts).map(([day, count]) => ({ day, count })));
  };

  const statCards = [
    { label: "Total Generations", value: totalGenerations, icon: TrendingUp },
    { label: "Proposals", value: toolBreakdown.find((t) => t.name === "Proposals")?.value ?? 0, icon: FileText },
    { label: "Mockups", value: toolBreakdown.find((t) => t.name === "Mockups")?.value ?? 0, icon: ImageIcon },
    { label: "Emails", value: toolBreakdown.find((t) => t.name === "Emails")?.value ?? 0, icon: Send },
  ];

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-xl border border-border bg-card p-5"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-xl border border-border bg-card p-5"
        >
          <h3 className="font-semibold text-sm mb-4">Weekly Activity</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} className="text-muted-foreground" />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Tool Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-xl border border-border bg-card p-5"
        >
          <h3 className="font-semibold text-sm mb-4">Tool Usage Breakdown</h3>
          {totalGenerations > 0 ? (
            <div className="flex items-center gap-6">
              <ResponsiveContainer width={160} height={160}>
                <PieChart>
                  <Pie
                    data={toolBreakdown.filter((t) => t.value > 0)}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    dataKey="value"
                    strokeWidth={2}
                  >
                    {toolBreakdown.filter((t) => t.value > 0).map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2">
                {toolBreakdown.map((item) => (
                  <div key={item.name} className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-muted-foreground">{item.name}</span>
                    <span className="font-medium ml-auto">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-10">
              No data yet. Start generating content to see your breakdown.
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
};
