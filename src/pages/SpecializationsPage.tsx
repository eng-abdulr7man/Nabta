// import Navbar from "@/components/layout/Navbar";
// import Footer from "@/components/layout/Footer";
// import BottomNav from "@/components/layout/BottomNav";
// import SpecializationCard from "@/components/specializations/SpecializationCard";
// import { useSpecializations, useCoursesCount } from "@/hooks/useCourses";
// import { motion } from "framer-motion";

// const SpecializationsPage = () => {
//   const { data: specializations, isLoading } = useSpecializations();
//   const { data: counts } = useCoursesCount();

//   return (
//     <div className="min-h-screen flex flex-col bg-background">
//       <Navbar />
//       <main className="flex-1 pt-24 pb-20 md:pb-8">
//         <div className="container mx-auto px-4">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="text-center mb-10"
//           >
//             <h1 className="text-3xl font-black text-foreground mb-2">التخصصات الزراعية</h1>
//             <p className="text-muted-foreground">اكتشف التخصصات المختلفة واختر مسارك المهني</p>
//           </motion.div>

//           {isLoading ? (
//             <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto">
//               {Array.from({ length: 8 }).map((_, i) => (
//                 <div key={i} className="glass-card p-6 h-32 animate-pulse" />
//               ))}
//             </div>
//           ) : (
//             <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto">
//               {(specializations || []).map((spec, i) => (
//                 <SpecializationCard
//                   key={spec.id}
//                   {...spec}
//                   coursesCount={counts?.[spec.id] || 0}
//                   index={i}
//                 />
//               ))}
//             </div>
//           )}
//         </div>
//       </main>
//       <Footer />
//       <BottomNav />
//     </div>
//   );
// };

// export default SpecializationsPage;

//v2
import { useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BottomNav from "@/components/layout/BottomNav";
import SpecializationCard from "@/components/specializations/SpecializationCard";
import { useSpecializations, useCoursesCount } from "@/hooks/useCourses";
import { motion } from "framer-motion";
import { Layers } from "lucide-react";

// إعدادات حركة الظهور المتتالية (Stagger Animation)
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const SpecializationsPage = () => {
  const { data: specializations, isLoading } = useSpecializations();
  const { data: counts } = useCoursesCount();

  // لضمان فتح الصفحة من الأعلى دائماً
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#050806] font-tajawal selection:bg-emerald-500/30">
      <Navbar />
      
      <main className="flex-1 pt-32 pb-24 md:pb-16 relative overflow-hidden">
        
        {/* إضاءات خلفية (Ambient Glows) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[70vw] h-[50vw] rounded-full bg-emerald-900/10 blur-[150px] pointer-events-none" />
        
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          
          {/* ======================================= */}
          {/* الهيدر (Header Section) */}
          {/* ======================================= */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16 space-y-4"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#121A15] border border-neutral-800 text-emerald-400 text-sm font-medium shadow-[0_0_20px_rgba(16,185,129,0.05)] mx-auto mb-2">
              <Layers className="w-4 h-4" />
              مسارات التعلم
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight mb-4">
              التخصصات <span className="text-transparent bg-clip-text bg-gradient-to-l from-emerald-400 to-green-600">الزراعية</span>
            </h1>
            <p className="text-lg text-neutral-400 max-w-2xl mx-auto leading-relaxed">
              اكتشف التخصصات المختلفة، تصفح الكورسات المتاحة في كل مجال، واختر مسارك المهني نحو احتراف الزراعة الحديثة.
            </p>
          </motion.div>

          {/* ======================================= */}
          {/* شبكة التخصصات (Specializations Grid) */}
          {/* ======================================= */}
          {isLoading ? (
            
            // --- حالة التحميل (Premium Skeletons) ---
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-[#0a0f0c] border border-neutral-800/50 rounded-3xl p-6 sm:p-8 h-[260px] flex flex-col justify-between animate-pulse shadow-lg">
                  <div className="w-14 h-14 rounded-2xl bg-[#121A15] border border-neutral-800" />
                  <div className="space-y-4">
                    <div className="h-6 w-3/4 bg-[#121A15] rounded-md" />
                    <div className="h-4 w-1/2 bg-[#121A15] rounded-md" />
                  </div>
                </div>
              ))}
            </div>

          ) : (
            
            // --- عرض الكروت الفعلي ---
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {(specializations || []).map((spec, i) => (
                <motion.div key={spec.id} variants={itemVariants} className="h-full">
                  <SpecializationCard
                    {...spec}
                    coursesCount={counts?.[spec.id] || 0}
                    index={i}
                  />
                </motion.div>
              ))}
            </motion.div>

          )}
        </div>
      </main>
      
      <Footer />
      <BottomNav />
    </div>
  );
};

export default SpecializationsPage;
