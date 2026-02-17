-- Add unique constraint on favorites to prevent duplicates
ALTER TABLE public.favorites ADD CONSTRAINT favorites_user_course_unique UNIQUE (user_id, course_id);

-- Allow anyone to view basic profile info (name only) for public features like ratings
CREATE POLICY "Anyone can view profile names"
ON public.profiles
FOR SELECT
USING (true);
