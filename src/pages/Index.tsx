import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BottomNav from "@/components/layout/BottomNav";
import HeroSection from "@/components/home/HeroSection";
import SpecializationsSection from "@/components/home/SpecializationsSection";
import FeaturedCourses from "@/components/home/FeaturedCourses";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 pt-16 pb-16 md:pb-0">
        <HeroSection />
        <SpecializationsSection />
        <FeaturedCourses />
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
};

export default Index;
