import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, PlayCircle, Download, GraduationCap, FileText, ChevronDown, ChevronUp, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BottomNav from "@/components/layout/BottomNav";
import { downloadCertificatePDF } from "@/lib/generateCertificatePDF";

const MyCoursesPage = () => {
  const { user, profile } = useAuth();
  const [expandedNotes, setExpandedNotes] = useState<Record<string, boolean>>({});

  const toggleNotes = (courseId: string) => {
    setExpandedNotes(prev => ({ ...prev, [courseId]: !prev[courseId] }));
  };

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

  // جلب الملاحظات من جدول lesson_notes مع ربطها بالدروس والسكشن لمعرفة الكورس التابعة له
  const { data: notesData } = useQuery({
    queryKey: ["my-lesson-notes", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lesson_notes")
        .select(`
          id,
          title,
          content,
          video_timestamp,
          created_at,
          lesson_id,
          lessons (
            id,
            title,
            sections (
              course_id
            )
          )
        `)
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) {
        console.error("Error fetching lesson notes:", error.message);
        return [];
      }
      return data || [];
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
    <div className="min-h-screen flex flex-col bg-[#050806] font-tajawal selection:bg-emerald-500/30">
      <Navbar />
      <main className="flex-1 pt-32 pb-24 md:pb-16 relative">
        <div className="container mx-auto px-4 lg:px-8 relative z-10 max-w-4xl">
          
          {/* الهيدر البسيط */}
          <div className="mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">كورساتي</h1>
            <p className="text-neutral-400 text-sm md:text-base">تابع كورساتك، أنجز دروسك، واستعرض ملاحظاتك المدونة بكل بساطة.</p>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-[#0a0f0c] border border-white/5 rounded-2xl p-4 h-32 animate-pulse" />
              ))}
            </div>
          ) : !enrollments || enrollments.length === 0 ? (
            <div className="text-center py-20 bg-[#0a0f0c] border border-white/5 rounded-2xl">
              <BookOpen className="w-10 h-10 text-neutral-600 mx-auto mb-4" />
              <p className="text-white font-medium mb-4">لم تقم بالتسجيل في أي كورس بعد</p>
              <Link to="/courses">
                <Button className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl">تصفح الكورسات</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {enrollments.map((enrollment: any, i: number) => {
                  const course = enrollment.courses;
                  if (!course) return null;
                  const progress = getProgress(course.id);
                  const cert = getCertificate(course.id);
                  const isCompleted = progress === 100;
                  
                  // فلترة الملاحظات الخاصة بهذا الكورس عن طريق مطابقة course_id القادم من علاقة الدروس والسكشن
                  const courseNotes = (notesData || []).filter((n: any) => {
                    const noteCourseId = n.lessons?.sections?.course_id;
                    return noteCourseId === course.id;
                  });

                  const isNotesOpen = expandedNotes[course.id] || false;

                  return (
                    <motion.div
                      key={enrollment.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="bg-[#0a0f0c] border border-white/5 rounded-2xl p-4 sm:p-5 hover:border-emerald-500/20 transition-all"
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        
                        {/* صورة مصغرة */}
                        <Link to={`/courses/${course.id}/learn`} className="w-full sm:w-28 h-20 rounded-xl bg-neutral-900 overflow-hidden shrink-0 block">
                          {course.thumbnail_url ? (
                            <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <BookOpen className="w-6 h-6 text-emerald-500/40" />
                            </div>
                          )}
                        </Link>

                        {/* تفاصيل الكورس والتقدم */}
                        <div className="flex-1 min-w-0 w-full">
                          <Link to={`/courses/${course.id}/learn`}>
                            <h3 className="text-lg font-bold text-white truncate hover:text-emerald-400 transition-colors">
                              {course.title}
                            </h3>
                          </Link>
                          <p className="text-xs text-neutral-400 mt-0.5">بواسطة {course.instructor}</p>

                          <div className="mt-3 space-y-1.5">
                            <div className="flex justify-between text-xs text-neutral-400">
                              <span>التقدم</span>
                              <span className="text-emerald-400 font-bold">{progress}%</span>
                            </div>
                            <Progress value={progress} className="h-1.5 bg-neutral-800 [&>div]:bg-emerald-500 rounded-full" />
                          </div>
                        </div>

                        {/* زر الانتقال */}
                        <div className="w-full sm:w-auto shrink-0">
                          <Link to={`/courses/${course.id}/learn`} className="block">
                            <Button className="w-full sm:w-auto bg-white/5 hover:bg-emerald-600 text-white text-sm h-10 px-4 rounded-xl border border-white/10 transition-all">
                              {isCompleted ? "مراجعة" : "متابعة"}
                            </Button>
                          </Link>
                        </div>

                      </div>

                      {/* قسم الملاحظات المرتبة ببساطة */}
                      <div className="mt-4 pt-3 border-t border-white/5">
                        <button
                          onClick={() => toggleNotes(course.id)}
                          className="flex items-center gap-1.5 text-xs font-medium text-neutral-400 hover:text-emerald-400 transition-colors"
                        >
                          <FileText className="w-3.5 h-3.5 text-emerald-400" />
                          <span>الملاحظات المدونة ({courseNotes.length})</span>
                          {isNotesOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>

                        {isNotesOpen && (
                          <div className="mt-3 space-y-2.5 max-h-56 overflow-y-auto pr-1">
                            {courseNotes.length === 0 ? (
                              <p className="text-xs text-neutral-500 italic">لا توجد ملاحظات مسجلة لهذا الكورس حتى الآن.</p>
                            ) : (
                              courseNotes.map((note: any) => (
                                <div key={note.id} className="bg-black/40 border border-white/5 rounded-xl p-3 text-xs space-y-1">
                                  <div className="flex items-center justify-between text-emerald-400 font-medium">
                                    <span>{note.title}</span>
                                    {note.lessons?.title && (
                                      <span className="text-neutral-400 text-[11px] truncate max-w-[180px]">
                                        درس: {note.lessons.title}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-neutral-300 leading-relaxed">{note.content}</p>
                                  
                                  <div className="flex items-center justify-between pt-1 text-[10px] text-neutral-500">
                                    {note.video_timestamp > 0 && (
                                      <span className="flex items-center gap-1 text-emerald-500/80">
                                        <Clock className="w-3 h-3" /> عند الدقيقة {Math.floor(note.video_timestamp / 60)}:{Math.floor(note.video_timestamp % 60).toString().padStart(2, '0')}
                                      </span>
                                    )}
                                    <span>
                                      {new Date(note.created_at).toLocaleDateString("ar-EG", {
                                        month: "short",
                                        day: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit"
                                      })}
                                    </span>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        )}
                      </div>

                      {/* زر الشهادة إن وجد */}
                      {cert && (
                        <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                          <span className="text-emerald-400 font-medium flex items-center gap-1">
                            <GraduationCap className="w-4 h-4" /> تم إتمام الكورس بنجاح
                          </span>
                          <Button
                            onClick={() => handleDownloadCert(cert)}
                            className="h-8 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white px-3 rounded-lg text-xs transition-all flex items-center gap-1.5 border border-emerald-500/30"
                          >
                            <Download className="w-3.5 h-3.5" /> الشهادة
                          </Button>
                        </div>
                      )}

                    </motion.div>
                  );
                })}
              </AnimatePresence>
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
