import { useEffect, useState } from "react";
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

  // ==========================================
  // حالات المفضلة الجديدة (استعلام ديناميكي)
  // ==========================================
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteId, setFavoriteId] = useState<string | null>(null);

  // التأكد هل الكورس في المفضلة عند تحميل الصفحة
  useEffect(() => {
    if (!user || !id) return;
    const checkFavoriteStatus = async () => {
      const { data } = await supabase
        .from("favorites")
        .select("id")
        .eq("user_id", user.id)
        .eq("course_id", id)
        .maybeSingle();

      if (data) {
        setIsFavorite(true);
        setFavoriteId(data.id);
      } else {
        setIsFavorite(false);
        setFavoriteId(null);
      }
    };
    checkFavoriteStatus();
  }, [user, id]);

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

  // ==========================================
  // دالة Toggle للإضافة أو الإزالة من المفضلة
  // ==========================================
  const toggleFavMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("يجب تسجيل الدخول أولاً");
      
      if (isFavorite && favoriteId) {
        // إزالة من المفضلة
        const { error } = await supabase.from("favorites").delete().eq("id", favoriteId);
        if (error) throw error;
        return { action: "removed" };
      } else {
        // إضافة للمفضلة
        const { data, error } = await supabase
          .from("favorites")
          .insert({ user_id: user.id, course_id: id! })
          .select("id")
          .single();
        if (error) throw error;
        return { action: "added", id: data.id };
      }
    },
    onSuccess: (data) => {
      if (data.action === "added") {
        setIsFavorite(true);
        setFavoriteId(data.id);
        toast({ title: "تمت الإضافة للمفضلة ❤️" });
      } else {
        setIsFavorite(false);
        setFavoriteId(null);
        toast({ title: "تمت الإزالة من المفضلة 💔" });
      }
    },
    onError: (err: any) => {
      toast({ title: "خطأ", description: err.message, variant: "destructive" });
    },
  });

  const handleEnroll = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    enrollMutation.mutate();
  };

  const handleToggleFavorite = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    toggleFavMutation.mutate();
  };

  const totalLessons = lessons?.length || 0;
  const totalDuration = lessons?.reduce((a, l) => a + (l.duration_minutes || 0), 0) || 0;

  // ==========================================
  // حالة التحميل (Premium Skeleton)
  // ==========================================
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 pt-32 pb-20">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl space-y-6">
              <div className="h-8 w-32 bg-muted rounded-full animate-pulse border border-border" />
              <div className="h-12 w-3/4 bg-muted rounded-2xl animate-pulse border border-border" />
              <div className="h-24 w-full bg-muted rounded-2xl animate-pulse border border-border" />
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
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground text-lg font-medium">عذراً، هذا الكورس غير موجود.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background font-tajawal selection:bg-accent">
      <Navbar />
      
      <main className="flex-1 pt-32 pb-24 md:pb-16 relative overflow-hidden">
        
        {/* إضاءات خلفية (Ambient Glows) */}

        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-12 items-start">
            
            {/* ======================================= */}
            {/* العمود الأيمن (تفاصيل الكورس - متحرك) */}
            {/* ======================================= */}
            <div className="lg:w-[65%] space-y-12">
              
              {/* الهيدر والعنوان */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                {spec && (
                  <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-muted border border-emerald-900/50 text-primary text-sm font-bold mb-6">
                    <Award className="w-4 h-4" />
                    {spec.name}
                  </span>
                )}
                <h1 className="text-3xl md:text-5xl font-black text-foreground mb-6 leading-[1.3]">{course.title}</h1>
                <p className="text-muted-foreground text-lg leading-relaxed mb-6">{course.description}</p>
                <div className="flex items-center gap-3 text-sm text-foreground">
                  <span className="w-10 h-10 rounded-full bg-accent flex items-center justify-center border border-primary/20">
                    <ShieldCheck className="w-5 h-5 text-primary" />
                  </span>
                  <div>
                    <p className="text-xs text-muted-foreground">مقدم الكورس</p>
                    <p className="font-bold text-foreground">{course.instructor}</p>
                  </div>
                </div>
              </motion.div>

              {/* ماذا ستتعلم */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="bg-muted border border-border rounded-3xl p-8 shadow-lg"
              >
                <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center border border-border">
                    <CheckCircle className="w-5 h-5 text-primary" />
                  </div>
                  ماذا ستتعلم في هذا الكورس؟
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {["فهم الأساسيات والمبادئ العلمية", "تطبيق التقنيات الحديثة", "تحليل البيانات الزراعية", "إدارة المشاريع الزراعية", "حل المشكلات العملية", "الحصول على شهادة إتمام"].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-foreground font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* محتوى الكورس (Syllabus) */}
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center border border-border">
                    <BookOpen className="w-5 h-5 text-primary" />
                  </div>
                  محتوى الكورس
                </h2>
                
                {(sections || []).length === 0 ? (
                  <div className="bg-muted border border-border rounded-2xl p-8 text-center">
                    <p className="text-muted-foreground">جاري إعداد محتوى الكورس، سيتم إضافته قريباً.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {(sections || []).map((section, i) => {
                      const sectionLessons = (lessons || []).filter((l) => l.section_id === section.id);
                      return (
                        <div key={section.id} className="bg-muted border border-border rounded-2xl overflow-hidden hover:border-primary/20 transition-colors">
                          <div className="px-6 py-4 bg-muted border-b border-border flex items-center justify-between">
                            <h3 className="font-bold text-foreground text-base">{section.title}</h3>
                            <span className="text-xs font-bold text-primary bg-accent px-3 py-1 rounded-full">
                              {sectionLessons.length} دروس
                            </span>
                          </div>
                          <div className="divide-y divide-neutral-800/40">
                            {sectionLessons.map((lesson) => (
                              <div key={lesson.id} className="px-6 py-4 flex items-center justify-between group hover:bg-muted/50 transition-colors">
                                <div className="flex items-center gap-3">
                                  <PlayCircle className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                  <span className="text-foreground text-sm font-medium">{lesson.title}</span>
                                </div>
                                {lesson.duration_minutes > 0 && (
                                  <span className="text-xs text-muted-foreground">{lesson.duration_minutes} دقيقة</span>
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
              <div className="pt-8 border-t border-border">
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
                className="bg-muted border border-border rounded-3xl p-6 md:p-8 shadow-2xl backdrop-blur-xl"
              >
                
                {/* الأزرار الرئيسية */}
                <div className="space-y-4 mb-8">
                  {enrollment ? (
                    <Button 
                      onClick={() => navigate(`/courses/${id}/learn`)}
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-14 text-lg font-bold rounded-xl transition-all  hover:"
                    >
                      <PlayCircle className="w-5 h-5 ml-2" />
                      متابعة التعلم
                    </Button>
                  ) : (
                    <Button 
                      onClick={handleEnroll} 
                      disabled={enrollMutation.isPending}
                      className="w-full bg-white hover:bg-primary/90 text-black hover:text-primary-foreground h-14 text-lg font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(255,255,255,0.05)] hover:"
                    >
                      {enrollMutation.isPending ? "جاري التسجيل..." : "سجل في الكورس مجاناً"}
                    </Button>
                  )}
                  
                  {/* زر المفضلة الديناميكي الذكي */}
                  <Button 
                    variant="outline" 
                    onClick={handleToggleFavorite}
                    disabled={toggleFavMutation.isPending}
                    className={`w-full h-12 font-bold rounded-xl transition-all group ${
                      isFavorite
                        ? "bg-red-500/10 border-red-500/30 text-red-500 hover:bg-red-500/20"
                        : "bg-transparent border-border text-foreground hover:bg-muted hover:text-foreground hover:border-primary/20"
                    }`}
                  >
                    <Heart 
                      className={`w-4 h-4 ml-2 transition-colors ${
                        isFavorite ? "fill-current" : "group-hover:text-red-500"
                      }`} 
                    />
                    {toggleFavMutation.isPending 
                      ? "جاري التحديث..." 
                      : isFavorite 
                      ? "إزالة من المفضلة" 
                      : "إضافة إلى المفضلة"}
                  </Button>
                </div>

                {/* إحصائيات الكورس المدمجة */}
                <div className="space-y-5">
                  <h4 className="font-bold text-foreground text-base border-b border-border pb-2">معلومات الكورس</h4>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center"><Users className="w-4 h-4 text-primary" /></div>
                      <span>المشتركين</span>
                    </div>
                    <span className="font-bold text-foreground">{enrolledCount || 0} طالب</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center"><BookOpen className="w-4 h-4 text-primary" /></div>
                      <span>الدروس</span>
                    </div>
                    <span className="font-bold text-foreground">{totalLessons} درس</span>
                  </div>

                  {totalDuration > 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center"><Clock className="w-4 h-4 text-primary" /></div>
                        <span>المدة التقريبية</span>
                      </div>
                      <span className="font-bold text-foreground">{Math.round(totalDuration / 60)} ساعة</span>
                    </div>
                  )}

                  {ratingData && ratingData.avg > 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center"><Star className="w-4 h-4 text-yellow-500" /></div>
                        <span>التقييم العام</span>
                      </div>
                      <span className="font-bold text-foreground flex items-center gap-1">
                        {ratingData.avg} <span className="text-muted-foreground text-xs">({ratingData.count})</span>
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
