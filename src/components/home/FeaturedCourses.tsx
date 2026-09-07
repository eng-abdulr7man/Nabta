import { Link } from "react-router-dom";
import { ArrowLeft, BookOpen } from "lucide-react";
import CourseCard from "@/components/courses/CourseCard";
import { useCourses } from "@/hooks/useCourses";

const FeaturedCourses = () => {
  const { data: courses, isLoading } = useCourses();

  if (isLoading) {
    return (
      <section className="py-16 bg-background font-tajawal border-b border-border/40">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex items-center justify-between mb-8">
            <div className="h-7 w-48 bg-muted rounded animate-pulse" />
            <div className="h-6 w-28 bg-muted rounded animate-pulse" />
          </div>
          <div className="flex lg:grid lg:grid-cols-3 gap-6 overflow-hidden">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="min-w-[280px] sm:min-w-[320px] lg:min-w-0 bg-card border border-border rounded-2xl h-80 animate-pulse shrink-0" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  const featuredList = (courses || []).slice(0, 6);

  return (
    <section className="py-16 md:py-20 bg-background font-tajawal border-b border-border/40 overflow-hidden">
      <div className="container mx-auto px-4 max-w-6xl" dir="rtl">
        
        {/* رأس القسم */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground tracking-tight">
              الكورسات المميزة
            </h2>
            <p className="text-muted-foreground text-sm mt-1">
              أبرز المقررات والبرامج التدريبية المتاحة حالياً.
            </p>
          </div>

          <Link
            to="/courses"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground hover:text-primary transition-colors self-start sm:self-auto group"
          >
            <span>عرض كل الكورسات</span>
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* محتوى القسم */}
        {featuredList.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-border rounded-2xl bg-muted/20">
            <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center mx-auto mb-3 text-muted-foreground">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-foreground mb-1">مفيش كورسات هنا لسه</h3>
            <p className="text-muted-foreground text-xs">
              جاري تجهيز محتوى جديد.. تابعنا قريباً.
            </p>
          </div>
        ) : (
          <div className="flex lg:grid lg:grid-cols-3 gap-6 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 snap-x snap-mandatory scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none]">
            {featuredList.map((course, i) => (
              <div
                key={course.id}
                className="min-w-[280px] sm:min-w-[320px] lg:min-w-0 snap-start shrink-0 h-full"
              >
                <CourseCard {...course} index={i} />
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};

export default FeaturedCourses;
