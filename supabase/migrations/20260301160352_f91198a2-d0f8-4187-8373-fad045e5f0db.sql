
-- Add cover letter usage columns to user_usage
ALTER TABLE public.user_usage 
  ADD COLUMN IF NOT EXISTS cover_letters_generated integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS cover_letters_limit integer DEFAULT 3;

-- Create check_cover_letter_usage_limit function
CREATE OR REPLACE FUNCTION public.check_cover_letter_usage_limit(p_user_id uuid, p_ip text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_user_usage RECORD;
BEGIN
  SELECT * INTO v_user_usage FROM user_usage WHERE user_id = p_user_id;
  
  IF v_user_usage IS NULL THEN
    INSERT INTO user_usage (user_id, ip_address, proposals_generated, proposals_limit, mockups_generated, mockups_limit, cover_letters_generated, cover_letters_limit)
    VALUES (p_user_id, p_ip, 0, 5, 0, 5, 0, 3)
    RETURNING * INTO v_user_usage;
  END IF;
  
  IF v_user_usage.is_premium = FALSE AND v_user_usage.cover_letters_generated >= v_user_usage.cover_letters_limit THEN
    RETURN jsonb_build_object(
      'allowed', FALSE, 
      'reason', 'cover_letter_limit_exceeded', 
      'used', v_user_usage.cover_letters_generated, 
      'limit', v_user_usage.cover_letters_limit,
      'is_premium', v_user_usage.is_premium
    );
  END IF;
  
  RETURN jsonb_build_object(
    'allowed', TRUE, 
    'used', v_user_usage.cover_letters_generated, 
    'limit', v_user_usage.cover_letters_limit,
    'is_premium', v_user_usage.is_premium
  );
END;
$function$;

-- Create record_cover_letter_usage function
CREATE OR REPLACE FUNCTION public.record_cover_letter_usage(p_user_id uuid, p_ip text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  UPDATE user_usage 
  SET cover_letters_generated = cover_letters_generated + 1, 
      ip_address = p_ip,
      updated_at = NOW() 
  WHERE user_id = p_user_id;
END;
$function$;

-- Create cover_letters table
CREATE TABLE IF NOT EXISTS public.cover_letters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  job_title text,
  company_name text,
  job_description text NOT NULL,
  resume_content text,
  generated_cover_letter text,
  tone text DEFAULT 'professional',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.cover_letters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own cover letters" ON public.cover_letters FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own cover letters" ON public.cover_letters FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own cover letters" ON public.cover_letters FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Users can update own cover letters" ON public.cover_letters FOR UPDATE USING (auth.uid() = user_id);
