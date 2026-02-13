import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSpecializations } from "@/hooks/useCourses";

const AdminCourses = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: specs } = useSpecializations();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", description: "", instructor: "", specialization_id: "", published: false });

  const { data: courses, isLoading } = useQuery({
    queryKey: ["admin-courses"],
    queryFn: async () => {
      const { data, error } = await supabase.from("courses").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

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
      toast({ title: editId ? "تم تحديث الكورس" : "تم إضافة الكورس" });
      queryClient.invalidateQueries({ queryKey: ["admin-courses"] });
      resetForm();
    },
    onError: (err: any) => toast({ title: "خطأ", description: err.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("courses").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "تم حذف الكورس" });
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
    setForm({ title: "", description: "", instructor: "", specialization_id: "", published: false });
  };

  const handleEdit = (course: any) => {
    setEditId(course.id);
    setForm({
      title: course.title,
      description: course.description || "",
      instructor: course.instructor,
      specialization_id: course.specialization_id || "",
      published: course.published,
    });
    setShowForm(true);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-black text-foreground">إدارة الكورسات</h1>
          <Button onClick={() => { resetForm(); setShowForm(true); }} className="bg-primary text-primary-foreground gap-1">
            <Plus className="w-4 h-4" /> إضافة كورس
          </Button>
        </div>

        {showForm && (
          <div className="glass-card p-6 space-y-4">
            <h2 className="font-bold text-foreground">{editId ? "تعديل الكورس" : "كورس جديد"}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                placeholder="عنوان الكورس"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="px-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <input
                placeholder="اسم المحاضر"
                value={form.instructor}
                onChange={(e) => setForm({ ...form, instructor: e.target.value })}
                className="px-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <select
                value={form.specialization_id}
                onChange={(e) => setForm({ ...form, specialization_id: e.target.value })}
                className="px-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="">اختر التخصص</option>
                {(specs || []).map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
              <label className="flex items-center gap-2 text-sm text-foreground">
                <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} />
                منشور
              </label>
            </div>
            <textarea
              placeholder="وصف الكورس"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
            />
            <div className="flex gap-2">
              <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending} className="bg-primary text-primary-foreground">
                {saveMutation.isPending ? "جاري الحفظ..." : "حفظ"}
              </Button>
              <Button variant="outline" onClick={resetForm}>إلغاء</Button>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => <div key={i} className="glass-card h-16 animate-pulse" />)}
          </div>
        ) : (
          <div className="space-y-2">
            {(courses || []).map((course: any) => {
              const spec = specs?.find((s) => s.id === course.specialization_id);
              return (
                <div key={course.id} className="glass-card p-4 flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-foreground text-sm truncate">{course.title}</h3>
                    <p className="text-xs text-muted-foreground">{course.instructor} • {spec?.name || "بدون تخصص"}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => togglePublish.mutate({ id: course.id, published: course.published })}>
                      {course.published ? <Eye className="w-4 h-4 text-primary" /> : <EyeOff className="w-4 h-4 text-muted-foreground" />}
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(course)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => deleteMutation.mutate(course.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminCourses;
