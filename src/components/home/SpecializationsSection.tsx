import { Link } from "react-router-dom";
import { BookOpen, ChevronLeft, Leaf } from "lucide-react";
import { useSpecializations, useCoursesCount } from "@/hooks/useCourses";

const SpecializationsSection = () => {
  const { data: specializations, isLoading } = useSpecializations();
  const { data: counts } = useCoursesCount();

  if (isLoading) {
    return (
      <section className="py-16 bg-background font-tajawal border-b border-border/40">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="h-7 w-40 bg-muted rounded mb-8 animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-card border border-border rounded-2xl p-6 h-48 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-20 bg-background font-tajawal border-b border-border/40">
      <div className="container mx-auto px-4 max-w-6xl" dir="rtl">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground tracking-tight">
            التخصصات الدراسية
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            اختار التخصص وابدأ في استعراض المناهج والمقررات.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {(specializations || []).map((spec) => {
            const coursesCount = counts?.[spec.id] || 0;
            return (
              <Link
                key={spec.id}
                to={`/courses?spec=${spec.id}`}
                className="group bg-card border border-border rounded-2xl p-6 flex flex-col justify-between hover:border-foreground/20 transition-all shadow-sm"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center text-primary mb-5 group-hover:bg-primary/10 transition-colors">
                    <Leaf className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {spec.name || "تخصص"}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2 mb-6">
                    {spec.description || "مقررات ومناهج دراسية متكاملة."}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-border/60 pt-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    <span className="font-medium text-foreground">{coursesCount} مقرر</span>
                  </div>
                  <ChevronLeft className="w-4 h-4 text-muted-foreground/60 group-hover:text-foreground group-hover:-translate-x-0.5 transition-all" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export Title SpecializationsSection;
