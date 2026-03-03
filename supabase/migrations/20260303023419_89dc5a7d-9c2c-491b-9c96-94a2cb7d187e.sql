-- Explicitly deny direct UPDATE on user_usage (updates only via SECURITY DEFINER functions)
CREATE POLICY "Users cannot update usage directly"
ON public.user_usage FOR UPDATE
USING (false);
