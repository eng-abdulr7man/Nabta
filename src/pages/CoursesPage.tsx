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
  
  const initialQ = searchParams.get("q") || "";  
  const [search, setSearch] = useState(initialQ);  
  const [selectedSpec, setSelectedSpec] = useState<string | null>(initialSpec);
  
  const { data: courses, isLoading } = useCourses(selectedSpec);
  const { data: specializations } = useSpecializations();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
      
      <main className="flex-1 pt-28 pb-20 md:pb-16">
        <div className="container mx-auto px-4 lg:px-8">
          
          {/* الهيدر */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-8 lg:mb-10"
          >
           
            <h1 className="text-3xl md:text-4xl font-black text-foreground tracking-tight mb-3">
              استكشف <span className="text-primary">برامجنا التدريبية</span>
            </h1>
            <p className="text-base text-muted-foreground max-w-2xl leading-relaxed">
              تصفح مجموعة واسعة من الكورسات المتخصصة، مصممة بعناية لتناسب احتياجات سوق العمل الحقيقي.
            </p>
          </motion.div>

          {/* التخطيط */}
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            
            {/* الفلاتر والبحث */}
            <div className="lg:w-[28%] w-full lg:sticky lg:top-28 z-20">
              <div className="bg-card border border-border rounded-2xl p-4 lg:p-5 shadow-sm">
                
                {/* حقل البحث */}
                <div className="mb-6">
                  <label className="hidden lg:flex text-xs font-bold text-foreground mb-2.5 items-center gap-2">
                    <Search className="w-3.5 h-3.5 text-primary" />
                    ابحث عن كورس
                  </label>
                  <div className="relative">
                    <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground lg:hidden" />
                    <input
                      type="text"
                      placeholder="ابحث عن كورس..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full pr-10 lg:pr-3.5 pl-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-all"
                    />
                  </div>
                </div>

                {/* التخصصات */}
                <div>
                  <label className="hidden lg:flex text-xs font-bold text-foreground mb-3 items-center gap-2 border-b border-border pb-2.5">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-primary" />
                    تصفية حسب التخصص
                  </label>
                  
                  <div className="flex flex-row overflow-x-auto lg:flex-col gap-2 pb-2 lg:pb-0 -mx-4 px-4 lg:mx-0 lg:px-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    <button
                      onClick={() => setSelectedSpec(null)}
                      className={`flex items-center justify-between px-4 py-2 rounded-full lg:rounded-xl text-xs font-bold transition-all shrink-0 w-max lg:w-full text-right ${
                        !selectedSpec 
                          ? "bg-primary text-primary-foreground" 
                          : "bg-background border border-border text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <LayoutGrid className="w-3.5 h-3.5 hidden lg:block" />
                        الكل
                      </span>
                      {!selectedSpec && <Check className="w-3.5 h-3.5 hidden lg:block" />}
                    </button>
                    
                    {(specializations || []).map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setSelectedSpec(s.id)}
                        className={`flex items-center justify-between px-4 py-2 rounded-full lg:rounded-xl text-xs font-bold transition-all shrink-0 w-max lg:w-full text-right ${
                          selectedSpec === s.id 
                            ? "bg-primary text-primary-foreground" 
                            : "bg-background border border-border text-muted-foreground hover:text-foreground hover:bg-muted"
                        }`}
                      >
                        <span>{s.name}</span>
                        {selectedSpec === s.id && <Check className="w-3.5 h-3.5 hidden lg:block" />}
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* النتائج */}
            <div className="lg:w-[72%] w-full">
              
              {!isLoading && (
                <div className="hidden lg:flex items-center justify-between border-b border-border pb-3 mb-5">
                  <span className="text-xs text-muted-foreground font-medium">
                    عرض <strong className="text-foreground">{filtered.length}</strong> كورس متاح
                  </span>
                </div>
              )}

              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="bg-card border border-border rounded-2xl p-4 h-[360px] flex flex-col animate-pulse">
                      <div className="w-full h-40 bg-muted rounded-xl mb-4" />
                      <div className="space-y-2.5 flex-1">
                        <div className="h-3 w-1/3 bg-muted rounded" />
                        <div className="h-5 w-full bg-muted rounded" />
                        <div className="h-5 w-3/4 bg-muted rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : filtered.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-16 px-4 text-center bg-card border border-border rounded-2xl shadow-sm"
                >
                  <div className="w-14 h-14 bg-muted rounded-xl flex items-center justify-center mb-4 border border-border">
                    <SearchX className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-1">مفيش نتائج مطابقة</h3>
                  <p className="text-sm text-muted-foreground max-w-xs mb-5 leading-relaxed">
                    جرب تبحث بكلمة تانيه أو امسح الفلاتر عشان تشوف كل الكورسات.
                  </p>
                  <button 
                    onClick={() => { setSearch(""); setSelectedSpec(null); }}
                    className="bg-background hover:bg-muted border border-border text-primary px-4 py-2 rounded-xl text-xs font-bold transition-all"
                  >
                    عرض كل الكورسات
                  </button>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
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
