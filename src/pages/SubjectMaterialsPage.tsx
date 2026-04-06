import { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, PlaySquare, Presentation, Mic, ArrowRight, Loader2, Download, Sparkles } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";

const SubjectMaterialsPage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type") || "lecture";
  const navigate = useNavigate();

  const [subject, setSubject] = useState<any>(null);
  const [materials, setMaterials] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [id, type]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const { data: subjData } = await supabase.from("subjects").select("*").eq("id", id).single();
      if (subjData) setSubject(subjData);

      const { data: matData } = await supabase.from("materials").select("*").eq("subject_id", id).eq("type", type).order("created_at", { ascending: true });
      if (matData) setMaterials(matData);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const config = {
    lecture: { name: "المحاضرات", icon: FileText, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
    section: { name: "السكاشن العملي", icon: PlaySquare, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
    ppt: { name: "العروض (PPT)", icon: Presentation, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
    record: { name: "التسجيلات", icon: Mic, color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20" },
  }[type as keyof typeof config] || { name: "الملفات", icon: FileText, color: "text-white", bg: "bg-white/10", border: "border-white/20" };

  return (
    <div className="min-h-screen flex flex-col bg-[#050806] font-tajawal selection:bg-emerald-500/30" dir="rtl">
      <Navbar />

      <main className="flex-1 pt-28 pb-20 relative px-4 overflow-x-hidden">
        {/* إضاءات خلفية خافتة */}
        <div className="absolute top-0 right-0 w-[60vw] h-[60vw] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-5xl mx-auto">
          
          {/*Header Section */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate("/library")} className="group w-12 h-12 rounded-2xl bg-[#0a0f0c] border border-white/5 flex items-center justify-center hover:border-emerald-500/40 transition-all shadow-xl">
                <ArrowRight className="w-6 h-6 group-hover:text-emerald-400 transition-colors" />
              </button>
              <div>
                <h1 className="text-2xl md:text-4xl font-black text-white">{subject?.name || "..."}</h1>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`${config.bg} ${config.color} px-3 py-1 rounded-lg text-sm font-bold border ${config.border}`}>
                    {config.name}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/*Materials Grid */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
              <p className="text-neutral-500 animate-pulse">جاري تحضير الملفات...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <AnimatePresence>
                {materials.length > 0 ? (
                  materials.map((mat, idx) => (
                    <motion.div
                      key={mat.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      className="relative group p-1 rounded-[2rem] bg-gradient-to-br from-white/5 to-transparent border border-white/5 hover:border-emerald-500/30 transition-all duration-500"
                    >
                      <div className="bg-[#0a0f0c] rounded-[1.9rem] p-5 md:p-6 h-full flex flex-col">
                        <div className="flex items-start justify-between mb-6">
                          <div className={`w-14 h-14 rounded-2xl ${config.bg} border ${config.border} flex items-center justify-center group-hover:scale-110 transition-transform duration-500`}>
                            <config.icon className={`w-7 h-7 ${config.color}`} />
                          </div>
                          <Sparkles className="w-5 h-5 text-neutral-800 group-hover:text-emerald-500/40 transition-colors" />
                        </div>

                        <h3 className="text-lg md:text-xl font-bold text-white mb-2 leading-snug group-hover:text-emerald-400 transition-colors">
                          {mat.title}
                        </h3>
                        <p className="text-neutral-500 text-sm mb-8 line-clamp-2">
                          جاهز للعرض والتحميل المباشر. اضغط على الزر أدناه للوصول للمحتوى.
                        </p>

                        <div className="mt-auto">
                          <a href={mat.drive_url} target="_blank" rel="noopener noreferrer">
                            <Button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl h-14 text-base font-black shadow-lg shadow-emerald-900/20 flex items-center gap-3 transition-all active:scale-95">
                              تحميل الملف <Download className="w-5 h-5" />
                            </Button>
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="col-span-full py-20 bg-[#0a0f0c] border-2 border-dashed border-white/5 rounded-[3rem] flex flex-col items-center justify-center text-center px-6">
                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                      <config.icon className="w-10 h-10 text-neutral-700" />
                    </div>
                    <h3 className="text-xl font-bold text-neutral-300 mb-2">القسم فارغ حالياً</h3>
                    <p className="text-neutral-500 max-w-sm">سيقوم الأدمن برفع {config.name} في أقرب وقت ممكن. انتظرونا!</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default SubjectMaterialsPage;
