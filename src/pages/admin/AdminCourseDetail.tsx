import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, Pencil, Trash2, ChevronDown, ChevronUp, Video, 
  FileText, Upload, X, ArrowRight, BookOpen, Layers, Save
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCourse } from "@/hooks/useCourses";
import { useAuth } from "@/contexts/AuthContext";

const AdminCourseDetail = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data: course } = useCourse(id!);

  const { data: sections, isLoading: loadingSections } = useQuery({
    queryKey: ["admin-sections", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("sections").select("*").eq("course_id", id!).order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  const sectionIds = (sections || []).map((s: any) => s.id);
  const { data: lessons } = useQuery({
    queryKey: ["admin-lessons", sectionIds],
    queryFn: async () => {
      const { data, error } = await supabase.from("lessons").select("*").in("section_id", sectionIds).order("sort_order");
      if (error) throw error;
      return data;
    },
    enabled: sectionIds.length > 0,
  });

  const [showSectionForm, setShowSectionForm] = useState(false);
  const [editSectionId, setEditSectionId] = useState<string | null>(null);
  const [sectionTitle, setSectionTitle] = useState("");

  const [showLessonForm, setShowLessonForm] = useState<string | null>(null);
  const [editLessonId, setEditLessonId] = useState<string | null>(null);
  const [lessonForm, setLessonForm] = useState({ title: "", video_url: "", duration_minutes: 0, content: "", file_url: "" });
  const [uploading, setUploading] = useState(false);

  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["admin-sections", id] });
    queryClient.invalidateQueries({ queryKey: ["admin-lessons"] });
  };

  const logActivity = async (action: string, details: any = {}) => {
    if (user) {
      await supabase.from("activity_log").insert({ user_id: user.id, action, details });
    }
  };

  // Section mutations
  const saveSection = useMutation({
    mutationFn: async () => {
      const order = (sections?.length || 0) + 1;
      if (editSectionId) {
        const { error } = await supabase.from("sections").update({ title: sectionTitle }).eq("id", editSectionId);
        if (error) throw error;
        await logActivity("تحديث قسم", { section_title: sectionTitle, course_id: id });
      } else {
        const { error } = await supabase.from("sections").insert({ title: sectionTitle, course_id: id!, sort_order: order });
        if (error) throw error;
        await logActivity("إضافة قسم", { section_title: sectionTitle, course_id: id });
      }
    },
    onSuccess: () => {
      toast({ title: editSectionId ? "تم تحديث القسم" : "تم إضافة القسم" });
      invalidate();
      setShowSectionForm(false);
      setEditSectionId(null);
      setSectionTitle("");
    },
    onError: (err: any) => toast({ title: "خطأ", description: err.message, variant: "destructive" }),
  });

  const deleteSection = useMutation({
    mutationFn: async (sId: string) => {
      const section = sections?.find((s: any) => s.id === sId);
      await supabase.from("lessons").delete().eq("section_id", sId);
      const { error } = await supabase.from("sections").delete().eq("id", sId);
      if (error) throw error;
      await logActivity("حذف قسم", { section_title: section?.title, course_id: id });
    },
    onSuccess: () => { toast({ title: "تم حذف القسم" }); invalidate(); },
  });

  // File upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const filePath = `${id}/${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage.from("lesson-files").upload(filePath, file);
    if (uploadError) {
      toast({ title: "خطأ في رفع الملف", description: uploadError.message, variant: "destructive" });
      setUploading(false);
      return;
    }
    const { data: urlData } = supabase.storage.from("lesson-files").getPublicUrl(filePath);
    setLessonForm((prev) => ({ ...prev, file_url: urlData.publicUrl }));
    setUploading(false);
    toast({ title: "تم رفع الملف بنجاح" });
  };

  // Lesson mutations
  const saveLesson = useMutation({
    mutationFn: async (sectionId: string) => {
      const sectionLessons = (lessons || []).filter((l: any) => l.section_id === sectionId);
      const order = sectionLessons.length + 1;
      if (editLessonId) {
        const { error } = await supabase.from("lessons").update(lessonForm).eq("id", editLessonId);
        if (error) throw error;
        await logActivity("تحديث درس", { lesson_title: lessonForm.title, course_id: id });
      } else {
        const { error } = await supabase.from("lessons").insert({ ...lessonForm, section_id: sectionId, sort_order: order });
        if (error) throw error;
        await logActivity("إضافة درس", { lesson_title: lessonForm.title, course_id: id });
      }
    },
    onSuccess: () => {
      toast({ title: editLessonId ? "تم تحديث الدرس" : "تم إضافة الدرس" });
      invalidate();
      setShowLessonForm(null);
      setEditLessonId(null);
      setLessonForm({ title: "", video_url: "", duration_minutes: 0, content: "", file_url: "" });
    },
    onError: (err: any) => toast({ title: "خطأ", description: err.message, variant: "destructive" }),
  });

  const deleteLesson = useMutation({
    mutationFn: async (lId: string) => {
      const lesson = (lessons || []).find((l: any) => l.id === lId);
      const { error } = await supabase.from("lessons").delete().eq("id", lId);
      if (error) throw error;
      await logActivity("حذف درس", { lesson_title: lesson?.title, course_id: id });
    },
    onSuccess: () => { toast({ title: "تم حذف الدرس" }); invalidate(); },
  });

  const toggleSection = (sId: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      next.has(sId) ? next.delete(sId) : next.add(sId);
      return next;
    });
  };

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto space-y-8 font-tajawal p-2" dir="rtl">
        
        {/* Header Section */}
        <div className="bg-[#0a0f0c] p-6 rounded-[2rem] border border-neutral-800/60 shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl -z-10" />
          
          <div className="flex items-center gap-4">
            <Link to="/admin/courses" className="p-3 bg-[#121A15] border border-neutral-800 rounded-xl text-neutral-400 hover:text-white transition-colors">
              <ArrowRight className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-white flex items-center gap-3">
                <BookOpen className="w-7 h-7 text-emerald-500" />
                {course?.title || "جاري التحميل..."}
              </h1>
              <p className="text-neutral-500 text-sm font-bold mt-1 flex items-center gap-2">
                <Layers className="w-4 h-4" /> إدارة محتوى الكورس (الأقسام والدروس)
              </p>
            </div>
          </div>
        </div>

        {/* Sections Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#121A15]/50 p-4 rounded-2xl border border-neutral-800/50">
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-500" /> المنهج الدراسي
          </h2>
          <Button 
            onClick={() => { setShowSectionForm(true); setEditSectionId(null); setSectionTitle(""); }}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl gap-2 shadow-lg"
          >
            <Plus className="w-4 h-4" /> إضافة قسم جديد
          </Button>
        </div>

        {/* Section Form */}
        <AnimatePresence>
          {showSectionForm && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="bg-[#0a0f0c] border border-emerald-500/30 p-5 rounded-2xl flex flex-col sm:flex-row gap-3 shadow-lg"
            >
              <input
                placeholder="مثال: الفصل الأول - مقدمة أساسية..."
                value={sectionTitle}
                onChange={(e) => setSectionTitle(e.target.value)}
                className="flex-1 bg-[#121A15] border border-neutral-800 px-5 py-3 rounded-xl text-white outline-none focus:border-emerald-500/50 transition-colors"
              />
              <div className="flex gap-2">
                <Button onClick={() => saveSection.mutate()} disabled={saveSection.isPending || !sectionTitle} className="bg-emerald-600 hover:bg-emerald-500 h-[48px] px-6 rounded-xl font-bold">
                  {saveSection.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "حفظ القسم"}
                </Button>
                <Button variant="ghost" onClick={() => { setShowSectionForm(false); setEditSectionId(null); }} className="h-[48px] text-neutral-400 hover:text-white rounded-xl bg-[#121A15] border border-neutral-800">
                  إلغاء
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sections List */}
        {loadingSections ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => <div key={i} className="bg-[#0a0f0c] border border-neutral-800/50 h-20 rounded-2xl animate-pulse" />)}
          </div>
        ) : (
          <div className="space-y-5">
            {(sections || []).map((section: any) => {
              const sectionLessons = (lessons || []).filter((l: any) => l.section_id === section.id);
              const isExpanded = expandedSections.has(section.id);

              return (
                <div key={section.id} className="bg-[#0a0f0c] border border-neutral-800/60 rounded-2xl overflow-hidden shadow-xl transition-all">
                  
                  {/* Section Header */}
                  <div className={`px-5 py-4 flex items-center justify-between transition-colors ${isExpanded ? 'bg-[#121A15]' : 'hover:bg-[#121A15]/50'}`}>
                    <button onClick={() => toggleSection(section.id)} className="flex items-center gap-3 flex-1 text-right outline-none group">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                        {isExpanded ? <ChevronUp className="w-4 h-4 text-emerald-500" /> : <ChevronDown className="w-4 h-4 text-emerald-500" />}
                      </div>
                      <span className="font-black text-base text-white">{section.title}</span>
                      <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-md">
                        {sectionLessons.length} دروس
                      </span>
                    </button>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg" onClick={() => { setEditSectionId(section.id); setSectionTitle(section.title); setShowSectionForm(true); }}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg" onClick={() => deleteSection.mutate(section.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Section Body (Lessons) */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                        <div className="border-t border-neutral-800/50 bg-[#050806]/50 divide-y divide-neutral-800/50">
                          
                          {/* Lessons List */}
                          {sectionLessons.map((lesson: any) => (
                            <div key={lesson.id} className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#121A15]/50 transition-colors">
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center shrink-0">
                                  <Video className="w-4 h-4 text-emerald-500" />
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-white font-bold text-sm truncate">{lesson.title}</span>
                                  <div className="flex items-center gap-2 mt-1">
                                    {lesson.duration_minutes > 0 && <span className="text-[10px] text-neutral-400 font-mono bg-neutral-900 px-1.5 rounded">{lesson.duration_minutes} دقيقة</span>}
                                    {lesson.content && <span className="text-[10px] text-emerald-400 bg-emerald-400/10 px-1.5 rounded font-bold">مرفق نص</span>}
                                    {lesson.file_url && <span className="text-[10px] text-blue-400 bg-blue-400/10 px-1.5 rounded font-bold flex items-center gap-1"><FileText className="w-3 h-3"/> ملف</span>}
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-2 shrink-0">
                                <Button variant="ghost" size="sm" className="h-8 px-3 text-xs font-bold text-neutral-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg" onClick={() => {
                                  setEditLessonId(lesson.id);
                                  setLessonForm({
                                    title: lesson.title, video_url: lesson.video_url || "",
                                    duration_minutes: lesson.duration_minutes || 0,
                                    content: lesson.content || "", file_url: lesson.file_url || "",
                                  });
                                  setShowLessonForm(section.id);
                                }}>
                                  <Pencil className="w-3.5 h-3.5 ml-1" /> تعديل
                                </Button>
                                <Button variant="ghost" size="sm" className="h-8 px-3 text-xs font-bold text-neutral-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg" onClick={() => deleteLesson.mutate(lesson.id)}>
                                  <Trash2 className="w-3.5 h-3.5 ml-1" /> حذف
                                </Button>
                              </div>
                            </div>
                          ))}

                          {/* Lesson Form (Add/Edit) */}
                          {showLessonForm === section.id ? (
                            <div className="p-6 bg-[#121A15] border-t border-emerald-500/20 shadow-inner">
                              <h4 className="text-sm font-black text-emerald-500 mb-4 flex items-center gap-2">
                                {editLessonId ? <Pencil className="w-4 h-4"/> : <Plus className="w-4 h-4"/>} 
                                {editLessonId ? "تعديل بيانات الدرس" : "إضافة درس جديد"}
                              </h4>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                  <label className="text-xs font-bold text-neutral-400">عنوان الدرس <span className="text-red-500">*</span></label>
                                  <input
                                    placeholder="مثال: الدرس الأول..."
                                    value={lessonForm.title}
                                    onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl bg-[#0a0f0c] border border-neutral-800 text-white text-sm focus:border-emerald-500/50 outline-none"
                                  />
                                </div>
                                <div className="space-y-1.5">
                                  <label className="text-xs font-bold text-neutral-400">رابط الفيديو (YouTube)</label>
                                  <input
                                    placeholder="https://youtube.com/..."
                                    value={lessonForm.video_url}
                                    onChange={(e) => setLessonForm({ ...lessonForm, video_url: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl bg-[#0a0f0c] border border-neutral-800 text-white text-sm focus:border-emerald-500/50 outline-none"
                                    dir="ltr"
                                  />
                                </div>
                                <div className="space-y-1.5">
                                  <label className="text-xs font-bold text-neutral-400">المدة بالدقائق</label>
                                  <input
                                    type="number"
                                    placeholder="0"
                                    value={lessonForm.duration_minutes || ""}
                                    onChange={(e) => setLessonForm({ ...lessonForm, duration_minutes: parseInt(e.target.value) || 0 })}
                                    className="w-full px-4 py-3 rounded-xl bg-[#0a0f0c] border border-neutral-800 text-white text-sm focus:border-emerald-500/50 outline-none"
                                  />
                                </div>

                                {/* File Upload */}
                                <div className="space-y-1.5 md:col-span-2">
                                  <label className="text-xs font-bold text-neutral-400">ملف مرفق للدرس (PDF, ZIP...)</label>
                                  {lessonForm.file_url ? (
                                    <div className="flex items-center justify-between p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                                      <div className="flex items-center gap-3 overflow-hidden">
                                        <div className="p-2 bg-blue-500/20 rounded-lg"><FileText className="w-4 h-4 text-blue-400" /></div>
                                        <a href={lessonForm.file_url} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-blue-400 truncate hover:underline" dir="ltr">
                                          {lessonForm.file_url.split("/").pop()}
                                        </a>
                                      </div>
                                      <button onClick={() => setLessonForm({ ...lessonForm, file_url: "" })} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
                                        <X className="w-5 h-5" />
                                      </button>
                                    </div>
                                  ) : (
                                    <label className="flex flex-col items-center justify-center gap-2 px-4 py-6 rounded-xl bg-[#0a0f0c] border border-dashed border-neutral-700 hover:border-emerald-500/50 hover:bg-emerald-500/5 cursor-pointer transition-colors group">
                                      <Upload className="w-6 h-6 text-neutral-500 group-hover:text-emerald-500 transition-colors" />
                                      <span className="text-sm font-bold text-neutral-400 group-hover:text-emerald-400">{uploading ? "جاري الرفع..." : "اضغط لرفع ملف مرفق (اختياري)"}</span>
                                      <input type="file" className="hidden" onChange={handleFileUpload} disabled={uploading} />
                                    </label>
                                  )}
                                </div>

                                <div className="space-y-1.5 md:col-span-2">
                                  <label className="text-xs font-bold text-neutral-400">محتوى نصي إضافي (يظهر تحت الفيديو)</label>
                                  <textarea
                                    placeholder="اكتب ملاحظات، روابط، أو شرح تفصيلي..."
                                    value={lessonForm.content}
                                    onChange={(e) => setLessonForm({ ...lessonForm, content: e.target.value })}
                                    rows={4}
                                    className="w-full px-4 py-3 rounded-xl bg-[#0a0f0c] border border-neutral-800 text-white text-sm focus:border-emerald-500/50 outline-none resize-none"
                                  />
                                </div>
                              </div>

                              <div className="flex gap-3 mt-6">
                                <Button onClick={() => saveLesson.mutate(section.id)} disabled={saveLesson.isPending || !lessonForm.title} className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 rounded-xl font-bold gap-2">
                                  {saveLesson.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} 
                                  حفظ الدرس
                                </Button>
                                <Button variant="ghost" onClick={() => { setShowLessonForm(null); setEditLessonId(null); }} className="px-6 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800">
                                  إلغاء
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="p-4 bg-[#0a0f0c]">
                              <button
                                onClick={() => {
                                  setShowLessonForm(section.id); setEditLessonId(null);
                                  setLessonForm({ title: "", video_url: "", duration_minutes: 0, content: "", file_url: "" });
                                }}
                                className="w-full py-3 rounded-xl border border-dashed border-neutral-800 text-neutral-400 hover:text-emerald-400 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all flex items-center justify-center gap-2 font-bold text-sm"
                              >
                                <Plus className="w-4 h-4" /> أضف درساً جديداً لهذا القسم
                              </button>
                            </div>
                          )}

                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}

        {!loadingSections && (!sections || sections.length === 0) && (
          <div className="text-center py-16 bg-[#0a0f0c] border border-neutral-800/50 rounded-[2rem]">
            <Layers className="w-16 h-16 text-neutral-800 mx-auto mb-4" />
            <h3 className="text-lg font-black text-white mb-2">لا توجد أقسام بعد</h3>
            <p className="text-neutral-500 text-sm">قم بإضافة قسم جديد لبدء بناء هيكل الكورس.</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminCourseDetail;
