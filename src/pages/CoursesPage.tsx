

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
  
  // 1. قراءة كلمة البحث من الرابط (لو موجودة)
  const initialQ = searchParams.get("q") || ""; 
  
  // 2. وضع الكلمة كقيمة ابتدائية لحالة البحث
  const [search, setSearch] = useState(initialQ); 
  const [selectedSpec, setSelectedSpec] = useState<string | null>(initialSpec);
  
  const { data: courses, isLoading } = useCourses(selectedSpec);
  const { data: specializations } = useSpecializations();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // 3. الخطوة السحرية: تحديث البحث تلقائياً لو المستخدم بحث من النافبار وهو جوه صفحة الكورسات أصلاً
  useEffect(() => {
    const q = searchParams.get("q");
    if (q !== null) {
      setSearch(q);
    }
  }, [searchParams]);

  const filtered = (courses || []).filter((c) => {
    return c.title.includes(search) || c.description.includes(search);
  });

  return (
    <div className="min-h-screen flex flex-col bg-background font-tajawal selection:bg-accent">
      <Navbar />
      
      <main className="flex-1 pt-32 pb-24 md:pb-16 relative overflow-hidden">
        
        {/* إضاءات خلفية */}


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
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-muted border border-border text-primary text-sm font-medium  mb-4">
              <BookOpen className="w-4 h-4" />
              مكتبة الكورسات
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tight mb-4">
              استكشف <span className="text-transparent bg-clip-text text-primary">برامجنا التدريبية</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
              تصفح مجموعة واسعة من الكورسات الزراعية المتخصصة، مصممة بعناية لتناسب احتياجات سوق العمل الحالي.
            </p>
          </motion.div>

          {/* ======================================= */}
          {/* التخطيط اللامتماثل (Asymmetrical Layout) */}
          {/* ======================================= */}
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
            
            {/* 1. العمود الأيمن اللاصق (الفلاتر والبحث) */}
            <div className="lg:w-[30%] w-full lg:sticky lg:top-32 z-20 mb-2 lg:mb-0">
              
              <div className="bg-muted lg:border lg:border-border rounded-2xl lg:rounded-3xl p-4 lg:p-6 lg:shadow-2xl lg:backdrop-blur-xl">
                
                {/* البحث */}
                <div className="mb-6 lg:mb-8">
                  <label className="hidden lg:flex text-sm font-bold text-foreground mb-3 items-center gap-2">
                    <Search className="w-4 h-4 text-primary" />
                    ابحث عن كورس
                  </label>
                  <div className="relative group">
                    <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors lg:hidden" />
                    <input
                      type="text"
                      placeholder="ابحث عن كورس (مثال: اللاندسكيب)..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full pr-12 lg:pr-4 pl-4 py-3.5 rounded-xl bg-muted border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/20 focus:ring-1 focus:ring-primary transition-all shadow-inner"
                    />
                  </div>
                </div>

                {/* التخصصات */}
                <div>
                  <label className="hidden lg:flex text-sm font-bold text-foreground mb-4 items-center gap-2 border-b border-border pb-3">
                    <SlidersHorizontal className="w-4 h-4 text-primary" />
                    تصفية حسب التخصص
                  </label>
                  
                  {/* حاوية التخصصات: كبسولات للموبايل، قائمة للكمبيوتر */}
                  {/* أضفنا -mx-4 px-4 للموبايل عشان التمرير ميبقاش مقطوع من حواف الشاشة */}
                  <div className="flex flex-row overflow-x-auto lg:flex-col gap-3 pb-4 lg:pb-0 -mx-4 px-4 lg:mx-0 lg:px-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    
                    <button
                      onClick={() => setSelectedSpec(null)}
                      className={`flex items-center justify-center lg:justify-between px-5 lg:px-4 py-2 lg:py-3 rounded-full lg:rounded-xl text-sm font-bold transition-all duration-300 shrink-0 w-max lg:w-full lg:text-right ${
                        !selectedSpec 
                          ? "bg-primary text-primary-foreground lg:bg-accent lg:border lg:border-primary/20 lg:text-primary  lg:shadow-none" 
                          : "bg-muted border border-border lg:border-transparent text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <LayoutGrid className="w-4 h-4 hidden lg:block" />
                        الكل
                      </span>
                      {!selectedSpec && <Check className="w-4 h-4 text-primary hidden lg:block" />}
                    </button>
                    
                    {(specializations || []).map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setSelectedSpec(s.id)}
                        className={`flex items-center justify-center lg:justify-between px-5 lg:px-4 py-2 lg:py-3 rounded-full lg:rounded-xl text-sm font-bold transition-all duration-300 shrink-0 w-max lg:w-full lg:text-right ${
                          selectedSpec === s.id 
                            ? "bg-primary text-primary-foreground lg:bg-accent lg:border lg:border-primary/20 lg:text-primary  lg:shadow-none" 
                            : "bg-muted border border-border lg:border-transparent text-muted-foreground hover:text-foreground hover:bg-muted"
                        }`}
                      >
                        <span>{s.name}</span>
                        {selectedSpec === s.id && <Check className="w-4 h-4 text-primary hidden lg:block" />}
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
                <div className="hidden lg:flex items-center justify-between border-b border-border pb-4 mb-6">
                  <span className="text-muted-foreground font-medium">
                    عرض <strong className="text-foreground">{filtered.length}</strong> كورس
                  </span>
                </div>
              )}

              {isLoading ? (
                // --- Skeleton ---
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="bg-muted border border-border rounded-3xl p-4 h-[400px] flex flex-col animate-pulse shadow-lg">
                      <div className="w-full h-48 bg-muted rounded-2xl mb-4 border border-border" />
                      <div className="space-y-3 flex-1">
                        <div className="h-4 w-1/3 bg-accent rounded-md mb-3" />
                        <div className="h-6 w-full bg-muted rounded-md" />
                        <div className="h-6 w-3/4 bg-muted rounded-md" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : filtered.length === 0 ? (
                // --- Empty State ---
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-20 px-4 text-center bg-muted border border-dashed border-border rounded-[2rem] shadow-lg"
                >
                  <div className="w-20 h-20 bg-muted rounded-2xl flex items-center justify-center mb-6 border border-border">
                    <SearchX className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">لا توجد نتائج مطابقة</h3>
                  <p className="text-muted-foreground max-w-sm mb-6 leading-relaxed">
                    لم نتمكن من العثور على أي كورسات تطابق كلمة البحث.
                  </p>
                  <button 
                    onClick={() => { setSearch(""); setSelectedSpec(null); }}
                    className="bg-muted hover:bg-muted border border-border hover:border-primary/20 text-primary px-6 py-3 rounded-xl font-bold transition-all"
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
