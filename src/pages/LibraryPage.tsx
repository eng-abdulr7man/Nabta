import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  Library, Search, Building2, BookOpen, 
  Presentation, Mic, PlaySquare, FileText, X, Sparkles, ChevronDown, Loader2,
  Trash2, Pencil 
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { toast } from "sonner";

const LibraryPage = () => {
  const navigate = useNavigate();
  const [universities, setUniversities] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [selectedUni, setSelectedUni] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState<any | null>(null);

  const [isUniMenuOpen, setIsUniMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // حالة للتحقق من أن المستخدم الحالي هو "أدمن"
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAdminStatus();
    fetchUniversitiesAndSubjects();
  }, []);

  // مراقبة الضغط خارج القائمة المنسدلة
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsUniMenuOpen(false);
      }
    };
    if (isUniMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isUniMenuOpen]);

  // دالة التحقق الحقيقي من الداتابيس لمعرفة إذا كان اليوزر أدمن
  const checkAdminStatus = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        // بنفترض إنك بتخزن بيانات المستخدمين في جدول profiles وفيه عمود role
        const { data, error } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single();
          
        if (!error && data?.role === "admin") {
          setIsAdmin(true); // تفعيل وضع الأدمن
        }
      }
    } catch (error) {
      console.error("Error checking admin status:", error);
    }
  };

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

  const handleDeleteSubject = async (e: React.MouseEvent, id: string, name: string) => {
    e.stopPropagation(); 
    if (!window.confirm(`هل أنت متأكد من حذف مادة "${name}" بجميع ملفاتها؟`)) return;

    try {
      const { error } = await supabase.from("subjects").delete().eq("id", id);
      if (error) throw error;
      
      setSubjects((prev) => prev.filter((subj) => subj.id !== id));
      toast.success("تم حذف المادة بنجاح");
    } catch (error) {
      console.error("Error deleting subject:", error);
      toast.error("حدث خطأ أثناء الحذف");
    }
  };

  const handleEditSubject = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); 
    navigate(`/admin/library?edit=${id}`);
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
        <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-emerald-600/5 blur-[120px] rounded-full pointer-events-none -z-10" />

        <div className="container mx-auto px-4 md:px-8 max-w-7xl">
          
          <div className="text-center max-w-3xl mx-auto mb-12">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-emerald-500 text-sm font-bold mb-6">
              <Library className="w-4 h-4" /> المكتبة الأكاديمية
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl md:text-6xl font-black mb-6 leading-tight">
              كل مراجعك <span className="text-emerald-500">في مكان واحد</span>
            </motion.h1>
          </div>

          <div className="max-w-4xl mx-auto mb-16 px-2 relative z-[100]">
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-0 bg-[#0a0f0c] rounded-[2.5rem] border border-white/10 shadow-2xl overflow-visible backdrop-blur-xl">
              
              <div className="flex-[2] flex items-center gap-4 px-8 py-5 border-b md:border-b-0 md:border-l border-white/5 group">
                <Search className="w-5 h-5 text-emerald-500 transition-transform group-focus-within:scale-110" />
                <input 
                  type="text" 
                  placeholder="ابحث عن مادة..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent border-none outline-none text-white font-bold placeholder:text-neutral-700 text-lg"
                />
              </div>
              
              <div className="flex-1 relative" ref={dropdownRef}>
                <div 
                  onClick={() => setIsUniMenuOpen(!isUniMenuOpen)}
                  className="flex items-center gap-3 px-8 py-5 cursor-pointer hover:bg-white/[0.02] transition-colors h-full"
                >
                  <Building2 className="w-5 h-5 text-emerald-500" />
                  <div className="flex-1 text-right">
                    <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider mb-0.5">الجامعة</p>
                    <p className="text-white font-black text-lg leading-tight truncate max-w-[150px]">
                      {selectedUni === "all" ? "كل الجامعات" : universities.find(u => u.id === selectedUni)?.name}
                    </p>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-emerald-500 transition-transform duration-300 ${isUniMenuOpen ? 'rotate-180' : ''}`} />
                </div>

                <AnimatePresence>
                  {isUniMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute top-full right-0 left-0 mt-3 bg-[#0a0f0c] border border-white/10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.7)] overflow-hidden z-[100] backdrop-blur-2xl p-2"
                    >
                      <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                        <button
                          onClick={() => { setSelectedUni("all"); setIsUniMenuOpen(false); }}
                          className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all mb-1 ${selectedUni === "all" ? "bg-emerald-500/10 text-emerald-400" : "hover:bg-white/5 text-neutral-400 text-right"}`}
                        >
                          <span className="font-bold">كل الجامعات</span>
                          {selectedUni === "all" && <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />}
                        </button>
                        
                        {universities.map((uni) => (
                          <button
                            key={uni.id}
                            onClick={() => { setSelectedUni(uni.id); setIsUniMenuOpen(false); }}
                            className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all mb-1 ${selectedUni === uni.id ? "bg-emerald-500/10 text-emerald-400" : "hover:bg-white/5 text-neutral-400 text-right"}`}
                          >
                            <span className="font-bold">{uni.name}</span>
                            {selectedUni === uni.id && <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20"><Loader2 className="animate-spin text-emerald-500" /></div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredSubjects.map((subj) => (
                <motion.div
                  key={subj.id}
                  whileHover={{ y: -8 }}
                  onClick={() => setSelectedSubject(subj)}
                  className="relative group bg-[#0a0f0c] border border-white/5 rounded-[2.5rem] p-8 cursor-pointer hover:border-emerald-500/40 transition-all duration-500 text-center shadow-xl flex flex-col items-center overflow-hidden"
                >
                  {/* زراير التحكم الثابتة والظاهرة دائماً للأدمن */}
                  {isAdmin && (
                    <div className="absolute top-4 left-4 flex flex-col gap-2 z-20">
                      <button 
                        onClick={(e) => handleDeleteSubject(e, subj.id, subj.name)}
                        className="p-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 transition-all cursor-pointer"
                        title="حذف المادة"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={(e) => handleEditSubject(e, subj.id)}
                        className="p-2.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 border border-blue-500/20 transition-all cursor-pointer"
                        title="تعديل المادة"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/5 flex items-center justify-center border border-emerald-500/10 mb-6 mt-4">
                    <BookOpen className="w-8 h-8 text-emerald-500" />
                  </div>
                  
                  <h3 className="text-xl font-bold mb-4 px-4">{subj.name}</h3>
                  
                  <div className="mt-auto flex flex-col gap-2 items-center w-full">
                    <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 text-xs font-black w-full border border-emerald-500/10">
                      {subj.academic_year || "الفرقة غير محددة"}
                    </span>
                    <p className="text-neutral-500 text-[11px] font-bold uppercase tracking-wider mt-1">
                      {subj.universities?.name || "جامعة عامة"}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>

      <AnimatePresence>
        {selectedSubject && (
          <div className="fixed inset-0 flex items-center justify-center z-[150] px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedSubject(null)} className="absolute inset-0 bg-black/95 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="relative w-full max-w-2xl bg-[#0a0f0c] border border-white/10 rounded-[3.5rem] p-8 md:p-14 shadow-2xl"
            >
              <button onClick={() => setSelectedSubject(null)} className="absolute top-8 left-8 p-3 rounded-2xl bg-white/5 hover:text-rose-400 transition-all"><X className="w-5 h-5" /></button>
              <div className="text-center mb-12">
                <div className="w-20 h-20 rounded-[2rem] bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 mb-8 mx-auto"><Sparkles className="w-10 h-10 text-emerald-500" /></div>
                <h2 className="text-3xl md:text-5xl font-black mb-4">مادة {selectedSubject.name}</h2>
                <p className="text-neutral-500 font-bold uppercase text-xs">اختر القسم المطلوب</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { id: "lecture", label: "المحاضرات", icon: FileText, color: "text-blue-400", bg: "bg-blue-500/10" },
                  { id: "section", label: "السكاشن", icon: PlaySquare, color: "text-emerald-400", bg: "bg-emerald-500/10" },
                  { id: "ppt", label: "البوربوينت", icon: Presentation, color: "text-purple-400", bg: "bg-purple-500/10" },
                  { id: "record", label: "التسجيلات", icon: Mic, color: "text-yellow-400", bg: "bg-yellow-500/10" },
                ].map((item) => (
                  <button key={item.id} onClick={() => handleOpenMaterialType(item.id)} className="flex flex-col items-center gap-4 p-6 rounded-[2.5rem] bg-white/[0.03] border border-white/5 hover:border-emerald-500/30 transition-all group active:scale-95">
                    <div className={`w-14 h-14 rounded-2xl ${item.bg} flex items-center justify-center group-hover:scale-110 transition-all`}><item.icon className={`w-7 h-7 ${item.color}`} /></div>
                    <span className="text-white font-black text-xs md:text-sm">{item.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <Footer />
    </div>
  );
};

export default LibraryPage;
