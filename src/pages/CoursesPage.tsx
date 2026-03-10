// import Navbar from "@/components/layout/Navbar";
// import Footer from "@/components/layout/Footer";
// import BottomNav from "@/components/layout/BottomNav";
// import CourseCard from "@/components/courses/CourseCard";
// import { useCourses, useSpecializations } from "@/hooks/useCourses";
// import { useState } from "react";
// import { useSearchParams } from "react-router-dom";
// import { motion } from "framer-motion";
// import { Search } from "lucide-react";

// const CoursesPage = () => {
//   const [searchParams] = useSearchParams();
//   const initialSpec = searchParams.get("spec");
//   const [search, setSearch] = useState("");
//   const [selectedSpec, setSelectedSpec] = useState<string | null>(initialSpec);
//   const { data: courses, isLoading } = useCourses(selectedSpec);
//   const { data: specializations } = useSpecializations();

//   const filtered = (courses || []).filter((c) => {
//     return c.title.includes(search) || c.description.includes(search);
//   });

//   return (
//     <div className="min-h-screen flex flex-col bg-background">
//       <Navbar />
//       <main className="flex-1 pt-24 pb-20 md:pb-8">
//         <div className="container mx-auto px-4">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="mb-8"
//           >
//             <h1 className="text-3xl font-black text-foreground mb-2">جميع الكورسات</h1>
//             <p className="text-muted-foreground">تصفح واختر الكورس المناسب لك</p>
//           </motion.div>

//           <div className="flex flex-col sm:flex-row gap-4 mb-8">
//             <div className="relative flex-1">
//               <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
//               <input
//                 type="text"
//                 placeholder="ابحث عن كورس..."
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 className="w-full pr-10 pl-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
//               />
//             </div>
//             <div className="flex flex-wrap gap-2">
//               <button
//                 onClick={() => setSelectedSpec(null)}
//                 className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
//                   !selectedSpec ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
//                 }`}
//               >
//                 الكل
//               </button>
//               {(specializations || []).map((s) => (
//                 <button
//                   key={s.id}
//                   onClick={() => setSelectedSpec(s.id)}
//                   className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
//                     selectedSpec === s.id ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
//                   }`}
//                 >
//                   {s.name}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {isLoading ? (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//               {Array.from({ length: 6 }).map((_, i) => (
//                 <div key={i} className="glass-card h-80 animate-pulse" />
//               ))}
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//               {filtered.map((course, i) => (
//                 <CourseCard key={course.id} {...course} index={i} />
//               ))}
//             </div>
//           )}

//           {!isLoading && filtered.length === 0 && (
//             <div className="text-center py-16 text-muted-foreground">
//               <p className="text-lg">لا توجد نتائج مطابقة</p>
//             </div>
//           )}
//         </div>
//       </main>
//       <Footer />
//       <BottomNav />
//     </div>
//   );
// };

// export default CoursesPage;

//v2

// import { useState, useEffect } from "react";
// import Navbar from "@/components/layout/Navbar";
// import Footer from "@/components/layout/Footer";
// import BottomNav from "@/components/layout/BottomNav";
// import CourseCard from "@/components/courses/CourseCard";
// import { useCourses, useSpecializations } from "@/hooks/useCourses";
// import { useSearchParams } from "react-router-dom";
// import { motion } from "framer-motion";
// import { Search, SlidersHorizontal, BookOpen, SearchX } from "lucide-react";

// const CoursesPage = () => {
//   const [searchParams] = useSearchParams();
//   const initialSpec = searchParams.get("spec");
//   const [search, setSearch] = useState("");
//   const [selectedSpec, setSelectedSpec] = useState<string | null>(initialSpec);
//   const { data: courses, isLoading } = useCourses(selectedSpec);
//   const { data: specializations } = useSpecializations();

//   // تمرير لأعلى الصفحة عند الفتح
//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, []);

//   // فلترة الكورسات بناءً على نص البحث
//   const filtered = (courses || []).filter((c) => {
//     return c.title.includes(search) || c.description.includes(search);
//   });

//   return (
//     <div className="min-h-screen flex flex-col bg-[#050806] font-tajawal selection:bg-emerald-500/30">
//       <Navbar />
      
//       <main className="flex-1 pt-32 pb-24 md:pb-16 relative overflow-hidden">
        
//         {/* إضاءات خلفية (Ambient Glows) */}
//         <div className="absolute top-0 right-[-10%] w-[40vw] h-[40vw] rounded-full bg-emerald-900/10 blur-[150px] pointer-events-none" />
//         <div className="absolute top-[30%] left-[-10%] w-[30vw] h-[30vw] rounded-full bg-emerald-900/5 blur-[120px] pointer-events-none" />

//         <div className="container mx-auto px-4 lg:px-8 relative z-10">
          
//           {/* ======================================= */}
//           {/* الهيدر (Header Section) */}
//           {/* ======================================= */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5 }}
//             className="mb-12 space-y-4"
//           >
//             <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#121A15] border border-neutral-800 text-emerald-400 text-sm font-medium shadow-[0_0_20px_rgba(16,185,129,0.05)]">
//               <BookOpen className="w-4 h-4" />
//               مكتبة الكورسات
//             </div>
//             <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
//               استكشف <span className="text-transparent bg-clip-text bg-gradient-to-l from-emerald-400 to-green-600">برامجنا التدريبية</span>
//             </h1>
//             <p className="text-lg text-neutral-400 max-w-2xl">
//               تصفح مجموعة واسعة من الكورسات الزراعية المتخصصة، مصممة بعناية لتناسب احتياجات سوق العمل الحالي.
//             </p>
//           </motion.div>

//           {/* ======================================= */}
//           {/* شريط البحث والفلاتر (Search & Filters Bar) */}
//           {/* ======================================= */}
//           <div className="flex flex-col lg:flex-row gap-5 mb-10 items-start lg:items-center">
            
//             {/* حقل البحث الذكي */}
//             <div className="relative w-full lg:w-96 group shrink-0">
//               <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500 group-focus-within:text-emerald-500 transition-colors" />
//               <input
//                 type="text"
//                 placeholder="ابحث عن كورس (مثال: اللاندسكيب)..."
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 className="w-full pr-12 pl-4 py-3.5 rounded-xl bg-[#0a0f0c] border border-neutral-800/80 text-white text-sm placeholder:text-neutral-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all shadow-inner"
//               />
//             </div>

//             {/* تصنيفات التخصصات (Scrollable on Mobile) */}
//             <div className="flex items-center gap-3 overflow-x-auto pb-2 lg:pb-0 w-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
//               <div className="flex items-center gap-2 text-neutral-500 mr-2 shrink-0">
//                 <SlidersHorizontal className="w-4 h-4" />
//                 <span className="text-sm font-bold">تصفية:</span>
//               </div>
              
//               <button
//                 onClick={() => setSelectedSpec(null)}
//                 className={`px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-300 shrink-0 ${
//                   !selectedSpec 
//                     ? "bg-emerald-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)] scale-105" 
//                     : "bg-[#0a0f0c] border border-neutral-800/80 text-neutral-400 hover:text-white hover:bg-[#121A15]"
//                 }`}
//               >
//                 جميع التخصصات
//               </button>
              
//               {(specializations || []).map((s) => (
//                 <button
//                   key={s.id}
//                   onClick={() => setSelectedSpec(s.id)}
//                   className={`px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-300 shrink-0 ${
//                     selectedSpec === s.id 
//                       ? "bg-emerald-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)] scale-105" 
//                       : "bg-[#0a0f0c] border border-neutral-800/80 text-neutral-400 hover:text-white hover:bg-[#121A15]"
//                   }`}
//                 >
//                   {s.name}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* ======================================= */}
//           {/* شبكة عرض الكورسات (Courses Grid) */}
//           {/* ======================================= */}
//           {isLoading ? (
            
//             // --- حالة التحميل (Premium Skeletons) ---
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//               {Array.from({ length: 8 }).map((_, i) => (
//                 <div key={i} className="bg-[#0a0f0c] border border-neutral-800/50 rounded-3xl p-4 h-[400px] flex flex-col animate-pulse shadow-lg">
//                   <div className="w-full h-48 bg-[#121A15] rounded-2xl mb-4 border border-neutral-800/50" />
//                   <div className="space-y-3 flex-1">
//                     <div className="h-4 w-1/3 bg-emerald-900/20 rounded-md mb-3" />
//                     <div className="h-6 w-full bg-[#121A15] rounded-md" />
//                     <div className="h-6 w-3/4 bg-[#121A15] rounded-md" />
//                   </div>
//                   <div className="h-10 w-full bg-[#121A15] rounded-xl mt-4" />
//                 </div>
//               ))}
//             </div>

//           ) : filtered.length === 0 ? (
            
//             // --- حالة عدم وجود نتائج (Empty State) ---
//             <motion.div 
//               initial={{ opacity: 0, scale: 0.95 }}
//               animate={{ opacity: 1, scale: 1 }}
//               className="flex flex-col items-center justify-center py-24 px-4 text-center bg-[#0a0f0c] border border-dashed border-neutral-800 rounded-[2rem] shadow-lg max-w-2xl mx-auto mt-8"
//             >
//               <div className="w-20 h-20 bg-[#121A15] rounded-2xl flex items-center justify-center mb-6 border border-neutral-800 shadow-inner">
//                 <SearchX className="w-10 h-10 text-neutral-500" />
//               </div>
//               <h3 className="text-2xl font-bold text-white mb-2">لا توجد نتائج مطابقة</h3>
//               <p className="text-neutral-400 max-w-sm mb-8 leading-relaxed">
//                 لم نتمكن من العثور على أي كورسات تطابق كلمة البحث "{search}". حاول استخدام كلمات مختلفة أو تصفح التخصصات الأخرى.
//               </p>
//               <button 
//                 onClick={() => { setSearch(""); setSelectedSpec(null); }}
//                 className="bg-[#121A15] hover:bg-[#1a241c] border border-neutral-800 hover:border-emerald-500/50 text-emerald-500 hover:text-emerald-400 px-6 py-3 rounded-xl font-bold transition-all duration-300"
//               >
//                 مسح الفلاتر وعرض الكل
//               </button>
//             </motion.div>

//           ) : (
            
//             // --- عرض الكورسات ---
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//               {filtered.map((course, i) => (
//                 <div key={course.id} className="h-full">
//                   <CourseCard {...course} index={i} />
//                 </div>
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

// export default CoursesPage;
//v3

// import { useState, useEffect } from "react";
// import Navbar from "@/components/layout/Navbar";
// import Footer from "@/components/layout/Footer";
// import BottomNav from "@/components/layout/BottomNav";
// import CourseCard from "@/components/courses/CourseCard";
// import { useCourses, useSpecializations } from "@/hooks/useCourses";
// import { useSearchParams } from "react-router-dom";
// import { motion } from "framer-motion";
// import { Search, SlidersHorizontal, BookOpen, SearchX, Check, LayoutGrid } from "lucide-react";

// const CoursesPage = () => {
//   const [searchParams] = useSearchParams();
//   const initialSpec = searchParams.get("spec");
//   const [search, setSearch] = useState("");
//   const [selectedSpec, setSelectedSpec] = useState<string | null>(initialSpec);
//   const { data: courses, isLoading } = useCourses(selectedSpec);
//   const { data: specializations } = useSpecializations();

//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, []);

//   const filtered = (courses || []).filter((c) => {
//     return c.title.includes(search) || c.description.includes(search);
//   });

//   return (
//     <div className="min-h-screen flex flex-col bg-[#050806] font-tajawal selection:bg-emerald-500/30">
//       <Navbar />
      
//       <main className="flex-1 pt-32 pb-24 md:pb-16 relative overflow-hidden">
        
//         {/* إضاءات خلفية */}
//         <div className="absolute top-0 right-[-10%] w-[40vw] h-[40vw] rounded-full bg-emerald-900/10 blur-[150px] pointer-events-none" />
//         <div className="absolute top-[30%] left-[-10%] w-[30vw] h-[30vw] rounded-full bg-emerald-900/5 blur-[120px] pointer-events-none" />

//         <div className="container mx-auto px-4 lg:px-8 relative z-10">
          
//           {/* ======================================= */}
//           {/* الهيدر */}
//           {/* ======================================= */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5 }}
//             className="mb-12"
//           >
//             <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#121A15] border border-neutral-800 text-emerald-400 text-sm font-medium shadow-[0_0_20px_rgba(16,185,129,0.05)] mb-4">
//               <BookOpen className="w-4 h-4" />
//               مكتبة الكورسات
//             </div>
//             <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
//               استكشف <span className="text-transparent bg-clip-text bg-gradient-to-l from-emerald-400 to-green-600">برامجنا التدريبية</span>
//             </h1>
//             <p className="text-lg text-neutral-400 max-w-2xl leading-relaxed">
//               تصفح مجموعة واسعة من الكورسات الزراعية المتخصصة، مصممة بعناية لتناسب احتياجات سوق العمل الحالي.
//             </p>
//           </motion.div>

//           {/* ======================================= */}
//           {/* التخطيط اللامتماثل (Asymmetrical Layout) */}
//           {/* ======================================= */}
//           <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
            
//             {/* 1. العمود الأيمن اللاصق (الفلاتر والبحث) */}
//             <div className="lg:w-[30%] w-full lg:sticky lg:top-32 space-y-6 z-20">
              
//               <div className="bg-[#0a0f0c] border border-neutral-800/80 rounded-3xl p-6 shadow-2xl backdrop-blur-xl">
                
//                 {/* البحث */}
//                 <div className="mb-8">
//                   <label className="text-sm font-bold text-neutral-300 mb-3 block flex items-center gap-2">
//                     <Search className="w-4 h-4 text-emerald-500" />
//                     ابحث عن كورس
//                   </label>
//                   <div className="relative group">
//                     <input
//                       type="text"
//                       placeholder="مثال: اللاندسكيب..."
//                       value={search}
//                       onChange={(e) => setSearch(e.target.value)}
//                       className="w-full pl-4 pr-4 py-3.5 rounded-xl bg-[#121A15] border border-neutral-800 text-white text-sm placeholder:text-neutral-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all shadow-inner"
//                     />
//                   </div>
//                 </div>

//                 {/* التخصصات */}
//                 <div>
//                   <label className="text-sm font-bold text-neutral-300 mb-4 block flex items-center gap-2 border-b border-neutral-800/50 pb-3">
//                     <SlidersHorizontal className="w-4 h-4 text-emerald-500" />
//                     تصفية حسب التخصص
//                   </label>
                  
//                   {/* حاوية التخصصات: عمودية في الكمبيوتر، وأفقية في الموبايل */}
//                   <div className="flex flex-row overflow-x-auto lg:flex-col gap-3 pb-2 lg:pb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    
//                     <button
//                       onClick={() => setSelectedSpec(null)}
//                       className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 shrink-0 lg:shrink w-full text-right ${
//                         !selectedSpec 
//                           ? "bg-emerald-600/10 border border-emerald-500/30 text-emerald-400" 
//                           : "bg-[#121A15] border border-transparent text-neutral-400 hover:text-white hover:bg-[#1a241c]"
//                       }`}
//                     >
//                       <span className="flex items-center gap-2">
//                         <LayoutGrid className="w-4 h-4" />
//                         جميع التخصصات
//                       </span>
//                       {!selectedSpec && <Check className="w-4 h-4 text-emerald-500 hidden lg:block" />}
//                     </button>
                    
//                     {(specializations || []).map((s) => (
//                       <button
//                         key={s.id}
//                         onClick={() => setSelectedSpec(s.id)}
//                         className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 shrink-0 lg:shrink w-full text-right ${
//                           selectedSpec === s.id 
//                             ? "bg-emerald-600/10 border border-emerald-500/30 text-emerald-400" 
//                             : "bg-[#121A15] border border-transparent text-neutral-400 hover:text-white hover:bg-[#1a241c]"
//                         }`}
//                       >
//                         <span>{s.name}</span>
//                         {selectedSpec === s.id && <Check className="w-4 h-4 text-emerald-500 hidden lg:block" />}
//                       </button>
//                     ))}

//                   </div>
//                 </div>

//               </div>
//             </div>

//             {/* 2. العمود الأيسر المتحرك (النتائج) */}
//             <div className="lg:w-[70%] w-full">
              
//               {/* رسالة النتائج */}
//               {!isLoading && (
//                 <div className="mb-6 flex items-center justify-between border-b border-neutral-800/50 pb-4">
//                   <span className="text-neutral-400 font-medium">
//                     عرض <strong className="text-white">{filtered.length}</strong> كورس
//                   </span>
//                 </div>
//               )}

//               {isLoading ? (
//                 // --- Skeleton ---
//                 <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
//                   {Array.from({ length: 6 }).map((_, i) => (
//                     <div key={i} className="bg-[#0a0f0c] border border-neutral-800/50 rounded-3xl p-4 h-[400px] flex flex-col animate-pulse shadow-lg">
//                       <div className="w-full h-48 bg-[#121A15] rounded-2xl mb-4 border border-neutral-800/50" />
//                       <div className="space-y-3 flex-1">
//                         <div className="h-4 w-1/3 bg-emerald-900/20 rounded-md mb-3" />
//                         <div className="h-6 w-full bg-[#121A15] rounded-md" />
//                         <div className="h-6 w-3/4 bg-[#121A15] rounded-md" />
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               ) : filtered.length === 0 ? (
//                 // --- Empty State ---
//                 <motion.div 
//                   initial={{ opacity: 0, scale: 0.95 }}
//                   animate={{ opacity: 1, scale: 1 }}
//                   className="flex flex-col items-center justify-center py-20 px-4 text-center bg-[#0a0f0c] border border-dashed border-neutral-800 rounded-[2rem] shadow-lg"
//                 >
//                   <div className="w-20 h-20 bg-[#121A15] rounded-2xl flex items-center justify-center mb-6 border border-neutral-800">
//                     <SearchX className="w-10 h-10 text-neutral-500" />
//                   </div>
//                   <h3 className="text-2xl font-bold text-white mb-2">لا توجد نتائج مطابقة</h3>
//                   <p className="text-neutral-400 max-w-sm mb-6 leading-relaxed">
//                     لم نتمكن من العثور على أي كورسات تطابق كلمة البحث.
//                   </p>
//                   <button 
//                     onClick={() => { setSearch(""); setSelectedSpec(null); }}
//                     className="bg-[#121A15] hover:bg-[#1a241c] border border-neutral-800 hover:border-emerald-500/50 text-emerald-500 px-6 py-3 rounded-xl font-bold transition-all"
//                   >
//                     مسح الفلاتر وعرض الكل
//                   </button>
//                 </motion.div>
//               ) : (
//                 // --- Grid ---
//                 <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
//                   {filtered.map((course, i) => (
//                     <div key={course.id} className="h-full">
//                       <CourseCard {...course} index={i} />
//                     </div>
//                   ))}
//                 </div>
//               )}

//             </div>
//           </div>
//         </div>
//       </main>
      
//       <Footer />
//       <BottomNav />
//     </div>
//   );
// };

// export default CoursesPage;

//v4

import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BottomNav from "@/components/layout/BottomNav";
import CourseCard from "@/components/courses/CourseCard";
import { useCourses, useSpecializations } from "@/hooks/useCourses";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, BookOpen, SearchX, Check, LayoutGrid } from "lucide-react";

const CoursesPage = () => {
  const [searchParams] = useSearchParams();
  const initialSpec = searchParams.get("spec");
  const [search, setSearch] = useState("");
  const [selectedSpec, setSelectedSpec] = useState<string | null>(initialSpec);
  const { data: courses, isLoading } = useCourses(selectedSpec);
  const { data: specializations } = useSpecializations();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filtered = (courses || []).filter((c) => {
    return c.title.includes(search) || c.description.includes(search);
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#050806] font-tajawal selection:bg-emerald-500/30">
      <Navbar />
      
      <main className="flex-1 pt-32 pb-24 md:pb-16 relative overflow-hidden">
        
        {/* إضاءات خلفية */}
        <div className="absolute top-0 right-[-10%] w-[40vw] h-[40vw] rounded-full bg-emerald-900/10 blur-[150px] pointer-events-none" />
        <div className="absolute top-[30%] left-[-10%] w-[30vw] h-[30vw] rounded-full bg-emerald-900/5 blur-[120px] pointer-events-none" />

        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          
          {/* ======================================= */}
          {/* الهيدر */}
          {/* ======================================= */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 lg:mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#121A15] border border-neutral-800 text-emerald-400 text-sm font-medium shadow-[0_0_20px_rgba(16,185,129,0.05)] mb-4">
              <BookOpen className="w-4 h-4" />
              مكتبة الكورسات
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
              استكشف <span className="text-transparent bg-clip-text bg-gradient-to-l from-emerald-400 to-green-600">برامجنا التدريبية</span>
            </h1>
            <p className="text-lg text-neutral-400 max-w-2xl leading-relaxed">
              تصفح مجموعة واسعة من الكورسات الزراعية المتخصصة، مصممة بعناية لتناسب احتياجات سوق العمل الحالي.
            </p>
          </motion.div>

          {/* ======================================= */}
          {/* التخطيط اللامتماثل (Asymmetrical Layout) */}
          {/* ======================================= */}
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
            
            {/* 1. العمود الأيمن اللاصق (الفلاتر والبحث) */}
            <div className="lg:w-[30%] w-full lg:sticky lg:top-32 z-20 mb-2 lg:mb-0">
              
              <div className="bg-[#0a0f0c] lg:border lg:border-neutral-800/80 rounded-2xl lg:rounded-3xl p-4 lg:p-6 lg:shadow-2xl lg:backdrop-blur-xl">
                
                {/* البحث */}
                <div className="mb-6 lg:mb-8">
                  <label className="hidden lg:flex text-sm font-bold text-neutral-300 mb-3 items-center gap-2">
                    <Search className="w-4 h-4 text-emerald-500" />
                    ابحث عن كورس
                  </label>
                  <div className="relative group">
                    <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500 group-focus-within:text-emerald-500 transition-colors lg:hidden" />
                    <input
                      type="text"
                      placeholder="ابحث عن كورس (مثال: اللاندسكيب)..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full pr-12 lg:pr-4 pl-4 py-3.5 rounded-xl bg-[#121A15] border border-neutral-800 text-white text-sm placeholder:text-neutral-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all shadow-inner"
                    />
                  </div>
                </div>

                {/* التخصصات */}
                <div>
                  <label className="hidden lg:flex text-sm font-bold text-neutral-300 mb-4 items-center gap-2 border-b border-neutral-800/50 pb-3">
                    <SlidersHorizontal className="w-4 h-4 text-emerald-500" />
                    تصفية حسب التخصص
                  </label>
                  
                  {/* حاوية التخصصات: كبسولات للموبايل، قائمة للكمبيوتر */}
                  {/* أضفنا -mx-4 px-4 للموبايل عشان التمرير ميبقاش مقطوع من حواف الشاشة */}
                  <div className="flex flex-row overflow-x-auto lg:flex-col gap-3 pb-4 lg:pb-0 -mx-4 px-4 lg:mx-0 lg:px-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    
                    <button
                      onClick={() => setSelectedSpec(null)}
                      className={`flex items-center justify-center lg:justify-between px-5 lg:px-4 py-2 lg:py-3 rounded-full lg:rounded-xl text-sm font-bold transition-all duration-300 shrink-0 w-max lg:w-full lg:text-right ${
                        !selectedSpec 
                          ? "bg-emerald-600 text-white lg:bg-emerald-600/10 lg:border lg:border-emerald-500/30 lg:text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)] lg:shadow-none" 
                          : "bg-[#121A15] border border-neutral-800/80 lg:border-transparent text-neutral-400 hover:text-white hover:bg-[#1a241c]"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <LayoutGrid className="w-4 h-4 hidden lg:block" />
                        الكل
                      </span>
                      {!selectedSpec && <Check className="w-4 h-4 text-emerald-500 hidden lg:block" />}
                    </button>
                    
                    {(specializations || []).map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setSelectedSpec(s.id)}
                        className={`flex items-center justify-center lg:justify-between px-5 lg:px-4 py-2 lg:py-3 rounded-full lg:rounded-xl text-sm font-bold transition-all duration-300 shrink-0 w-max lg:w-full lg:text-right ${
                          selectedSpec === s.id 
                            ? "bg-emerald-600 text-white lg:bg-emerald-600/10 lg:border lg:border-emerald-500/30 lg:text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)] lg:shadow-none" 
                            : "bg-[#121A15] border border-neutral-800/80 lg:border-transparent text-neutral-400 hover:text-white hover:bg-[#1a241c]"
                        }`}
                      >
                        <span>{s.name}</span>
                        {selectedSpec === s.id && <Check className="w-4 h-4 text-emerald-500 hidden lg:block" />}
                      </button>
                    ))}

                  </div>
                </div>

              </div>
            </div>

            {/* 2. العمود الأيسر المتحرك (النتائج) */}
            <div className="lg:w-[70%] w-full">
              
              {/* رسالة النتائج */}
              {!isLoading && (
                <div className="hidden lg:flex items-center justify-between border-b border-neutral-800/50 pb-4 mb-6">
                  <span className="text-neutral-400 font-medium">
                    عرض <strong className="text-white">{filtered.length}</strong> كورس
                  </span>
                </div>
              )}

              {isLoading ? (
                // --- Skeleton ---
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="bg-[#0a0f0c] border border-neutral-800/50 rounded-3xl p-4 h-[400px] flex flex-col animate-pulse shadow-lg">
                      <div className="w-full h-48 bg-[#121A15] rounded-2xl mb-4 border border-neutral-800/50" />
                      <div className="space-y-3 flex-1">
                        <div className="h-4 w-1/3 bg-emerald-900/20 rounded-md mb-3" />
                        <div className="h-6 w-full bg-[#121A15] rounded-md" />
                        <div className="h-6 w-3/4 bg-[#121A15] rounded-md" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : filtered.length === 0 ? (
                // --- Empty State ---
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-20 px-4 text-center bg-[#0a0f0c] border border-dashed border-neutral-800 rounded-[2rem] shadow-lg"
                >
                  <div className="w-20 h-20 bg-[#121A15] rounded-2xl flex items-center justify-center mb-6 border border-neutral-800">
                    <SearchX className="w-10 h-10 text-neutral-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">لا توجد نتائج مطابقة</h3>
                  <p className="text-neutral-400 max-w-sm mb-6 leading-relaxed">
                    لم نتمكن من العثور على أي كورسات تطابق كلمة البحث.
                  </p>
                  <button 
                    onClick={() => { setSearch(""); setSelectedSpec(null); }}
                    className="bg-[#121A15] hover:bg-[#1a241c] border border-neutral-800 hover:border-emerald-500/50 text-emerald-500 px-6 py-3 rounded-xl font-bold transition-all"
                  >
                    مسح الفلاتر وعرض الكل
                  </button>
                </motion.div>
              ) : (
                // --- Grid ---
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filtered.map((course, i) => (
                    <div key={course.id} className="h-full">
                      <CourseCard {...course} index={i} />
                    </div>
                  ))}
                </div>
              )}

            </div>
          </div>
        </div>
      </main>
      
      <Footer />
      <BottomNav />
    </div>
  );
};

export default CoursesPage;
