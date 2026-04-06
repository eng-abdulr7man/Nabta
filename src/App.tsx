import { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, PlaySquare, Presentation, Mic, ArrowRight, Loader2, Download, ExternalLink } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";

const SubjectMaterialsPage = () => {
  const { id } = useParams(); // ID المادة
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type") || "lecture"; // نوع الملف
  const navigate = useNavigate();

  const [subject, setSubject] = useState<any>(null);
  const [materials, setMaterials] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [id, type]);

  const fetchData = async () => {
    setIsLoading(true);
    
    // جلب اسم المادة
    const { data: subjData } = await supabase.from("subjects").select("*").eq("id", id).single();
    if (subjData) setSubject(subjData);

    // جلب الملفات
    const { data: matData } = await supabase.from("materials").select("*").eq("subject_id", id).eq("type", type).order("created_at", { ascending: true });
    if (matData) setMaterials(matData);
    
    setIsLoading(false);
  };

  const getTypeName = () => {
    switch (type) {
      case "lecture": return "المحاضرات";
      case "section": return "السكاشن العملي";
      case "ppt": return "العروض التقديمية";
      case "record": return "التسجيلات الصوتية";
      default: return "الملفات";
    }
  };

  const getTypeIcon = () => {
    switch (type) {
      case "lecture": return <FileText className="w-6 h-6" />;
      case "section": return <PlaySquare className="w-6 h-6" />;
      case "ppt": return <Presentation className="w-6 h-6" />;
      case "record": return <Mic className="w-6 h-6" />;
      default: return <FileText className="w-6 h-6" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#050806] font-tajawal selection:bg-emerald-500/30" dir="rtl">
      <Navbar />

      <main className="flex-1 pt-28 pb-20 relative z-10">
        {/* إضاءات الخلفية */}
        <div className="absolute top-0 right-0 w-[40vw] h-[40vw] bg-emerald-900/10 blur-[150px] rounded-full pointer-events-none -z-10" />

        <div className="container mx-auto px-4 max-w-4xl">
          
          {/* الهيدر وزرار الرجوع */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-10 bg-gradient-to-l from-[#121A15] to-[#0a0f0c] p-6 rounded-[2rem] border border-white/5 shadow-xl">
            <div className="flex items-center gap-5">
              <button onClick={() => navigate("/library")} className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-emerald-500/10 hover:border-emerald-500/30 hover:text-emerald-400 transition-all">
                <ArrowRight className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-2xl md:text-3xl font-black text-white">{subject?.name || "جاري التحميل..."}</h1>
                <div className="flex items-center gap-2 text-emerald-500 font-bold mt-2">
                  {getTypeIcon()} <span className="text-lg">{getTypeName()}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* قائمة الملفات */}
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {materials.length > 0 ? (
                  materials.map((mat, idx) => (
                    <motion.div
                      key={mat.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#0a0f0c] border border-white/5 hover:border-emerald-500/40 hover:bg-[#121A15] transition-all duration-300 shadow-lg hover:shadow-emerald-500/5"
                    >
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 group-hover:scale-110 transition-transform duration-300">
                          <span className="text-emerald-500">{getTypeIcon()}</span>
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
                            {mat.title}
                          </h3>
                          <p className="text-neutral-500 text-sm mt-1">
                            ملف جاهز للتحميل والمشاهدة
                          </p>
                        </div>
                      </div>

                      <a 
                        href={mat.drive_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="shrink-0"
                      >
                        <Button className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl h-12 px-6 gap-2 font-bold shadow-lg shadow-emerald-900/20 transition-all group-hover:-translate-y-1">
                          <Download className="w-5 h-5" /> تحميل / عرض
                        </Button>
                      </a>
                    </motion.div>
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-24 text-neutral-500 bg-[#0a0f0c] border border-dashed border-white/10 rounded-3xl"
                  >
                    <FileText className="w-20 h-20 mb-6 opacity-20" />
                    <p className="text-xl font-bold text-neutral-400 mb-2">لا توجد ملفات هنا بعد</p>
                    <p className="text-sm text-neutral-600">سيتم إضافة المحتوى قريباً من قبل الإدارة.</p>
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
