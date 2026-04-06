import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  Library, Search, Building2, BookOpen, 
  Presentation, Mic, PlaySquare, FileText, X, Sparkles, ChevronDown 
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

      <main className="flex-1 pt-32 pb-20 relative z-10 overflow-x-hidden">
        {/* الخلفية المضيئة */}
        <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-emerald-600/5 blur-[120px] rounded-full pointer-events-none -z-10" />

        <div className="container mx-auto px-4 md:px-8 max-w-7xl">
          
          {/* العنوان الرئيسي */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-emerald-500 text-sm font-bold mb-6">
              <Library className="w-4 h-4" /> المكتبة الأكاديمية
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl md:text-5xl font-black mb-6 leading-tight">
              كل مراجعك الدراسية <span className="text-emerald-500">في مكان واحد</span>
            </motion.h1>
          </div>

          {/* بار البحث والفلترة الاحترافي */}
          <div className="max-w-4xl mx-auto mb-16 px-2">
            <div className="flex flex-col md:flex-row items-center gap-4 bg-[#0a0f0c] p-2 rounded-[2rem] border border-white/5 shadow-2xl">
              <div className="flex-[2] flex items-center gap-3 px-6 py-3 w-full border-b md:border-b-0 md:border-l border-white/5">
                <Search className="w-5 h-5 text-neutral-500" />
                <input 
                  type="text" 
                  placeholder="ابحث عن مادة..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent border-none outline-none text-white font-bold placeholder:text-neutral-600"
                />
              </div>
              
              <div className="flex-1 flex items-center gap-3 px-6 py-3 w-full relative">
                <Building2 className="w-5 h-5 text-neutral-500" />
                <select 
                  value={selectedUni}
                  onChange={(e) => setSelectedUni(e.target.value)}
                  className="w-full bg-transparent border-none outline-none text-neutral-300 font-bold cursor-pointer appearance-none"
                >
                  <option value="all" className="bg-[#0a0f0c]">جميع الجامعات</option>
                  {universities.map(uni => (
                    <option key={uni.id} value={uni.id} className="bg-[#0a0f0c]">{uni.name}</option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-neutral-500 pointer-events-none absolute left-6" />
              </div>
            </div>
          </div>

          {/* شبكة المواد */}
          {isLoading ? (
            <div className="flex justify-center py-20"><Loader2 /></div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredSubjects.map((subj, idx) => (
                <motion.div
                  key={subj.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => setSelectedSubject(subj)}
                  className="group bg-[#0a0f0c] border border-white/5 rounded-[2.5rem] p-8 cursor-pointer hover:border-emerald-500/40 transition-all duration-500 hover:-translate-y-2 text-center"
                >
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/5 flex items-center justify-center border border-emerald-500/10 mb-6 mx-auto group-hover:bg-emerald-500/20 transition-colors">
                    <BookOpen className="w-8 h-8 text-emerald-500" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-emerald-400 transition-colors">{subj.name}</h3>
                  <p className="text-neutral-500 text-sm font-bold">{subj.universities?.name || "عام"}</p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* الـ Popup المحسن والمنظم */}
      <AnimatePresence>
        {selectedSubject && (
          <div className="fixed inset-0 flex items-center justify-center z-[150] px-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedSubject(null)}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-[#0a0f0c] border border-white/10 rounded-[3rem] p-8 md:p-12 shadow-[0_0_50px_rgba(0,0,0,0.5)]"
            >
              <button 
                onClick={() => setSelectedSubject(null)} 
                className="absolute top-8 left-8 p-3 rounded-2xl bg-white/5 hover:bg-rose-500/10 hover:text-rose-400 text-neutral-400 transition-all"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-12">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 mb-6 mx-auto">
                  <Sparkles className="w-8 h-8 text-emerald-500" />
                </div>
                <h2 className="text-3xl md:text-4xl font-black mb-3">مادة {selectedSubject.name}</h2>
                <p className="text-neutral-500 font-bold uppercase tracking-widest text-sm">اختر القسم المطلوب</p>
              </div>

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
                    className="flex flex-col items-center justify-center gap-4 p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:border-white/20 transition-all duration-300 group active:scale-95"
                  >
                    <div className={`w-14 h-14 rounded-2xl ${item.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <item.icon className={`w-6 h-6 ${item.color}`} />
                    </div>
                    <span className="text-white font-bold text-sm md:text-base">{item.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Loader2 = () => (
  <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
);

export default LibraryPage;
