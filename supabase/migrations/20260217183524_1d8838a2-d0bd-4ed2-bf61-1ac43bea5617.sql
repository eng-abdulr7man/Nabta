
-- Add content (text below lesson) and file_url columns to lessons
ALTER TABLE public.lessons ADD COLUMN IF NOT EXISTS content text DEFAULT '';
ALTER TABLE public.lessons ADD COLUMN IF NOT EXISTS file_url text DEFAULT '';

-- Create storage policies for lesson-files bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('lesson-files', 'lesson-files', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Anyone can view lesson files"
ON storage.objects FOR SELECT
USING (bucket_id = 'lesson-files');

CREATE POLICY "Admins can upload lesson files"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'lesson-files' AND public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete lesson files"
ON storage.objects FOR DELETE
USING (bucket_id = 'lesson-files' AND public.is_admin(auth.uid()));
