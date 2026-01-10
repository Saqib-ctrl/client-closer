import { useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

declare global {
  interface Window {
    Paddle?: {
      Environment: {
        set: (env: "sandbox" | "production") => void;
      };
      Initialize: (options: { token: string }) => void;
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

  useEffect(() => {
    // Load Paddle.js script
    const existingScript = document.querySelector('script[src*="paddle.js"]');
    if (!existingScript) {
      const script = document.createElement("script");
      script.src = "https://cdn.paddle.com/paddle/v2/paddle.js";
      script.async = true;
      script.onload = () => initializePaddle();
      document.head.appendChild(script);
    } else {
      initializePaddle();
    }
  }, []);

  const initializePaddle = useCallback(() => {
    if (window.Paddle) {
      window.Paddle.Environment.set(PADDLE_ENVIRONMENT);
      window.Paddle.Initialize({ token: PADDLE_CLIENT_TOKEN });
      console.log(`Paddle initialized in ${PADDLE_ENVIRONMENT} mode`);
    }
  }, []);

  const openCheckout = useCallback((planType: "monthly" | "yearly") => {
    if (!window.Paddle) {
      toast({
        title: "Error",
        description: "Payment system is still loading. Please try again.",
        variant: "destructive"
      });
      return;
    }

    const priceId = planType === "yearly" ? PADDLE_YEARLY_PRICE_ID : PADDLE_MONTHLY_PRICE_ID;

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
  }, [userId, userEmail, navigate]);

  return { openCheckout };
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
  const { openCheckout } = usePaddleCheckout({ userId, userEmail });

  return (
    <button
      onClick={() => openCheckout(planType)}
      className={className}
    >
      {children}
    </button>
  );
}