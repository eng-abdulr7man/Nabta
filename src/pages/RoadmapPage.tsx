import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BottomNav from "@/components/layout/BottomNav";
import Roadmap from "@/components/home/Roadmap";

const RoadmapPage = () => {
  return (
    <div className="min-h-screen bg-[#050806] flex flex-col font-tajawal selection:bg-emerald-500/30">
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
