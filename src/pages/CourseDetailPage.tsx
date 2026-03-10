// import Navbar from "@/components/layout/Navbar";
// import Footer from "@/components/layout/Footer";
// import BottomNav from "@/components/layout/BottomNav";
// import { useParams, useNavigate } from "react-router-dom";
// import { useCourse, useCourseSections, useSectionLessons, useSpecializations, useEnrollment, useEnrollmentsCount, useCourseRating } from "@/hooks/useCourses";
// import { useAuth } from "@/contexts/AuthContext";
// import { supabase } from "@/integrations/supabase/client";
// import { motion } from "framer-motion";
// import { BookOpen, Users, Star, Clock, Award, CheckCircle, Heart } from "lucide-react";
// import RatingSection from "@/components/courses/RatingSection";
// import { Button } from "@/components/ui/button";
// import { useToast } from "@/hooks/use-toast";
// import { useMutation, useQueryClient } from "@tanstack/react-query";

// const CourseDetailPage = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { user } = useAuth();
//   const { toast } = useToast();
//   const queryClient = useQueryClient();

//   const { data: course, isLoading } = useCourse(id!);
//   const { data: specs } = useSpecializations();
//   const { data: sections } = useCourseSections(id!);
//   const sectionIds = (sections || []).map((s) => s.id);
//   const { data: lessons } = useSectionLessons(sectionIds);
//   const { data: enrollment } = useEnrollment(id!, user?.id);
//   const { data: enrolledCount } = useEnrollmentsCount(id!);
//   const { data: ratingData } = useCourseRating(id!);

//   const spec = specs?.find((s) => s.id === course?.specialization_id);

//   const enrollMutation = useMutation({
//     mutationFn: async () => {
//       if (!user) throw new Error("يجب تسجيل الدخول أولاً");
//       const { error } = await supabase.from("enrollments").insert({
//         user_id: user.id,
//         course_id: id!,
//       });
//       if (error) throw error;
//     },
//     onSuccess: () => {
//       toast({ title: "تم التسجيل في الكورس بنجاح!" });
//       queryClient.invalidateQueries({ queryKey: ["enrollment", id] });
//       queryClient.invalidateQueries({ queryKey: ["enrollments-count", id] });
//     },
//     onError: (err: any) => {
//       toast({ title: "خطأ", description: err.message, variant: "destructive" });
//     },
//   });

//   const favMutation = useMutation({
//     mutationFn: async () => {
//       if (!user) throw new Error("يجب تسجيل الدخول أولاً");
//       const { error } = await supabase.from("favorites").insert({
//         user_id: user.id,
//         course_id: id!,
//       });
//       if (error) throw error;
//     },
//     onSuccess: () => {
//       toast({ title: "تمت الإضافة للمفضلة" });
//     },
//     onError: (err: any) => {
//       if (err.message?.includes("duplicate")) {
//         toast({ title: "الكورس موجود بالفعل في المفضلة" });
//       } else {
//         toast({ title: "خطأ", description: err.message, variant: "destructive" });
//       }
//     },
//   });

//   const handleEnroll = () => {
//     if (!user) {
//       navigate("/login");
//       return;
//     }
//     enrollMutation.mutate();
//   };

//   const handleFavorite = () => {
//     if (!user) {
//       navigate("/login");
//       return;
//     }
//     favMutation.mutate();
//   };

//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex flex-col bg-background">
//         <Navbar />
//         <main className="flex-1 pt-20 pb-20">
//           <div className="container mx-auto px-4 py-12">
//             <div className="max-w-4xl space-y-4">
//               <div className="h-8 w-24 bg-secondary rounded animate-pulse" />
//               <div className="h-10 w-96 bg-secondary rounded animate-pulse" />
//               <div className="h-6 w-full bg-secondary rounded animate-pulse" />
//             </div>
//           </div>
//         </main>
//       </div>
//     );
//   }

//   if (!course) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-background">
//         <p className="text-muted-foreground text-lg">الكورس غير موجود</p>
//       </div>
//     );
//   }

//   const totalLessons = lessons?.length || 0;
//   const totalDuration = lessons?.reduce((a, l) => a + (l.duration_minutes || 0), 0) || 0;

//   return (
//     <div className="min-h-screen flex flex-col bg-background">
//       <Navbar />
//       <main className="flex-1 pt-20 pb-20 md:pb-8">
//         <div className="bg-gradient-to-b from-primary/10 to-transparent">
//           <div className="container mx-auto px-4 py-12">
//             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl">
//               {spec && (
//                 <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20 mb-4">
//                   {spec.name}
//                 </span>
//               )}
//               <h1 className="text-3xl md:text-4xl font-black text-foreground mb-4">{course.title}</h1>
//               <p className="text-muted-foreground text-lg mb-6">{course.description}</p>

//               <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
//                 {ratingData && ratingData.avg > 0 && (
//                   <span className="flex items-center gap-1">
//                     <Star className="w-4 h-4 text-yellow-500 fill-current" /> {ratingData.avg} ({ratingData.count})
//                   </span>
//                 )}
//                 <span className="flex items-center gap-1">
//                   <Users className="w-4 h-4" /> {enrolledCount || 0} متعلم
//                 </span>
//                 <span className="flex items-center gap-1">
//                   <BookOpen className="w-4 h-4" /> {totalLessons} درس
//                 </span>
//                 {totalDuration > 0 && (
//                   <span className="flex items-center gap-1">
//                     <Clock className="w-4 h-4" /> {Math.round(totalDuration / 60)} ساعة
//                   </span>
//                 )}
//               </div>

//               <p className="text-sm text-muted-foreground">بواسطة <span className="text-primary">{course.instructor}</span></p>

//               <div className="mt-6 flex gap-3">
//                 {enrollment ? (
//                   <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 px-8" onClick={() => navigate(`/courses/${id}/learn`)}>
//                     متابعة التعلم
//                   </Button>
//                 ) : (
//                   <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 px-8" onClick={handleEnroll} disabled={enrollMutation.isPending}>
//                     {enrollMutation.isPending ? "جاري التسجيل..." : "التسجيل في الكورس"}
//                   </Button>
//                 )}
//                 <Button size="lg" variant="outline" className="border-border text-foreground hover:bg-secondary gap-1" onClick={handleFavorite}>
//                   <Heart className="w-4 h-4" />
//                   إضافة للمفضلة
//                 </Button>
//               </div>
//             </motion.div>
//           </div>
//         </div>

//         <div className="container mx-auto px-4 py-8">
//           <div className="max-w-4xl">
//             <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass-card p-6 mb-8">
//               <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
//                 <Award className="w-5 h-5 text-primary" />
//                 ماذا ستتعلم
//               </h2>
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                 {["فهم الأساسيات والمبادئ العلمية", "تطبيق التقنيات الحديثة", "تحليل البيانات الزراعية", "إدارة المشاريع الزراعية", "حل المشكلات العملية", "الحصول على شهادة إتمام"].map((item) => (
//                   <div key={item} className="flex items-start gap-2">
//                     <CheckCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" />
//                     <span className="text-sm text-muted-foreground">{item}</span>
//                   </div>
//                 ))}
//               </div>
//             </motion.div>

//             <h2 className="text-xl font-bold text-foreground mb-4">محتوى الكورس</h2>
//             {(sections || []).length === 0 ? (
//               <p className="text-muted-foreground text-center py-8">لا يوجد محتوى حالياً</p>
//             ) : (
//               <div className="space-y-3">
//                 {(sections || []).map((section, i) => {
//                   const sectionLessons = (lessons || []).filter((l) => l.section_id === section.id);
//                   return (
//                     <motion.div
//                       key={section.id}
//                       initial={{ opacity: 0, y: 10 }}
//                       whileInView={{ opacity: 1, y: 0 }}
//                       transition={{ delay: i * 0.1 }}
//                       viewport={{ once: true }}
//                       className="glass-card overflow-hidden"
//                     >
//                       <div className="px-5 py-3 bg-secondary/50 font-bold text-sm text-foreground">
//                         {section.title} ({sectionLessons.length} دروس)
//                       </div>
//                       <div className="divide-y divide-border">
//                         {sectionLessons.map((lesson) => (
//                           <div key={lesson.id} className="px-5 py-3 flex items-center justify-between text-sm">
//                             <span className="text-muted-foreground">{lesson.title}</span>
//                             {lesson.duration_minutes > 0 && (
//                               <span className="text-xs text-muted-foreground">{lesson.duration_minutes} دقيقة</span>
//                             )}
//                           </div>
//                         ))}
//                       </div>
//                     </motion.div>
//                   );
//                 })}
//               </div>
//             )}
//             {/* Ratings */}
//             <div className="mt-8">
//               <RatingSection courseId={id!} />
//             </div>
//           </div>
//         </div>
//       </main>
//       <Footer />
//       <BottomNav />
//     </div>
//   );
// };

// export default CourseDetailPage;

//v2

import { useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BottomNav from "@/components/layout/BottomNav";
import { useParams, useNavigate } from "react-router-dom";
import { useCourse, useCourseSections, useSectionLessons, useSpecializations, useEnrollment, useEnrollmentsCount, useCourseRating } from "@/hooks/useCourses";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { BookOpen, Users, Star, Clock, Award, CheckCircle, Heart, PlayCircle, ShieldCheck } from "lucide-react";
import RatingSection from "@/components/courses/RatingSection";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const CourseDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // تمرير لأعلى الصفحة عند الفتح
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { data: course, isLoading } = useCourse(id!);
  const { data: specs } = useSpecializations();
  const { data: sections } = useCourseSections(id!);
  const sectionIds = (sections || []).map((s) => s.id);
  const { data: lessons } = useSectionLessons(sectionIds);
  const { data: enrollment } = useEnrollment(id!, user?.id);
  const { data: enrolledCount } = useEnrollmentsCount(id!);
  const { data: ratingData } = useCourseRating(id!);

  const spec = specs?.find((s) => s.id === course?.specialization_id);

  const enrollMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("يجب تسجيل الدخول أولاً");
      const { error } = await supabase.from("enrollments").insert({
        user_id: user.id,
        course_id: id!,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "تم التسجيل في الكورس بنجاح!" });
      queryClient.invalidateQueries({ queryKey: ["enrollment", id] });
      queryClient.invalidateQueries({ queryKey: ["enrollments-count", id] });
    },
    onError: (err: any) => {
      toast({ title: "خطأ", description: err.message, variant: "destructive" });
    },
  });

  const favMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("يجب تسجيل الدخول أولاً");
      const { error } = await supabase.from("favorites").insert({
        user_id: user.id,
        course_id: id!,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "تمت الإضافة للمفضلة" });
    },
    onError: (err: any) => {
      if (err.message?.includes("duplicate")) {
        toast({ title: "الكورس موجود بالفعل في المفضلة" });
      } else {
        toast({ title: "خطأ", description: err.message, variant: "destructive" });
      }
    },
  });

  const handleEnroll = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    enrollMutation.mutate();
  };

  const handleFavorite = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    favMutation.mutate();
  };

  const totalLessons = lessons?.length || 0;
  const totalDuration = lessons?.reduce((a, l) => a + (l.duration_minutes || 0), 0) || 0;

  // ==========================================
  // حالة التحميل (Premium Skeleton)
  // ==========================================
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#050806]">
        <Navbar />
        <main className="flex-1 pt-32 pb-20">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl space-y-6">
              <div className="h-8 w-32 bg-[#121A15] rounded-full animate-pulse border border-neutral-800" />
              <div className="h-12 w-3/4 bg-[#121A15] rounded-2xl animate-pulse border border-neutral-800" />
              <div className="h-24 w-full bg-[#121A15] rounded-2xl animate-pulse border border-neutral-800" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ==========================================
  // حالة عدم وجود الكورس
  // ==========================================
  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050806]">
        <p className="text-neutral-400 text-lg font-medium">عذراً، هذا الكورس غير موجود.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#050806] font-tajawal selection:bg-emerald-500/30">
      <Navbar />
      
      <main className="flex-1 pt-32 pb-24 md:pb-16 relative overflow-hidden">
        
        {/* إضاءات خلفية (Ambient Glows) */}
        <div className="absolute top-[-10%] left-[-5%] w-[50vw] h-[50vw] rounded-full bg-emerald-900/10 blur-[150px] pointer-events-none" />
        
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-12 items-start">
            
            {/* ======================================= */}
            {/* العمود الأيمن (تفاصيل الكورس - متحرك) */}
            {/* ======================================= */}
            <div className="lg:w-[65%] space-y-12">
              
              {/* الهيدر والعنوان */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                {spec && (
                  <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#121A15] border border-emerald-900/50 text-emerald-400 text-sm font-bold mb-6">
                    <Award className="w-4 h-4" />
                    {spec.name}
                  </span>
                )}
                <h1 className="text-3xl md:text-5xl font-black text-white mb-6 leading-[1.3]">{course.title}</h1>
                <p className="text-neutral-400 text-lg leading-relaxed mb-6">{course.description}</p>
                <div className="flex items-center gap-3 text-sm text-neutral-300">
                  <span className="w-10 h-10 rounded-full bg-emerald-900/20 flex items-center justify-center border border-emerald-500/20">
                    <ShieldCheck className="w-5 h-5 text-emerald-500" />
                  </span>
                  <div>
                    <p className="text-xs text-neutral-500">مقدم الكورس</p>
                    <p className="font-bold text-white">{course.instructor}</p>
                  </div>
                </div>
              </motion.div>

              {/* ماذا ستتعلم */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="bg-[#0a0f0c] border border-neutral-800/60 rounded-3xl p-8 shadow-lg"
              >
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#121A15] flex items-center justify-center border border-neutral-800">
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                  </div>
                  ماذا ستتعلم في هذا الكورس؟
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {["فهم الأساسيات والمبادئ العلمية", "تطبيق التقنيات الحديثة", "تحليل البيانات الزراعية", "إدارة المشاريع الزراعية", "حل المشكلات العملية", "الحصول على شهادة إتمام"].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="text-neutral-300 font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* محتوى الكورس (Syllabus) */}
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#121A15] flex items-center justify-center border border-neutral-800">
                    <BookOpen className="w-5 h-5 text-emerald-500" />
                  </div>
                  محتوى الكورس
                </h2>
                
                {(sections || []).length === 0 ? (
                  <div className="bg-[#121A15] border border-neutral-800 rounded-2xl p-8 text-center">
                    <p className="text-neutral-500">جاري إعداد محتوى الكورس، سيتم إضافته قريباً.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {(sections || []).map((section, i) => {
                      const sectionLessons = (lessons || []).filter((l) => l.section_id === section.id);
                      return (
                        <div key={section.id} className="bg-[#0a0f0c] border border-neutral-800/60 rounded-2xl overflow-hidden hover:border-emerald-500/30 transition-colors">
                          <div className="px-6 py-4 bg-[#121A15] border-b border-neutral-800/60 flex items-center justify-between">
                            <h3 className="font-bold text-white text-base">{section.title}</h3>
                            <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full">
                              {sectionLessons.length} دروس
                            </span>
                          </div>
                          <div className="divide-y divide-neutral-800/40">
                            {sectionLessons.map((lesson) => (
                              <div key={lesson.id} className="px-6 py-4 flex items-center justify-between group hover:bg-[#121A15]/50 transition-colors">
                                <div className="flex items-center gap-3">
                                  <PlayCircle className="w-5 h-5 text-neutral-600 group-hover:text-emerald-500 transition-colors" />
                                  <span className="text-neutral-300 text-sm font-medium">{lesson.title}</span>
                                </div>
                                {lesson.duration_minutes > 0 && (
                                  <span className="text-xs text-neutral-500">{lesson.duration_minutes} دقيقة</span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </motion.div>

              {/* التقييمات */}
              <div className="pt-8 border-t border-neutral-800/50">
                <RatingSection courseId={id!} />
              </div>
              
            </div>

            {/* ======================================= */}
            {/* العمود الأيسر (الكارت اللاصق - Sticky) */}
            {/* ======================================= */}
            <div className="lg:w-[35%] w-full lg:sticky lg:top-32 z-20">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }} 
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-[#0a0f0c] border border-neutral-800/80 rounded-3xl p-6 md:p-8 shadow-2xl backdrop-blur-xl"
              >
                
                {/* الأزرار الرئيسية */}
                <div className="space-y-4 mb-8">
                  {enrollment ? (
                    <Button 
                      onClick={() => navigate(`/courses/${id}/learn`)}
                      className="w-full bg-emerald-600 hover:bg-emerald-500 text-white h-14 text-lg font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)]"
                    >
                      <PlayCircle className="w-5 h-5 ml-2" />
                      متابعة التعلم
                    </Button>
                  ) : (
                    <Button 
                      onClick={handleEnroll} 
                      disabled={enrollMutation.isPending}
                      className="w-full bg-white hover:bg-emerald-500 text-black hover:text-white h-14 text-lg font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(255,255,255,0.05)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)]"
                    >
                      {enrollMutation.isPending ? "جاري التسجيل..." : "سجل في الكورس مجاناً"}
                    </Button>
                  )}
                  
                  <Button 
                    variant="outline" 
                    onClick={handleFavorite}
                    className="w-full bg-transparent border-neutral-700 text-neutral-300 hover:bg-[#121A15] hover:text-white hover:border-emerald-500/50 h-12 font-bold rounded-xl transition-all group"
                  >
                    <Heart className="w-4 h-4 ml-2 group-hover:text-red-500 transition-colors" />
                    إضافة إلى المفضلة
                  </Button>
                </div>

                {/* إحصائيات الكورس المدمجة */}
                <div className="space-y-5">
                  <h4 className="font-bold text-white text-base border-b border-neutral-800 pb-2">معلومات الكورس</h4>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-3 text-neutral-400">
                      <div className="w-8 h-8 rounded-lg bg-[#121A15] flex items-center justify-center"><Users className="w-4 h-4 text-emerald-500" /></div>
                      <span>المشتركين</span>
                    </div>
                    <span className="font-bold text-white">{enrolledCount || 0} طالب</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-3 text-neutral-400">
                      <div className="w-8 h-8 rounded-lg bg-[#121A15] flex items-center justify-center"><BookOpen className="w-4 h-4 text-emerald-500" /></div>
                      <span>الدروس</span>
                    </div>
                    <span className="font-bold text-white">{totalLessons} درس</span>
                  </div>

                  {totalDuration > 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-3 text-neutral-400">
                        <div className="w-8 h-8 rounded-lg bg-[#121A15] flex items-center justify-center"><Clock className="w-4 h-4 text-emerald-500" /></div>
                        <span>المدة التقريبية</span>
                      </div>
                      <span className="font-bold text-white">{Math.round(totalDuration / 60)} ساعة</span>
                    </div>
                  )}

                  {ratingData && ratingData.avg > 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-3 text-neutral-400">
                        <div className="w-8 h-8 rounded-lg bg-[#121A15] flex items-center justify-center"><Star className="w-4 h-4 text-yellow-500" /></div>
                        <span>التقييم العام</span>
                      </div>
                      <span className="font-bold text-white flex items-center gap-1">
                        {ratingData.avg} <span className="text-neutral-500 text-xs">({ratingData.count})</span>
                      </span>
                    </div>
                  )}
                </div>

              </motion.div>
            </div>

          </div>
        </div>
      </main>
      
      <Footer />
      <BottomNav />
    </div>
  );
};

export default CourseDetailPage;
