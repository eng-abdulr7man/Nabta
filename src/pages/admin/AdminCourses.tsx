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

        {/* Header */}
        <div className="bg-muted p-6 md:p-8 rounded-[2rem] border border-border shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="absolute top-0 left-0 w-32 h-32 bg-accent blur-3xl -z-10" />
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-foreground flex items-center gap-3 tracking-tight">
              <BookOpen className="w-8 h-8 text-primary" /> إدارة الكورسات
            </h1>
            <p className="text-muted-foreground text-sm font-bold mt-2">قم بإنشاء وتعديل وإدارة جميع الدورات التدريبية في منصة نبتة.</p>
          </div>
          <Button 
            onClick={() => { resetForm(); setShowForm(true); }} 
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-black rounded-2xl h-14 px-6 shadow-lg  active:scale-95 transition-all w-full md:w-auto"
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
              <div className="bg-muted border border-primary/20 rounded-[2.5rem] p-6 md:p-8 shadow-2xl relative mb-8">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-black text-foreground flex items-center gap-2">
                    {editId ? <Pencil className="w-5 h-5 text-primary"/> : <Plus className="w-5 h-5 text-primary"/>} 
                    {editId ? "تعديل بيانات الكورس" : "إنشاء كورس جديد"}
                  </h2>
                  <button onClick={resetForm} className="p-2 bg-muted text-muted-foreground hover:text-foreground rounded-xl transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Title */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground">عنوان الكورس <span className="text-red-500">*</span></label>
                    <input
                      placeholder="مثال: أساسيات الزراعة المائية..."
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      className="w-full px-5 py-4 rounded-2xl bg-muted border border-border text-foreground text-sm focus:border-primary/20 focus:ring-1 focus:ring-primary outline-none transition-all shadow-inner"
                    />
                  </div>

                  {/* Instructor */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground">اسم المحاضر <span className="text-red-500">*</span></label>
                    <input
                      placeholder="د. أحمد محمود"
                      value={form.instructor}
                      onChange={(e) => setForm({ ...form, instructor: e.target.value })}
                      className="w-full px-5 py-4 rounded-2xl bg-muted border border-border text-foreground text-sm focus:border-primary/20 focus:ring-1 focus:ring-primary outline-none transition-all shadow-inner"
                    />
                  </div>

                  {/* Specialization */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground">التخصص (القسم)</label>
                    <div className="relative">
                      <select
                        value={form.specialization_id}
                        onChange={(e) => setForm({ ...form, specialization_id: e.target.value })}
                        className="w-full px-5 py-4 rounded-2xl bg-muted border border-border text-foreground text-sm focus:border-primary/20 outline-none transition-all appearance-none font-bold"
                      >
                        <option value="" className="text-muted-foreground">اختر التخصص...</option>
                        {(specs || []).map((s) => (
                          <option key={s.id} value={s.id} className="bg-muted">{s.name}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    </div>
                  </div>

                  {/* Status Toggle */}
                  <div className="space-y-2 flex flex-col justify-center">
                    <label className="text-xs font-bold text-muted-foreground mb-2">حالة النشر</label>
                    <label className="flex items-center gap-3 cursor-pointer group w-fit">
                      <div className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ease-in-out ${form.published ? 'bg-primary' : 'bg-neutral-700'}`}>
                        <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${form.published ? 'translate-x-0' : '-translate-x-6'}`} />
                      </div>
                      <input type="checkbox" className="hidden" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} />
                      <span className={`text-sm font-bold ${form.published ? 'text-primary' : 'text-muted-foreground'}`}>
                        {form.published ? "منشور ومتاح للطلاب" : "مسودة (غير ظاهر)"}
                      </span>
                    </label>
                  </div>

                  {/* Description */}
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-bold text-muted-foreground">وصف الكورس</label>
                    <textarea
                      placeholder="اكتب وصفاً مفصلاً يوضح محتوى وأهداف الكورس..."
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      rows={4}
                      className="w-full px-5 py-4 rounded-2xl bg-muted border border-border text-foreground text-sm focus:border-primary/20 outline-none resize-none transition-all shadow-inner"
                    />
                  </div>

                  {/* Thumbnail Upload */}
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-bold text-muted-foreground">صورة الغلاف (Thumbnail)</label>
                    {form.thumbnail_url ? (
                      <div className="relative w-full md:w-80 aspect-video rounded-2xl overflow-hidden border border-border group shadow-lg">
                        <img src={form.thumbnail_url} alt="Cover" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button onClick={() => setForm({ ...form, thumbnail_url: "" })} className="p-3 bg-red-500 text-foreground rounded-xl hover:bg-red-600 transition-colors shadow-xl">
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center gap-3 w-full md:w-80 aspect-video rounded-2xl bg-muted border-2 border-dashed border-border hover:border-primary/20 hover:bg-accent cursor-pointer transition-all group">
                        <Upload className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
                        <span className="text-sm font-bold text-muted-foreground group-hover:text-primary">
                          {uploading ? "جاري الرفع..." : "اضغط لرفع صورة الغلاف"}
                        </span>
                        <input type="file" accept="image/*" className="hidden" onChange={handleThumbnailUpload} disabled={uploading} />
                      </label>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4 mt-8 pt-6 border-t border-border">
                  <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending || !form.title || !form.instructor} className="h-14 px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-black text-lg rounded-2xl shadow-xl active:scale-95 transition-all flex items-center gap-2">
                    {saveMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    {editId ? "حفظ التعديلات" : "اعتماد الكورس"}
                  </Button>
                  <Button variant="ghost" onClick={resetForm} className="h-14 px-6 text-muted-foreground hover:text-foreground hover:bg-muted rounded-2xl font-bold">
                    إلغاء
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Courses List */}
        <div className="space-y-4">
          <h2 className="text-lg font-black text-foreground flex items-center gap-2 mb-4">
            <Layers className="w-5 h-5 text-primary" /> الكورسات المتاحة
          </h2>

          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => <div key={i} className="bg-muted border border-border h-32 rounded-3xl animate-pulse" />)}
            </div>
          ) : !courses || courses.length === 0 ? (
            <div className="text-center py-20 bg-muted border border-border rounded-[2.5rem]">
              <BookOpen className="w-16 h-16 text-neutral-800 mx-auto mb-4" />
              <h3 className="text-xl font-black text-foreground mb-2">لا توجد كورسات بعد</h3>
              <p className="text-muted-foreground text-sm">أضف كورس جديد أو استخدم أداة الاستيراد الذكي من يوتيوب.</p>
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
                    className="bg-muted border border-border p-5 rounded-3xl flex flex-col md:flex-row items-start md:items-center gap-6 shadow-lg hover:border-primary/20 transition-all group"
                  >
                    {/* Thumbnail */}
                    <div className="relative w-full md:w-48 aspect-video rounded-2xl overflow-hidden shrink-0 border border-border shadow-md">
                      {course.thumbnail_url ? (
                        <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full bg-muted flex flex-col items-center justify-center text-muted-foreground">
                          <Image className="w-8 h-8 mb-1" />
                          <span className="text-[10px] font-bold">بدون صورة</span>
                        </div>
                      )}
                      <div className="absolute top-2 left-2 flex gap-1">
                        <span className={`px-2 py-1 rounded-md text-[10px] font-black shadow-lg backdrop-blur-md border ${course.published ? 'bg-accent text-primary border-primary/20' : 'bg-black/60 text-muted-foreground border-border'}`}>
                          {course.published ? 'منشور' : 'مسودة'}
                        </span>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0 space-y-2">
                      <h3 className="text-xl font-black text-foreground truncate">{course.title}</h3>
                      <div className="flex items-center gap-4 flex-wrap text-sm">
                        <span className="text-muted-foreground font-bold flex items-center gap-1.5 bg-muted px-3 py-1.5 rounded-lg border border-border">
                          <Pencil className="w-3.5 h-3.5 text-primary" /> {course.instructor}
                        </span>
                        <span className="text-primary font-bold bg-accent px-3 py-1.5 rounded-lg border border-primary/20">
                          {spec?.name || "بدون تخصص"}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0 bg-muted p-2 rounded-2xl border border-border">
                      <Button 
                        variant="ghost" size="icon" title={course.published ? "إخفاء الكورس" : "نشر الكورس"}
                        onClick={() => togglePublish.mutate({ id: course.id, published: course.published })}
                        className={`h-10 w-10 rounded-xl transition-colors ${course.published ? 'text-primary hover:bg-accent' : 'text-muted-foreground hover:text-primary hover:bg-accent'}`}
                      >
                        {course.published ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                      </Button>
                      
                      <div className="w-px h-6 bg-muted mx-1" />

                      <Button 
                        variant="ghost" size="icon" title="إدارة المنهج والدروس"
                        onClick={() => navigate(`/admin/courses/${course.id}`)}
                        className="h-10 w-10 rounded-xl text-muted-foreground hover:text-purple-400 hover:bg-purple-500/10 transition-colors"
                      >
                        <ListTree className="w-5 h-5" />
                      </Button>
                      
                      <Button 
                        variant="ghost" size="icon" title="تعديل البيانات"
                        onClick={() => handleEdit(course)}
                        className="h-10 w-10 rounded-xl text-muted-foreground hover:text-blue-400 hover:bg-blue-500/10 transition-colors"
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
                        className="h-10 w-10 rounded-xl text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors"
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
