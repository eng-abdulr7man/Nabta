import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  Library, Search, Building2, BookOpen, 
  Presentation, Mic, PlaySquare, FileText, X, Sparkles, ChevronDown, Loader2 
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const LibraryPage = () => {
  const navigate = useNavigate();
  const [universities, setUniversities] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [selectedUni, setSelectedUni] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState<any | null>(null);

  useEffect(() => {
    fetchUniversitiesAndSubjects();
  }, []);

  const fetchUniversitiesAndSubjects = async () => {
    setIsLoading(true);
    try {
      const { data: uniData } = await supabase.from("universities").select("*");
      if (uniData) setUniversities(uniData);

      const { data: subjData } = await supabase.from("subjects").select("*, universities(name)");
      if (subjData) setSubjects(subjData);
    } catch (error) {
      console.error("Error fetching library data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredSubjects = subjects.filter(subj => {
    const matchesUni = selectedUni === "all" || subj.university_id === selectedUni;
    const matchesSearch = subj.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesUni && matchesSearch;
  });

  const handleOpenMaterialType = (type: string) => {
    if (!selectedSubject) return;
    navigate(`/library/${selectedSubject.id}?type=${type}`);
    setSelectedSubject(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#050806] font-tajawal selection:bg-emerald-500/30 text-white" dir="rtl">
      <Navbar />

      <main className="flex-1 pt-32 pb-20 relative z-10 overflow-x-hidden">
        {/* إضاءات خلفية ديكورية خافتة */}
        <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-emerald-600/5 blur-[120px] rounded-full pointer-events-none -z-10" />

        <div className="container mx-auto px-4 md:px-8 max-w-7xl">
          
          {/* العنوان الرئيسي */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-emerald-500 text-sm font-bold mb-6">
              <Library className="w-4 h-4" /> المكتبة الأكاديمية المجانية
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl md:text-6xl font-black mb-6 leading-tight">
              كل مراجعك الدراسية <span className="text-emerald-500">في مكان واحد</span>
            </motion.h1>
          </div>

          {/* بار البحث والفلترة الاحترافي المعدل */}
          <div className="max-w-4xl mx-auto mb-16 px-2">
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-0 bg-[#0a0f0c] rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden backdrop-blur-xl">
              
              {/* حقل البحث */}
              <div className="flex-[2] flex items-center gap-4 px-8 py-5 border-b md:border-b-0 md:border-l border-white/5 group transition-colors hover:bg-white/[0.01]">
                <Search className="w-5 h-5 text-emerald-500 group-focus-within:scale-110 transition-transform" />
                <input 
                  type="text" 
                  placeholder="ابحث عن مادة..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent border-none outline-none text-white font-bold placeholder:text-neutral-700 text-lg"
                />
              </div>
              
              {/* القائمة المنسدلة المحسنة */}
              <div className="flex-1 relative group transition-colors hover:bg-white/[0.02]">
                <div className="flex items-center gap-3 px-8 py-5 cursor-pointer">
                  <Building2 className="w-5 h-5 text-emerald-500" />
                  <div className="flex-1">
                    <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider mb-0.5">الجامعة</p>
                    <select 
                      value={selectedUni}
                      onChange={(e) => setSelectedUni(e.target.value)}
                      className="w-full bg-transparent border-none outline-none text-white font-black cursor-pointer appearance-none pr-0 leading-tight focus:ring-0"
                    >
                      <option value="all" className="bg-[#0a0f0c] text-white">كل الجامعات</option>
                      {universities.map(uni => (
                        <option key={uni.id} value={uni.id} className="bg-[#0a0f0c] text-white">
                          {uni.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <ChevronDown className="w-5 h-5 text-emerald-500 group-hover:translate-y-0.5 transition-transform shrink-0" />
                </div>
              </div>
            </div>
          </div>

          {/* شبكة المواد */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
              <p className="text-neutral-500 font-bold">بنجيبلك المواد...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredSubjects.map((subj, idx) => (
                <motion.div
                  key={subj.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => setSelectedSubject(subj)}
                  className="group bg-[#0a0f0c] border border-white/5 rounded-[2.5rem] p-8 cursor-pointer hover:border-emerald-500/40 hover:bg-[#0d130f] transition-all duration-500 hover:-translate-y-2 text-center shadow-lg"
                >
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/5 flex items-center justify-center border border-emerald-500/10 mb-6 mx-auto group-hover:scale-110 transition-transform">
                    <BookOpen className="w-8 h-8 text-emerald-500" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-emerald-400 transition-colors line-clamp-1">{subj.name}</h3>
                  <div className="flex flex-col gap-1">
                    <p className="text-neutral-500 text-xs font-bold uppercase">{subj.universities?.name || "عام"}</p>
                    <p className="text-emerald-500/60 text-[10px] font-black">{subj.academic_year}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* الـ Popup المحسن المتمركز 100% */}
      <AnimatePresence>
        {selectedSubject && (
          <div className="fixed inset-0 flex items-center justify-center z-[150] px-4">
            {/* الخلفية المعتمة */}
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedSubject(null)}
              className="absolute inset-0 bg-black/95 backdrop-blur-md"
            />
            
            {/* جسم النافذة */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 30 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="relative w-full max-w-2xl bg-[#0a0f0c] border border-white/10 rounded-[3.5rem] p-8 md:p-14 shadow-[0_0_80px_rgba(0,0,0,0.8)] overflow-hidden"
            >
              {/* زر الإغلاق المحسن */}
              <button 
                onClick={() => setSelectedSubject(null)} 
                className="absolute top-8 left-8 p-4 rounded-2xl bg-white/5 hover:bg-rose-500/10 hover:text-rose-400 text-neutral-400 transition-all active:scale-90"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-12">
                <div className="w-20 h-20 rounded-[2rem] bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 mb-8 mx-auto shadow-2xl">
                  <Sparkles className="w-10 h-10 text-emerald-500 animate-pulse" />
                </div>
                <h2 className="text-3xl md:text-5xl font-black mb-4 leading-tight">مادة {selectedSubject.name}</h2>
                <p className="text-neutral-500 font-bold uppercase tracking-widest text-xs md:text-sm">اختر القسم الذي تود مراجعته الآن</p>
              </div>

              {/* شبكة الأقسام المتجاوبة */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {[
                  { id: "lecture", label: "المحاضرات", icon: FileText, color: "text-blue-400", bg: "bg-blue-500/10" },
                  { id: "section", label: "السكاشن", icon: PlaySquare, color: "text-emerald-400", bg: "bg-emerald-500/10" },
                  { id: "ppt", label: "العروض", icon: Presentation, color: "text-purple-400", bg: "bg-purple-500/10" },
                  { id: "record", label: "التسجيلات", icon: Mic, color: "text-yellow-400", bg: "bg-yellow-500/10" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleOpenMaterialType(item.id)}
                    className="flex flex-col items-center justify-center gap-5 p-6 md:p-10 rounded-[2.5rem] bg-white/[0.03] border border-white/5 hover:border-emerald-500/30 transition-all duration-500 group active:scale-95"
                  >
                    <div className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl ${item.bg} flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                      <item.icon className={`w-7 h-7 md:w-8 md:h-8 ${item.color}`} />
                    </div>
                    <span className="text-white font-black text-xs md:text-sm">{item.label}</span>
                  </button>
                ))}
              </div>

              {/* شعار نبتة الصغير أسفل الـ Popup */}
              <div className="mt-14 text-center">
                <span className="text-[10px] text-neutral-800 font-black uppercase tracking-[0.3em]">Nabta Academy</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LibraryPage;
