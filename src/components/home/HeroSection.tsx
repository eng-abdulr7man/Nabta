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
import { ArrowLeft, BookOpen, Users, Award, Leaf, Sprout } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import heroBg from "@/assets/hero-bg.jpg";

// إعدادات الحركة (Variants) لتنظيم الأنيميشن وجعله متسلسلاً
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2, // تأخير بسيط بين ظهور كل عنصر والذي يليه
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 80, damping: 20 },
  },
};

const floatingIconVariants = {
  animate: {
    y: [0, -20, 0],
    rotate: [0, 10, -10, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const HeroSection = () => {
  const { user } = useAuth();

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-background">
      {/* Background with Ken Burns Effect (تأثير الزووم البطيء) */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.img
          initial={{ scale: 1 }}
          animate={{ scale: 1.1 }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "linear",
          }}
          src={heroBg}
          alt="خلفية زراعية"
          className="w-full h-full object-cover"
        />
        {/* تدرج لوني أغمق قليلاً لضمان وضوح النص */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
      </div>

      {/* Floating Abstract Icons (أيقونات عائمة في الخلفية تعطي عمق) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div variants={floatingIconVariants} animate="animate" className="absolute top-1/4 right-[15%] text-primary/20">
          <Leaf className="w-24 h-24" />
        </motion.div>
        <motion.div variants={floatingIconVariants} animate="animate" style={{ animationDelay: "2s" }} className="absolute bottom-1/3 left-[10%] text-primary/10">
          <Sprout className="w-32 h-32" />
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 relative z-10 mt-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto text-center space-y-8"
        >
          {/* Badge */}
          <motion.div variants={itemVariants}>
            <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold shadow-sm backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              🌱 منصة تعليمية زراعية متكاملة
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-7xl font-black text-foreground leading-tight drop-shadow-sm"
          >
            تعلّم <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-400">الزراعة الذكية</span>
            <br />
            مع أفضل المتخصصين
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            أكثر من 100 كورس متخصص في 8 تخصصات زراعية مختلفة. ابدأ رحلتك التعليمية اليوم مع MuAgriSmart Academy
          </motion.p>

          {/* Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Link to="/courses">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 h-14 text-lg gap-2 shadow-lg shadow-primary/25">
                  تصفح الكورسات
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </motion.div>
            </Link>
            {!user && (
              <Link to="/register">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button size="lg" variant="outline" className="border-border text-foreground hover:bg-secondary px-8 h-14 text-lg bg-background/50 backdrop-blur-sm">
                    إنشاء حساب مجاني
                  </Button>
                </motion.div>
              </Link>
            )}
          </motion.div>

          {/* Stats Section with Glassmorphism */}
          <motion.div
            variants={itemVariants}
            className="mt-12 pt-8"
          >
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-3xl mx-auto p-6 rounded-3xl bg-background/40 border border-white/10 shadow-2xl backdrop-blur-md">
              {[
                { icon: BookOpen, label: "كورس متخصص", value: "100+" },
                { icon: Users, label: "متعلم طموح", value: "5,000+" },
                { icon: Award, label: "شهادة معتمدة", value: "2,000+" },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -5 }}
                  className="text-center space-y-2 p-4 rounded-xl hover:bg-white/5 transition-colors"
                >
                  <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center text-primary mb-3">
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-3xl font-black text-foreground">{stat.value}</h3>
                  <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
