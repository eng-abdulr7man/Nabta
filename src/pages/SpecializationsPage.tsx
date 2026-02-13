import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BottomNav from "@/components/layout/BottomNav";
import SpecializationCard from "@/components/specializations/SpecializationCard";
import { specializations, mockCourses } from "@/data/mockData";
import { motion } from "framer-motion";

const SpecializationsPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 pt-24 pb-20 md:pb-8">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <h1 className="text-3xl font-black text-foreground mb-2">التخصصات الزراعية</h1>
            <p className="text-muted-foreground">اكتشف التخصصات المختلفة واختر مسارك المهني</p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto">
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
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
};

export default SpecializationsPage;
