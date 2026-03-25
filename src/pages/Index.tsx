import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BottomNav from "@/components/layout/BottomNav";
import HeroDarkSection from "@/components/home/HeroSection"; 
import SpecializationsSection from "@/components/home/SpecializationsSection";
import FeaturedCourses from "@/components/home/FeaturedCourses";
import Roadmap from "@/components/home/Roadmap"; 
import AiAnalyzerSection from "@/components/home/AiAnalyzerSection"; // 🌟 استدعاء قسم الذكاء الاصطناعي الجديد
import { motion } from "framer-motion";

const Index = () => {
  return (
    // وحدنا لون الخلفية هنا عشان ميبقاش في فواصل بيضاء بين السكاشن
    <div className="min-h-screen flex flex-col bg-[#050806] font-tajawal selection:bg-emerald-500/30 text-white">
      <Navbar />
      
      {/* شيلنا الـ pt-16 لأن الهيرو سكشن متظبط إنه ياخد الشاشة من فوق */}
      <main className="flex-1 pb-16 md:pb-0">
        
        {/* 1. قسم الترحيب (الهيرو) */}
        <HeroDarkSection />
        
        {/* 2. قسم خريطة الطريق (الرودماب) */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <Roadmap />
        </motion.div>

        {/* 🤖 3. قسم المستشار الذكي (AI Analyzer) - الجديد 🤖 */}
        <AiAnalyzerSection />
        
        {/* 4. قسم التخصصات */}
        <SpecializationsSection />
        
        {/* 5. قسم أحدث الكورسات */}
        <FeaturedCourses />
        
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
};

export default Index;
