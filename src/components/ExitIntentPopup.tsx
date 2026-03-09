import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, ArrowRight } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

export const ExitIntentPopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger if mouse leaves through the top of the window
      if (e.clientY <= 0 && !hasShown) {
        setIsVisible(true);
        setHasShown(true);
        trackEvent('exit_intent_popup_shown');
      }
    };

    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsVisible(false);
      }
    };

    // Also show popup after 30 seconds if user hasn't signed up
    timeoutId = setTimeout(() => {
      if (!hasShown) {
        setIsVisible(true);
        setHasShown(true);
        trackEvent('exit_intent_popup_shown', { trigger: 'timeout' });
      }
    }, 30000);

    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('keydown', handleEscKey);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('keydown', handleEscKey);
      clearTimeout(timeoutId);
    };
  }, [hasShown]);

  const handleClose = () => {
    setIsVisible(false);
    trackEvent('exit_intent_popup_closed');
  };

  const handleSignup = () => {
    setIsVisible(false);
    trackEvent('exit_intent_popup_signup_clicked');
    window.location.href = '/auth';
  };

  const handleDownload = () => {
    setIsVisible(false);
    trackEvent('exit_intent_popup_download_clicked');
    // Create and trigger download of lead magnet
    const link = document.createElement('a');
    link.href = '/proposal-templates.pdf'; // This would be a real PDF
    link.download = 'winning-proposal-templates.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={handleClose}
          />

          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md mx-4"
          >
            <div className="bg-card rounded-2xl border border-border p-8 shadow-2xl">
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Download className="w-8 h-8 text-primary" />
                </div>

                <h3 className="text-2xl font-bold mb-3">
                  Wait! Don't leave empty-handed
                </h3>
                
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Get our <strong>FREE "50 Winning Proposal Templates"</strong> that have helped freelancers land $2M+ in contracts. Plus, start using all 8 AI tools for free!
                </p>

                <div className="space-y-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSignup}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                  >
                    Get Free Templates + Start Using AI Tools
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleDownload}
                    className="w-full border border-border hover:bg-muted/50 px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                  >
                    Just Download Templates
                    <Download className="w-4 h-4" />
                  </motion.button>
                </div>

                <p className="text-xs text-muted-foreground mt-4">
                  No spam ever. Unsubscribe anytime. 14-day money-back guarantee.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};