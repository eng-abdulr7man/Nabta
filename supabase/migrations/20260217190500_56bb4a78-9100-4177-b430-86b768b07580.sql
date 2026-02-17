
-- Fix RLS policies: change from RESTRICTIVE to PERMISSIVE where needed

-- activity_log: fix SELECT policy
DROP POLICY IF EXISTS "Admins can view activity log" ON public.activity_log;
CREATE POLICY "Admins can view activity log" ON public.activity_log FOR SELECT USING (is_admin(auth.uid()));

DROP POLICY IF EXISTS "Authenticated users can insert activity" ON public.activity_log;
CREATE POLICY "Authenticated users can insert activity" ON public.activity_log FOR INSERT WITH CHECK (auth.uid() = user_id);

-- contact_messages: fix policies (multiple restrictive SELECTs block each other)
DROP POLICY IF EXISTS "Admins can manage messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Admins can view all messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Users can send messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Users can view own messages" ON public.contact_messages;

CREATE POLICY "Admins can view all messages" ON public.contact_messages FOR SELECT USING (is_admin(auth.uid()));
CREATE POLICY "Users can view own messages" ON public.contact_messages FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can send messages" ON public.contact_messages FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can update messages" ON public.contact_messages FOR UPDATE USING (is_admin(auth.uid()));
CREATE POLICY "Admins can delete messages" ON public.contact_messages FOR DELETE USING (is_admin(auth.uid()));

-- certificates: fix multiple restrictive SELECT policies
DROP POLICY IF EXISTS "Admins can manage certificates" ON public.certificates;
DROP POLICY IF EXISTS "Anyone can verify certificates" ON public.certificates;
DROP POLICY IF EXISTS "Users can view own certificates" ON public.certificates;

CREATE POLICY "Anyone can verify certificates" ON public.certificates FOR SELECT USING (true);
CREATE POLICY "Admins can insert certificates" ON public.certificates FOR INSERT WITH CHECK (is_admin(auth.uid()));
CREATE POLICY "Admins can update certificates" ON public.certificates FOR UPDATE USING (is_admin(auth.uid()));
CREATE POLICY "Admins can delete certificates" ON public.certificates FOR DELETE USING (is_admin(auth.uid()));

-- courses: fix multiple restrictive SELECT policies
DROP POLICY IF EXISTS "Admins can manage courses" ON public.courses;
DROP POLICY IF EXISTS "Admins can view all courses" ON public.courses;
DROP POLICY IF EXISTS "Anyone can view published courses" ON public.courses;

CREATE POLICY "Anyone can view published courses" ON public.courses FOR SELECT USING (published = true);
CREATE POLICY "Admins can view all courses" ON public.courses FOR SELECT USING (is_admin(auth.uid()));
CREATE POLICY "Admins can insert courses" ON public.courses FOR INSERT WITH CHECK (is_admin(auth.uid()));
CREATE POLICY "Admins can update courses" ON public.courses FOR UPDATE USING (is_admin(auth.uid()));
CREATE POLICY "Admins can delete courses" ON public.courses FOR DELETE USING (is_admin(auth.uid()));

-- enrollments: fix
DROP POLICY IF EXISTS "Admins can view all enrollments" ON public.enrollments;
DROP POLICY IF EXISTS "Users can enroll" ON public.enrollments;
DROP POLICY IF EXISTS "Users can update own enrollment" ON public.enrollments;
DROP POLICY IF EXISTS "Users can view own enrollments" ON public.enrollments;

CREATE POLICY "Anyone can count enrollments" ON public.enrollments FOR SELECT USING (true);
CREATE POLICY "Users can enroll" ON public.enrollments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own enrollment" ON public.enrollments FOR UPDATE USING (auth.uid() = user_id);

-- favorites: fix
DROP POLICY IF EXISTS "Users can add favorites" ON public.favorites;
DROP POLICY IF EXISTS "Users can remove favorites" ON public.favorites;
DROP POLICY IF EXISTS "Users can view own favorites" ON public.favorites;

CREATE POLICY "Users can view own favorites" ON public.favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can add favorites" ON public.favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can remove favorites" ON public.favorites FOR DELETE USING (auth.uid() = user_id);

-- lesson_progress: fix
DROP POLICY IF EXISTS "Users can insert own progress" ON public.lesson_progress;
DROP POLICY IF EXISTS "Users can update own progress" ON public.lesson_progress;
DROP POLICY IF EXISTS "Users can view own progress" ON public.lesson_progress;

CREATE POLICY "Users can view own progress" ON public.lesson_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own progress" ON public.lesson_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own progress" ON public.lesson_progress FOR UPDATE USING (auth.uid() = user_id);

-- lessons: fix
DROP POLICY IF EXISTS "Admins can manage lessons" ON public.lessons;
DROP POLICY IF EXISTS "Anyone can view lessons of published courses" ON public.lessons;

CREATE POLICY "Anyone can view lessons of published courses" ON public.lessons FOR SELECT USING (
  EXISTS (SELECT 1 FROM sections JOIN courses ON courses.id = sections.course_id WHERE sections.id = lessons.section_id AND courses.published = true)
);
CREATE POLICY "Admins can manage lessons" ON public.lessons FOR ALL USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid()));

-- profiles: fix
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Anyone can view profile names" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;

CREATE POLICY "Anyone can view profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- ratings: fix
DROP POLICY IF EXISTS "Anyone can view ratings" ON public.ratings;
DROP POLICY IF EXISTS "Users can create own rating" ON public.ratings;
DROP POLICY IF EXISTS "Users can delete own rating" ON public.ratings;
DROP POLICY IF EXISTS "Users can update own rating" ON public.ratings;

CREATE POLICY "Anyone can view ratings" ON public.ratings FOR SELECT USING (true);
CREATE POLICY "Users can create own rating" ON public.ratings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own rating" ON public.ratings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own rating" ON public.ratings FOR DELETE USING (auth.uid() = user_id);

-- sections: fix
DROP POLICY IF EXISTS "Admins can manage sections" ON public.sections;
DROP POLICY IF EXISTS "Anyone can view sections of published courses" ON public.sections;

CREATE POLICY "Anyone can view sections of published courses" ON public.sections FOR SELECT USING (
  EXISTS (SELECT 1 FROM courses WHERE courses.id = sections.course_id AND courses.published = true)
);
CREATE POLICY "Admins can manage sections" ON public.sections FOR ALL USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid()));

-- specializations: fix
DROP POLICY IF EXISTS "Admins can manage specializations" ON public.specializations;
DROP POLICY IF EXISTS "Anyone can view specializations" ON public.specializations;

CREATE POLICY "Anyone can view specializations" ON public.specializations FOR SELECT USING (true);
CREATE POLICY "Admins can manage specializations" ON public.specializations FOR ALL USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid()));

-- user_roles: fix
DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;

CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all roles" ON public.user_roles FOR SELECT USING (is_admin(auth.uid()));
CREATE POLICY "Admins can manage roles insert" ON public.user_roles FOR INSERT WITH CHECK (is_admin(auth.uid()));
CREATE POLICY "Admins can manage roles update" ON public.user_roles FOR UPDATE USING (is_admin(auth.uid()));
CREATE POLICY "Admins can manage roles delete" ON public.user_roles FOR DELETE USING (is_admin(auth.uid()));
