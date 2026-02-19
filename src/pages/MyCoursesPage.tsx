import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, CheckCircle, PlayCircle, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BottomNav from "@/components/layout/BottomNav";
import { downloadCertificatePDF } from "@/lib/generateCertificatePDF";

const MyCoursesPage = () => {
  const { user, profile } = useAuth();

  const { data: enrollments, isLoading } = useQuery({
    queryKey: ["my-enrollments", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("enrollments")
        .select("*, courses(*)")
        .eq("user_id", user!.id)
        .order("enrolled_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: progressData } = useQuery({
    queryKey: ["my-progress", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lesson_progress")
        .select("lesson_id, completed")
        .eq("user_id", user!.id);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const courseIds = (enrollments || []).map((e: any) => e.course_id);
  const { data: lessonCounts } = useQuery({
    queryKey: ["lesson-counts", courseIds],
    queryFn: async () => {
      const { data: sections } = await supabase
        .from("sections")
        .select("id, course_id")
        .in("course_id", courseIds);
      if (!sections) return {};
      const sectionIds = sections.map((s: any) => s.id);
      const { data: lessons } = await supabase
        .from("lessons")
        .select("id, section_id")
        .in("section_id", sectionIds);

      const courseLessonCount: Record<string, { total: number; lessonIds: string[] }> = {};
      for (const s of sections) {
        if (!courseLessonCount[s.course_id]) {
          courseLessonCount[s.course_id] = { total: 0, lessonIds: [] };
        }
      }
      for (const l of (lessons || [])) {
        const section = sections.find((s: any) => s.id === l.section_id);
        if (section) {
          courseLessonCount[section.course_id].total++;
          courseLessonCount[section.course_id].lessonIds.push(l.id);
        }
      }
      return courseLessonCount;
    },
    enabled: courseIds.length > 0,
  });

  const getProgress = (courseId: string) => {
    const info = lessonCounts?.[courseId];
    if (!info || info.total === 0) return 0;
    const completed = (progressData || []).filter(
      (p: any) => p.completed && info.lessonIds.includes(p.lesson_id)
    ).length;
    return Math.round((completed / info.total) * 100);
  };

  const { data: certificates } = useQuery({
    queryKey: ["my-certificates", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("certificates")
        .select("*, courses(title, instructor)")
        .eq("user_id", user!.id);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const getCertificate = (courseId: string) => {
    return certificates?.find((c: any) => c.course_id === courseId);
  };

  const handleDownloadCert = async (cert: any) => {
    await downloadCertificatePDF({
      learnerName: profile?.full_name || user?.email || "",
      courseName: cert.courses?.title || "",
      certificateNumber: cert.certificate_number,
      issuedAt: cert.issued_at,
      instructor: cert.courses?.instructor,
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 pt-24 pb-20 md:pb-8">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="text-3xl font-black text-foreground mb-2">كورساتي</h1>
            <p className="text-muted-foreground">تابع تقدمك في الكورسات المسجل بها</p>
          </motion.div>

          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="glass-card h-28 animate-pulse" />
              ))}
            </div>
          ) : !enrollments || enrollments.length === 0 ? (
            <div className="text-center py-16">
              <BookOpen className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-lg text-muted-foreground mb-4">لم تسجل في أي كورس بعد</p>
              <Link to="/courses">
                <Button className="bg-primary text-primary-foreground">تصفح الكورسات</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {enrollments.map((enrollment: any, i: number) => {
                const course = enrollment.courses;
                if (!course) return null;
                const progress = getProgress(course.id);
                const cert = getCertificate(course.id);

                return (
                  <motion.div
                    key={enrollment.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="glass-card p-4 sm:p-5"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="w-full sm:w-32 h-20 rounded-lg bg-gradient-to-br from-primary/20 to-accent/10 overflow-hidden shrink-0">
                        {course.thumbnail_url ? (
                          <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <BookOpen className="w-8 h-8 text-primary/30" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-foreground truncate">{course.title}</h3>
                        <p className="text-xs text-muted-foreground mt-1">{course.instructor}</p>
                        <div className="mt-3 flex items-center gap-3">
                          <Progress value={progress} className="flex-1 h-2" />
                          <span className="text-xs font-medium text-muted-foreground shrink-0">{progress}%</span>
                        </div>
                        {cert && (
                          <div className="flex items-center gap-2 mt-2">
                            <div className="flex items-center gap-1 text-xs text-primary">
                              <CheckCircle className="w-3.5 h-3.5" />
                              <span>تم الحصول على الشهادة</span>
                            </div>
                            <button
                              onClick={() => handleDownloadCert(cert)}
                              className="flex items-center gap-1 text-xs text-primary hover:underline"
                            >
                              <Download className="w-3.5 h-3.5" />
                              تحميل PDF
                            </button>
                          </div>
                        )}
                      </div>

                      <Link to={`/courses/${course.id}/learn`} className="shrink-0">
                        <Button size="sm" className="bg-primary text-primary-foreground gap-1 w-full sm:w-auto">
                          <PlayCircle className="w-4 h-4" />
                          {progress > 0 ? "متابعة" : "ابدأ"}
                        </Button>
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
};

export default MyCoursesPage;
