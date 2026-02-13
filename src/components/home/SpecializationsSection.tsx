import { motion } from "framer-motion";
import SpecializationCard from "@/components/specializations/SpecializationCard";
import { useSpecializations, useCoursesCount } from "@/hooks/useCourses";

const SpecializationsSection = () => {
  const { data: specializations, isLoading } = useSpecializations();
  const { data: counts } = useCoursesCount();

  if (isLoading) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <div className="h-8 w-48 bg-secondary rounded-lg mx-auto mb-3 animate-pulse" />
            <div className="h-4 w-64 bg-secondary rounded mx-auto animate-pulse" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="glass-card p-6 h-32 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl font-black text-foreground mb-3">التخصصات الزراعية</h2>
          <p className="text-muted-foreground">اختر التخصص الذي يناسبك وابدأ التعلم</p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {(specializations || []).map((spec, i) => (
            <SpecializationCard
              key={spec.id}
              {...spec}
              coursesCount={counts?.[spec.id] || 0}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SpecializationsSection;
