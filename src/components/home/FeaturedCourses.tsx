import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import CourseCard from "@/components/courses/CourseCard";
import { useCourses } from "@/hooks/useCourses";

const FeaturedCourses = () => {
  const { data: courses, isLoading } = useCourses();

  return (
    <section className="py-16 bg-card/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-between mb-10"
        >
          <div>
            <h2 className="text-3xl font-black text-foreground mb-2">الكورسات المميزة</h2>
            <p className="text-muted-foreground">أحدث الكورسات وأكثرها شهرة</p>
          </div>
          <Link to="/courses">
            <Button variant="ghost" className="text-primary hover:bg-primary/10 gap-1">
              عرض الكل
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="glass-card h-80 animate-pulse" />
            ))}
          </div>
        ) : (courses || []).length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <p>لا توجد كورسات حالياً. أضف كورسات من لوحة التحكم.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(courses || []).slice(0, 6).map((course, i) => (
              <CourseCard
                key={course.id}
                {...course}
                index={i}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedCourses;
