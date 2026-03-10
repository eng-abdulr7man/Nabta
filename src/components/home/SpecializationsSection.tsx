// import { motion } from "framer-motion";
// import SpecializationCard from "@/components/specializations/SpecializationCard";
// import { useSpecializations, useCoursesCount } from "@/hooks/useCourses";

// const SpecializationsSection = () => {
//   const { data: specializations, isLoading } = useSpecializations();
//   const { data: counts } = useCoursesCount();

//   if (isLoading) {
//     return (
//       <section className="py-16">
//         <div className="container mx-auto px-4">
//           <div className="text-center mb-10">
//             <div className="h-8 w-48 bg-secondary rounded-lg mx-auto mb-3 animate-pulse" />
//             <div className="h-4 w-64 bg-secondary rounded mx-auto animate-pulse" />
//           </div>
//           <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
//             {Array.from({ length: 8 }).map((_, i) => (
//               <div key={i} className="glass-card p-6 h-32 animate-pulse" />
//             ))}
//           </div>
//         </div>
//       </section>
//     );
//   }

//   return (
//     <section className="py-16">
//       <div className="container mx-auto px-4">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           className="text-center mb-10"
//         >
//           <h2 className="text-3xl font-black text-foreground mb-3">التخصصات الزراعية</h2>
//           <p className="text-muted-foreground">اختر التخصص الذي يناسبك وابدأ التعلم</p>
//         </motion.div>

//         <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
//           {(specializations || []).map((spec, i) => (
//             <SpecializationCard
//               key={spec.id}
//               {...spec}
//               coursesCount={counts?.[spec.id] || 0}
//               index={i}
//             />
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default SpecializationsSection;

//v1
// import { motion } from "framer-motion";
// import { Layers } from "lucide-react";
// import SpecializationCard from "@/components/specializations/SpecializationCard";
// import { useSpecializations, useCoursesCount } from "@/hooks/useCourses";

// // إعدادات حركة ظهور الكروت ورا بعض (Stagger Effect)
// const containerVariants = {
//   hidden: { opacity: 0 },
//   show: {
//     opacity: 1,
//     transition: {
//       staggerChildren: 0.1, // الوقت بين ظهور كل كارت والتاني
//     },
//   },
// };

// const itemVariants = {
//   hidden: { opacity: 0, y: 30 },
//   show: { 
//     opacity: 1, 
//     y: 0,
//     transition: { type: "spring", stiffness: 80, damping: 20 }
//   },
// };

// const SpecializationsSection = () => {
//   const { data: specializations, isLoading } = useSpecializations();
//   const { data: counts } = useCoursesCount();

//   if (isLoading) {
//     return (
//       <section className="relative py-24 bg-[#090D0A] overflow-hidden">
//         <div className="container mx-auto px-4 lg:px-8 relative z-10">
//           {/* Skeleton Header */}
//           <div className="text-center mb-16 flex flex-col items-center">
//             <div className="h-8 w-48 bg-neutral-800 rounded-full mb-6 animate-pulse" />
//             <div className="h-10 w-64 md:w-96 bg-neutral-800 rounded-xl mb-4 animate-pulse" />
//             <div className="h-4 w-48 bg-neutral-800 rounded-md animate-pulse" />
//           </div>
//           {/* Skeleton Cards */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//             {Array.from({ length: 8 }).map((_, i) => (
//               <div 
//                 key={i} 
//                 className="bg-[#121A15] border border-neutral-800/50 rounded-3xl p-6 h-48 flex flex-col justify-between animate-pulse"
//               >
//                 <div className="w-14 h-14 bg-neutral-800 rounded-2xl" />
//                 <div className="space-y-3">
//                   <div className="h-5 w-3/4 bg-neutral-800 rounded-md" />
//                   <div className="h-4 w-1/2 bg-neutral-800/50 rounded-md" />
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>
//     );
//   }

//   return (
//     <section className="relative py-24 bg-[#090D0A] overflow-hidden">
      
//       {/* إضاءة خلفية خفيفة لربط القسم بالهيرو */}
//       <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[1px] bg-gradient-to-r from-transparent via-emerald-900/50 to-transparent" />
//       <div className="absolute top-[-10%] right-[-10%] w-[30vw] h-[30vw] rounded-full bg-emerald-900/10 blur-[120px] pointer-events-none" />

//       <div className="container mx-auto px-4 lg:px-8 relative z-10">
        
//         {/* عنوان القسم (Section Header) */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true, margin: "-100px" }}
//           transition={{ duration: 0.6 }}
//           className="text-center mb-16 space-y-4"
//         >
//           <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neutral-800/50 border border-neutral-700 text-neutral-300 text-sm font-medium mx-auto">
//             <Layers className="w-4 h-4 text-emerald-400" />
//             مسارات التعلم
//           </span>
//           <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
//             استكشف <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-600">التخصصات الزراعية</span>
//           </h2>
//           <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
//             اختر التخصص الذي يناسب طموحك المهني، وابدأ رحلة التعلم مع أفضل الخبراء في المجال.
//           </p>
//         </motion.div>

//         {/* شبكة الكروت (Cards Grid) */}
//         <motion.div 
//           variants={containerVariants}
//           initial="hidden"
//           whileInView="show"
//           viewport={{ once: true, margin: "-50px" }}
//           className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
//         >
//           {(specializations || []).map((spec, i) => (
//             <motion.div key={spec.id} variants={itemVariants}>
//               <SpecializationCard
//                 {...spec}
//                 coursesCount={counts?.[spec.id] || 0}
//                 index={i}
//               />
//             </motion.div>
//           ))}
//         </motion.div>

//       </div>
//     </section>
//   );
// };

// export default SpecializationsSection;

//v2

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Leaf, BookOpen, Layers } from "lucide-react";
import { useSpecializations, useCoursesCount } from "@/hooks/useCourses";

// ==========================================
// 1. مكون كارت التخصص (الكارت السحري المضيء)
// ==========================================
const SpecializationCard = ({ id, name, description, coursesCount, index }) => {
  // دالة تتبع الماوس لعمل إضاءة داخلية تتفاعل مع حركة المستخدم
  const handleMouseMove = (e) => {
    const { currentTarget: target } = e;
    const rect = target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    target.style.setProperty("--mouse-x", `${x}px`);
    target.style.setProperty("--mouse-y", `${y}px`);
  };

  return (
    <Link to={`/specializations/${id}`} className="block h-full outline-none">
      <motion.div
        onMouseMove={handleMouseMove}
        className="group relative h-full bg-[#121A15] border border-neutral-800/60 rounded-3xl p-6 sm:p-8 overflow-hidden transition-all duration-500 hover:border-emerald-500/50 hover:shadow-[0_0_40px_rgba(16,185,129,0.1)] cursor-pointer min-w-[280px] lg:min-w-0"
      >
        {/* تأثير الإضاءة السحرية */}
        <div 
          className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-300 group-hover:opacity-100"
          style={{
            background: "radial-gradient(400px circle at var(--mouse-x, 0) var(--mouse-y, 0), rgba(16, 185, 129, 0.15), transparent 40%)",
          }}
        />

        <div className="relative z-10 flex flex-col h-full justify-between">
          <div>
            <div className="w-14 h-14 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-emerald-950/50 group-hover:border-emerald-500/30 transition-all duration-300">
              <Leaf className="w-7 h-7 text-emerald-500" strokeWidth={1.5} />
            </div>
            
            <h3 className="text-xl md:text-2xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
              {name || "اسم التخصص"}
            </h3>
            
            <p className="text-sm text-neutral-400 line-clamp-2 leading-relaxed">
              /* {description || "وصف مختصر للتخصص وما سيتعلمه المتدرب في هذا المسار التعليمي."} */
            </p>
          </div>

          <div className="mt-8 flex items-center justify-between border-t border-neutral-800/50 pt-4 overflow-hidden">
            <div className="flex items-center gap-2 text-neutral-500 group-hover:text-neutral-300 transition-colors">
              <BookOpen className="w-4 h-4" />
              <span className="text-sm font-medium">{coursesCount} كورسات</span>
            </div>

            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-500 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
              <ArrowLeft className="w-4 h-4" />
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

// ==========================================
// 2. إعدادات حركة الأنيميشن (Stagger)
// ==========================================
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

// ==========================================
// 3. القسم الرئيسي (Specializations Section)
// ==========================================
const SpecializationsSection = () => {
  const { data: specializations, isLoading } = useSpecializations();
  const { data: counts } = useCoursesCount();

  if (isLoading) {
    return (
      <section className="relative py-24 bg-[#090D0A] overflow-hidden">
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="text-center mb-16 flex flex-col items-center">
            <div className="h-8 w-48 bg-neutral-800 rounded-full mb-6 animate-pulse" />
            <div className="h-10 w-64 md:w-96 bg-neutral-800 rounded-xl mb-4 animate-pulse" />
          </div>
          <div className="flex lg:grid lg:grid-cols-4 gap-4 overflow-x-hidden">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="min-w-[280px] lg:min-w-0 bg-[#121A15] border border-neutral-800/50 rounded-3xl p-6 h-[260px] animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-24 bg-[#090D0A] overflow-hidden">
      
      {/* إضاءات الخلفية */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[1px] bg-gradient-to-r from-transparent via-emerald-900/30 to-transparent" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-emerald-900/10 blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        
        {/* عنوان القسم */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 space-y-4"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neutral-800/50 border border-neutral-700 text-neutral-300 text-sm font-medium mx-auto shadow-inner">
            <Layers className="w-4 h-4 text-emerald-400" />
            مسارات التعلم
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            اختر <span className="text-transparent bg-clip-text bg-gradient-to-l from-emerald-400 to-green-600">تخصصك الزراعي</span>
          </h2>
          <p className="text-lg text-neutral-400 max-w-xl mx-auto">
            منصتنا توفر لك مسارات تعليمية متكاملة مصممة خصيصاً لتناسب احتياجات سوق العمل الزراعي الحديث.
          </p>
        </motion.div>

        {/* شبكة الكروت / السلايدر */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="flex lg:grid lg:grid-cols-4 gap-6 overflow-x-auto lg:overflow-visible pb-8 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {(specializations || []).map((spec, i) => (
            <motion.div 
              key={spec.id} 
              variants={itemVariants}
              className="snap-center lg:snap-align-none shrink-0" 
            >
              <SpecializationCard
                {...spec}
                coursesCount={counts?.[spec.id] || 0}
                index={i}
              />
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default SpecializationsSection;
