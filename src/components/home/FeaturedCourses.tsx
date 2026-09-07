import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Copy, Check, BookOpen, User, PlayCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const FeaturedCourses = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [lessonCounts, setLessonCounts] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFeaturedCourses() {
      setIsLoading(true);
      try {
        // جلب الكورسات المنشورة
        const { data: coursesData, error: coursesError } = await supabase
          .from("courses")
          .select("*")
          .eq("published", true)
          .limit(6);

        if (coursesError) throw coursesError;

        if (coursesData) {
          setCourses(coursesData);

          // حساب عدد الدروس الحقيقي لكل كورس من جدول الأقسام والدروس
          const counts: Record<string, number> = {};
          for (const course of coursesData) {
            const { data: sectionsData } = await supabase
              .from("sections")
              .select("id")
              .eq("course_id", course.id);

            if (sectionsData && sectionsData.length > 0) {
              const sectionIds = sectionsData.map((s) => s.id);
              const { count } = await supabase
                .from("lessons")
                .select("*", { count: "exact", head: true })
                .in("section_id", sectionIds);

              counts[course.id] = count || 0;
            } else {
              counts[course.id] = 0;
            }
          }
          setLessonCounts(counts);
        }
      } catch (err) {
        console.error("Error fetching featured courses:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchFeaturedCourses();
  }, []);

  const handleCopyLink = (e: React.MouseEvent, courseId: string) => {
    e.preventDefault();
    e.stopPropagation();
    const courseUrl = `${window.location.origin}/courses/${courseId}`;
    navigator.clipboard.writeText(courseUrl);
    setCopiedId(courseId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (isLoading) {
    return (
      <section className="py-16 bg-background border-b border-border/50">
        <div className="container mx-auto px-4 max-w-6xl" dir="rtl">
          <div className="flex items-center justify-between mb-8">
            <div className="h-7 w-40 bg-muted rounded-lg animate-pulse" />
            <div className="h-6 w-24 bg-muted rounded-lg animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-card border border-border/60 rounded-2xl h-88 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-24 bg-background border-b border-border/50" dir="rtl">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* رأس القسم */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
              الكورسات المميزة
            </h2>
            <p className="text-sm text-muted-foreground mt-1.5">
              مجموعة مختارة من أفضل البرامج التدريبية لتطوير مهاراتك.
            </p>
          </div>

          <Link
            to="/courses"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/80 transition-colors group"
          >
            <span>عرض كل الكورسات</span>
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* حالة عدم وجود كورسات */}
        {courses.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-border rounded-2xl bg-muted/20">
            <BookOpen className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-60" />
            <h3 className="text-base font-bold text-foreground mb-1">لا توجد كورسات متاحة حالياً</h3>
            <p className="text-xs text-muted-foreground">جاري تجهيز محتوى تعليمي جديد.. تابعنا قريباً.</p>
          </div>
        ) : (
          /* شبكة الكروت الاحترافية */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => {
              const lessonCount = lessonCounts[course.id] || 0;

              return (
                <Link
                  key={course.id}
                  to={`/courses/${course.id}`}
                  className="group bg-card border border-border/80 rounded-2xl overflow-hidden flex flex-col hover:border-primary/50 hover:shadow-lg transition-all duration-300"
                >
                  {/* حاوية الصورة */}
                  <div className="relative w-full h-48 bg-muted overflow-hidden">
                    {course.thumbnail_url ? (
                      <img
                        src={course.thumbnail_url}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-muted/60">
                        <BookOpen className="w-10 h-10 opacity-30" />
                      </div>
                    )}

                    {/* زر نسخ الرابط */}
                    <button
                      type="button"
                      onClick={(e) => handleCopyLink(e, course.id)}
                      className="absolute top-3 left-3 bg-background/90 backdrop-blur-md hover:bg-background text-foreground px-2.5 py-1.5 rounded-xl border border-border/60 shadow-sm transition-all flex items-center gap-1.5 text-xs font-medium z-10"
                      title="نسخ رابط الكورس"
                    >
                      {copiedId === course.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-[11px] text-emerald-600">تم النسخ</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                          <span className="text-[11px]">نسخ الرابط</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* محتوى الكارت */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-base font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                        {course.title}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {course.description || "شرح تفصيلي للمنهج والتدريبات العملية خطوة بخطوة."}
                      </p>
                    </div>

                    {/* تفاصيل إضافية (عدد الدروس + اسم المحاضر) */}
                    <div className="space-y-3 pt-3 border-t border-border/60">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        {course.instructor ? (
                          <span className="flex items-center gap-1.5 truncate max-w-[55%]">
                            <User className="w-3.5 h-3.5 shrink-0 text-primary" />
                            <span className="truncate font-medium text-foreground">{course.instructor}</span>
                          </span>
                        ) : (
                          <span className="text-muted-foreground">محتوى مرئي</span>
                        )}

                        <span className="flex items-center gap-1.5 font-medium text-foreground bg-muted/50 px-2.5 py-1 rounded-lg">
                          <PlayCircle className="w-3.5 h-3.5 text-primary" />
                          <span>{lessonCount} دروس</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
};

export default FeaturedCourses;
