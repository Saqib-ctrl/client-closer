import { useEffect, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

declare global {
  interface Window {
    Paddle?: {
      Environment: {
        set: (env: "sandbox" | "production") => void;
      };
      Initialize: (options: { token: string; eventCallback?: (event: PaddleEvent) => void }) => void;
      Checkout: {
        open: (options: {
          items: { priceId: string; quantity?: number }[];
          customer?: { email?: string };
          customData?: Record<string, string>;
          settings?: {
            successUrl?: string;
            displayMode?: "overlay" | "inline";
            theme?: "light" | "dark";
            locale?: string;
          };
        }) => void;
      };
    };
  }
}

interface PaddleEvent {
  name: string;
  data?: Record<string, unknown>;
}

interface PaddleCheckoutProps {
  userId: string;
  userEmail?: string;
}

// Paddle configuration from environment
const PADDLE_CLIENT_TOKEN = import.meta.env.VITE_PADDLE_CLIENT_TOKEN || "live_ab0073acf516e0ad298e015aeeb";
const PADDLE_ENVIRONMENT = (import.meta.env.VITE_PADDLE_ENVIRONMENT || "production") as "sandbox" | "production";
const PADDLE_MONTHLY_PRICE_ID = import.meta.env.VITE_PADDLE_MONTHLY_PRICE_ID || "pri_01kem40bz4mf7jze396ffrd2yn";
const PADDLE_YEARLY_PRICE_ID = import.meta.env.VITE_PADDLE_YEARLY_PRICE_ID || "pri_01kem3ysfpk1aaqqqsckbzbkh6";

export function usePaddleCheckout({ userId, userEmail }: PaddleCheckoutProps) {
  const navigate = useNavigate();
  const [isReady, setIsReady] = useState(false);

  const initializePaddle = useCallback(() => {
    if (window.Paddle) {
      try {
        window.Paddle.Environment.set(PADDLE_ENVIRONMENT);
        window.Paddle.Initialize({ 
          token: PADDLE_CLIENT_TOKEN,
          eventCallback: (event: PaddleEvent) => {
            console.log("Paddle event:", event.name, event.data);
            
            if (event.name === "checkout.error") {
              console.error("Paddle checkout error:", event.data);
              toast({
                title: "Checkout Error",
                description: "There was an issue with the checkout. Please try again.",
                variant: "destructive"
              });
            }
            
            if (event.name === "checkout.completed") {
              console.log("Paddle checkout completed:", event.data);
              toast({
                title: "Payment Successful!",
                description: "Your subscription is now active.",
              });
              navigate("/dashboard?upgraded=true");
            }
            
            if (event.name === "checkout.closed") {
              console.log("Paddle checkout closed by user");
            }
          }
        });
        console.log(`Paddle initialized in ${PADDLE_ENVIRONMENT} mode`);
        setIsReady(true);
      } catch (error) {
        console.error("Failed to initialize Paddle:", error);
      }
    }
  }, [navigate]);

  useEffect(() => {
    // Load Paddle.js script
    const existingScript = document.querySelector('script[src*="paddle.js"]');
    if (!existingScript) {
      const script = document.createElement("script");
      script.src = "https://cdn.paddle.com/paddle/v2/paddle.js";
      script.async = true;
      script.onload = () => initializePaddle();
      script.onerror = () => {
        console.error("Failed to load Paddle script");
        toast({
          title: "Error",
          description: "Failed to load payment system. Please refresh the page.",
          variant: "destructive"
        });
      };
      document.head.appendChild(script);
    } else if (window.Paddle) {
      // Script already loaded, just initialize
      initializePaddle();
    } else {
      // Script exists but Paddle not ready, wait for it
      const checkPaddle = setInterval(() => {
        if (window.Paddle) {
          clearInterval(checkPaddle);
          initializePaddle();
        }
      }, 100);
      
      // Clear interval after 10 seconds
      setTimeout(() => clearInterval(checkPaddle), 10000);
    }
  }, [initializePaddle]);

  const openCheckout = useCallback((planType: "monthly" | "yearly") => {
    // Validate userId before proceeding
    if (!userId || userId.trim() === "") {
      console.error("Cannot open checkout: userId is empty");
      toast({
        title: "Error",
        description: "Please log in to continue with checkout.",
        variant: "destructive"
      });
      navigate("/auth?redirect=/pricing");
      return;
    }

    if (!window.Paddle) {
      console.error("Paddle not loaded");
      toast({
        title: "Error",
        description: "Payment system is still loading. Please try again.",
        variant: "destructive"
      });
      return;
    }

    if (!isReady) {
      console.error("Paddle not ready");
      toast({
        title: "Error",
        description: "Payment system is initializing. Please try again in a moment.",
        variant: "destructive"
      });
      return;
    }

    const priceId = planType === "yearly" ? PADDLE_YEARLY_PRICE_ID : PADDLE_MONTHLY_PRICE_ID;

    console.log("Opening Paddle checkout with:", {
      priceId,
      userId,
      userEmail,
      planType
    });

    try {
      window.Paddle.Checkout.open({
        items: [{ priceId, quantity: 1 }],
        customer: userEmail ? { email: userEmail } : undefined,
        customData: { user_id: userId },
        settings: {
          displayMode: "overlay",
          theme: "dark",
          successUrl: `${window.location.origin}/dashboard?upgraded=true`
        }
      });
    } catch (error) {
      console.error("Error opening Paddle checkout:", error);
      toast({
        title: "Error",
        description: "Failed to open checkout. Please try again.",
        variant: "destructive"
      });
    }
  }, [userId, userEmail, navigate, isReady]);

  return { openCheckout, isReady };
}

export function PaddleCheckoutButton({
  userId,
  userEmail,
  planType,
  children,
  className
}: PaddleCheckoutProps & {
  planType: "monthly" | "yearly";
  children: React.ReactNode;
  className?: string;
}) {
  const { openCheckout, isReady } = usePaddleCheckout({ userId, userEmail });

  return (
    <button
      onClick={() => openCheckout(planType)}
      className={className}
      disabled={!isReady}
    >
      {children}
    </button>
  );
}
