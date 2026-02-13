import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BottomNav from "@/components/layout/BottomNav";
import { useParams, useNavigate } from "react-router-dom";
import { useCourse, useCourseSections, useSectionLessons, useSpecializations, useEnrollment, useEnrollmentsCount, useCourseRating } from "@/hooks/useCourses";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { BookOpen, Users, Star, Clock, Award, CheckCircle, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const CourseDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

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

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 pt-20 pb-20">
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl space-y-4">
              <div className="h-8 w-24 bg-secondary rounded animate-pulse" />
              <div className="h-10 w-96 bg-secondary rounded animate-pulse" />
              <div className="h-6 w-full bg-secondary rounded animate-pulse" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground text-lg">الكورس غير موجود</p>
      </div>
    );
  }

  const totalLessons = lessons?.length || 0;
  const totalDuration = lessons?.reduce((a, l) => a + (l.duration_minutes || 0), 0) || 0;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 pt-20 pb-20 md:pb-8">
        <div className="bg-gradient-to-b from-primary/10 to-transparent">
          <div className="container mx-auto px-4 py-12">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl">
              {spec && (
                <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20 mb-4">
                  {spec.name}
                </span>
              )}
              <h1 className="text-3xl md:text-4xl font-black text-foreground mb-4">{course.title}</h1>
              <p className="text-muted-foreground text-lg mb-6">{course.description}</p>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
                {ratingData && ratingData.avg > 0 && (
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" /> {ratingData.avg} ({ratingData.count})
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" /> {enrolledCount || 0} متعلم
                </span>
                <span className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4" /> {totalLessons} درس
                </span>
                {totalDuration > 0 && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" /> {Math.round(totalDuration / 60)} ساعة
                  </span>
                )}
              </div>

              <p className="text-sm text-muted-foreground">بواسطة <span className="text-primary">{course.instructor}</span></p>

              <div className="mt-6 flex gap-3">
                {enrollment ? (
                  <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 px-8" onClick={() => navigate(`/courses/${id}/learn`)}>
                    متابعة التعلم
                  </Button>
                ) : (
                  <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 px-8" onClick={handleEnroll} disabled={enrollMutation.isPending}>
                    {enrollMutation.isPending ? "جاري التسجيل..." : "التسجيل في الكورس"}
                  </Button>
                )}
                <Button size="lg" variant="outline" className="border-border text-foreground hover:bg-secondary gap-1" onClick={handleFavorite}>
                  <Heart className="w-4 h-4" />
                  إضافة للمفضلة
                </Button>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass-card p-6 mb-8">
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-primary" />
                ماذا ستتعلم
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {["فهم الأساسيات والمبادئ العلمية", "تطبيق التقنيات الحديثة", "تحليل البيانات الزراعية", "إدارة المشاريع الزراعية", "حل المشكلات العملية", "الحصول على شهادة إتمام"].map((item) => (
                  <div key={item} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <span className="text-sm text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <h2 className="text-xl font-bold text-foreground mb-4">محتوى الكورس</h2>
            {(sections || []).length === 0 ? (
              <p className="text-muted-foreground text-center py-8">لا يوجد محتوى حالياً</p>
            ) : (
              <div className="space-y-3">
                {(sections || []).map((section, i) => {
                  const sectionLessons = (lessons || []).filter((l) => l.section_id === section.id);
                  return (
                    <motion.div
                      key={section.id}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      viewport={{ once: true }}
                      className="glass-card overflow-hidden"
                    >
                      <div className="px-5 py-3 bg-secondary/50 font-bold text-sm text-foreground">
                        {section.title} ({sectionLessons.length} دروس)
                      </div>
                      <div className="divide-y divide-border">
                        {sectionLessons.map((lesson) => (
                          <div key={lesson.id} className="px-5 py-3 flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">{lesson.title}</span>
                            {lesson.duration_minutes > 0 && (
                              <span className="text-xs text-muted-foreground">{lesson.duration_minutes} دقيقة</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
};

export default CourseDetailPage;
