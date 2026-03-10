// import { motion } from "framer-motion";
// import { Link } from "react-router-dom";
// import { ArrowLeft } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import CourseCard from "@/components/courses/CourseCard";
// import { useCourses } from "@/hooks/useCourses";

// const FeaturedCourses = () => {
//   const { data: courses, isLoading } = useCourses();

//   return (
//     <section className="py-16 bg-card/30">
//       <div className="container mx-auto px-4">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           className="flex items-center justify-between mb-10"
//         >
//           <div>
//             <h2 className="text-3xl font-black text-foreground mb-2">الكورسات المميزة</h2>
//             <p className="text-muted-foreground">أحدث الكورسات وأكثرها شهرة</p>
//           </div>
//           <Link to="/courses">
//             <Button variant="ghost" className="text-primary hover:bg-primary/10 gap-1">
//               عرض الكل
//               <ArrowLeft className="w-4 h-4" />
//             </Button>
//           </Link>
//         </motion.div>

//         {isLoading ? (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//             {Array.from({ length: 6 }).map((_, i) => (
//               <div key={i} className="glass-card h-80 animate-pulse" />
//             ))}
//           </div>
//         ) : (courses || []).length === 0 ? (
//           <div className="text-center py-16 text-muted-foreground">
//             <p>لا توجد كورسات حالياً. أضف كورسات من لوحة التحكم.</p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//             {(courses || []).slice(0, 6).map((course, i) => (
//               <CourseCard
//                 key={course.id}
//                 {...course}
//                 index={i}
//               />
//             ))}
//           </div>
//         )}
//       </div>
//     </section>
//   );
// };

// export default FeaturedCourses;

//v2

// import { motion } from "framer-motion";
// import { Link } from "react-router-dom";
// import { ArrowLeft, Sparkles, BookOpen } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import CourseCard from "@/components/courses/CourseCard";
// import { useCourses } from "@/hooks/useCourses";

// // إعدادات حركة الظهور المتتالية للكروت
// const containerVariants = {
//   hidden: { opacity: 0 },
//   show: {
//     opacity: 1,
//     transition: { staggerChildren: 0.15 },
//   },
// };

// const itemVariants = {
//   hidden: { opacity: 0, y: 30 },
//   show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
// };

// const FeaturedCourses = () => {
//   const { data: courses, isLoading } = useCourses();

//   return (
//     // خلفية داكنة جداً مع تدرج خفيف لفصل القسم عما قبله
//     <section className="relative py-24 bg-[#0a0f0c] overflow-hidden border-t border-neutral-800/30">
      
//       {/* إضاءات خلفية لإعطاء عمق للمنطقة */}
//       <div className="absolute top-[10%] right-[-5%] w-[40vw] h-[40vw] rounded-full bg-emerald-900/10 blur-[120px] pointer-events-none" />
//       <div className="absolute bottom-[-10%] left-[10%] w-[30vw] h-[30vw] rounded-full bg-blue-900/5 blur-[100px] pointer-events-none" />

//       <div className="container mx-auto px-4 lg:px-8 relative z-10">
        
//         {/* === رأس القسم (Header) === */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true, margin: "-100px" }}
//           transition={{ duration: 0.6 }}
//           className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6"
//         >
//           <div className="space-y-4">
//             <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium shadow-inner">
//               <Sparkles className="w-4 h-4" />
//               الأكثر طلباً
//             </span>
//             <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
//               الكورسات <span className="text-transparent bg-clip-text bg-gradient-to-l from-emerald-400 to-green-600">المميزة</span>
//             </h2>
//             <p className="text-lg text-neutral-400 max-w-xl">
//               أحدث الكورسات وأكثرها مبيعاً. ابدأ رحلتك التعليمية مع أفضل المحتويات الزراعية.
//             </p>
//           </div>

//           {/* زر عرض الكل */}
//           <Link to="/courses" className="shrink-0">
//             <Button 
//               size="lg"
//               variant="outline" 
//               className="group border-neutral-700 text-neutral-300 hover:text-white hover:bg-neutral-800 hover:border-neutral-600 px-6 h-12 text-base font-medium transition-all bg-transparent rounded-2xl"
//             >
//               عرض كل الكورسات
//               <ArrowLeft className="w-4 h-4 ml-2 group-hover:-translate-x-1 transition-transform" />
//             </Button>
//           </Link>
//         </motion.div>

//         {/* === حالة التحميل (Loading Skeleton) === */}
//         {isLoading ? (
//           <div className="flex lg:grid lg:grid-cols-3 gap-6 overflow-x-hidden">
//             {Array.from({ length: 3 }).map((_, i) => (
//               <div 
//                 key={i} 
//                 className="min-w-[85vw] sm:min-w-[340px] lg:min-w-0 bg-[#121A15] border border-neutral-800/50 rounded-3xl p-4 h-[420px] flex flex-col animate-pulse"
//               >
//                 {/* صورة الكورس */}
//                 <div className="w-full h-48 bg-neutral-800 rounded-2xl mb-4" />
//                 {/* تفاصيل الكورس */}
//                 <div className="space-y-3 flex-1">
//                   <div className="h-4 w-1/3 bg-emerald-900/40 rounded-md mb-2" />
//                   <div className="h-6 w-full bg-neutral-800 rounded-md" />
//                   <div className="h-6 w-3/4 bg-neutral-800 rounded-md" />
//                 </div>
//                 {/* الفوتر (المدرب والسعر) */}
//                 <div className="flex items-center justify-between border-t border-neutral-800/50 pt-4 mt-4">
//                   <div className="flex items-center gap-2">
//                     <div className="w-8 h-8 rounded-full bg-neutral-800" />
//                     <div className="h-4 w-20 bg-neutral-800 rounded-md" />
//                   </div>
//                   <div className="h-5 w-16 bg-neutral-800 rounded-md" />
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (courses || []).length === 0 ? (
          
//           {/* === حالة عدم وجود كورسات (Empty State) === */}
//           <motion.div 
//             initial={{ opacity: 0, scale: 0.95 }}
//             animate={{ opacity: 1, scale: 1 }}
//             className="flex flex-col items-center justify-center py-20 px-4 text-center border border-dashed border-neutral-800 rounded-3xl bg-neutral-900/20"
//           >
//             <div className="w-16 h-16 bg-neutral-800/50 rounded-2xl flex items-center justify-center mb-4 text-neutral-500">
//               <BookOpen className="w-8 h-8" />
//             </div>
//             <h3 className="text-xl font-bold text-white mb-2">لا توجد كورسات حالياً</h3>
//             <p className="text-neutral-500 max-w-sm">
//               لم يتم إضافة أي كورسات مميزة بعد. قم بإضافة كورسات من لوحة التحكم لتظهر هنا.
//             </p>
//           </motion.div>
//         ) : (
          
//           {/* === عرض الكورسات (Courses Grid / Slider) === */}
//           <motion.div 
//             variants={containerVariants}
//             initial="hidden"
//             whileInView="show"
//             viewport={{ once: true, margin: "-50px" }}
//             // إعدادات السلايدر للموبايل والجريد للكمبيوتر
//             className="flex lg:grid lg:grid-cols-3 gap-6 overflow-x-auto lg:overflow-visible pb-8 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
//           >
//             {(courses || []).slice(0, 6).map((course, i) => (
//               <motion.div 
//                 key={course.id} 
//                 variants={itemVariants}
//                 // حجم الكارت في الموبايل 85% من الشاشة عشان يبان جزء من الكارت اللي بعده
//                 className="snap-center lg:snap-align-none shrink-0 w-[85vw] sm:w-[340px] lg:w-auto h-full"
//               >
//                 {/* ملحوظة: تأكد إن CourseCard بتاعك واخد h-full و flex-col
//                   عشان الكروت كلها تطلع نفس الطول بغض النظر عن طول العنوان
//                 */}
//                 <CourseCard
//                   {...course}
//                   index={i}
//                 />
//               </motion.div>
//             ))}
//           </motion.div>
//         )}
//       </div>
//     </section>
//   );
// };

// export default FeaturedCourses;

//v3

// import { useRef } from "react";
// import { motion, useScroll, useTransform } from "framer-motion";
// import { Link } from "react-router-dom";
// import { ArrowLeft, Sparkles, BookOpen, Flame } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import CourseCard from "@/components/courses/CourseCard";
// import { useCourses } from "@/hooks/useCourses";

// // ==========================================
// // إعدادات الأنيميشن للكروت
// // ==========================================
// const containerVariants = {
//   hidden: { opacity: 0 },
//   show: {
//     opacity: 1,
//     transition: { staggerChildren: 0.15 },
//   },
// };

// const itemVariants = {
//   hidden: { opacity: 0, y: 40, scale: 0.95 },
//   show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 70, damping: 20 } },
// };

// // ==========================================
// // القسم الرئيسي للكورسات المميزة
// // ==========================================
// const FeaturedCourses = () => {
//   const { data: courses, isLoading } = useCourses();
//   const containerRef = useRef(null);

//   // تأثير بارالاكس (Parallax) خفيف للإضاءة الخلفية
//   const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end start"] });
//   const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

//   return (
//     <section ref={containerRef} className="relative py-24 bg-[#050806] overflow-hidden border-t border-neutral-800/20">
      
//       {/* 1. إضاءات خلفية ديناميكية (Dynamic Glowing Backgrounds) */}
//       <motion.div style={{ y: yBg }} className="absolute inset-0 z-0 pointer-events-none">
//         <div className="absolute top-[10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-900/10 blur-[150px]" />
//         <div className="absolute bottom-[20%] left-[-5%] w-[400px] h-[400px] rounded-full bg-green-900/5 blur-[120px]" />
//         {/* شبكة هندسية خفيفة جداً للعمق */}
//         <div className="absolute inset-0 opacity-[0.015] bg-[url('/grid.svg')] bg-center" />
//       </motion.div>

//       <div className="container mx-auto px-4 lg:px-8 relative z-10">
        
//         {/* التخطيط اللامتماثل (Asymmetrical Layout) */}
//         <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
          
//           {/* ======================================= */}
//           {/* الجانب الأيمن: لاصق (Sticky Header Side) */}
//           {/* ======================================= */}
//           <div className="lg:w-[35%] lg:sticky lg:top-32 space-y-8 z-20">
//             <motion.div
//               initial={{ opacity: 0, x: 30 }}
//               whileInView={{ opacity: 1, x: 0 }}
//               viewport={{ once: true, margin: "-100px" }}
//               transition={{ duration: 0.6 }}
//               className="space-y-6"
//             >
//               <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#121A15] border border-neutral-800 text-emerald-400 text-sm font-semibold shadow-[0_0_20px_rgba(16,185,129,0.05)]">
//                 <Flame className="w-4 h-4 text-amber-500 animate-pulse" />
//                 الأكثر طلباً في السوق
//               </div>
              
//               <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.15] tracking-tight">
//                 أقوى <br className="hidden lg:block" />
//                 <span className="text-transparent bg-clip-text bg-gradient-to-l from-emerald-400 to-green-600 relative">
//                   الكورسات
//                   <span className="absolute -bottom-2 right-0 w-1/2 h-1 bg-gradient-to-l from-emerald-500 to-transparent rounded-full" />
//                 </span>
//               </h2>
              
//               <p className="text-lg text-neutral-400 leading-relaxed pr-2">
//                 برامج تدريبية مكثفة مصممة على يد خبراء الصناعة. اكتسب المهارات العملية التي تضعك في مقدمة سوق العمل الزراعي.
//               </p>

//               <Link to="/courses" className="inline-block pt-4">
//                 <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
//                   <Button 
//                     size="lg"
//                     className="bg-white hover:bg-neutral-200 text-black px-8 h-14 text-base font-bold transition-all shadow-xl rounded-2xl gap-3 group"
//                   >
//                     تصفح جميع الكورسات
//                     <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1.5 transition-transform" />
//                   </Button>
//                 </motion.div>
//               </Link>
//             </motion.div>
//           </div>

//           {/* ======================================= */}
//           {/* الجانب الأيسر: متحرك (Scrollable Grid Side) */}
//           {/* ======================================= */}
//           <div className="lg:w-[65%] w-full min-h-[50vh]">
            
//             {isLoading ? (
//               // --- حالة التحميل (Premium Skeleton) ---
//               <div className="flex lg:grid lg:grid-cols-2 gap-6 overflow-x-hidden">
//                 {Array.from({ length: 4 }).map((_, i) => (
//                   <div key={i} className="min-w-[85vw] sm:min-w-[340px] lg:min-w-0 bg-[#0c120e] border border-neutral-800/40 rounded-3xl p-4 h-[440px] flex flex-col animate-pulse">
//                     <div className="w-full h-52 bg-neutral-900 rounded-2xl mb-5" />
//                     <div className="space-y-4 flex-1 px-2">
//                       <div className="h-4 w-1/3 bg-emerald-900/30 rounded-md mb-3" />
//                       <div className="h-6 w-full bg-neutral-800/80 rounded-md" />
//                       <div className="h-6 w-4/5 bg-neutral-800/80 rounded-md" />
//                     </div>
//                   </div>
//                 ))}
//               </div>

//             ) : (courses || []).length === 0 ? (
//               // --- حالة عدم وجود كورسات (Empty State) ---
//               <motion.div 
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 className="flex flex-col items-center justify-center py-24 px-4 text-center border border-dashed border-neutral-800/60 rounded-3xl bg-[#0c120e]/50 backdrop-blur-sm"
//               >
//                 <div className="w-20 h-20 bg-neutral-900 rounded-3xl flex items-center justify-center mb-6 shadow-inner border border-neutral-800">
//                   <BookOpen className="w-10 h-10 text-neutral-600" />
//                 </div>
//                 <h3 className="text-2xl font-bold text-white mb-3">لا توجد كورسات متاحة حالياً</h3>
//                 <p className="text-neutral-500 max-w-md leading-relaxed">
//                   نعمل على إضافة محتوى حصري قريباً. يرجى متابعة المنصة للإصدارات الجديدة.
//                 </p>
//               </motion.div>

//             ) : (
//               // --- عرض الكورسات (The Courses Grid / Slider) ---
//               <motion.div 
//                 variants={containerVariants}
//                 initial="hidden"
//                 whileInView="show"
//                 viewport={{ once: true, margin: "-50px" }}
//                 className="flex lg:grid lg:grid-cols-2 gap-6 overflow-x-auto lg:overflow-visible pb-8 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
//               >
//                 {(courses || []).slice(0, 6).map((course, i) => (
//                   <motion.div 
//                     key={course.id} 
//                     variants={itemVariants}
//                     className="snap-center lg:snap-align-none shrink-0 w-[85vw] sm:w-[340px] lg:w-auto h-full"
//                   >
//                     <CourseCard
//                       {...course}
//                       index={i}
//                     />
//                   </motion.div>
//                 ))}
//               </motion.div>
//             )}

//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default FeaturedCourses;

//v4

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Sparkles, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import CourseCard from "@/components/courses/CourseCard";
import { useCourses } from "@/hooks/useCourses";

// إعدادات الأنيميشن
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

const FeaturedCourses = () => {
  const { data: courses, isLoading } = useCourses();

  return (
    <section className="relative py-24 bg-[#090D0A] overflow-hidden">
      
      {/* إضاءات خلفية مركزية (Center Glow) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[70%] h-[1px] bg-gradient-to-r from-transparent via-emerald-900/50 to-transparent" />
      <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[50vw] h-[50vw] rounded-full bg-emerald-900/10 blur-[150px] pointer-events-none" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        
        {/* ======================================= */}
        {/* الهيدر المركزي (Centered Header) */}
        {/* ======================================= */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16 space-y-6"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neutral-800/50 border border-neutral-700 text-emerald-400 text-sm font-medium shadow-inner">
            <Sparkles className="w-4 h-4" />
            الأكثر طلباً
          </span>
          
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            الكورسات <span className="text-transparent bg-clip-text bg-gradient-to-l from-emerald-400 to-green-600">المميزة</span>
          </h2>
          
          <p className="text-lg text-neutral-400 leading-relaxed">
            مجموعة منتقاة من أفضل البرامج التدريبية. ابدأ رحلتك الآن واكتسب المهارات التي يتطلبها سوق العمل الزراعي الحديث.
          </p>

          <Link to="/courses" className="inline-block pt-2">
            <Button 
              variant="outline" 
              className="group border-neutral-700 text-white hover:text-black hover:bg-white hover:border-white px-8 h-12 text-base font-medium transition-all bg-transparent rounded-full"
            >
              تصفح جميع الكورسات
              <ArrowLeft className="w-4 h-4 ml-2 group-hover:-translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>

        {/* ======================================= */}
        {/* شبكة الكورسات (Courses Grid) */}
        {/* ======================================= */}
        {isLoading ? (
          
          // --- Skeleton Loading ---
          <div className="flex lg:grid lg:grid-cols-3 gap-6 overflow-x-hidden">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="min-w-[85vw] sm:min-w-[340px] lg:min-w-0 bg-[#121A15] border border-neutral-800/50 rounded-3xl p-4 h-[420px] flex flex-col animate-pulse">
                <div className="w-full h-48 bg-neutral-800 rounded-2xl mb-4" />
                <div className="space-y-3 flex-1">
                  <div className="h-4 w-1/3 bg-emerald-900/40 rounded-md mb-2" />
                  <div className="h-6 w-full bg-neutral-800 rounded-md" />
                  <div className="h-6 w-3/4 bg-neutral-800 rounded-md" />
                </div>
              </div>
            ))}
          </div>

        ) : (courses || []).length === 0 ? (
          
          // --- Empty State ---
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20 px-4 text-center border border-dashed border-neutral-800 rounded-3xl bg-[#121A15]/50"
          >
            <div className="w-16 h-16 bg-neutral-800 rounded-2xl flex items-center justify-center mb-4 text-neutral-500">
              <BookOpen className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">لا توجد كورسات حالياً</h3>
            <p className="text-neutral-500 max-w-sm">
              لم يتم إضافة أي كورسات مميزة بعد.
            </p>
          </motion.div>

        ) : (
          
          // --- عرض الكورسات مع تأثير التركيز (Focus Hover Effect) ---
          // الكلاس group/list هو اللي بيتحكم في إخفاء باقي الكروت عند عمل Hover على كارت واحد
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            className="group/list flex lg:grid lg:grid-cols-3 gap-6 overflow-x-auto lg:overflow-visible pb-8 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            {(courses || []).slice(0, 6).map((course, i) => (
              <motion.div 
                key={course.id} 
                variants={itemVariants}
                // transition-all group-hover/list:opacity-50 hover:!opacity-100: دي اللي بتعمل التأثير السحري
                className="snap-center lg:snap-align-none shrink-0 w-[85vw] sm:w-[340px] lg:w-auto h-full transition-all duration-500 lg:group-hover/list:opacity-40 lg:hover:!opacity-100 lg:hover:scale-[1.02]"
              >
                <CourseCard
                  {...course}
                  index={i}
                />
              </motion.div>
            ))}
          </motion.div>

        )}
      </div>
    </section>
  );
};

export default FeaturedCourses;
