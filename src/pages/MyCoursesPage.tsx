import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, CheckCircle, PlayCircle, Download, Award, GraduationCap, ArrowLeft } from "lucide-react";
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
    <div className="min-h-screen flex flex-col bg-[#050806] font-tajawal selection:bg-emerald-500/30">
      <Navbar />
      <main className="flex-1 pt-32 pb-24 md:pb-16 relative overflow-x-hidden">
        
        {/* إضاءات خلفية (Ambient Glows) */}
        <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-emerald-900/10 blur-[150px] pointer-events-none" />
        <div className="absolute top-[40%] right-[-10%] w-[30vw] h-[30vw] rounded-full bg-emerald-900/5 blur-[120px] pointer-events-none" />
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')] opacity-5 pointer-events-none" />

        <div className="container mx-auto px-4 lg:px-8 relative z-10 max-w-6xl">
          
          {/* ======================================= */}
          {/* الهيدر */}
          {/* ======================================= */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5 }}
            className="mb-10 lg:mb-16 max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-900/20 border border-emerald-500/20 text-emerald-400 text-sm font-bold shadow-[0_0_20px_rgba(16,185,129,0.1)] mb-6">
              <Award className="w-4 h-4" />
              تابع التعلم
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-4">
               <span className="text-transparent bg-clip-text bg-gradient-to-l from-emerald-400 to-emerald-600">كورساتي</span>
            </h1>
            <p className="text-lg md:text-xl text-neutral-400 leading-relaxed">
              تابع تقدمك، استكمل دروسك، واحصل على شهاداتك فور إتمامك للمسارات التدريبية.
            </p>
          </motion.div>

          {/* ======================================= */}
          {/* المحتوى */}
          {/* ======================================= */}
          {isLoading ? (
            
            // --- حالة التحميل (Premium Skeletons) ---
            <div className="space-y-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-gradient-to-r from-[#0a0f0c] to-[#0f1712] border border-white/5 rounded-[2rem] p-6 h-auto sm:h-48 flex flex-col sm:flex-row gap-6 animate-pulse shadow-xl">
                  <div className="w-full sm:w-56 h-32 sm:h-full bg-[#121A15] rounded-2xl shrink-0" />
                  <div className="flex-1 flex flex-col justify-center space-y-4 py-2">
                    <div className="h-6 w-3/4 bg-[#121A15] rounded-md" />
                    <div className="h-4 w-1/3 bg-[#121A15] rounded-md" />
                    <div className="h-3 w-full bg-[#121A15] rounded-full mt-auto" />
                  </div>
                </div>
              ))}
            </div>

          ) : !enrollments || enrollments.length === 0 ? (
            
            // --- حالة خلو الصفحة (Empty State) ---
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-32 px-4 text-center bg-gradient-to-b from-[#0a0f0c] to-[#050806] border border-dashed border-neutral-800 rounded-[2.5rem] shadow-2xl max-w-3xl mx-auto mt-8"
            >
              {/* أنيميشن طفو للأيقونة */}
              <motion.div 
                animate={{ y: [0, -12, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                className="w-24 h-24 bg-gradient-to-tr from-[#121A15] to-[#1a241d] rounded-[2rem] flex items-center justify-center mb-8 border border-white/5 shadow-2xl relative"
              >
                <div className="absolute inset-0 bg-emerald-500/10 rounded-[2rem] blur-xl" />
                <BookOpen className="w-12 h-12 text-neutral-500 relative z-10" />
              </motion.div>
              <h3 className="text-3xl font-black text-white mb-4">لم تبدأ رحلتك بعد</h3>
              <p className="text-neutral-400 text-lg max-w-md mb-10 leading-relaxed">
                لم تقم بالتسجيل في أي كورس حتى الآن. مكتبة نبتة مليئة بالمعرفة التي تنتظرك.
              </p>
              <Link to="/courses">
                <Button className="group bg-emerald-600 hover:bg-emerald-500 text-white px-10 h-14 rounded-2xl font-bold text-lg transition-all shadow-[0_0_30px_rgba(16,185,129,0.2)] hover:shadow-[0_0_40px_rgba(16,185,129,0.4)] flex items-center gap-3">
                  تصفح الكورسات المتاحة
                  <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>

          ) : (
            
            // --- عرض الكورسات المسجلة (Progress Cards) ---
            <div className="space-y-6">
              <AnimatePresence>
                {enrollments.map((enrollment: any, i: number) => {
                  const course = enrollment.courses;
                  if (!course) return null;
                  const progress = getProgress(course.id);
                  const cert = getCertificate(course.id);
                  const isCompleted = progress === 100;

                  return (
                    <motion.div
                      key={enrollment.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="group bg-gradient-to-r from-[#0a0f0c] to-[#0f1712] border border-white/5 rounded-[2rem] p-5 sm:p-6 hover:border-emerald-500/30 transition-all duration-500 shadow-lg hover:shadow-2xl hover:shadow-emerald-500/10 relative overflow-hidden"
                    >
                      {/* شريط الإضاءة العلوي للكارت المكتمل */}
                      {isCompleted && (
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-emerald-600 opacity-50" />
                      )}

                      <div className="flex flex-col sm:flex-row gap-6 lg:gap-8 items-start sm:items-center">
                        
                        {/* صورة الكورس */}
                        <Link to={`/courses/${course.id}/learn`} className="w-full sm:w-64 h-40 sm:h-44 rounded-2xl bg-neutral-900 border border-white/5 overflow-hidden shrink-0 relative block">
                          {course.thumbnail_url ? (
                            <>
                              <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
                            </>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-900/20 to-[#0a0f0c]">
                              <BookOpen className="w-10 h-10 text-emerald-500/30" />
                            </div>
                          )}
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="w-14 h-14 bg-emerald-500/90 rounded-full flex items-center justify-center backdrop-blur-sm shadow-lg shadow-emerald-500/30 transform scale-90 group-hover:scale-100 transition-transform">
                              <PlayCircle className="w-7 h-7 text-white fill-white" />
                            </div>
                          </div>
                        </Link>

                        {/* معلومات الكورس والتقدم */}
                        <div className="flex-1 min-w-0 w-full flex flex-col h-full py-1">
                          <div className="mb-auto">
                            <Link to={`/courses/${course.id}/learn`}>
                              <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors line-clamp-2 leading-snug">
                                {course.title}
                              </h3>
                            </Link>
                            <p className="text-sm text-neutral-400 flex items-center gap-2">
                              بواسطة <span className="font-bold text-neutral-200">{course.instructor}</span>
                            </p>
                          </div>

                          <div className="mt-6 space-y-3">
                            <div className="flex justify-between items-end">
                              <span className="text-sm font-bold text-neutral-300">نسبة الإنجاز</span>
                              <span className={`text-xl font-black ${isCompleted ? 'text-emerald-400' : 'text-white'}`}>
                                {progress}%
                              </span>
                            </div>
                            <Progress 
                              value={progress} 
                              // تخصيص الـ Progress عشان ياخد تدرج لوني وضل
                              className="h-2.5 bg-neutral-800 overflow-hidden rounded-full [&>div]:bg-gradient-to-r [&>div]:from-emerald-500 [&>div]:to-emerald-300 [&>div]:shadow-[0_0_10px_rgba(16,185,129,0.5)]" 
                            />
                          </div>
                        </div>

                        {/* زر المتابعة/البدء (موبايل وتابلت بيترصوا لوحدهم) */}
                        <div className="shrink-0 w-full sm:w-auto mt-2 sm:mt-0 self-end sm:self-center">
                          <Link to={`/courses/${course.id}/learn`} className="block">
                            <Button 
                              className={`w-full sm:w-auto h-14 px-8 rounded-xl font-bold text-lg flex items-center justify-center gap-2.5 transition-all ${
                                isCompleted 
                                  ? "bg-white/5 text-white border border-white/10 hover:bg-white/10 hover:border-emerald-500/30" 
                                  : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:-translate-y-0.5"
                              }`}
                            >
                              {isCompleted ? (
                                <>مراجعة <ArrowLeft className="w-5 h-5" /></>
                              ) : progress > 0 ? (
                                <>متابعة <PlayCircle className="w-5 h-5" /></>
                              ) : (
                                <>ابدأ الآن <PlayCircle className="w-5 h-5" /></>
                              )}
                            </Button>
                          </Link>
                        </div>
                      </div>

                      {/* ======================================= */}
                      {/* منطقة الشهادة (VIP Banner) */}
                      {/* ======================================= */}
                      {cert && (
                        <div className="mt-8 pt-5 border-t border-white/5">
                          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-gradient-to-r from-emerald-900/20 to-transparent border border-emerald-500/20 rounded-2xl p-4 md:px-6 md:py-4">
                            <div className="flex items-center gap-3 w-full sm:w-auto">
                              <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center shrink-0">
                                <GraduationCap className="w-5 h-5 text-emerald-400" />
                              </div>
                              <div>
                                <p className="text-emerald-400 font-bold text-sm md:text-base">تهانينا! لقد أتممت هذا الكورس بنجاح.</p>
                                <p className="text-neutral-500 text-xs mt-0.5 font-sans">ID: {cert.certificate_number}</p>
                              </div>
                            </div>
                            
                            <Button
                              onClick={() => handleDownloadCert(cert)}
                              className="w-full sm:w-auto h-12 bg-[#050806] border border-emerald-500/50 hover:bg-emerald-600 text-white font-bold px-6 rounded-xl transition-all shadow-lg hover:shadow-emerald-500/20 flex items-center gap-2"
                            >
                              <Download className="w-4 h-4" />
                              تحميل الشهادة
                            </Button>
                          </div>
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
