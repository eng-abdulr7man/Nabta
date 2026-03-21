import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BottomNav from "@/components/layout/BottomNav";
import SmartTools from "@/components/tools/SmartTools";

const ToolsPage = () => {
  return (
    <div className="min-h-screen bg-[#050806] flex flex-col font-tajawal">
      <Navbar />
      <main className="flex-1 pt-20">
        <SmartTools />
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
};

export default ToolsPage;
