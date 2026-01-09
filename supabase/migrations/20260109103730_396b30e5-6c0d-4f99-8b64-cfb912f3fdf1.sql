-- Add a restrictive policy for ip_usage (no direct access, only via security definer functions)
CREATE POLICY "No direct access to ip_usage" ON public.ip_usage 
  FOR ALL USING (false);