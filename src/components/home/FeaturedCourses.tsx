import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useCourses } from "@/hooks/useCourses";

const FeaturedCourses = () => {
  const { data: courses, isLoading } = useCourses();

  if (isLoading) {
    return (
      <section className="py-10 bg-background border-b border-border">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="h-5 w-28 bg-muted rounded mb-4 animate-pulse" />
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-16 bg-muted/60 rounded animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  const featuredList = (courses || []).slice(0, 4);

  if (featuredList.length === 0) {
    return (
      <section className="py-10 bg-background border-b border-border">
        <div className="container mx-auto px-4 max-w-3xl text-center" dir="rtl">
          <p className="text-xs text-muted-foreground">مفيش كورسات متاحة دلوقتي.. بنجهّز محتوى جديد.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-16 bg-background border-b border-border">
      <div className="container mx-auto px-4 max-w-3xl" dir="rtl">
        
        {/* رأس القسم البسيط */}
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-border/60">
          <div>
            <h2 className="text-sm font-bold text-foreground">الكورسات المتاحة</h2>
          </div>

          <Link
            to="/courses"
            className="text-xs font-medium text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
          >
            <span>عرض الكل</span>
            <ArrowLeft className="w-3 h-3" />
          </Link>
        </div>

        {/* قائمة نصية منظمة (تجنب تماماً شكل الكروت والـ AI SaaS) */}
        <div className="divide-y divide-border/60">
          {featuredList.map((course: any) => (
            <Link
              key={course.id}
              to={`/courses/${course.id}`}
              className="py-3.5 flex items-center justify-between gap-4 group hover:bg-muted/20 px-2 -mx-2 rounded transition-colors"
            >
              <div className="space-y-0.5">
                <h3 className="text-xs md:text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                  {course.title || course.name}
                </h3>
                <p className="text-[11px] text-muted-foreground line-clamp-1">
                  {course.description || course.subtitle || "شرح تفصيلي للمنهج العملي."}
                </p>
              </div>

              <span className="text-[11px] text-muted-foreground shrink-0 font-normal">
                {course.price ? `${course.price} ج.م` : "مجانـاً"}
              </span>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
};

export default FeaturedCourses;
