import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Building2, BookOpen, FileText, Plus, Loader2, Link as LinkIcon,
  Trash2, Pencil, Settings2, X, GraduationCap, FolderArchive
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const AdminLibraryManager = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("subjects"); // للتبديل بين القوائم تحت
  
  // داتا الداتا بيز للعرض
  const [universities, setUniversities] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [materials, setMaterials] = useState<any[]>([]);

  // ====================
  // حالات الجامعات
  // ====================
  const [uniName, setUniName] = useState("");
  const [editingUniId, setEditingUniId] = useState<string | null>(null);

  // ====================
  // حالات المواد
  // ====================
  const [subjName, setSubjName] = useState("");
  const [subjYear, setSubjYear] = useState("الفرقة الأولى");
  const [selectedUniId, setSelectedUniId] = useState("");
  const [editingSubjId, setEditingSubjId] = useState<string | null>(null);

  // ====================
  // حالات الملفات
  // ====================
  const [matTitle, setMatTitle] = useState("");
  const [matType, setMatType] = useState("lecture");
  const [matDriveUrl, setMatDriveUrl] = useState("");
  const [selectedSubjId, setSelectedSubjId] = useState("");
  const [editingMatId, setEditingMatId] = useState<string | null>(null);

  // جلب البيانات
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    fetchUniversities();
    fetchSubjects();
    fetchMaterials();
  };

  const fetchUniversities = async () => {
    const { data } = await supabase.from("universities").select("*").order("created_at", { ascending: false });
    if (data) setUniversities(data);
  };

  const fetchSubjects = async () => {
    const { data } = await supabase.from("subjects").select("*, universities(name)").order("created_at", { ascending: false });
    if (data) setSubjects(data);
  };

  const fetchMaterials = async () => {
    const { data } = await supabase.from("materials").select("*, subjects(name)").order("created_at", { ascending: false });
    if (data) setMaterials(data);
  };

  // ==========================================
  // دوال الحفظ (إضافة / تعديل)
  // ==========================================
  const handleSaveUniversity = async () => {
    if (!uniName.trim()) return toast.error("أدخل اسم الجامعة");
    setIsLoading(true);
    
    let error;
    if (editingUniId) {
      const res = await supabase.from("universities").update({ name: uniName.trim() }).eq("id", editingUniId);
      error = res.error;
    } else {
      const res = await supabase.from("universities").insert([{ name: uniName.trim() }]);
      error = res.error;
    }
    
    setIsLoading(false);
    if (error) toast.error("حدث خطأ");
    else {
      toast.success(editingUniId ? "تم التحديث بنجاح" : "تمت إضافة الجامعة بنجاح 🏛️");
      setUniName("");
      setEditingUniId(null);
      fetchUniversities();
    }
  };

  const handleSaveSubject = async () => {
    if (!subjName.trim() || !selectedUniId) return toast.error("أكمل بيانات المادة واختيار الجامعة");
    setIsLoading(true);

    let error;
    const payload = { name: subjName.trim(), academic_year: subjYear, university_id: selectedUniId };
    
    if (editingSubjId) {
      const res = await supabase.from("subjects").update(payload).eq("id", editingSubjId);
      error = res.error;
    } else {
      const res = await supabase.from("subjects").insert([payload]);
      error = res.error;
    }
    
    setIsLoading(false);
    if (error) toast.error("حدث خطأ");
    else {
      toast.success(editingSubjId ? "تم التحديث بنجاح" : "تمت إضافة المادة بنجاح 📚");
      setSubjName("");
      setEditingSubjId(null);
      fetchSubjects();
    }
  };

  const handleSaveMaterial = async () => {
    if (!matTitle.trim() || !matDriveUrl.trim() || !selectedSubjId) return toast.error("أكمل جميع بيانات الملف");
    setIsLoading(true);

    let error;
    const payload = { title: matTitle.trim(), type: matType, drive_url: matDriveUrl.trim(), subject_id: selectedSubjId };

    if (editingMatId) {
      const res = await supabase.from("materials").update(payload).eq("id", editingMatId);
      error = res.error;
    } else {
      const res = await supabase.from("materials").insert([payload]);
      error = res.error;
    }
    
    setIsLoading(false);
    if (error) toast.error("حدث خطأ");
    else {
      toast.success(editingMatId ? "تم التحديث بنجاح" : "تم رفع الملف بنجاح 🚀");
      setMatTitle("");
      setMatDriveUrl("");
      setEditingMatId(null);
      fetchMaterials();
    }
  };

  // ==========================================
  // دوال الحذف
  // ==========================================
  const handleDelete = async (table: string, id: string, name: string, fetchFn: () => void) => {
    if (!window.confirm(`هل أنت متأكد من حذف "${name}"؟ قد يؤدي هذا لحذف البيانات المرتبطة بها.`)) return;
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) toast.error("لا يمكن الحذف لارتباطها ببيانات أخرى");
    else {
      toast.success("تم الحذف بنجاح");
      fetchFn();
    }
  };

  // ==========================================
  // دوال الإعداد للتعديل (Populate Forms)
  // ==========================================
  const startEditUni = (uni: any) => { setUniName(uni.name); setEditingUniId(uni.id); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const startEditSubj = (subj: any) => { setSubjName(subj.name); setSubjYear(subj.academic_year); setSelectedUniId(subj.university_id); setEditingSubjId(subj.id); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const startEditMat = (mat: any) => { setMatTitle(mat.title); setMatType(mat.type); setMatDriveUrl(mat.drive_url); setSelectedSubjId(mat.subject_id); setEditingMatId(mat.id); window.scrollTo({ top: 0, behavior: "smooth" }); };

  return (
    <div className="bg-[#050806] min-h-screen text-white p-6 md:p-12 font-tajawal selection:bg-emerald-500/30" dir="rtl">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-3 mb-2">
            <Settings2 className="text-emerald-500 w-8 h-8" /> لوحة تحكم المكتبة
          </h1>
          <p className="text-neutral-400">من هنا يمكنك إضافة، تعديل، وحذف الجامعات، المواد، والملفات بسهولة.</p>
        </div>

        {/* ========================================= */}
        {/* صف الفورمات (الإضافة والتعديل) */}
        {/* ========================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* 1. جامعة */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`bg-[#0a0f0c] p-6 rounded-[2rem] border ${editingUniId ? 'border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.1)]' : 'border-white/5'} shadow-xl relative overflow-hidden`}>
            {editingUniId && <div className="absolute top-0 left-0 w-full h-1 bg-amber-500 animate-pulse" />}
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${editingUniId ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' : 'bg-blue-500/10 border-blue-500/20 text-blue-400'}`}>
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">{editingUniId ? 'تعديل جامعة' : 'إضافة جامعة'}</h3>
            </div>
            
            <div className="space-y-4">
              <input type="text" placeholder="اسم الجامعة..." value={uniName} onChange={(e) => setUniName(e.target.value)} className="w-full bg-[#121A15] border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-colors" />
              
              <div className="flex gap-2">
                <Button onClick={handleSaveUniversity} disabled={isLoading} className={`flex-1 rounded-xl h-12 text-white font-bold ${editingUniId ? 'bg-amber-600 hover:bg-amber-500' : 'bg-blue-600 hover:bg-blue-500'}`}>
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : editingUniId ? 'تحديث' : 'حفظ'}
                </Button>
                {editingUniId && (
                  <Button variant="ghost" onClick={() => {setEditingUniId(null); setUniName("");}} className="h-12 w-12 rounded-xl bg-white/5 hover:bg-rose-500/20 hover:text-rose-400">
                    <X className="w-5 h-5" />
                  </Button>
                )}
              </div>
            </div>
          </motion.div>

          {/* 2. مادة */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className={`bg-[#0a0f0c] p-6 rounded-[2rem] border ${editingSubjId ? 'border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.1)]' : 'border-white/5'} shadow-xl relative overflow-hidden`}>
            {editingSubjId && <div className="absolute top-0 left-0 w-full h-1 bg-amber-500 animate-pulse" />}
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${editingSubjId ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' : 'bg-purple-500/10 border-purple-500/20 text-purple-400'}`}>
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">{editingSubjId ? 'تعديل مادة' : 'إضافة مادة'}</h3>
            </div>
            
            <div className="space-y-4">
              <select value={selectedUniId} onChange={(e) => setSelectedUniId(e.target.value)} className="w-full bg-[#121A15] border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-purple-500 transition-colors text-white font-bold">
                <option value="">الجامعة...</option>
                {universities.map(uni => (<option key={uni.id} value={uni.id}>{uni.name}</option>))}
              </select>
              <input type="text" placeholder="اسم المادة..." value={subjName} onChange={(e) => setSubjName(e.target.value)} className="w-full bg-[#121A15] border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-purple-500 transition-colors" />
              <select value={subjYear} onChange={(e) => setSubjYear(e.target.value)} className="w-full bg-[#121A15] border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-purple-500 transition-colors text-white font-bold">
                {["الفرقة الأولى", "الفرقة الثانية", "الفرقة الثالثة", "الفرقة الرابعة"].map(y => <option key={y} value={y}>{y}</option>)}
              </select>

              <div className="flex gap-2">
                <Button onClick={handleSaveSubject} disabled={isLoading} className={`flex-1 rounded-xl h-12 text-white font-bold ${editingSubjId ? 'bg-amber-600 hover:bg-amber-500' : 'bg-purple-600 hover:bg-purple-500'}`}>
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : editingSubjId ? 'تحديث' : 'حفظ'}
                </Button>
                {editingSubjId && (
                  <Button variant="ghost" onClick={() => {setEditingSubjId(null); setSubjName("");}} className="h-12 w-12 rounded-xl bg-white/5 hover:bg-rose-500/20 hover:text-rose-400">
                    <X className="w-5 h-5" />
                  </Button>
                )}
              </div>
            </div>
          </motion.div>

          {/* 3. ملف */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className={`bg-[#0a0f0c] p-6 rounded-[2rem] border ${editingMatId ? 'border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.1)]' : 'border-emerald-500/30'} shadow-xl relative overflow-hidden`}>
            {editingMatId && <div className="absolute top-0 left-0 w-full h-1 bg-amber-500 animate-pulse" />}
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${editingMatId ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'}`}>
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">{editingMatId ? 'تعديل ملف' : 'رفع ملف'}</h3>
            </div>
            
            <div className="space-y-4">
              <select value={selectedSubjId} onChange={(e) => setSelectedSubjId(e.target.value)} className="w-full bg-[#121A15] border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-emerald-500 transition-colors text-white font-bold">
                <option value="">المادة...</option>
                {subjects.map(subj => (<option key={subj.id} value={subj.id}>{subj.name}</option>))}
              </select>

              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "lecture", label: "محاضرة 📝" }, { id: "section", label: "سكشن 🔬" },
                  { id: "ppt", label: "عروض 📊" }, { id: "record", label: "ريكورد 🎧" }
                ].map(t => (
                  <button key={t.id} onClick={() => setMatType(t.id)} className={`py-2 rounded-xl border text-sm font-bold transition-all ${matType === t.id ? "bg-emerald-600 border-emerald-500 text-white" : "bg-[#121A15] border-white/5 text-neutral-400"}`}>
                    {t.label}
                  </button>
                ))}
              </div>

              <input type="text" placeholder="عنوان الملف..." value={matTitle} onChange={(e) => setMatTitle(e.target.value)} className="w-full bg-[#121A15] border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-emerald-500 transition-colors" />
              <div className="relative">
                <LinkIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input type="url" placeholder="رابط درايف..." value={matDriveUrl} onChange={(e) => setMatDriveUrl(e.target.value)} className="w-full bg-[#121A15] border border-white/10 rounded-xl pr-10 pl-4 py-3 outline-none focus:border-emerald-500 transition-colors" dir="ltr" />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSaveMaterial} disabled={isLoading} className={`flex-1 rounded-xl h-12 text-white font-bold ${editingMatId ? 'bg-amber-600 hover:bg-amber-500' : 'bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-900/20'}`}>
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : editingMatId ? 'تحديث' : 'رفع الملف'}
                </Button>
                {editingMatId && (
                  <Button variant="ghost" onClick={() => {setEditingMatId(null); setMatTitle(""); setMatDriveUrl("");}} className="h-12 w-12 rounded-xl bg-white/5 hover:bg-rose-500/20 hover:text-rose-400">
                    <X className="w-5 h-5" />
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* ========================================= */}
        {/* قسم إدارة البيانات الحالية (Data Grid) */}
        {/* ========================================= */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-[#0a0f0c] p-6 md:p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-white/5 pb-6">
            <h2 className="text-2xl font-black flex items-center gap-3">
              <FolderArchive className="text-emerald-500" /> إدارة البيانات المسجلة
            </h2>
            
            {/* Tabs */}
            <div className="flex bg-[#121A15] p-1.5 rounded-2xl border border-white/5 w-fit">
              {[
                { id: "subjects", label: "المواد الدراسية" },
                { id: "materials", label: "الملفات" },
                { id: "universities", label: "الجامعات" }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === tab.id ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-900/20' : 'text-neutral-500 hover:text-white hover:bg-white/5'}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* محتوى الـ Tabs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            
            {/* عرض المواد */}
            {activeTab === "subjects" && subjects.map(subj => (
              <div key={subj.id} className="bg-[#121A15] p-5 rounded-2xl border border-white/5 flex flex-col gap-4 group hover:border-white/10 transition-colors">
                <div>
                  <h4 className="text-lg font-bold text-white mb-1">{subj.name}</h4>
                  <p className="text-xs text-neutral-400 font-medium">{subj.academic_year} • {subj.universities?.name}</p>
                </div>
                <div className="flex items-center gap-2 mt-auto pt-4 border-t border-white/5">
                  <button onClick={() => startEditSubj(subj)} className="flex-1 py-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white transition-all text-xs font-bold flex items-center justify-center gap-2"><Pencil className="w-3.5 h-3.5"/> تعديل</button>
                  <button onClick={() => handleDelete('subjects', subj.id, subj.name, fetchSubjects)} className="w-10 h-10 rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center shrink-0"><Trash2 className="w-4 h-4"/></button>
                </div>
              </div>
            ))}

            {/* عرض الملفات */}
            {activeTab === "materials" && materials.map(mat => (
              <div key={mat.id} className="bg-[#121A15] p-5 rounded-2xl border border-white/5 flex flex-col gap-4 group hover:border-white/10 transition-colors">
                <div>
                  <span className="inline-block px-2 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-black rounded mb-2">{mat.type}</span>
                  <h4 className="text-base font-bold text-white mb-1 line-clamp-1" title={mat.title}>{mat.title}</h4>
                  <p className="text-xs text-neutral-400 font-medium line-clamp-1">{mat.subjects?.name}</p>
                </div>
                <div className="flex items-center gap-2 mt-auto pt-4 border-t border-white/5">
                  <button onClick={() => startEditMat(mat)} className="flex-1 py-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white transition-all text-xs font-bold flex items-center justify-center gap-2"><Pencil className="w-3.5 h-3.5"/> تعديل</button>
                  <button onClick={() => handleDelete('materials', mat.id, mat.title, fetchMaterials)} className="w-10 h-10 rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center shrink-0"><Trash2 className="w-4 h-4"/></button>
                </div>
              </div>
            ))}

            {/* عرض الجامعات */}
            {activeTab === "universities" && universities.map(uni => (
              <div key={uni.id} className="bg-[#121A15] p-5 rounded-2xl border border-white/5 flex items-center justify-between group hover:border-white/10 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center"><Building2 className="w-5 h-5 text-neutral-400" /></div>
                  <h4 className="font-bold text-white">{uni.name}</h4>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => startEditUni(uni)} className="p-2 rounded-md bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white"><Pencil className="w-4 h-4"/></button>
                  <button onClick={() => handleDelete('universities', uni.id, uni.name, fetchUniversities)} className="p-2 rounded-md bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white"><Trash2 className="w-4 h-4"/></button>
                </div>
              </div>
            ))}

            {/* حالة الفراغ */}
            {((activeTab === "subjects" && subjects.length === 0) || 
              (activeTab === "materials" && materials.length === 0) || 
              (activeTab === "universities" && universities.length === 0)) && (
              <div className="col-span-full py-12 text-center flex flex-col items-center">
                <FolderArchive className="w-12 h-12 text-neutral-700 mb-3" />
                <p className="text-neutral-500 font-bold">لا توجد بيانات مسجلة في هذا القسم بعد.</p>
              </div>
            )}
            
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default AdminLibraryManager;
