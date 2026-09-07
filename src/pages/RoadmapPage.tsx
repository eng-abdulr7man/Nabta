import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BottomNav from "@/components/layout/BottomNav";
import Roadmap from "@/components/home/Roadmap";

const RoadmapPage = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col font-tajawal selection:bg-accent">
      <Navbar />
      <main className="flex-1 pt-20">
        <Roadmap />
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
};

export default RoadmapPage;
