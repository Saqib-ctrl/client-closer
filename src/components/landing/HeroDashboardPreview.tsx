import { motion } from "framer-motion";
import { FileText, Image, Mail, Receipt, Users, BarChart3, Globe, PenTool, Check, Eye, DollarSign, Bell } from "lucide-react";

const tools = [
  { icon: FileText, label: "Proposals", active: true },
  { icon: Image, label: "Mockups" },
  { icon: PenTool, label: "Letters" },
  { icon: Mail, label: "Emails" },
  { icon: Receipt, label: "Invoices" },
  { icon: Users, label: "CRM" },
  { icon: Globe, label: "Portfolio" },
  { icon: BarChart3, label: "Analytics" },
];

const notifications = [
  {
    avatar: "SC",
    name: "Sarah Chen",
    message: "Loved the proposal! Let's move forward.",
    time: "2m ago",
    color: "bg-primary/20 text-primary",
  },
  {
    avatar: "MR",
    name: "Mark Rivera",
    message: "Invoice #1042 has been paid",
    time: "8m ago",
    color: "bg-emerald-500/20 text-emerald-600",
  },
  {
    avatar: "JL",
    name: "Julia Lee",
    message: "New project inquiry — Brand redesign",
    time: "15m ago",
    color: "bg-blue-500/20 text-blue-600",
  },
];

const statusItems = [
  { label: "Proposal sent", icon: Check, status: "Sent", color: "text-primary" },
  { label: "Client viewed", icon: Eye, status: "Viewed", color: "text-blue-500" },
  { label: "Invoice paid", icon: DollarSign, status: "$2,400", color: "text-emerald-500" },
];

const HeroDashboardPreview = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
      className="mt-20 md:mt-28 flex justify-center"
      style={{ perspective: "1200px" }}
    >
      <motion.div
        initial={{ rotateX: 20, rotateY: -10 }}
        animate={{ rotateX: 12, rotateY: -8 }}
        whileHover={{ rotateX: 4, rotateY: -3, scale: 1.02 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-4xl glass-card rounded-2xl border border-border/30 overflow-hidden shadow-2xl shadow-primary/5"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Top bar */}
        <div className="flex items-center gap-2 px-5 py-3 border-b border-border/30 bg-card/50">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-destructive/60" />
            <div className="w-3 h-3 rounded-full bg-yellow-400/60" />
            <div className="w-3 h-3 rounded-full bg-emerald-400/60" />
          </div>
          <div className="flex-1 flex justify-center">
            <div className="px-4 py-1 rounded-md bg-muted/50 text-xs text-muted-foreground font-mono">
              propel.app/dashboard
            </div>
          </div>
        </div>

        <div className="flex min-h-[340px] md:min-h-[380px]">
          {/* Sidebar */}
          <div className="hidden sm:flex flex-col w-16 md:w-48 border-r border-border/20 bg-card/30 py-3">
            {tools.map((tool, i) => (
              <motion.div
                key={tool.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.8 + i * 0.05 }}
                className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                  tool.active
                    ? "text-primary bg-primary/10 border-r-2 border-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <tool.icon className="w-4 h-4 shrink-0" />
                <span className="hidden md:inline font-medium">{tool.label}</span>
              </motion.div>
            ))}
          </div>

          {/* Main content */}
          <div className="flex-1 p-4 md:p-6 space-y-4">
            {/* Status bar */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.2 }}
              className="flex items-center gap-3 flex-wrap"
            >
              {statusItems.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 1.3 + i * 0.15 }}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 text-xs font-medium"
                >
                  <item.icon className={`w-3.5 h-3.5 ${item.color}`} />
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className={`font-semibold ${item.color}`}>{item.status}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* Notifications */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Bell className="w-4 h-4" />
                <span className="font-medium">Recent activity</span>
              </div>
              {notifications.map((notif, i) => (
                <motion.div
                  key={notif.name}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 1.5 + i * 0.3 }}
                  className="flex items-start gap-3 p-3 rounded-xl bg-muted/30 border border-border/20"
                >
                  <div className={`w-9 h-9 rounded-full ${notif.color} flex items-center justify-center text-xs font-bold shrink-0`}>
                    {notif.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-semibold text-foreground">{notif.name}</span>
                      <span className="text-xs text-muted-foreground shrink-0">{notif.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{notif.message}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default HeroDashboardPreview;
