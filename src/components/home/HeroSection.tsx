// import { motion } from "framer-motion";
// import { Link } from "react-router-dom";
// import { ArrowLeft, BookOpen, Users, Award } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { useAuth } from "@/contexts/AuthContext";
// import heroBg from "@/assets/hero-bg.jpg";

// const HeroSection = () => {
//   const { user } = useAuth();

//   return (
//     <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
//       {/* Background */}
//       <div className="absolute inset-0">
//         <img src={heroBg} alt="خلفية زراعية" className="w-full h-full object-cover" />
//         <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/80 to-background" />
//       </div>

//       {/* Content */}
//       <div className="container mx-auto px-4 relative z-10">
//         <div className="max-w-3xl mx-auto text-center space-y-6">
//           <motion.div
//             initial={{ opacity: 0, y: 30 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.7 }}
//           >
//             <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
//               🌱 منصة تعليمية زراعية متكاملة
//             </span>
//           </motion.div>

//           <motion.h1
//             initial={{ opacity: 0, y: 30 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.7, delay: 0.1 }}
//             className="text-4xl md:text-6xl font-black text-foreground leading-tight"
//           >
//             تعلّم <span className="gradient-text">الزراعة الذكية</span>
//             <br />
//             مع أفضل المتخصصين
//           </motion.h1>

//           <motion.p
//             initial={{ opacity: 0, y: 50 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.7, delay: 0.2 }}
//             className="text-lg text-muted-foreground max-w-xl mx-auto"
//           >
//             أكثر من 100 كورس متخصص في 8 تخصصات زراعية مختلفة. ابدأ رحلتك التعليمية اليوم مع MuAgriSmart Academy
//           </motion.p>

//           <motion.div
//             initial={{ opacity: 0, y: 30 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.7, delay: 0.3 }}
//             className="flex flex-col sm:flex-row items-center justify-center gap-3"
//           >
//             <Link to="/courses">
//               <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 gap-2">
//                 تصفح الكورسات
//                 <ArrowLeft className="w-4 h-4" />
//               </Button>
//             </Link>
//             {!user && (
//               <Link to="/register">
//                 <Button size="lg" variant="outline" className="border-border text-foreground hover:bg-secondary px-8">
//                   إنشاء حساب مجاني
//                 </Button>
//               </Link>
//             )}
//           </motion.div>

//           {/* Stats */}
//           <motion.div
//             initial={{ opacity: 0, y: 30 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.7, delay: 0.5 }}
//             className="flex items-center justify-center gap-8 pt-8"
//           >
//             {[
//               { icon: BookOpen, label: "كورس", value: "100+" },
//               { icon: Users, label: "متعلم", value: "5,000+" },
//               { icon: Award, label: "شهادة", value: "2,000+" },
//             ].map((stat) => (
//               <div key={stat.label} className="text-center">
//                 <stat.icon className="w-5 h-5 text-primary mx-auto mb-1" />
//                 <p className="text-xl font-black text-foreground">{stat.value}</p>
//                 <p className="text-xs text-muted-foreground">{stat.label}</p>
//               </div>
//             ))}
//           </motion.div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default HeroSection;
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Play, Star, ShieldCheck, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import heroBg from "@/assets/hero-bg.jpg"; 

const HeroDarkSection = () => {
  const { user } = useAuth();

  return (
    // خلفية داكنة جداً مع تدرج لوني خفيف جداً من المنتصف
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-[#090D0A] text-white py-16 lg:py-0">
      
      {/* إضاءة خضراء خفيفة في الخلفية (Glow Effect) */}
      <div className="absolute top-[-10%] right-[-5%] w-[40vw] h-[40vw] rounded-full bg-emerald-900/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[30vw] h-[30vw] rounded-full bg-green-900/10 blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* النص والمحتوى (يمين) */}
          <div className="space-y-8 text-center lg:text-right order-2 lg:order-1">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium">
                <ShieldCheck className="w-4 h-4" />
                المنصة الأولى للتعليم الزراعي المتقدم
              </span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl lg:text-6xl font-black leading-[1.2] tracking-tight text-neutral-50"
            >
              طوّر مهاراتك في <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-l from-emerald-400 to-green-600">
                الزراعة الحديثة
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg text-neutral-400 max-w-lg mx-auto lg:mx-0 leading-relaxed"
            >
              اكتسب المعرفة العملية والشهادات المعتمدة من خبراء متخصصين. ابدأ الآن وانضم لآلاف المتدربين في مجالات الزراعة الذكية والمستدامة.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
            >
              <Link to="/courses">
                <Button size="lg" className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white px-8 h-14 text-base font-semibold gap-2 transition-all shadow-[0_0_20px_rgba(5,150,105,0.3)] hover:shadow-[0_0_30px_rgba(5,150,105,0.5)]">
                  ابدأ التعلم الآن
                  <ArrowLeft className="w-4 h-4 mr-1" />
                </Button>
              </Link>
              
              {!user && (
                <Link to="/register">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto border-neutral-700 text-neutral-300 hover:text-white hover:bg-neutral-800 hover:border-neutral-600 px-8 h-14 text-base font-medium transition-all bg-transparent">
                    <Play className="w-4 h-4 ml-2" />
                    شاهد كيف نعمل
                  </Button>
                </Link>
              )}
            </motion.div>

            {/* إحصائيات سريعة تحت الأزرار */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex items-center justify-center lg:justify-start gap-8 pt-6 border-t border-neutral-800/50 mt-8"
            >
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-white">100+</span>
                <span className="text-sm text-neutral-500">كورس متخصص</span>
              </div>
              <div className="w-px h-8 bg-neutral-800"></div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-white">5K+</span>
                <span className="text-sm text-neutral-500">متدرب نشط</span>
              </div>
            </motion.div>
          </div>

          {/* الصورة والتأثيرات (يسار) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative order-1 lg:order-2"
          >
            {/* إطار الصورة */}
            <div className="relative rounded-3xl overflow-hidden border border-neutral-800 shadow-2xl aspect-[4/3] lg:aspect-square max-w-md mx-auto">
              <div className="absolute inset-0 bg-emerald-500/10 mix-blend-overlay z-10"></div>
              <img 
                src={heroBg} 
                alt="تعلم الزراعة" 
                className="w-full h-full object-cover object-center"
              />
            </div>

            {/* كارت تقييم عائم (Floating Card 1) */}
            <motion.div 
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-10 -right-6 lg:-right-10 bg-[#121A15] border border-neutral-800/80 p-4 rounded-2xl shadow-xl backdrop-blur-md flex items-center gap-3 z-20"
            >
              <div className="w-10 h-10 rounded-full bg-emerald-900/50 flex items-center justify-center text-emerald-400">
                <Star className="w-5 h-5 fill-current" />
              </div>
              <div>
                <p className="text-xs text-neutral-400 mb-0.5">تقييم المتدربين</p>
                <p className="text-sm font-bold text-white">4.9/5 متوسط</p>
              </div>
            </motion.div>

            {/* كارت تفاعلي عائم (Floating Card 2) */}
            <motion.div 
              animate={{ y: [10, -10, 10] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-10 -left-6 lg:-left-10 bg-[#121A15] border border-neutral-800/80 p-4 rounded-2xl shadow-xl backdrop-blur-md flex items-center gap-3 z-20"
            >
               <div className="w-10 h-10 rounded-full bg-blue-900/30 flex items-center justify-center text-blue-400">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-neutral-400 mb-0.5">مجتمع زراعي</p>
                <p className="text-sm font-bold text-white">+5,000 مهندس</p>
              </div>
            </motion.div>
            
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default HeroDarkSection;
