import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BottomNav from "@/components/layout/BottomNav";
import HeroDarkSection from "@/components/home/HeroSection"; 
import SpecializationsSection from "@/components/home/SpecializationsSection";
import FeaturedCourses from "@/components/home/FeaturedCourses";
import Roadmap from "@/components/home/Roadmap"; 
import CropOfTheMonth from "@/components/home/CropOfTheMonth"; // 🌟 استدعاء القسم الذكي

import { motion } from "framer-motion";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#050806] font-tajawal selection:bg-emerald-500/30 text-white">
      <Navbar />
      <main className="flex-1 pb-16 md:pb-0">
        <HeroDarkSection />
        
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.8 }} viewport={{ once: true, margin: "-100px" }}>
          <Roadmap />
        </motion.div>

        {/* 🤖 قسم التقويم الذكي بالـ AI 🤖 */}
        <CropOfTheMonth />
        
        <SpecializationsSection />
        <FeaturedCourses />
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
};

export default Index;
