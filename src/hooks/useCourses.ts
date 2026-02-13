import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  specialization_id: string | null;
  thumbnail_url: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Section {
  id: string;
  course_id: string;
  title: string;
  sort_order: number;
}

export interface Lesson {
  id: string;
  section_id: string;
  title: string;
  video_url: string;
  duration_minutes: number;
  sort_order: number;
}

export interface Specialization {
  id: string;
  name: string;
  icon: string;
  color: string;
  sort_order: number;
}

export const useCourses = (specialization?: string | null) => {
  return useQuery({
    queryKey: ["courses", specialization],
    queryFn: async () => {
      let query = supabase
        .from("courses")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false });
      if (specialization) {
        query = query.eq("specialization_id", specialization);
      }
      const { data, error } = await query;
      if (error) throw error;
      return data as Course[];
    },
  });
};

export const useCourse = (id: string) => {
  return useQuery({
    queryKey: ["course", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data as Course;
    },
    enabled: !!id,
  });
};

export const useCourseSections = (courseId: string) => {
  return useQuery({
    queryKey: ["sections", courseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sections")
        .select("*")
        .eq("course_id", courseId)
        .order("sort_order");
      if (error) throw error;
      return data as Section[];
    },
    enabled: !!courseId,
  });
};

export const useSectionLessons = (sectionIds: string[]) => {
  return useQuery({
    queryKey: ["lessons", sectionIds],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lessons")
        .select("*")
        .in("section_id", sectionIds)
        .order("sort_order");
      if (error) throw error;
      return data as Lesson[];
    },
    enabled: sectionIds.length > 0,
  });
};

export const useSpecializations = () => {
  return useQuery({
    queryKey: ["specializations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("specializations")
        .select("*")
        .order("sort_order");
      if (error) throw error;
      return data as Specialization[];
    },
  });
};

export const useCoursesCount = () => {
  return useQuery({
    queryKey: ["courses-count-by-spec"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("specialization_id")
        .eq("published", true);
      if (error) throw error;
      const counts: Record<string, number> = {};
      (data || []).forEach((c: any) => {
        if (c.specialization_id) {
          counts[c.specialization_id] = (counts[c.specialization_id] || 0) + 1;
        }
      });
      return counts;
    },
  });
};

export const useEnrollment = (courseId: string, userId?: string) => {
  return useQuery({
    queryKey: ["enrollment", courseId, userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("enrollments")
        .select("*")
        .eq("course_id", courseId)
        .eq("user_id", userId!)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!courseId && !!userId,
  });
};

export const useEnrollmentsCount = (courseId: string) => {
  return useQuery({
    queryKey: ["enrollments-count", courseId],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("enrollments")
        .select("*", { count: "exact", head: true })
        .eq("course_id", courseId);
      if (error) throw error;
      return count || 0;
    },
  });
};

export const useCourseRating = (courseId: string) => {
  return useQuery({
    queryKey: ["course-rating", courseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ratings")
        .select("rating")
        .eq("course_id", courseId);
      if (error) throw error;
      if (!data || data.length === 0) return { avg: 0, count: 0 };
      const sum = data.reduce((a: number, r: any) => a + r.rating, 0);
      return { avg: Math.round((sum / data.length) * 10) / 10, count: data.length };
    },
  });
};

export const useLessonsCount = (courseId: string) => {
  return useQuery({
    queryKey: ["lessons-count", courseId],
    queryFn: async () => {
      // Get sections first, then count lessons
      const { data: sections } = await supabase
        .from("sections")
        .select("id")
        .eq("course_id", courseId);
      if (!sections || sections.length === 0) return 0;
      const sectionIds = sections.map((s: any) => s.id);
      const { count, error } = await supabase
        .from("lessons")
        .select("*", { count: "exact", head: true })
        .in("section_id", sectionIds);
      if (error) throw error;
      return count || 0;
    },
  });
};
