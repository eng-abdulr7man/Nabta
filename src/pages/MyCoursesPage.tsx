// import { useQuery } from "@tanstack/react-query";
// import { supabase } from "@/integrations/supabase/client";
// import { useAuth } from "@/contexts/AuthContext";
// import { Link } from "react-router-dom";
// import { motion } from "framer-motion";
// import { BookOpen, CheckCircle, PlayCircle, Download } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Progress } from "@/components/ui/progress";
// import Navbar from "@/components/layout/Navbar";
// import Footer from "@/components/layout/Footer";
// import BottomNav from "@/components/layout/BottomNav";
// import { downloadCertificatePDF } from "@/lib/generateCertificatePDF";

// const MyCoursesPage = () => {
//   const { user, profile } = useAuth();

//   const { data: enrollments, isLoading } = useQuery({
//     queryKey: ["my-enrollments", user?.id],
//     queryFn: async () => {
//       const { data, error } = await supabase
//         .from("enrollments")
//         .select("*, courses(*)")
//         .eq("user_id", user!.id)
//         .order("enrolled_at", { ascending: false });
//       if (error) throw error;
//       return data;
//     },
//     enabled: !!user,
//   });

//   const { data: progressData } = useQuery({
//     queryKey: ["my-progress", user?.id],
//     queryFn: async () => {
//       const { data, error } = await supabase
//         .from("lesson_progress")
//         .select("lesson_id, completed")
//         .eq("user_id", user!.id);
//       if (error) throw error;
//       return data;
//     },
//     enabled: !!user,
//   });

//   const courseIds = (enrollments || []).map((e: any) => e.course_id);
//   const { data: lessonCounts } = useQuery({
//     queryKey: ["lesson-counts", courseIds],
//     queryFn: async () => {
//       const { data: sections } = await supabase
//         .from("sections")
//         .select("id, course_id")
//         .in("course_id", courseIds);
//       if (!sections) return {};
//       const sectionIds = sections.map((s: any) => s.id);
//       const { data: lessons } = await supabase
//         .from("lessons")
//         .select("id, section_id")
//         .in("section_id", sectionIds);

//       const courseLessonCount: Record<string, { total: number; lessonIds: string[] }> = {};
//       for (const s of sections) {
//         if (!courseLessonCount[s.course_id]) {
//           courseLessonCount[s.course_id] = { total: 0, lessonIds: [] };
//         }
//       }
//       for (const l of (lessons || [])) {
//         const section = sections.find((s: any) => s.id === l.section_id);
//         if (section) {
//           courseLessonCount[section.course_id].total++;
//           courseLessonCount[section.course_id].lessonIds.push(l.id);
//         }
//       }
//       return courseLessonCount;
//     },
//     enabled: courseIds.length > 0,
//   });

//   const getProgress = (courseId: string) => {
//     const info = lessonCounts?.[courseId];
//     if (!info || info.total === 0) return 0;
//     const completed = (progressData || []).filter(
//       (p: any) => p.completed && info.lessonIds.includes(p.lesson_id)
//     ).length;
//     return Math.round((completed / info.total) * 100);
//   };

//   const { data: certificates } = useQuery({
//     queryKey: ["my-certificates", user?.id],
//     queryFn: async () => {
//       const { data, error } = await supabase
//         .from("certificates")
//         .select("*, courses(title, instructor)")
//         .eq("user_id", user!.id);
//       if (error) throw error;
//       return data;
//     },
//     enabled: !!user,
//   });

//   const getCertificate = (courseId: string) => {
//     return certificates?.find((c: any) => c.course_id === courseId);
//   };

//   const handleDownloadCert = async (cert: any) => {
//     await downloadCertificatePDF({
//       learnerName: profile?.full_name || user?.email || "",
//       courseName: cert.courses?.title || "",
//       certificateNumber: cert.certificate_number,
//       issuedAt: cert.issued_at,
//       instructor: cert.courses?.instructor,
//     });
//   };

//   return (
//     <div className="min-h-screen flex flex-col bg-background">
//       <Navbar />
//       <main className="flex-1 pt-24 pb-20 md:pb-8">
//         <div className="container mx-auto px-4">
//           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
//             <h1 className="text-3xl font-black text-foreground mb-2">كورساتي</h1>
//             <p className="text-muted-foreground">تابع تقدمك في الكورسات المسجل بها</p>
//           </motion.div>

//           {isLoading ? (
//             <div className="space-y-4">
//               {Array.from({ length: 3 }).map((_, i) => (
//                 <div key={i} className="glass-card h-28 animate-pulse" />
//               ))}
//             </div>
//           ) : !enrollments || enrollments.length === 0 ? (
//             <div className="text-center py-16">
//               <BookOpen className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
//               <p className="text-lg text-muted-foreground mb-4">لم تسجل في أي كورس بعد</p>
//               <Link to="/courses">
//                 <Button className="bg-primary text-primary-foreground">تصفح الكورسات</Button>
//               </Link>
//             </div>
//           ) : (
//             <div className="space-y-4">
//               {enrollments.map((enrollment: any, i: number) => {
//                 const course = enrollment.courses;
//                 if (!course) return null;
//                 const progress = getProgress(course.id);
//                 const cert = getCertificate(course.id);

//                 return (
//                   <motion.div
//                     key={enrollment.id}
//                     initial={{ opacity: 0, y: 15 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ delay: i * 0.05 }}
//                     className="glass-card p-4 sm:p-5"
//                   >
//                     <div className="flex flex-col sm:flex-row sm:items-center gap-4">
//                       <div className="w-full sm:w-32 h-20 rounded-lg bg-gradient-to-br from-primary/20 to-accent/10 overflow-hidden shrink-0">
//                         {course.thumbnail_url ? (
//                           <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover" />
//                         ) : (
//                           <div className="w-full h-full flex items-center justify-center">
//                             <BookOpen className="w-8 h-8 text-primary/30" />
//                           </div>
//                         )}
//                       </div>

//                       <div className="flex-1 min-w-0">
//                         <h3 className="font-bold text-foreground truncate">{course.title}</h3>
//                         <p className="text-xs text-muted-foreground mt-1">{course.instructor}</p>
//                         <div className="mt-3 flex items-center gap-3">
//                           <Progress value={progress} className="flex-1 h-2" />
//                           <span className="text-xs font-medium text-muted-foreground shrink-0">{progress}%</span>
//                         </div>
//                         {cert && (
//                           <div className="flex items-center gap-2 mt-2">
//                             <div className="flex items-center gap-1 text-xs text-primary">
//                               <CheckCircle className="w-3.5 h-3.5" />
//                               <span>تم الحصول على الشهادة</span>
//                             </div>
//                             <button
//                               onClick={() => handleDownloadCert(cert)}
//                               className="flex items-center gap-1 text-xs text-primary hover:underline"
//                             >
//                               <Download className="w-3.5 h-3.5" />
//                               تحميل PDF
//                             </button>
//                           </div>
//                         )}
//                       </div>

//                       <Link to={`/courses/${course.id}/learn`} className="shrink-0">
//                         <Button size="sm" className="bg-primary text-primary-foreground gap-1 w-full sm:w-auto">
//                           <PlayCircle className="w-4 h-4" />
//                           {progress > 0 ? "متابعة" : "ابدأ"}
//                         </Button>
//                       </Link>
//                     </div>
//                   </motion.div>
//                 );
//               })}
//             </div>
//           )}
//         </div>
//       </main>
//       <Footer />
//       <BottomNav />
//     </div>
//   );
// };

// export default MyCoursesPage;

//v2
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, CheckCircle, PlayCircle, Download, Award, SearchX } from "lucide-react";
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
      <main className="flex-1 pt-32 pb-24 md:pb-16 relative overflow-hidden">
        
        {/* إضاءات خلفية (Ambient Glows) */}
        <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-emerald-900/10 blur-[150px] pointer-events-none" />
        <div className="absolute top-[40%] right-[-10%] w-[30vw] h-[30vw] rounded-full bg-emerald-900/5 blur-[120px] pointer-events-none" />

        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          
          {/* ======================================= */}
          {/* الهيدر */}
          {/* ======================================= */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5 }}
            className="mb-10 lg:mb-12 max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#121A15] border border-neutral-800 text-emerald-400 text-sm font-medium shadow-[0_0_20px_rgba(16,185,129,0.05)] mb-4">
              <Award className="w-4 h-4" />
              التعلم المستمر
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
              مساحة <span className="text-transparent bg-clip-text bg-gradient-to-l from-emerald-400 to-green-600">كورساتي</span>
            </h1>
            <p className="text-lg text-neutral-400 leading-relaxed">
              تابع تقدمك، استكمل دروسك، واحصل على شهاداتك فور إتمامك للمسارات التدريبية.
            </p>
          </motion.div>

          {/* ======================================= */}
          {/* المحتوى */}
          {/* ======================================= */}
          {isLoading ? (
            
            // --- حالة التحميل (Skeletons) ---
            <div className="space-y-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-[#0a0f0c] border border-neutral-800/50 rounded-3xl p-6 h-40 flex flex-col sm:flex-row gap-6 animate-pulse shadow-lg">
                  <div className="w-full sm:w-48 h-full bg-[#121A15] rounded-2xl shrink-0" />
                  <div className="flex-1 space-y-4 py-2">
                    <div className="h-5 w-1/2 bg-[#121A15] rounded-md" />
                    <div className="h-3 w-1/4 bg-[#121A15] rounded-md" />
                    <div className="h-2 w-full bg-[#121A15] rounded-full mt-6" />
                  </div>
                </div>
              ))}
            </div>

          ) : !enrollments || enrollments.length === 0 ? (
            
            // --- حالة خلو الصفحة (Empty State) ---
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-24 px-4 text-center bg-[#0a0f0c] border border-dashed border-neutral-800 rounded-[2rem] shadow-lg max-w-2xl mx-auto mt-8"
            >
              <div className="w-20 h-20 bg-[#121A15] rounded-2xl flex items-center justify-center mb-6 border border-neutral-800 shadow-inner relative">
                <div className="absolute inset-0 bg-emerald-500/5 rounded-2xl blur-md" />
                <BookOpen className="w-10 h-10 text-neutral-500 relative z-10" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">لم تبدأ رحلتك بعد</h3>
              <p className="text-neutral-400 max-w-sm mb-8 leading-relaxed">
                لم تقم بالتسجيل في أي كورس حتى الآن. ابدأ الآن واكتسب مهارات زراعية جديدة.
              </p>
              <Link to="/courses">
                <Button className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 h-12 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)]">
                  تصفح الكورسات المتاحة
                </Button>
              </Link>
            </motion.div>

          ) : (
            
            // --- عرض الكورسات المسجلة (Progress Cards) ---
            <div className="space-y-6">
              {enrollments.map((enrollment: any, i: number) => {
                const course = enrollment.courses;
                if (!course) return null;
                const progress = getProgress(course.id);
                const cert = getCertificate(course.id);
                const isCompleted = progress === 100;

                return (
                  <motion.div
                    key={enrollment.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="group bg-[#0a0f0c] border border-neutral-800/60 rounded-3xl p-5 sm:p-6 hover:bg-[#121A15] hover:border-emerald-500/30 transition-all duration-300 shadow-lg hover:shadow-[0_10px_30px_rgba(16,185,129,0.05)] hover:-translate-y-1"
                  >
                    <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                      
                      {/* صورة الكورس */}
                      <div className="w-full sm:w-48 h-32 rounded-2xl bg-[#121A15] border border-neutral-800 overflow-hidden shrink-0 relative group-hover:border-emerald-500/20 transition-colors">
                        {course.thumbnail_url ? (
                          <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-emerald-900/10">
                            <BookOpen className="w-8 h-8 text-emerald-500/50" />
                          </div>
                        )}
                      </div>

                      {/* معلومات الكورس والتقدم */}
                      <div className="flex-1 min-w-0 w-full space-y-3">
                        <div>
                          <h3 className="text-xl font-bold text-white truncate mb-1 group-hover:text-emerald-400 transition-colors">
                            {course.title}
                          </h3>
                          <p className="text-sm text-neutral-400">بواسطة: <span className="text-neutral-300">{course.instructor}</span></p>
                        </div>

                        <div className="flex items-center gap-4 pt-2">
                          <Progress 
                            value={progress} 
                            // استخدام كلاسات Tailwind للتحكم في لون الـ Progress الداخلي
                            className="flex-1 h-2 bg-neutral-800 overflow-hidden rounded-full [&>div]:bg-emerald-500" 
                          />
                          <span className={`text-sm font-bold shrink-0 ${isCompleted ? 'text-emerald-500' : 'text-neutral-400'}`}>
                            {progress}%
                          </span>
                        </div>
                      </div>

                      {/* زر المتابعة/البدء */}
                      <div className="shrink-0 w-full sm:w-auto mt-4 sm:mt-0">
                        <Link to={`/courses/${course.id}/learn`} className="block">
                          <Button 
                            className={`w-full sm:w-auto h-12 px-6 rounded-xl font-bold flex items-center gap-2 transition-all ${
                              isCompleted 
                                ? "bg-[#121A15] text-white border border-neutral-700 hover:bg-neutral-800" 
                                : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)]"
                            }`}
                          >
                            <PlayCircle className="w-5 h-5" />
                            {isCompleted ? "مراجعة الكورس" : progress > 0 ? "متابعة التعلم" : "ابدأ الآن"}
                          </Button>
                        </Link>
                      </div>
                    </div>

                    {/* منطقة الشهادة (تظهر فقط عند اكتمال الكورس) */}
                    {cert && (
                      <div className="mt-5 pt-5 border-t border-neutral-800/60 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2 text-sm text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-xl w-full sm:w-auto justify-center">
                          <CheckCircle className="w-4 h-4" />
                          <span>تم إتمام الكورس بنجاح</span>
                        </div>
                        
                        <button
                          onClick={() => handleDownloadCert(cert)}
                          className="flex items-center justify-center gap-2 text-sm text-white font-bold bg-[#121A15] border border-neutral-700 hover:border-emerald-500 hover:bg-emerald-600 hover:text-white px-5 py-2.5 rounded-xl w-full sm:w-auto transition-all duration-300"
                        >
                          <Download className="w-4 h-4" />
                          تحميل الشهادة (PDF)
                        </button>
                      </div>
                    )}
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
