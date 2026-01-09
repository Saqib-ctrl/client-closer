-- Create user_usage table to track proposal counts per user
CREATE TABLE public.user_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  proposals_generated INTEGER DEFAULT 0,
  proposals_limit INTEGER DEFAULT 5,
  ip_address TEXT,
  is_premium BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on user_usage
ALTER TABLE public.user_usage ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_usage
CREATE POLICY "Users can view their own usage" ON public.user_usage 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own usage" ON public.user_usage 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create ip_usage table to track abuse across multiple accounts
CREATE TABLE public.ip_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address TEXT NOT NULL UNIQUE,
  proposals_generated INTEGER DEFAULT 0,
  first_seen_at TIMESTAMPTZ DEFAULT NOW(),
  last_seen_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on ip_usage (admin only, accessed via security definer functions)
ALTER TABLE public.ip_usage ENABLE ROW LEVEL SECURITY;

-- Function to check usage limits (security definer to bypass RLS)
CREATE OR REPLACE FUNCTION public.check_usage_limit(p_user_id UUID, p_ip TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_usage RECORD;
  v_ip_usage RECORD;
BEGIN
  -- Get or create user usage record
  SELECT * INTO v_user_usage FROM user_usage WHERE user_id = p_user_id;
  
  IF v_user_usage IS NULL THEN
    INSERT INTO user_usage (user_id, ip_address, proposals_generated, proposals_limit)
    VALUES (p_user_id, p_ip, 0, 5)
    RETURNING * INTO v_user_usage;
  END IF;
  
  -- Get or create IP usage record
  SELECT * INTO v_ip_usage FROM ip_usage WHERE ip_address = p_ip;
  
  IF v_ip_usage IS NULL THEN
    INSERT INTO ip_usage (ip_address, proposals_generated)
    VALUES (p_ip, 0)
    RETURNING * INTO v_ip_usage;
  END IF;
  
  -- Check if user has exceeded their limit (skip for premium users)
  IF v_user_usage.is_premium = FALSE AND v_user_usage.proposals_generated >= v_user_usage.proposals_limit THEN
    RETURN jsonb_build_object(
      'allowed', FALSE, 
      'reason', 'limit_exceeded', 
      'used', v_user_usage.proposals_generated, 
      'limit', v_user_usage.proposals_limit,
      'is_premium', v_user_usage.is_premium
    );
  END IF;
  
  -- Check if IP has excessive usage (15+ proposals = potential abuse)
  IF v_ip_usage.proposals_generated >= 15 AND v_user_usage.is_premium = FALSE THEN
    RETURN jsonb_build_object(
      'allowed', FALSE, 
      'reason', 'ip_abuse_detected', 
      'message', 'Unusual activity detected. Please contact support.'
    );
  END IF;
  
  RETURN jsonb_build_object(
    'allowed', TRUE, 
    'used', v_user_usage.proposals_generated, 
    'limit', v_user_usage.proposals_limit,
    'is_premium', v_user_usage.is_premium
  );
END;
$$;

-- Function to increment usage after successful generation
CREATE OR REPLACE FUNCTION public.record_proposal_usage(p_user_id UUID, p_ip TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Update user usage
  UPDATE user_usage 
  SET proposals_generated = proposals_generated + 1, 
      ip_address = p_ip,
      updated_at = NOW() 
  WHERE user_id = p_user_id;
  
  -- Update IP usage
  INSERT INTO ip_usage (ip_address, proposals_generated)
  VALUES (p_ip, 1)
  ON CONFLICT (ip_address) 
  DO UPDATE SET 
    proposals_generated = ip_usage.proposals_generated + 1,
    last_seen_at = NOW();
END;
$$;

-- Trigger to create user_usage record on new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user_usage()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO user_usage (user_id, proposals_generated, proposals_limit, is_premium)
  VALUES (NEW.id, 0, 5, FALSE);
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created_usage
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_usage();

-- Add updated_at trigger for user_usage
CREATE TRIGGER update_user_usage_updated_at
  BEFORE UPDATE ON public.user_usage
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();