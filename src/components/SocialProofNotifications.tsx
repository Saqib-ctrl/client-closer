import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, ImageIcon, Mail, Users } from "lucide-react";

interface Notification {
  id: string;
  message: string;
  icon: React.ReactNode;
  timestamp: Date;
}

const generateNotification = (): Notification => {
  const notifications = [
    {
      message: "Alex just generated a winning proposal",
      icon: <FileText className="w-4 h-4" />,
    },
    {
      message: "Sarah created 3 mockups in 2 minutes",
      icon: <ImageIcon className="w-4 h-4" />,
    },
    {
      message: "Mike sent a professional email to a client",
      icon: <Mail className="w-4 h-4" />,
    },
    {
      message: "Jessica upgraded to Pro for unlimited access",
      icon: <Users className="w-4 h-4" />,
    },
    {
      message: "David just landed a client with AI proposals",
      icon: <FileText className="w-4 h-4" />,
    },
    {
      message: "Lisa created her professional portfolio",
      icon: <ImageIcon className="w-4 h-4" />,
    },
    {
      message: "Tom generated 5 cover letters this hour",
      icon: <Mail className="w-4 h-4" />,
    },
    {
      message: "Emma organized her client CRM perfectly",
      icon: <Users className="w-4 h-4" />,
    },
  ];

  const randomNotification = notifications[Math.floor(Math.random() * notifications.length)];
  return {
    id: Math.random().toString(36).substr(2, 9),
    message: randomNotification.message,
    icon: randomNotification.icon,
    timestamp: new Date(),
  };
};

export const SocialProofNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Show first notification after 5 seconds
    const initialTimeout = setTimeout(() => {
      setNotifications([generateNotification()]);
    }, 5000);

    // Then show a new notification every 15-25 seconds
    const interval = setInterval(() => {
      const newNotification = generateNotification();
      setNotifications(prev => {
        const updated = [newNotification, ...prev.slice(0, 2)]; // Keep max 3 notifications
        return updated;
      });

      // Remove notification after 6 seconds
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== newNotification.id));
      }, 6000);
    }, Math.random() * 10000 + 15000); // Random between 15-25 seconds

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="fixed bottom-4 left-4 z-50 pointer-events-none">
      <AnimatePresence>
        {notifications.map((notification, index) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: -100, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -100, scale: 0.8 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="mb-2"
            style={{ marginBottom: index * 8 }}
          >
            <div className="bg-card border border-border/30 rounded-lg p-3 shadow-lg backdrop-blur-sm max-w-xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  {notification.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground font-medium leading-tight">
                    {notification.message}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(notification.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};