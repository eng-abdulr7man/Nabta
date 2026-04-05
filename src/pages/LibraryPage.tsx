import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  Library, Search, Building2, BookOpen, 
  Presentation, Mic, PlaySquare, FileText, X, Sparkles 
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

  // States for Popup (Modal)
  const [selectedSubject, setSelectedSubject] = useState<any | null>(null);

  useEffect(() => {
    fetchUniversitiesAndSubjects();
  }, []);

  const fetchUniversitiesAndSubjects = async () => {
    setIsLoading(true);
    // 1. جلب الجامعات
    const { data: uniData } = await supabase.from("universities").select("*");
    if (uniData) setUniversities(uniData);

    // 2. جلب المواد
    const { data: subjData } = await supabase.from("subjects").select("*, universities(name)");
    if (subjData) setSubjects(subjData);
    
    setIsLoading(false);
  };

  // فلترة المواد حسب الجامعة والبحث
  const filteredSubjects = subjects.filter(subj => {
    const matchesUni = selectedUni === "all" || subj.university_id === selectedUni;
    const matchesSearch = subj.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesUni && matchesSearch;
  });

  // دالة فتح القسم المحدد جوه المادة
  const handleOpenMaterialType = (type: string) => {
    if (!selectedSubject) return;
    // هيروح لصفحة المادة ويبعت نوع القسم في الرابط (هنعمل الصفحة دي الخطوة الجاية)
    navigate(`/library/${selectedSubject.id}?type=${type}`);
    setSelectedSubject(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#050806] font-tajawal selection:bg-emerald-500/30" dir="rtl">
      <Navbar />

      <main className="flex-1 pt-24 pb-20 relative z-10">
        {/* إضاءات الخلفية */}
        <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-emerald-900/10 blur-[150px] rounded-full pointer-events-none -z-10" />
        <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-blue-900/10 blur-[150px] rounded-full pointer-events-none -z-10" />

        <div className="container mx-auto px-4 md:px-8 max-w-7xl">
          
          {/* ========================================= */}
          {/* الهيدر وشريط البحث */}
          {/* ========================================= */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-bold mb-6">
              <Library className="w-4 h-4" /> المكتبة الأكاديمية المجانية
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
              كل ماتحتاجه للتفوق في <span className="text-emerald-500">كليتك</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-neutral-400 text-lg mb-10">
              محاضرات، سكاشن، وتسجيلات لمختلف المواد الزراعية مصنفة حسب جامعتك.
            </motion.p>

            {/* الفلاتر */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex flex-col md:flex-row items-center gap-4 bg-[#0a0f0c] p-2 rounded-2xl border border-white/5 shadow-2xl">
              <div className="flex-1 flex items-center gap-3 px-4 w-full">
                <Search className="w-5 h-5 text-neutral-500 shrink-0" />
                <input 
                  type="text" 
                  placeholder="ابحث عن مادة (مثال: وراثة، كيمياء...)" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent border-none outline-none text-white py-3 placeholder:text-neutral-600"
                />
              </div>
              <div className="w-full md:w-px h-px md:h-10 bg-white/10" />
              <div className="flex-1 flex items-center gap-3 px-4 w-full">
                <Building2 className="w-5 h-5 text-neutral-500 shrink-0" />
                <select 
                  value={selectedUni}
                  onChange={(e) => setSelectedUni(e.target.value)}
                  className="w-full bg-transparent border-none outline-none text-neutral-300 py-3 cursor-pointer appearance-none"
                >
                  <option value="all" className="bg-[#121A15]">جميع الجامعات</option>
                  {universities.map(uni => (
                    <option key={uni.id} value={uni.id} className="bg-[#121A15]">{uni.name}</option>
                  ))}
                </select>
              </div>
            </motion.div>
          </div>

          {/* ========================================= */}
          {/* شبكة المواد (Grid) */}
          {/* ========================================= */}
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
            </div>
          ) : filteredSubjects.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredSubjects.map((subj, idx) => (
                <motion.div
                  key={subj.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => setSelectedSubject(subj)}
                  className="group bg-gradient-to-b from-[#0a0f0c] to-[#121A15] border border-white/5 hover:border-emerald-500/40 rounded-[2rem] p-6 cursor-pointer hover:-translate-y-2 transition-all duration-300 shadow-lg hover:shadow-emerald-500/10 flex flex-col items-center text-center relative overflow-hidden"
                >
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 mb-5 group-hover:scale-110 transition-transform">
                    <BookOpen className="w-8 h-8 text-emerald-500" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">{subj.name}</h3>
                  <div className="flex items-center gap-2 text-xs text-neutral-500 font-bold">
                    <span>{subj.academic_year}</span>
                    <span className="w-1 h-1 rounded-full bg-neutral-700" />
                    <span>{subj.universities?.name || "عام"}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-neutral-500 bg-[#0a0f0c] border border-dashed border-white/10 rounded-3xl">
              <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-20" />
              <p className="text-lg">لا توجد مواد مطابقة لبحثك حالياً.</p>
            </div>
          )}

        </div>
      </main>

      <Footer />

      {/* ========================================= */}
      {/* النافذة المنبثقة (Popup Modal) */}
      {/* ========================================= */}
      <AnimatePresence>
        {selectedSubject && (
          <>
            {/* خلفية سوداء ضبابية */}
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedSubject(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
            />
            
            {/* جسم الـ Popup */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-2xl bg-gradient-to-br from-[#121A15] to-[#0a0f0c] border border-white/10 rounded-[2rem] p-6 md:p-8 z-[101] shadow-2xl overflow-hidden"
            >
              {/* إضاءة ديكور */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-50" />
              
              <button onClick={() => setSelectedSubject(null)} className="absolute top-6 left-6 p-2 rounded-xl bg-white/5 hover:bg-rose-500/20 hover:text-rose-400 text-neutral-400 transition-colors">
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-8 mt-2">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4">
                  <Sparkles className="w-5 h-5 text-emerald-500" />
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-white mb-2">مادة {selectedSubject.name}</h2>
                <p className="text-neutral-400 text-sm">اختر القسم الذي تريد تصفحه لتطوير مهاراتك.</p>
              </div>

              {/* أزرار الأقسام الـ 4 */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { id: "lecture", label: "المحاضرات", icon: FileText, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20", hover: "hover:border-blue-500/50 hover:shadow-blue-500/20" },
                  { id: "section", label: "السكاشن العملي", icon: PlaySquare, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", hover: "hover:border-emerald-500/50 hover:shadow-emerald-500/20" },
                  { id: "ppt", label: "العروض (PPT)", icon: Presentation, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20", hover: "hover:border-purple-500/50 hover:shadow-purple-500/20" },
                  { id: "record", label: "التسجيلات", icon: Mic, color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20", hover: "hover:border-yellow-500/50 hover:shadow-yellow-500/20" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleOpenMaterialType(item.id)}
                    className={`flex flex-col items-center justify-center gap-3 p-6 rounded-2xl bg-[#0a0f0c] border border-white/5 transition-all duration-300 shadow-lg ${item.hover} group relative overflow-hidden`}
                  >
                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-b from-transparent to-${item.color.split('-')[1]}-900/10`} />
                    <div className={`w-14 h-14 rounded-full ${item.bg} border ${item.border} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 relative z-10`}>
                      <item.icon className={`w-6 h-6 ${item.color}`} />
                    </div>
                    <span className="text-white font-bold text-sm relative z-10">{item.label}</span>
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
