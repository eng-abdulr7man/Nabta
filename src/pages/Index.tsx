import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BottomNav from "@/components/layout/BottomNav";
import HeroSection from "@/components/home/HeroSection";
import SmartWeatherAlert from "@/components/home/SmartWeatherAlert";
import SpecializationsSection from "@/components/home/SpecializationsSection";
import FeaturedCourses from "@/components/home/FeaturedCourses";
import Roadmap from "@/components/home/Roadmap";
import CropOfTheMonth from "@/components/home/CropOfTheMonth";
import FeaturedMarketplace from "@/components/home/FeaturedMarketplace";
import TestimonialsWall from "@/components/home/TestimonialsWall";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background font-tajawal text-foreground">
      <Navbar />
      <main className="flex-1 pt-16 pb-16 md:pb-0">
        <HeroSection />
        <SmartWeatherAlert />
        <Roadmap />
        <CropOfTheMonth />
        <SpecializationsSection />
        <FeaturedCourses />
        <FeaturedMarketplace />
        <TestimonialsWall />
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
};

export default Index;
