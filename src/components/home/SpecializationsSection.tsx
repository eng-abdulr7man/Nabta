import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { useSpecializations, useCoursesCount } from "@/hooks/useCourses";

const SpecializationsSection = () => {
  const { data: specializations, isLoading } = useSpecializations();
  const { data: counts } = useCoursesCount();

  if (isLoading) {
    return (
      <section className="py-16 bg-background font-tajawal border-b border-border/40">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="h-6 w-32 bg-muted rounded mb-6 animate-pulse" />
          <div className="flex lg:grid lg:grid-cols-4 gap-4 overflow-hidden">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="min-w-[260px] lg:min-w-0 bg-card border border-border rounded-xl p-5 h-36 animate-pulse shrink-0" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-20 bg-background font-tajawal border-b border-border/40 overflow-hidden">
      <div className="container mx-auto px-4 max-w-6xl" dir="rtl">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground tracking-tight">
            التخصصات الدراسية
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            اختار التخصص وابدأ في استعراض المقررات.
          </p>
        </div>

        {/* سكرول أفقي على الموبايل، وشبكة منظمة على الكمبيوتر */}
        <div className="flex lg:grid lg:grid-cols-4 gap-4 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 snap-x snap-mandatory scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none]">
          {(specializations || []).map((spec) => {
            const coursesCount = counts?.[spec.id] || 0;
            return (
              <Link
                key={spec.id}
                to={`/courses?spec=${spec.id}`}
                className="group bg-card border border-border/80 rounded-xl p-5 flex flex-col justify-between hover:border-foreground/30 transition-colors min-w-[260px] sm:min-w-[280px] lg:min-w-0 snap-start shrink-0"
              >
                <div>
                  <h3 className="text-base font-bold text-foreground mb-1.5 group-hover:text-primary transition-colors">
                    {spec.name || "تخصص"}
                  </h3>
                  <p className="text-muted-foreground text-xs leading-relaxed line-clamp-2 mb-6">
                    {spec.description || "مقررات ومناهج دراسية متكاملة."}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border/40">
                  <span>{coursesCount} مقرر دراسي</span>
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

export default SpecializationsSection;
