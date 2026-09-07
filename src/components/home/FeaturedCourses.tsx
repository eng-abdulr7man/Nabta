import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Copy, Check, BookOpen } from "lucide-react";
import { useCourses } from "@/hooks/useCourses";

const FeaturedCourses = () => {
  const { data: courses, isLoading } = useCourses();
  const [copiedId, setCopiedId] = useState<string | null>(null);

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
      <section className="py-12 bg-background border-b border-border">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex items-center justify-between mb-8">
            <div className="h-6 w-32 bg-muted rounded animate-pulse" />
            <div className="h-5 w-20 bg-muted rounded animate-pulse" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-card border border-border rounded-xl h-80 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  const featuredList = (courses || []).slice(0, 6);

  return (
    <section className="py-14 md:py-20 bg-background border-b border-border" dir="rtl">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* رأس القسم */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-foreground tracking-tight">
              الكورسات المميزة
            </h2>
            <p className="text-xs md:text-sm text-muted-foreground mt-1">
              اختر كورس وابدأ التعلم فوراً.
            </p>
          </div>

          <Link
            to="/courses"
            className="text-xs md:text-sm font-medium text-primary hover:underline flex items-center gap-1 transition-all"
          >
            <span>عرض كل الكورسات</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* حالة عدم وجود كورسات */}
        {featuredList.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-border rounded-xl bg-muted/10">
            <BookOpen className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm font-medium text-foreground">مفيش كورسات متاحة دلوقتي</p>
            <p className="text-xs text-muted-foreground mt-1">جاري تجهيز محتوى جديد، تابعنا قريباً.</p>
          </div>
        ) : (
          /* شبكة الكروت (متجاوبة تماماً على الموبايل والكمبيوتر) */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredList.map((course: any) => (
              <Link
                key={course.id}
                to={`/courses/${course.id}`}
                className="group bg-card border border-border/80 rounded-xl overflow-hidden flex flex-col hover:border-foreground/40 transition-all duration-200"
              >
                {/* صورة الكورس */}
                <div className="relative w-full h-44 bg-muted overflow-hidden">
                  {course.image || course.thumbnail ? (
                    <img
                      src={course.image || course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-muted/50">
                      <BookOpen className="w-8 h-8 opacity-40" />
                    </div>
                  )}

                  {/* زر نسخ الرابط فوق الصورة (سريع وواضح) */}
                  <button
                    type="button"
                    onClick={(e) => handleCopyLink(e, course.id)}
                    className="absolute top-3 left-3 bg-background/95 hover:bg-background text-foreground p-2 rounded-lg border border-border shadow-sm transition-all flex items-center gap-1.5 text-xs font-medium"
                    title="نسخ رابط الكورس"
                  >
                    {copiedId === course.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-[11px] text-emerald-600">اتنسخ</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-[11px]">نسخ الرابط</span>
                      </>
                    )}
                  </button>
                </div>

                {/* تفاصيل الكورس */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <h3 className="text-sm md:text-base font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                      {course.title || course.name}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {course.description || course.subtitle || "شرح تفصيلي للمنهج والتدريبات العملية."}
                    </p>
                  </div>

                  {/* السعر والزر */}
                  <div className="flex items-center justify-between pt-3 border-t border-border/60">
                    <span className="text-xs font-semibold text-foreground">
                      {course.price && Number(course.price) > 0 ? `${course.price} ج.م` : "مجانـاً"}
                    </span>

                    <span className="text-xs font-medium text-primary flex items-center gap-1 group-hover:translate-x-[-2px] transition-transform">
                      <span>ابدأ الدرس</span>
                      <ArrowLeft className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};

export default FeaturedCourses;
