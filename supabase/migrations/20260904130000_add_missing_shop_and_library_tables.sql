-- =====================================================================
-- FIX: several features in the app (Marketplace/shop + University
-- Library) call supabase.from('products'/'categories'/'universities'/
-- 'subjects'/'materials') but these tables were never created in any
-- prior migration, and the 'media' storage bucket used for product
-- image uploads doesn't exist either. That's why:
--   - /shop shows nothing and "إضافة صنف جديد" fails silently
--   - the home page "FeaturedMarketplace" section is always empty
--   - /library and AdminLibraryManager (جامعات/مواد/ملفات) don't work
--   - uploading a product photo fails ("فشل رفع الصورة")
-- This migration creates them, matching the RLS style already used
-- for courses/specializations (public read, admin-only write).
-- =====================================================================

-- ---------------------------------------------------------------------
-- Account suspension: AdminUsers.tsx ("إيقاف الحساب") and
-- AuthContext.tsx (BanGuard) already read/write profiles.is_suspended,
-- but the column never existed — so clicking "إيقاف الحساب" throws a
-- DB error and the ban never actually applies.
-- ---------------------------------------------------------------------
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_suspended BOOLEAN NOT NULL DEFAULT false;

-- Only admins should be able to flip this flag (the existing "Users can
-- update own profile" policy would otherwise let a suspended user
-- un-suspend themselves).
CREATE POLICY "Admins can update any profile" ON public.profiles FOR UPDATE TO authenticated
  USING (is_admin(auth.uid()));

-- ---------------------------------------------------------------------
-- Marketplace: categories + products
-- ---------------------------------------------------------------------
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  price TEXT NOT NULL DEFAULT '',
  category TEXT DEFAULT '',
  description TEXT DEFAULT '',
  image_url TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------
-- University Library: universities + subjects + materials
-- ---------------------------------------------------------------------
CREATE TABLE public.universities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  academic_year TEXT NOT NULL DEFAULT 'الفرقة الأولى',
  university_id UUID REFERENCES public.universities(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'lecture', -- lecture | section | ppt | record
  drive_url TEXT NOT NULL,
  subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_subjects_university_id ON public.subjects(university_id);
CREATE INDEX idx_materials_subject_id ON public.materials(subject_id);

-- ---------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.universities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;

-- Categories: anyone can browse, only admins manage
CREATE POLICY "Anyone can view categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admins can insert categories" ON public.categories FOR INSERT WITH CHECK (is_admin(auth.uid()));
CREATE POLICY "Admins can update categories" ON public.categories FOR UPDATE USING (is_admin(auth.uid()));
CREATE POLICY "Admins can delete categories" ON public.categories FOR DELETE USING (is_admin(auth.uid()));

-- Products: anyone can browse, only admins manage
CREATE POLICY "Anyone can view products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Admins can insert products" ON public.products FOR INSERT WITH CHECK (is_admin(auth.uid()));
CREATE POLICY "Admins can update products" ON public.products FOR UPDATE USING (is_admin(auth.uid()));
CREATE POLICY "Admins can delete products" ON public.products FOR DELETE USING (is_admin(auth.uid()));

-- Universities: anyone can browse, only admins manage
CREATE POLICY "Anyone can view universities" ON public.universities FOR SELECT USING (true);
CREATE POLICY "Admins can insert universities" ON public.universities FOR INSERT WITH CHECK (is_admin(auth.uid()));
CREATE POLICY "Admins can update universities" ON public.universities FOR UPDATE USING (is_admin(auth.uid()));
CREATE POLICY "Admins can delete universities" ON public.universities FOR DELETE USING (is_admin(auth.uid()));

-- Subjects: anyone can browse, only admins manage
CREATE POLICY "Anyone can view subjects" ON public.subjects FOR SELECT USING (true);
CREATE POLICY "Admins can insert subjects" ON public.subjects FOR INSERT WITH CHECK (is_admin(auth.uid()));
CREATE POLICY "Admins can update subjects" ON public.subjects FOR UPDATE USING (is_admin(auth.uid()));
CREATE POLICY "Admins can delete subjects" ON public.subjects FOR DELETE USING (is_admin(auth.uid()));

-- Materials: anyone can browse, only admins manage
CREATE POLICY "Anyone can view materials" ON public.materials FOR SELECT USING (true);
CREATE POLICY "Admins can insert materials" ON public.materials FOR INSERT WITH CHECK (is_admin(auth.uid()));
CREATE POLICY "Admins can update materials" ON public.materials FOR UPDATE USING (is_admin(auth.uid()));
CREATE POLICY "Admins can delete materials" ON public.materials FOR DELETE USING (is_admin(auth.uid()));

-- ---------------------------------------------------------------------
-- Help Center: help_articles (AdminArticles.jsx admin panel +
-- ArticlesPage.jsx public page both call this table, it never existed)
-- ---------------------------------------------------------------------
CREATE TABLE public.help_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT 'account', -- account | payment | course | certificate
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER update_help_articles_updated_at
  BEFORE UPDATE ON public.help_articles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.help_articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view help articles" ON public.help_articles FOR SELECT USING (true);
CREATE POLICY "Admins can insert help articles" ON public.help_articles FOR INSERT WITH CHECK (is_admin(auth.uid()));
CREATE POLICY "Admins can update help articles" ON public.help_articles FOR UPDATE USING (is_admin(auth.uid()));
CREATE POLICY "Admins can delete help articles" ON public.help_articles FOR DELETE USING (is_admin(auth.uid()));

-- ---------------------------------------------------------------------
-- Storage bucket for lesson attachments (AdminCourseDetail.tsx uploads
-- to 'lesson-files' when adding/editing a lesson)
-- ---------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public) VALUES ('lesson-files', 'lesson-files', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Lesson files are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'lesson-files');
CREATE POLICY "Admins can manage lesson files" ON storage.objects FOR ALL TO authenticated
  USING (bucket_id = 'lesson-files' AND is_admin(auth.uid()))
  WITH CHECK (bucket_id = 'lesson-files' AND is_admin(auth.uid()));

-- ---------------------------------------------------------------------
-- Storage bucket for product images (Marketplace.tsx uploads to 'media')
-- ---------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public) VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Media files are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'media');
CREATE POLICY "Admins can manage media" ON storage.objects FOR ALL TO authenticated
  USING (bucket_id = 'media' AND is_admin(auth.uid()))
  WITH CHECK (bucket_id = 'media' AND is_admin(auth.uid()));
