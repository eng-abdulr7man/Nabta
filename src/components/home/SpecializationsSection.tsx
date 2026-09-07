import { Link } from "react-router-dom";
import { BookOpen, ChevronLeft } from "lucide-react";
import { useSpecializations, useCoursesCount } from "@/hooks/useCourses";

const SpecializationsSection = () => {
  const { data: specializations, isLoading } = useSpecializations();
  const { data: counts } = useCoursesCount();

  if (isLoading) {
    return (
      <section className="py-12 bg-background font-tajawal border-b border-border/40">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="h-6 w-32 bg-muted rounded mb-6 animate-pulse" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-5 h-36 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-background font-tajawal border-b border-border/40">
      <div className="container mx-auto px-4 max-w-5xl" dir="rtl">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-foreground">
            التخصصات الدراسية
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {(specializations || []).main?.map ? null : (specializations || []).map((spec) => {
            const coursesCount = counts?.[spec.id] || 0;
            return (
              <Link
                key={spec.id}
                to={`/courses?spec=${spec.id}`}
                className="group bg-card border border-border rounded-xl p-5 flex flex-col justify-between hover:border-border/80 transition-colors"
              >
                <div>
                  <h3 className="text-base font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                    {spec.name || "تخصص"}
                  </h3>
                  <p className="text-muted-foreground text-xs leading-relaxed line-clamp-2">
                    {spec.description || "مقررات ومناهج دراسية متكاملة."}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-border pt-3 mt-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>{coursesCount} مقرر</span>
                  </div>
                  <ChevronLeft className="w-4 h-4 text-muted-foreground/60 group-hover:text-foreground transition-colors" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SpecializationsSection;
