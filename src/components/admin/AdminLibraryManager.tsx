import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Building2, BookOpen, FileText, Plus, Loader2, Link as LinkIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const AdminLibraryManager = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  // داتا الداتا بيز للعرض في القوائم المنسدلة
  const [universities, setUniversities] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);

  // 1. حالات (States) إضافة جامعة
  const [uniName, setUniName] = useState("");

  // 2. حالات إضافة مادة
  const [subjName, setSubjName] = useState("");
  const [subjYear, setSubjYear] = useState("الفرقة الأولى");
  const [selectedUniId, setSelectedUniId] = useState("");

  // 3. حالات إضافة ملف
  const [matTitle, setMatTitle] = useState("");
  const [matType, setMatType] = useState("lecture");
  const [matDriveUrl, setMatDriveUrl] = useState("");
  const [selectedSubjId, setSelectedSubjId] = useState("");

  // جلب البيانات عند فتح الصفحة
  useEffect(() => {
    fetchUniversities();
    fetchSubjects();
  }, []);

  const fetchUniversities = async () => {
    const { data } = await supabase.from("universities").select("*").order("created_at", { ascending: false });
    if (data) setUniversities(data);
  };

  const fetchSubjects = async () => {
    const { data } = await supabase.from("subjects").select("*").order("created_at", { ascending: false });
    if (data) setSubjects(data);
  };

  // --- دوال الإضافة ---
  const handleAddUniversity = async () => {
    if (!uniName.trim()) return toast.error("أدخل اسم الجامعة");
    setIsLoading(true);
    const { error } = await supabase.from("universities").insert([{ name: uniName.trim() }]);
    setIsLoading(false);
    
    if (error) {
      toast.error("حدث خطأ أثناء إضافة الجامعة");
    } else {
      toast.success("تمت إضافة الجامعة بنجاح 🏛️");
      setUniName("");
      fetchUniversities(); // تحديث القائمة
    }
  };

  const handleAddSubject = async () => {
    if (!subjName.trim() || !selectedUniId) return toast.error("أكمل بيانات المادة واختيار الجامعة");
    setIsLoading(true);
    const { error } = await supabase.from("subjects").insert([
      { name: subjName.trim(), academic_year: subjYear, university_id: selectedUniId }
    ]);
    setIsLoading(false);

    if (error) {
      toast.error("حدث خطأ أثناء إضافة المادة");
    } else {
      toast.success("تمت إضافة المادة بنجاح 📚");
      setSubjName("");
      fetchSubjects(); // تحديث القائمة
    }
  };

  const handleAddMaterial = async () => {
    if (!matTitle.trim() || !matDriveUrl.trim() || !selectedSubjId) {
      return toast.error("أكمل جميع بيانات الملف والرابط");
    }
    setIsLoading(true);
    const { error } = await supabase.from("materials").insert([
      { title: matTitle.trim(), type: matType, drive_url: matDriveUrl.trim(), subject_id: selectedSubjId }
    ]);
    setIsLoading(false);

    if (error) {
      toast.error("حدث خطأ أثناء رفع الملف");
    } else {
      toast.success("تم رفع الملف للمكتبة بنجاح 🚀");
      setMatTitle("");
      setMatDriveUrl("");
    }
  };

  return (
    <div className="bg-[#050806] min-h-screen text-white p-6 md:p-12 font-tajawal" dir="rtl">
      <div className="max-w-5xl mx-auto space-y-12">
        
        {/* هيدر الصفحة */}
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-3 mb-2">
            <BookOpen className="text-emerald-500 w-8 h-8" /> إدارة المكتبة الأكاديمية
          </h1>
          <p className="text-neutral-400">من هنا يمكنك تنظيم الجامعات، المواد، ورفع ملفات الدرايف للطلاب.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* ========================================= */}
          {/* 1. قسم إضافة جامعة */}
          {/* ========================================= */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#0a0f0c] p-6 rounded-3xl border border-white/5 shadow-xl h-fit">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                <Building2 className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold">1. إضافة جامعة</h3>
            </div>
            
            <div className="space-y-4">
              <input 
                type="text" 
                placeholder="مثال: جامعة المنصورة" 
                value={uniName} 
                onChange={(e) => setUniName(e.target.value)}
                className="w-full bg-[#121A15] border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-colors"
              />
              <Button onClick={handleAddUniversity} disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-xl h-12">
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Plus className="w-4 h-4 ml-2" /> حفظ الجامعة</>}
              </Button>
            </div>
          </motion.div>

          {/* ========================================= */}
          {/* 2. قسم إضافة مادة */}
          {/* ========================================= */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-[#0a0f0c] p-6 rounded-3xl border border-white/5 shadow-xl h-fit">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                <BookOpen className="w-5 h-5 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold">2. إضافة مادة</h3>
            </div>
            
            <div className="space-y-4">
              <select value={selectedUniId} onChange={(e) => setSelectedUniId(e.target.value)} className="w-full bg-[#121A15] border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-purple-500 transition-colors text-neutral-300">
                <option value="">اختر الجامعة...</option>
                {universities.map(uni => (
                  <option key={uni.id} value={uni.id}>{uni.name}</option>
                ))}
              </select>

              <input 
                type="text" 
                placeholder="اسم المادة (مثال: وراثة)" 
                value={subjName} 
                onChange={(e) => setSubjName(e.target.value)}
                className="w-full bg-[#121A15] border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-purple-500 transition-colors"
              />

              <select value={subjYear} onChange={(e) => setSubjYear(e.target.value)} className="w-full bg-[#121A15] border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-purple-500 transition-colors text-neutral-300">
                <option value="الفرقة الأولى">الفرقة الأولى</option>
                <option value="الفرقة الثانية">الفرقة الثانية</option>
                <option value="الفرقة الثالثة">الفرقة الثالثة</option>
                <option value="الفرقة الرابعة">الفرقة الرابعة</option>
              </select>

              <Button onClick={handleAddSubject} disabled={isLoading} className="w-full bg-purple-600 hover:bg-purple-500 text-white rounded-xl h-12">
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Plus className="w-4 h-4 ml-2" /> حفظ المادة</>}
              </Button>
            </div>
          </motion.div>

          {/* ========================================= */}
          {/* 3. قسم رفع الملفات (الماتيريال) */}
          {/* ========================================= */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-[#0a0f0c] p-6 rounded-3xl border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.05)] h-fit">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                <FileText className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold">3. رفع ملف / رابط</h3>
            </div>
            
            <div className="space-y-4">
              <select value={selectedSubjId} onChange={(e) => setSelectedSubjId(e.target.value)} className="w-full bg-[#121A15] border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-emerald-500 transition-colors text-neutral-300">
                <option value="">اختر المادة...</option>
                {subjects.map(subj => (
                  <option key={subj.id} value={subj.id}>{subj.name} ({subj.academic_year})</option>
                ))}
              </select>

              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => setMatType("lecture")} className={`py-3 rounded-xl border text-sm font-bold transition-all ${matType === "lecture" ? "bg-emerald-600 border-emerald-500 text-white" : "bg-[#121A15] border-white/5 text-neutral-400 hover:border-emerald-500/30"}`}>محاضرة 📝</button>
                <button onClick={() => setMatType("section")} className={`py-3 rounded-xl border text-sm font-bold transition-all ${matType === "section" ? "bg-emerald-600 border-emerald-500 text-white" : "bg-[#121A15] border-white/5 text-neutral-400 hover:border-emerald-500/30"}`}>سكشن 🔬</button>
                <button onClick={() => setMatType("ppt")} className={`py-3 rounded-xl border text-sm font-bold transition-all ${matType === "ppt" ? "bg-emerald-600 border-emerald-500 text-white" : "bg-[#121A15] border-white/5 text-neutral-400 hover:border-emerald-500/30"}`}>عروض 📊</button>
                <button onClick={() => setMatType("record")} className={`py-3 rounded-xl border text-sm font-bold transition-all ${matType === "record" ? "bg-emerald-600 border-emerald-500 text-white" : "bg-[#121A15] border-white/5 text-neutral-400 hover:border-emerald-500/30"}`}>ريكورد 🎧</button>
              </div>

              <input 
                type="text" 
                placeholder="عنوان الملف (مثال: سكشن 1 عملي)" 
                value={matTitle} 
                onChange={(e) => setMatTitle(e.target.value)}
                className="w-full bg-[#121A15] border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-emerald-500 transition-colors"
              />

              <div className="relative">
                <LinkIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input 
                  type="url" 
                  placeholder="رابط جوجل درايف هنا..." 
                  value={matDriveUrl} 
                  onChange={(e) => setMatDriveUrl(e.target.value)}
                  className="w-full bg-[#121A15] border border-white/10 rounded-xl pr-10 pl-4 py-3 outline-none focus:border-emerald-500 transition-colors"
                  dir="ltr"
                />
              </div>

              <Button onClick={handleAddMaterial} disabled={isLoading} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl h-12 shadow-lg shadow-emerald-900/20 mt-2">
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Plus className="w-4 h-4 ml-2" /> رفع الملف للمكتبة</>}
              </Button>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default AdminLibraryManager;
