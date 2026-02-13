import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminSpecializations = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ id: "", name: "", icon: "Wheat", color: "142 60% 45%", sort_order: 0 });

  const { data: specs, isLoading } = useQuery({
    queryKey: ["admin-specializations"],
    queryFn: async () => {
      const { data, error } = await supabase.from("specializations").select("*").order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (editId) {
        const { error } = await supabase.from("specializations").update({ name: form.name, icon: form.icon, color: form.color, sort_order: form.sort_order }).eq("id", editId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("specializations").insert(form);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast({ title: editId ? "تم التحديث" : "تم الإضافة" });
      queryClient.invalidateQueries({ queryKey: ["admin-specializations"] });
      queryClient.invalidateQueries({ queryKey: ["specializations"] });
      resetForm();
    },
    onError: (err: any) => toast({ title: "خطأ", description: err.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("specializations").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "تم الحذف" });
      queryClient.invalidateQueries({ queryKey: ["admin-specializations"] });
    },
  });

  const resetForm = () => {
    setShowForm(false);
    setEditId(null);
    setForm({ id: "", name: "", icon: "Wheat", color: "142 60% 45%", sort_order: 0 });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-black text-foreground">إدارة التخصصات</h1>
          <Button onClick={() => { resetForm(); setShowForm(true); }} className="bg-primary text-primary-foreground gap-1">
            <Plus className="w-4 h-4" /> إضافة
          </Button>
        </div>

        {showForm && (
          <div className="glass-card p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {!editId && (
                <input placeholder="المعرف (مثال: plant-production)" value={form.id} onChange={(e) => setForm({ ...form, id: e.target.value })}
                  className="px-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" dir="ltr" />
              )}
              <input placeholder="الاسم" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="px-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
              <select value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })}
                className="px-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50">
                {["Wheat", "Sprout", "Bug", "Droplets", "Cpu", "Factory", "FlaskConical", "TrendingUp"].map((i) => (
                  <option key={i} value={i}>{i}</option>
                ))}
              </select>
              <input placeholder="الترتيب" type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })}
                className="px-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
            <div className="flex gap-2">
              <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending} className="bg-primary text-primary-foreground">حفظ</Button>
              <Button variant="outline" onClick={resetForm}>إلغاء</Button>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="glass-card h-14 animate-pulse" />)}</div>
        ) : (
          <div className="space-y-2">
            {(specs || []).map((spec: any) => (
              <div key={spec.id} className="glass-card p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `hsla(${spec.color}, 0.15)` }}>
                    <span className="text-xs font-bold" style={{ color: `hsl(${spec.color})` }}>{spec.sort_order}</span>
                  </div>
                  <div>
                    <p className="font-bold text-sm text-foreground">{spec.name}</p>
                    <p className="text-xs text-muted-foreground">{spec.id}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditId(spec.id); setForm(spec); setShowForm(true); }}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => deleteMutation.mutate(spec.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminSpecializations;
