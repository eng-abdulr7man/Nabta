import { Link } from "react-router-dom";
import { ArrowLeft, BookOpen } from "lucide-react";
import CourseCard from "@/components/courses/CourseCard";
import { useCourses } from "@/hooks/useCourses";

const FeaturedCourses = () => {
  const { data: courses, isLoading } = useCourses();

  if (isLoading) {
    return (
      <section className="py-12 bg-background border-b border-border/40">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex items-center justify-between mb-6">
            <div className="h-6 w-36 bg-muted rounded animate-pulse" />
            <div className="h-5 w-20 bg-muted rounded animate-pulse" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-card border border-border/60 rounded-xl h-72 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  const featuredList = (courses || []).slice(0, 3);

  if (featuredList.length === 0) {
    return (
      <section className="py-12 bg-background border-b border-border/40">
        <div className="container mx-auto px-4 max-w-5xl" dir="rtl">
          <div className="text-center py-12 border border-dashed border-border/60 rounded-xl bg-muted/10">
            <BookOpen className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm font-medium text-foreground">مفيش كورسات متاحة دلوقتي</p>
            <p className="text-xs text-muted-foreground mt-1">تابعنا، بنجهز محتوى جديد قريب.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-14 md:py-20 bg-background border-b border-border/40">
      <div className="container mx-auto px-4 max-w-5xl" dir="rtl">
        
        {/* رأس القسم */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-foreground tracking-tight">
              الكورسات المميزة
            </h2>
            <p className="text-xs md:text-sm text-muted-foreground mt-1">
              أبرز البرامج التدريبية المتاحة لتبدأ بها.
            </p>
          </div>

          <Link
            to="/courses"
            className="inline-flex items-center gap-1 text-xs md:text-sm font-medium text-primary hover:underline transition-all"
          >
            <span>عرض الكل</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* شبكة متجاوبة وآمنة 100% على الموبايل (عمود واحد للموبايل، وعمودين/ثلاثة للشاشات الكبيرة) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featuredList.map((course, i) => (
            <div key={course.id} className="h-full">
              <CourseCard {...course} index={i} />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default FeaturedCourses;
