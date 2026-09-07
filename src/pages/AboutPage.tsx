// import Navbar from "@/components/layout/Navbar";
// import Footer from "@/components/layout/Footer";
// import BottomNav from "@/components/layout/BottomNav";
// import { motion } from "framer-motion";
// import { Sprout, Target, Award, Users } from "lucide-react";

// const features = [
//   { icon: Target, title: "رؤيتنا", desc: "أن نكون المنصة الرائدة في التعليم الزراعي الإلكتروني في الوطن العربي." },
//   { icon: Award, title: "مهمتنا", desc: "تقديم محتوى تعليمي عالي الجودة يساهم في تطوير القطاع الزراعي وتأهيل الكوادر المتخصصة." },
//   { icon: Users, title: "فريقنا", desc: "نخبة من الأساتذة والخبراء المتخصصين في مختلف فروع العلوم الزراعية." },
// ];

// const AboutPage = () => (
//   <div className="min-h-screen flex flex-col bg-background">
//     <Navbar />
//     <main className="flex-1 pt-24 pb-20 md:pb-8">
//       <div className="container mx-auto px-4 max-w-3xl">
//         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
//           <div className="text-center mb-10">
//             <Sprout className="w-14 h-14 text-primary mx-auto mb-3" />
//             <h1 className="text-3xl font-black text-foreground mb-2">عن المنصة</h1>
//             <p className="text-muted-foreground max-w-xl mx-auto">
//               أكاديمية MuAgriSmart هي منصة تعليمية إلكترونية متخصصة في العلوم الزراعية، تهدف إلى نشر المعرفة الزراعية وتطوير المهارات العملية من خلال كورسات احترافية.
//             </p>
//           </div>

//           <div className="grid gap-6">
//             {features.map((f, i) => (
//               <motion.div
//                 key={i}
//                 initial={{ opacity: 0, x: -20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ delay: i * 0.1 }}
//                 className="glass-card p-6 flex items-start gap-4"
//               >
//                 <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
//                   <f.icon className="w-6 h-6 text-primary" />
//                 </div>
//                 <div>
//                   <h3 className="font-bold text-foreground mb-1">{f.title}</h3>
//                   <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//         </motion.div>
//       </div>
//     </main>
//     <Footer />
//     <BottomNav />
//   </div>
// );

// export default AboutPage;

//v2

import { useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BottomNav from "@/components/layout/BottomNav";
import { motion } from "framer-motion";
import { Sprout, Target, Award, Users, Info } from "lucide-react";

// قمت بتوسيع النصوص قليلاً لتعطي مظهراً أكثر احترافية وغنى في الكروت
const features = [
  { 
    icon: Target, 
    title: "رؤيتنا", 
    desc: "أن نكون المنصة الرائدة في التعليم الزراعي الإلكتروني في الوطن العربي، ومرجعاً أساسياً لكل مهتم بتطوير القطاع الزراعي الحديث والمستدام." 
  },
  { 
    icon: Award, 
    title: "مهمتنا", 
    desc: "تقديم محتوى تعليمي عالي الجودة يواكب أحدث التطورات التكنولوجية، ويساهم في تأهيل كوادر متخصصة قادرة على قيادة المستقبل الزراعي بمهارة." 
  },
  { 
    icon: Users, 
    title: "فريقنا", 
    desc: "نخبة من الأكاديميين والخبراء المتخصصين في مختلف فروع العلوم الزراعية، يجمعون بين المعرفة الأكاديمية العميقة والخبرة العملية الطويلة في سوق العمل." 
  },
];

// إعدادات حركة الظهور المتتالية
const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const AboutPage = () => {
  // لضمان فتح الصفحة من الأعلى دائماً
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background font-tajawal selection:bg-accent">
      <Navbar />
      
      <main className="flex-1 pt-32 pb-24 md:pb-16 relative overflow-hidden">
        
        {/* إضاءات خلفية (Ambient Glows) */}


        <div className="container mx-auto px-4 max-w-4xl relative z-10">
          
          {/* ======================================= */}
          {/* قسم الهيدر (Header Section) */}
          {/* ======================================= */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16 space-y-6"
          >
            {/* الشارة العلوية */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted border border-border text-primary text-sm font-medium  mx-auto">
              <Info className="w-4 h-4" />
              تعرف علينا
            </div>

            {/* الأيقونة المركزية */}
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 rounded-2xl bg-muted border border-border flex items-center justify-center  relative group">
                <div className="absolute inset-0 bg-accent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <Sprout className="w-10 h-10 text-primary relative z-10" />
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground tracking-tight">
              أكاديمية <span className="text-transparent bg-clip-text text-primary">نـَـبْـتـَـة</span>
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              نحن منصة تعليمية إلكترونية متخصصة في العلوم الزراعية، نهدف إلى نشر المعرفة ودمج التكنولوجيا بالزراعة المستدامة من خلال كورسات احترافية معتمدة.
            </p>
          </motion.div>

          {/* ======================================= */}
          {/* شبكة المميزات (Features Grid) */}
          {/* ======================================= */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid gap-6"
          >
            {features.map((f, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="group bg-muted border border-border rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-6 hover:bg-muted hover:border-primary/20 transition-all duration-300"
              >
                {/* صندوق الأيقونة */}
                <div className="w-16 h-16 rounded-2xl bg-muted border border-border flex items-center justify-center shrink-0 group-hover:bg-accent group-hover:border-primary/20 transition-all duration-300">
                  <f.icon className="w-8 h-8 text-primary" />
                </div>
                
                {/* النصوص */}
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">{f.title}</h3>
                  <p className="text-base text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </main>
      
      <Footer />
      <BottomNav />
    </div>
  );
};

export default AboutPage;
