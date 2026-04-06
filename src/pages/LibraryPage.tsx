import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  Library, Search, Building2, BookOpen, 
  Presentation, Mic, PlaySquare, FileText, X, Sparkles, GraduationCap 
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
    const { data: uniData } = await supabase.from("universities").select("*");
    if (uniData) setUniversities(uniData);

    const { data: subjData } = await supabase.from("subjects").select("*, universities(name)");
    if (subjData) setSubjects(subjData);
    setIsLoading(false);
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

      <main className="flex-1 pt-24 pb-20 relative z-10 overflow-x-hidden">
        {/* إضاءات الخلفية الديكورية */}
        <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-emerald-900/10 blur-[150px] rounded-full pointer-events-none -z-10" />
        <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-blue-900/10 blur-[150px] rounded-full pointer-events-none -z-10" />

        <div className="container mx-auto px-4 md:px-8 max-w-7xl">
          
          {/* Header & Search Section */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-bold mb-6">
              <Library className="w-4 h-4" /> المكتبة الأكاديمية الرقمية
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl md:text-6xl font-black mb-6 leading-tight">
              ابحث عن <span className="text-emerald-500 underline decoration-emerald-500/30 underline-offset-8">مادتك</span> الدراسية
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-neutral-400 text-lg mb-10 px-4">
              كل ما تحتاجه من محاضرات وسكاشن في مكان واحد منظم وسريع.
            </motion.p>

            {/* Filters Bar */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex flex-col md:flex-row items-stretch md:items-center gap-4 bg-[#0a0f0c]/80 backdrop-blur-xl p-3 rounded-[2rem] border border-white/5 shadow-2xl mx-4">
              <div className="flex-1 flex items-center gap-3 px-4 py-2">
                <Search className="w-5 h-5 text-emerald-500 shrink-0" />
                <input 
                  type="text" 
                  placeholder="ابحث بالاسم (وراثة، كيمياء...)" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent border-none outline-none text-white placeholder:text-neutral-600 font-bold"
                />
              </div>
              <div className="hidden md:block w-px h-8 bg-white/10" />
              <div className="flex-1 flex items-center gap-3 px-4 py-2">
                <Building2 className="w-5 h-5 text-emerald-500 shrink-0" />
                <select 
                  value={selectedUni}
                  onChange={(e) => setSelectedUni(e.target.value)}
                  className="w-full bg-transparent border-none outline-none text-neutral-300 cursor-pointer appearance-none font-bold"
                >
                  <option value="all" className="bg-[#121A15]">جميع الجامعات</option>
                  {universities.map(uni => (
                    <option key={uni.id} value={uni.id} className="bg-[#121A15]">{uni.name}</option>
                  ))}
                </select>
              </div>
            </motion.div>
          </div>

          {/* Subjects Grid */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
              <p className="text-neutral-500 animate-pulse font-bold">بنحضرلك المكتبة...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <AnimatePresence>
                {filteredSubjects.map((subj, idx) => (
                  <motion.div
                    key={subj.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => setSelectedSubject(subj)}
                    className="group relative bg-[#0a0f0c] border border-white/5 hover:border-emerald-500/40 rounded-[2.5rem] p-8 cursor-pointer transition-all duration-500 hover:-translate-y-3 shadow-xl flex flex-col items-center text-center overflow-hidden"
                  >
                    {/* Hover Glow */}
                    <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 mb-6 group-hover:rotate-6 transition-transform duration-500">
                      <BookOpen className="w-10 h-10 text-emerald-400" />
                    </div>
                    
                    <h3 className="text-2xl font-black mb-3 group-hover:text-emerald-400 transition-colors line-clamp-1">{subj.name}</h3>
                    
                    <div className="flex flex-col gap-2">
                      <span className="px-4 py-1.5 rounded-full bg-white/5 border border-white/5 text-neutral-400 text-xs font-bold">
                        {subj.universities?.name || "جامعة عامة"}
                      </span>
                      <span className="text-emerald-500/80 text-xs font-black uppercase tracking-widest italic">
                        {subj.academic_year}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* ========================================= */}
      {/* PopUp Modal - النسخة المحسنة Responsev 100% */}
      {/* ========================================= */}
      <AnimatePresence>
        {selectedSubject && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedSubject(null)}
              className="fixed inset-0 bg-black/95 backdrop-blur-md z-[110]"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 50 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-4xl bg-[#0a0f0c] border border-white/10 rounded-[3rem] p-8 md:p-12 z-[120] shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-y-auto max-h-[95vh] custom-scrollbar"
            >
              <button 
                onClick={() => setSelectedSubject(null)} 
                className="absolute top-6 left-6 p-3 rounded-2xl bg-white/5 hover:bg-rose-500/20 hover:text-rose-400 text-neutral-400 transition-all active:scale-90"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="text-center mb-12 mt-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-[1.5rem] bg-emerald-500/10 border border-emerald-500/20 mb-6">
                  <Sparkles className="w-8 h-8 text-emerald-500" />
                </div>
                <h2 className="text-3xl md:text-5xl font-black mb-4">مادة {selectedSubject.name}</h2>
                <p className="text-neutral-500 text-lg font-medium">اختر القسم الذي تريد الوصول إليه</p>
              </div>

              {/* Grid الأقسام - متجاوب 100% */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {[
                  { id: "lecture", label: "المحاضرات", icon: FileText, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
                  { id: "section", label: "السكاشن", icon: PlaySquare, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
                  { id: "ppt", label: "البوربوينت", icon: Presentation, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
                  { id: "record", label: "التسجيلات", icon: Mic, color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleOpenMaterialType(item.id)}
                    className="group relative flex flex-col items-center justify-center gap-5 p-6 md:p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/5 transition-all duration-500 hover:border-white/20 hover:-translate-y-2 active:scale-95 min-h-[160px] md:min-h-[220px] overflow-hidden"
                  >
                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-b from-transparent via-white/[0.02] to-white/[0.05]`} />
                    
                    <div className={`w-14 h-14 md:w-20 md:h-20 rounded-[1.5rem] ${item.bg} border ${item.border} flex items-center justify-center group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(255,255,255,0.05)] transition-all duration-500 z-10`}>
                      <item.icon className={`w-7 h-7 md:w-10 md:h-10 ${item.color}`} />
                    </div>
                    
                    <span className="text-white font-black text-sm md:text-lg z-10">
                      {item.label}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LibraryPage;
