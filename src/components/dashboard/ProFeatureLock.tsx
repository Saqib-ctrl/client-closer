import { Crown, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ProFeatureLockProps {
  isPremium: boolean;
  children: React.ReactNode;
  feature?: string;
}

export const ProFeatureLock = ({ isPremium, children, feature = "this feature" }: ProFeatureLockProps) => {
  const navigate = useNavigate();

  if (isPremium) return <>{children}</>;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="relative inline-flex">
          <div className="opacity-50 pointer-events-none">{children}</div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Lock className="w-3.5 h-3.5 text-muted-foreground" />
          </div>
        </div>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="max-w-[200px]">
        <div className="flex items-center gap-2">
          <Crown className="w-3.5 h-3.5 text-primary shrink-0" />
          <span className="text-xs">Upgrade to Pro to unlock {feature}</span>
        </div>
      </TooltipContent>
    </Tooltip>
  );
};

interface ProBannerProps {
  isPremium: boolean;
  feature: string;
}

export const ProBanner = ({ isPremium, feature }: ProBannerProps) => {
  const navigate = useNavigate();
  
  if (isPremium) return null;

  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary/5 border border-primary/20">
      <Crown className="w-4 h-4 text-primary shrink-0" />
      <p className="text-sm text-muted-foreground flex-1">
        <span className="font-medium text-foreground">Pro feature:</span> {feature} is available on the Pro plan.
      </p>
      <Button size="sm" variant="outline" onClick={() => navigate("/#pricing")} className="shrink-0 text-xs">
        Upgrade
      </Button>
    </div>
  );
};
