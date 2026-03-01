
-- Add mockup usage columns to user_usage
ALTER TABLE public.user_usage 
  ADD COLUMN IF NOT EXISTS mockups_generated integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS mockups_limit integer DEFAULT 5;

-- Create check_mockup_usage_limit function
CREATE OR REPLACE FUNCTION public.check_mockup_usage_limit(p_user_id uuid, p_ip text)
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
    INSERT INTO user_usage (user_id, ip_address, proposals_generated, proposals_limit, mockups_generated, mockups_limit)
    VALUES (p_user_id, p_ip, 0, 5, 0, 5)
    RETURNING * INTO v_user_usage;
  END IF;
  
  IF v_user_usage.is_premium = FALSE AND v_user_usage.mockups_generated >= v_user_usage.mockups_limit THEN
    RETURN jsonb_build_object(
      'allowed', FALSE, 
      'reason', 'mockup_limit_exceeded', 
      'used', v_user_usage.mockups_generated, 
      'limit', v_user_usage.mockups_limit,
      'is_premium', v_user_usage.is_premium
    );
  END IF;
  
  RETURN jsonb_build_object(
    'allowed', TRUE, 
    'used', v_user_usage.mockups_generated, 
    'limit', v_user_usage.mockups_limit,
    'is_premium', v_user_usage.is_premium
  );
END;
$function$;

-- Create record_mockup_usage function
CREATE OR REPLACE FUNCTION public.record_mockup_usage(p_user_id uuid, p_ip text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  UPDATE user_usage 
  SET mockups_generated = mockups_generated + 1, 
      ip_address = p_ip,
      updated_at = NOW() 
  WHERE user_id = p_user_id;
END;
$function$;
