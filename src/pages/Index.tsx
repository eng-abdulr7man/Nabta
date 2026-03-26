import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BottomNav from "@/components/layout/BottomNav";
import HeroDarkSection from "@/components/home/HeroSection"; 
import SmartWeatherAlert from "@/components/home/SmartWeatherAlert"; 
import SpecializationsSection from "@/components/home/SpecializationsSection";
import FeaturedCourses from "@/components/home/FeaturedCourses";
import Roadmap from "@/components/home/Roadmap"; 
import CropOfTheMonth from "@/components/home/CropOfTheMonth"; 
import FeaturedMarketplace from "@/components/home/FeaturedMarketplace"; 
import TestimonialsWall from "@/components/home/TestimonialsWall"; // 🌟 استدعاء جدار الثقة
import { motion } from "framer-motion";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#050806] font-tajawal selection:bg-emerald-500/30 text-white">
      <Navbar />
      <main className="flex-1 pb-16 md:pb-0">
        
        {/* 1. ההيرو والطقس الذكي */}
        <HeroDarkSection />
        <SmartWeatherAlert />
        
        {/* 2. خريطة الطريق */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.8 }} viewport={{ once: true, margin: "-100px" }}>
          <Roadmap />
        </motion.div>

        {/* 3. التقويم الذكي بالـ AI */}
        <CropOfTheMonth />
        
        {/* 4. التعليم (التخصصات والكورسات) */}
        <SpecializationsSection />
        <FeaturedCourses />

        {/* 5. المتجر والمبيعات */}
        <FeaturedMarketplace />

        {/* 6. جدار الثقة والمراجعات (الختام القوي) 🌟 */}
        <TestimonialsWall />
        
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
};

export default Index;
