
-- Add email usage columns to user_usage
ALTER TABLE public.user_usage ADD COLUMN IF NOT EXISTS emails_generated integer DEFAULT 0;
ALTER TABLE public.user_usage ADD COLUMN IF NOT EXISTS emails_limit integer DEFAULT 5;

-- Create emails table
CREATE TABLE public.emails (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  email_type TEXT NOT NULL DEFAULT 'follow-up',
  context TEXT NOT NULL,
  generated_email TEXT,
  subject_line TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.emails ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own emails" ON public.emails FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own emails" ON public.emails FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own emails" ON public.emails FOR DELETE USING (auth.uid() = user_id);

-- Create templates table
CREATE TABLE public.templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own templates" ON public.templates FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own templates" ON public.templates FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own templates" ON public.templates FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Users can update own templates" ON public.templates FOR UPDATE USING (auth.uid() = user_id);

-- Email usage functions
CREATE OR REPLACE FUNCTION public.check_email_usage_limit(p_user_id uuid, p_ip text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_user_usage RECORD;
BEGIN
  SELECT * INTO v_user_usage FROM user_usage WHERE user_id = p_user_id;
  
  IF v_user_usage IS NULL THEN
    INSERT INTO user_usage (user_id, ip_address, proposals_generated, proposals_limit, mockups_generated, mockups_limit, cover_letters_generated, cover_letters_limit, emails_generated, emails_limit)
    VALUES (p_user_id, p_ip, 0, 5, 0, 5, 0, 3, 0, 5)
    RETURNING * INTO v_user_usage;
  END IF;
  
  IF v_user_usage.is_premium = FALSE AND v_user_usage.emails_generated >= v_user_usage.emails_limit THEN
    RETURN jsonb_build_object(
      'allowed', FALSE, 
      'reason', 'email_limit_exceeded', 
      'used', v_user_usage.emails_generated, 
      'limit', v_user_usage.emails_limit,
      'is_premium', v_user_usage.is_premium
    );
  END IF;
  
  RETURN jsonb_build_object(
    'allowed', TRUE, 
    'used', v_user_usage.emails_generated, 
    'limit', v_user_usage.emails_limit,
    'is_premium', v_user_usage.is_premium
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.record_email_usage(p_user_id uuid, p_ip text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  UPDATE user_usage 
  SET emails_generated = emails_generated + 1, 
      ip_address = p_ip,
      updated_at = NOW() 
  WHERE user_id = p_user_id;
END;
$$;
