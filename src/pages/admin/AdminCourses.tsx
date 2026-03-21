import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, Pencil, Trash2, Eye, EyeOff, ListTree, 
  Upload, X, Image, BookOpen, Loader2, Save, Layers, ChevronDown 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useSpecializations } from "@/hooks/useCourses";

const AdminCourses = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: specs } = useSpecializations();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", description: "", instructor: "", specialization_id: "", published: false, thumbnail_url: "" });
  const [uploading, setUploading] = useState(false);

  const { data: courses, isLoading } = useQuery({
    queryKey: ["admin-courses"],
    queryFn: async () => {
      const { data, error } = await supabase.from("courses").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const filePath = `courses/${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage.from("thumbnails").upload(filePath, file);
    if (uploadError) {
      toast({ title: "خطأ في رفع الصورة", description: uploadError.message, variant: "destructive" });
      setUploading(false);
      return;
    }
    const { data: urlData } = supabase.storage.from("thumbnails").getPublicUrl(filePath);
    setForm((prev) => ({ ...prev, thumbnail_url: urlData.publicUrl }));
    setUploading(false);
    toast({ title: "تم رفع الصورة بنجاح" });
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (editId) {
        const { error } = await supabase.from("courses").update(form).eq("id", editId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("courses").insert(form);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast({ title: editId ? "تم تحديث الكورس بنجاح" : "تم إضافة الكورس بنجاح" });
      queryClient.invalidateQueries({ queryKey: ["admin-courses"] });
      resetForm();
    },
    onError: (err: any) => toast({ title: "خطأ في الحفظ", description: err.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("courses").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "تم حذف الكورس بشكل نهائي" });
      queryClient.invalidateQueries({ queryKey: ["admin-courses"] });
    },
  });

  const togglePublish = useMutation({
    mutationFn: async ({ id, published }: { id: string; published: boolean }) => {
      const { error } = await supabase.from("courses").update({ published: !published }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-courses"] }),
  });

  const resetForm = () => {
    setShowForm(false);
    setEditId(null);
    setForm({ title: "", description: "", instructor: "", specialization_id: "", published: false, thumbnail_url: "" });
  };

  const handleEdit = (course: any) => {
    setEditId(course.id);
    setForm({
      title: course.title,
      description: course.description || "",
      instructor: course.instructor,
      specialization_id: course.specialization_id || "",
      published: course.published,
      thumbnail_url: course.thumbnail_url || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
    setShowForm(true);
  };

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto space-y-8 p-2 font-tajawal relative" dir="rtl">
        
        {/* خلفية التوهج */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-500/5 blur-[120px] rounded-full -z-10" />

        {/* Header */}
        <div className="bg-[#0a0f0c] p-6 md:p-8 rounded-[2rem] border border-neutral-800/60 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="absolute top-0 left-0 w-32 h-32 bg-emerald-500/10 blur-3xl -z-10" />
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-white flex items-center gap-3 tracking-tight">
              <BookOpen className="w-8 h-8 text-emerald-500" /> إدارة الكورسات
            </h1>
            <p className="text-neutral-500 text-sm font-bold mt-2">قم بإنشاء وتعديل وإدارة جميع الدورات التدريبية في منصة نبتة.</p>
          </div>
          <Button 
            onClick={() => { resetForm(); setShowForm(true); }} 
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl h-14 px-6 shadow-lg shadow-emerald-900/20 active:scale-95 transition-all w-full md:w-auto"
          >
            <Plus className="w-5 h-5 ml-2" /> إضافة كورس جديد
          </Button>
        </div>

        {/* Form Container (Add / Edit) */}
        <AnimatePresence>
          {showForm && (
            <motion.div 
              initial={{ opacity: 0, height: 0, y: -20 }} 
              animate={{ opacity: 1, height: "auto", y: 0 }} 
              exit={{ opacity: 0, height: 0, y: -20 }}
              className="overflow-hidden"
            >
              <div className="bg-[#0a0f0c] border border-emerald-500/30 rounded-[2.5rem] p-6 md:p-8 shadow-2xl relative mb-8">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-black text-white flex items-center gap-2">
                    {editId ? <Pencil className="w-5 h-5 text-emerald-500"/> : <Plus className="w-5 h-5 text-emerald-500"/>} 
                    {editId ? "تعديل بيانات الكورس" : "إنشاء كورس جديد"}
                  </h2>
                  <button onClick={resetForm} className="p-2 bg-neutral-900 text-neutral-400 hover:text-white rounded-xl transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Title */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-neutral-400">عنوان الكورس <span className="text-red-500">*</span></label>
                    <input
                      placeholder="مثال: أساسيات الزراعة المائية..."
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      className="w-full px-5 py-4 rounded-2xl bg-[#121A15] border border-neutral-800 text-white text-sm focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 outline-none transition-all shadow-inner"
                    />
                  </div>

                  {/* Instructor */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-neutral-400">اسم المحاضر <span className="text-red-500">*</span></label>
                    <input
                      placeholder="د. أحمد محمود"
                      value={form.instructor}
                      onChange={(e) => setForm({ ...form, instructor: e.target.value })}
                      className="w-full px-5 py-4 rounded-2xl bg-[#121A15] border border-neutral-800 text-white text-sm focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 outline-none transition-all shadow-inner"
                    />
                  </div>

                  {/* Specialization */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-neutral-400">التخصص (القسم)</label>
                    <div className="relative">
                      <select
                        value={form.specialization_id}
                        onChange={(e) => setForm({ ...form, specialization_id: e.target.value })}
                        className="w-full px-5 py-4 rounded-2xl bg-[#121A15] border border-neutral-800 text-white text-sm focus:border-emerald-500/50 outline-none transition-all appearance-none font-bold"
                      >
                        <option value="" className="text-neutral-500">اختر التخصص...</option>
                        {(specs || []).map((s) => (
                          <option key={s.id} value={s.id} className="bg-[#0a0f0c]">{s.name}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none" />
                    </div>
                  </div>

                  {/* Status Toggle */}
                  <div className="space-y-2 flex flex-col justify-center">
                    <label className="text-xs font-bold text-neutral-400 mb-2">حالة النشر</label>
                    <label className="flex items-center gap-3 cursor-pointer group w-fit">
                      <div className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ease-in-out ${form.published ? 'bg-emerald-500' : 'bg-neutral-700'}`}>
                        <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${form.published ? 'translate-x-0' : '-translate-x-6'}`} />
                      </div>
                      <input type="checkbox" className="hidden" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} />
                      <span className={`text-sm font-bold ${form.published ? 'text-emerald-500' : 'text-neutral-500'}`}>
                        {form.published ? "منشور ومتاح للطلاب" : "مسودة (غير ظاهر)"}
                      </span>
                    </label>
                  </div>

                  {/* Description */}
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-bold text-neutral-400">وصف الكورس</label>
                    <textarea
                      placeholder="اكتب وصفاً مفصلاً يوضح محتوى وأهداف الكورس..."
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      rows={4}
                      className="w-full px-5 py-4 rounded-2xl bg-[#121A15] border border-neutral-800 text-white text-sm focus:border-emerald-500/50 outline-none resize-none transition-all shadow-inner"
                    />
                  </div>

                  {/* Thumbnail Upload */}
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-bold text-neutral-400">صورة الغلاف (Thumbnail)</label>
                    {form.thumbnail_url ? (
                      <div className="relative w-full md:w-80 aspect-video rounded-2xl overflow-hidden border border-neutral-800 group shadow-lg">
                        <img src={form.thumbnail_url} alt="Cover" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button onClick={() => setForm({ ...form, thumbnail_url: "" })} className="p-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors shadow-xl">
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center gap-3 w-full md:w-80 aspect-video rounded-2xl bg-[#121A15] border-2 border-dashed border-neutral-800 hover:border-emerald-500/50 hover:bg-emerald-500/5 cursor-pointer transition-all group">
                        <Upload className="w-8 h-8 text-neutral-600 group-hover:text-emerald-500 transition-colors" />
                        <span className="text-sm font-bold text-neutral-500 group-hover:text-emerald-400">
                          {uploading ? "جاري الرفع..." : "اضغط لرفع صورة الغلاف"}
                        </span>
                        <input type="file" accept="image/*" className="hidden" onChange={handleThumbnailUpload} disabled={uploading} />
                      </label>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4 mt-8 pt-6 border-t border-neutral-800/50">
                  <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending || !form.title || !form.instructor} className="h-14 px-8 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-lg rounded-2xl shadow-xl active:scale-95 transition-all flex items-center gap-2">
                    {saveMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    {editId ? "حفظ التعديلات" : "اعتماد الكورس"}
                  </Button>
                  <Button variant="ghost" onClick={resetForm} className="h-14 px-6 text-neutral-400 hover:text-white hover:bg-neutral-900 rounded-2xl font-bold">
                    إلغاء
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Courses List */}
        <div className="space-y-4">
          <h2 className="text-lg font-black text-white flex items-center gap-2 mb-4">
            <Layers className="w-5 h-5 text-emerald-500" /> الكورسات المتاحة
          </h2>

          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => <div key={i} className="bg-[#0a0f0c] border border-neutral-800/50 h-32 rounded-3xl animate-pulse" />)}
            </div>
          ) : !courses || courses.length === 0 ? (
            <div className="text-center py-20 bg-[#0a0f0c] border border-neutral-800/50 rounded-[2.5rem]">
              <BookOpen className="w-16 h-16 text-neutral-800 mx-auto mb-4" />
              <h3 className="text-xl font-black text-white mb-2">لا توجد كورسات بعد</h3>
              <p className="text-neutral-500 text-sm">أضف كورس جديد أو استخدم أداة الاستيراد الذكي من يوتيوب.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5">
              {courses.map((course: any) => {
                const spec = specs?.find((s) => s.id === course.specialization_id);
                
                return (
                  <motion.div 
                    key={course.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#0a0f0c] border border-neutral-800/60 p-5 rounded-3xl flex flex-col md:flex-row items-start md:items-center gap-6 shadow-lg hover:border-emerald-500/30 transition-all group"
                  >
                    {/* Thumbnail */}
                    <div className="relative w-full md:w-48 aspect-video rounded-2xl overflow-hidden shrink-0 border border-neutral-800/80 shadow-md">
                      {course.thumbnail_url ? (
                        <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full bg-[#121A15] flex flex-col items-center justify-center text-neutral-600">
                          <Image className="w-8 h-8 mb-1" />
                          <span className="text-[10px] font-bold">بدون صورة</span>
                        </div>
                      )}
                      <div className="absolute top-2 left-2 flex gap-1">
                        <span className={`px-2 py-1 rounded-md text-[10px] font-black shadow-lg backdrop-blur-md border ${course.published ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-black/60 text-neutral-400 border-white/10'}`}>
                          {course.published ? 'منشور' : 'مسودة'}
                        </span>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0 space-y-2">
                      <h3 className="text-xl font-black text-white truncate">{course.title}</h3>
                      <div className="flex items-center gap-4 flex-wrap text-sm">
                        <span className="text-neutral-400 font-bold flex items-center gap-1.5 bg-[#121A15] px-3 py-1.5 rounded-lg border border-neutral-800">
                          <Pencil className="w-3.5 h-3.5 text-emerald-500" /> {course.instructor}
                        </span>
                        <span className="text-emerald-500 font-bold bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
                          {spec?.name || "بدون تخصص"}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0 bg-[#121A15] p-2 rounded-2xl border border-neutral-800/50">
                      <Button 
                        variant="ghost" size="icon" title={course.published ? "إخفاء الكورس" : "نشر الكورس"}
                        onClick={() => togglePublish.mutate({ id: course.id, published: course.published })}
                        className={`h-10 w-10 rounded-xl transition-colors ${course.published ? 'text-emerald-500 hover:bg-emerald-500/10' : 'text-neutral-500 hover:text-emerald-400 hover:bg-emerald-500/10'}`}
                      >
                        {course.published ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                      </Button>
                      
                      <div className="w-px h-6 bg-neutral-800 mx-1" />

                      <Button 
                        variant="ghost" size="icon" title="إدارة المنهج والدروس"
                        onClick={() => navigate(`/admin/courses/${course.id}`)}
                        className="h-10 w-10 rounded-xl text-neutral-400 hover:text-purple-400 hover:bg-purple-500/10 transition-colors"
                      >
                        <ListTree className="w-5 h-5" />
                      </Button>
                      
                      <Button 
                        variant="ghost" size="icon" title="تعديل البيانات"
                        onClick={() => handleEdit(course)}
                        className="h-10 w-10 rounded-xl text-neutral-400 hover:text-blue-400 hover:bg-blue-500/10 transition-colors"
                      >
                        <Pencil className="w-5 h-5" />
                      </Button>
                      
                      <Button 
                        variant="ghost" size="icon" title="حذف الكورس"
                        onClick={() => {
                          if (window.confirm("هل أنت متأكد من حذف هذا الكورس وجميع دروسه نهائياً؟")) {
                            deleteMutation.mutate(course.id);
                          }
                        }}
                        className="h-10 w-10 rounded-xl text-neutral-400 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminCourses;
