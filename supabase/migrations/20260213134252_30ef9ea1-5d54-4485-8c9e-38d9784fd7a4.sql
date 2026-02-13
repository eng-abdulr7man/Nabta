
-- Fix the permissive activity log insert policy
DROP POLICY "System can insert activity" ON public.activity_log;
CREATE POLICY "Authenticated users can insert activity" ON public.activity_log 
  FOR INSERT TO authenticated 
  WITH CHECK (auth.uid() = user_id);
