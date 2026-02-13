import { motion } from "framer-motion";
import SpecializationCard from "@/components/specializations/SpecializationCard";
import { specializations, mockCourses } from "@/data/mockData";

const SpecializationsSection = () => {
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
          {specializations.map((spec, i) => (
            <SpecializationCard
              key={spec.id}
              {...spec}
              coursesCount={mockCourses.filter((c) => c.specialization === spec.id).length}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SpecializationsSection;
