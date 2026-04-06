import { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, PlaySquare, Presentation, Mic, ArrowRight, Loader2, ExternalLink } from "lucide-react";
import Navbar from "@/components/layout/Navbar";

const SubjectMaterialsPage = () => {
  const { id } = useParams(); // ID المادة
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type") || "lecture"; // نوع الملف (محاضرة، سكشن، الخ)
  const navigate = useNavigate();

  const [subject, setSubject] = useState<any>(null);
  const [materials, setMaterials] = useState<any[]>([]);
  const [activeMaterial, setActiveMaterial] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // دالة لتحويل رابط درايف العادي لرابط عرض مدمج (Preview)
  const getEmbedUrl = (url: string) => {
    if (!url) return "";
    if (url.includes("drive.google.com")) {
      return url.replace(/\/view.*$/, "/preview");
    }
    return url;
  };

  useEffect(() => {
    fetchData();
  }, [id, type]);

  const fetchData = async () => {
    setIsLoading(true);
    
    // جلب اسم المادة
    const { data: subjData } = await supabase.from("subjects").select("*").eq("id", id).single();
    if (subjData) setSubject(subjData);

    // جلب الملفات المربوطة بالمادة دي وبنفس النوع المختار
    const { data: matData } = await supabase.from("materials").select("*").eq("subject_id", id).eq("type", type).order("created_at", { ascending: true });
    
    if (matData) {
      setMaterials(matData);
      if (matData.length > 0) setActiveMaterial(matData[0]); // فتح أول ملف تلقائياً
    }
    
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
      case "lecture": return <FileText className="w-5 h-5" />;
      case "section": return <PlaySquare className="w-5 h-5" />;
      case "ppt": return <Presentation className="w-5 h-5" />;
      case "record": return <Mic className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#050806] font-tajawal selection:bg-emerald-500/30" dir="rtl">
      <Navbar />

      <main className="flex-1 pt-24 pb-12 flex flex-col h-screen overflow-hidden">
        <div className="container mx-auto px-4 h-full flex flex-col">
          
          {/* الهيدر وزرار الرجوع */}
          <div className="flex items-center justify-between mb-6 shrink-0 bg-[#0a0f0c] p-4 rounded-2xl border border-white/5 shadow-lg">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate("/library")} className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 hover:text-emerald-400 transition-colors">
                <ArrowRight className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl md:text-2xl font-black text-white">{subject?.name || "جاري التحميل..."}</h1>
                <div className="flex items-center gap-2 text-emerald-500 text-sm font-bold mt-1">
                  {getTypeIcon()} <span>{getTypeName()}</span>
                </div>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="flex-1 flex justify-center items-center">
              <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
            </div>
          ) : (
            <div className="flex-1 flex flex-col lg:flex-row gap-6 overflow-hidden pb-4">
              
              {/* القائمة الجانبية (لستة الملفات) */}
              <div className="w-full lg:w-80 shrink-0 flex flex-col gap-3 overflow-y-auto custom-scrollbar pr-2 pb-4 h-full">
                {materials.length > 0 ? (
                  materials.map((mat) => (
                    <button
                      key={mat.id}
                      onClick={() => setActiveMaterial(mat)}
                      className={`flex items-start gap-3 p-4 rounded-2xl transition-all text-right border ${
                        activeMaterial?.id === mat.id 
                        ? "bg-emerald-600/20 border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.15)]" 
                        : "bg-[#0a0f0c] border-white/5 hover:border-emerald-500/30 hover:bg-white/5"
                      }`}
                    >
                      <div className={`mt-1 shrink-0 ${activeMaterial?.id === mat.id ? "text-emerald-400" : "text-neutral-500"}`}>
                        {getTypeIcon()}
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-bold text-sm ${activeMaterial?.id === mat.id ? "text-white" : "text-neutral-300"}`}>
                          {mat.title}
                        </h3>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="text-center p-8 bg-[#0a0f0c] rounded-2xl border border-dashed border-white/10">
                    <p className="text-neutral-500 text-sm">لا توجد ملفات متوفرة في هذا القسم حالياً.</p>
                  </div>
                )}
              </div>

              {/* شاشة العرض المدمجة (Iframe) */}
              <div className="flex-1 bg-[#0a0f0c] border border-white/5 rounded-3xl overflow-hidden shadow-2xl relative flex flex-col h-[50vh] lg:h-auto">
                <AnimatePresence mode="wait">
                  {activeMaterial ? (
                    <motion.div
                      key={activeMaterial.id}
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="w-full h-full flex flex-col"
                    >
                      <div className="h-12 bg-[#121A15] border-b border-white/5 flex items-center justify-between px-4 shrink-0">
                        <span className="font-bold text-sm text-neutral-300 truncate pl-4">{activeMaterial.title}</span>
                        <a href={activeMaterial.drive_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs font-bold text-emerald-500 hover:text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg transition-colors">
                          فتح في نافذة خارجية <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                      
                      {/* الشاشة نفسها */}
                      <div className="flex-1 w-full bg-[#1a201c] relative">
                        <iframe 
                          src={getEmbedUrl(activeMaterial.drive_url)} 
                          className="absolute inset-0 w-full h-full border-none"
                          allow="autoplay"
                        ></iframe>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-neutral-600">
                      <FileText className="w-16 h-16 mb-4 opacity-20" />
                      <p>اختر ملفاً من القائمة لعرضه هنا</p>
                    </div>
                  )}
                </AnimatePresence>
              </div>

            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default SubjectMaterialsPage;
