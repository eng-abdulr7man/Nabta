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

import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Zap, Target, BarChart3, PieChart, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useRef } from "react";

// --- إعدادات الأنيميشن الاحترافية ---

// أنيميشن حاوي للعناصر يظهرها بتتابع سلس
const staggerContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15, // سرعة تتابع ظهور العناصر
      delayChildren: 0.2,
    },
  },
};

// أنيميشن للعناصر الفردية (العنوان، الوصف، الأزرار)
const fadeInUpVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 70, damping: 18 },
  },
};

// أنيميشن للبطاقات الإحصائية بتأثير ثلاثي الأبعاد خفيف عند الظهور
const cardVariants = {
  hidden: { opacity: 0, scale: 0.8, rotateX: -15 },
  visible: {
    opacity: 1,
    scale: 1,
    rotateX: 0,
    transition: { type: "spring", stiffness: 100, damping: 15 },
  },
};

// أنيميشن للعناصر العائمة في الخلفية (Parallax)
const floatingAnimation = (duration, delay = 0) => ({
  animate: {
    y: [0, -25, 0],
    x: [0, 15, 0],
    rotate: [0, 5, -5, 0],
    transition: {
      duration: duration,
      delay: delay,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
});

const HeroSectionPro = () => {
  const { user } = useAuth();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  
  // تأثير بارالاكس (Parallax) عند عمل سكرول
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const yText = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section ref={ref} className="relative min-h-[95vh] flex items-center justify-center overflow-hidden bg-[#fafafa] dark:bg-[#080a09] py-20">
      
      {/* 1. طبقة الخلفية الديناميكية (Dynamic Background Layer) */}
      <motion.div style={{ y: yBg }} className="absolute inset-0 z-0">
        {/* تدرجات لونية ناعمة توحي بالطبيعة والتكنولوجيا */}
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-green-100/50 dark:bg-green-950/20 blur-3xl" />
        <div className="absolute bottom-[-15%] left-[-10%] w-[600px] h-[600px] rounded-full bg-emerald-100/40 dark:bg-emerald-950/15 blur-3xl" />
        
        {/* نمط شبكي خفيف جداً لإعطاء طابع هندسي/تقني */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02] bg-[url('/grid.svg')] bg-center" />
      </motion.div>

      {/* 2. العناصر العائمة المجردة (Floating Abstract Elements for Depth) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
        {/* عنصر يرمز للنبات/النمو */}
        <motion.div {...floatingAnimation(7, 0.5)} className="absolute top-[20%] left-[10%] opacity-20 dark:opacity-10 text-primary">
          <svg width="120" height="120" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M50 10C50 10 20 40 20 60C20 80 30 90 50 90C70 90 80 80 80 60C80 40 50 10 50 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M50 90V40" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M50 60C50 60 70 50 75 40" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </motion.div>
        
        {/* عنصر يرمز للبيانات/التكنولوجيا */}
        <motion.div {...floatingAnimation(9, 2)} className="absolute bottom-[25%] right-[8%] opacity-15 dark:opacity-10 text-emerald-600">
          <motion.div animate={{rotate: 360}} transition={{duration: 20, repeat: Infinity, ease: "linear"}}>
            <Database size={100} strokeWidth={1}/>
          </motion.div>
        </motion.div>
        
        {/* نقطة مضيئة مركزة */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-primary/10 blur-3xl" />
      </div>

      {/* 3. المحتوى الأساسي (Main Content) */}
      <div className="container mx-auto px-4 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* الجانب الأيمن: النصوص والدعوة لاتخاذ إجراء (Text & CTA) */}
          <motion.div
            variants={staggerContainerVariants}
            initial="hidden"
            animate="visible"
            style={{ y: yText }}
            className="lg:col-span-7 space-y-8 text-center lg:text-right"
          >
            <motion.div variants={fadeInUpVariants}>
              <span className="inline-flex items-center gap-2.5 px-6 py-2 rounded-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-foreground text-sm font-semibold shadow-inner">
                <Zap className="w-4 h-4 text-amber-500 animate-pulse" />
                <span className="opacity-80">أول منصة متخصصة في</span> 
                <span className="text-primary font-bold">الزراعة الرقمية الذكية 🌱</span>
              </span>
            </motion.div>

            <motion.h1
              variants={fadeInUpVariants}
              className="text-5xl md:text-6xl xl:text-7xl font-black text-foreground leading-[1.15] tracking-tight"
            >
              مستقبل <span className="text-primary relative inline-block">الزراعة<span className="absolute bottom-1 left-0 w-full h-2 bg-primary/20 rounded-full"></span></span> يبدأ بمعرفة حقيقية.
            </motion.h1>

            <motion.p
              variants={fadeInUpVariants}
              className="text-xl text-muted-foreground max-w-2xl mx-auto lg:mr-0 leading-relaxed opacity-90"
            >
              اكتسب المهارات والشهادات المعتمدة من خبراء دوليين لتطبيق أحدث تكنولوجيات الزراعة المستدامة وزيادة الإنتاجية. انضم لأكثر من 5,000 متخصص اليوم.
            </motion.p>

            <motion.div
              variants={fadeInUpVariants}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-5 pt-4"
            >
              <Link to="/courses">
                <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.98 }}>
                  <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 px-10 h-16 text-lg font-bold gap-3 rounded-2xl shadow-xl shadow-primary/20 group">
                    تصفح مسارات التعلم
                    <ArrowLeft className="w-5 h-5 group-hover:translate-x-[-4px] transition-transform" />
                  </Button>
                </motion.div>
              </Link>
              {!user && (
                <Link to="/register">
                  <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.98 }}>
                    <Button size="lg" variant="outline" className="border-neutral-300 dark:border-neutral-700 text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-900 px-10 h-16 text-lg rounded-2xl bg-white dark:bg-black/20 backdrop-blur-sm">
                      ابدأ رحلتك مجاناً
                    </Button>
                  </motion.div>
                </Link>
              )}
            </motion.div>
          </motion.div>

          {/* الجانب الأيسر: الإحصائيات التفاعلية في تخطيط شبكي (Interactive Stats Grid) */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.15, delayChildren: 0.6 } }
            }}
            className="lg:col-span-5 grid grid-cols-2 gap-6 relative"
          >
            {/* زخرفة خلفية خفيفة خلف البطاقات */}
            <div className="absolute inset-[-20px] bg-emerald-50/50 dark:bg-emerald-950/10 rounded-3xl blur-2xl z-0" />

            {[
              { icon: BarChart3, label: "تخصص زراعي نادر", value: "8+", color: "text-blue-500", bg: "bg-blue-100/60 dark:bg-blue-950/30" },
              { icon: Zap, label: "درس تعليمي مكثف", value: "1,200+", color: "text-amber-500", bg: "bg-amber-100/60 dark:bg-amber-950/30" },
              { icon: Target, label: "مشروع تطبيقي عملي", value: "50+", color: "text-red-500", bg: "bg-red-100/60 dark:bg-red-950/30" },
              { icon: PieChart, label: "عائد استثمار متوقع", value: "92%", color: "text-primary", bg: "bg-green-100/60 dark:bg-green-950/30" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover={{ y: -8, transition: {duration: 0.2} }}
                className={`relative z-10 p-7 rounded-3xl bg-white dark:bg-[#101311] border border-neutral-100 dark:border-neutral-800/50 shadow-lg hover:shadow-2xl transition-all duration-300 group ${index === 1 ? 'lg:translate-y-8' : ''} ${index === 3 ? 'lg:translate-y-8' : ''}`}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-14 h-14 rounded-2xl ${stat.bg} flex items-center justify-center ${stat.color} shadow-inner`}>
                    <stat.icon className="w-7 h-7" strokeWidth={1.5} />
                  </div>
                </div>
                <div className="space-y-1">
                  <h3 className="text-4xl font-black text-foreground tracking-tight group-hover:text-primary transition-colors">{stat.value}</h3>
                  <p className="text-base font-semibold text-muted-foreground opacity-80">{stat.label}</p>
                </div>
                {/* تأثير لمعان عند الـ Hover */}
                <div className="absolute inset-0 rounded-3xl transition-opacity opacity-0 group-hover:opacity-100 bg-gradient-to-br from-white/20 to-transparent pointer-events-none"/>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default HeroSectionPro;
