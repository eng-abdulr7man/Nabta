import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { 
  Plus, Pencil, Trash2, X, Save, Library, Loader2,
  Wheat, Sprout, Bug, Droplets, Cpu, Factory, FlaskConical, 
  TrendingUp, Leaf, Sun, TreePine, Flower2, Mountain, 
  Fish, Egg, Milk, Apple, Grape, Carrot, Tractor, Hash
} from "lucide-react";

// 🎨 خريطة الأيقونات عشان نعرضها بشكل حي (Dynamic Render)
const iconMap: Record<string, any> = {
  Wheat, Sprout, Bug, Droplets, Cpu, Factory, FlaskConical, TrendingUp,
  Leaf, Sun, TreePine, Flower2, Mountain, Fish, Egg, Milk, Apple, Grape, Carrot, Tractor
};

const iconOptions = [
  { value: "Wheat", label: "قمح" }, { value: "Sprout", label: "نبتة" },
  { value: "Bug", label: "حشرة" }, { value: "Droplets", label: "ماء" },
  { value: "Cpu", label: "تقنية" }, { value: "Factory", label: "مصنع" },
  { value: "FlaskConical", label: "مختبر" }, { value: "TrendingUp", label: "تطوير" },
  { value: "Leaf", label: "ورقة" }, { value: "Sun", label: "شمس" },
  { value: "TreePine", label: "شجرة" }, { value: "Flower2", label: "زهرة" },
  { value: "Mountain", label: "جبل" }, { value: "Fish", label: "سمكة" },
  { value: "Egg", label: "بيضة" }, { value: "Milk", label: "حليب" },
  { value: "Apple", label: "تفاحة" }, { value: "Grape", label: "عنب" },
  { value: "Carrot", label: "جزرة" }, { value: "Tractor", label: "جرار" },
];

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
      toast({ title: editId ? "تم تحديث التخصص بنجاح" : "تم إضافة التخصص بنجاح" });
      queryClient.invalidateQueries({ queryKey: ["admin-specializations"] });
      queryClient.invalidateQueries({ queryKey: ["specializations"] });
      resetForm();
    },
    onError: (err: any) => toast({ title: "خطأ في الحفظ", description: err.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("specializations").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "تم حذف التخصص بشكل نهائي" });
      queryClient.invalidateQueries({ queryKey: ["admin-specializations"] });
    },
  });

  const resetForm = () => {
    setShowForm(false);
    setEditId(null);
    setForm({ id: "", name: "", icon: "Wheat", color: "142 60% 45%", sort_order: (specs?.length || 0) + 1 });
  };

  const handleEdit = (spec: any) => {
    setEditId(spec.id);
    setForm(spec);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto space-y-8 p-2 font-tajawal relative overflow-x-hidden" dir="rtl">
        
        {/* Ambient Glow */}
        <div className="absolute top-[-5%] left-[-5%] w-[300px] h-[300px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />

        {/* 🌟 Header Section 🌟 */}
        <div className="bg-[#0a0f0c] p-6 md:p-8 rounded-[2rem] border border-neutral-800/60 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/10 blur-3xl -z-10" />
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-white flex items-center gap-3 tracking-tight">
              <Library className="w-8 h-8 text-emerald-500" /> إدارة التخصصات
            </h1>
            <p className="text-neutral-400 font-medium mt-2">قم بإنشاء وتصنيف الأقسام التي تندرج تحتها كورسات المنصة.</p>
          </div>
          <Button onClick={() => { resetForm(); setShowForm(true); }} className="bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl h-14 px-6 shadow-lg shadow-emerald-900/20 active:scale-95 transition-all w-full md:w-auto">
            <Plus className="w-5 h-5 ml-2" /> إضافة تخصص جديد
          </Button>
        </div>

        {/* 🌟 Form Container (Add / Edit) 🌟 */}
        <AnimatePresence>
          {showForm && (
            <motion.div initial={{ opacity: 0, height: 0, y: -20 }} animate={{ opacity: 1, height: "auto", y: 0 }} exit={{ opacity: 0, height: 0, y: -20 }} className="overflow-hidden">
              <div className="bg-[#0a0f0c] border border-emerald-500/30 rounded-[2.5rem] p-6 md:p-8 shadow-2xl relative mb-8">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-black text-white flex items-center gap-2">
                    {editId ? <Pencil className="w-5 h-5 text-emerald-500"/> : <Plus className="w-5 h-5 text-emerald-500"/>} 
                    {editId ? "تعديل بيانات التخصص" : "إنشاء تخصص جديد"}
                  </h2>
                  <button onClick={resetForm} className="p-2 bg-neutral-900 text-neutral-400 hover:text-white rounded-xl transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* ID (Readonly in edit) */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-neutral-400">المعرف البرمجي (Slug)</label>
                    <input
                      placeholder="مثال: plant-production"
                      value={form.id}
                      onChange={(e) => setForm({ ...form, id: e.target.value })}
                      disabled={!!editId}
                      className="w-full px-5 py-4 rounded-2xl bg-[#121A15] border border-neutral-800 text-white text-sm focus:border-emerald-500/50 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      dir="ltr"
                    />
                  </div>

                  {/* Name */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-neutral-400">اسم التخصص (عربي) <span className="text-red-500">*</span></label>
                    <input
                      placeholder="مثال: الإنتاج النباتي"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-5 py-4 rounded-2xl bg-[#121A15] border border-neutral-800 text-white text-sm focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 outline-none transition-all"
                    />
                  </div>

                  {/* Icon Select */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-neutral-400">الرمز المعبر (Icon)</label>
                    <div className="relative flex items-center bg-[#121A15] border border-neutral-800 rounded-2xl focus-within:border-emerald-500/50 focus-within:ring-1 focus-within:ring-emerald-500/20 transition-all px-4 py-1">
                      {/* عرض الأيقونة الحية هنا */}
                      {(() => {
                        const SelectedIcon = iconMap[form.icon] || Wheat;
                        return <SelectedIcon className="w-6 h-6 text-neutral-400 shrink-0 ml-2" />;
                      })()}
                      <select
                        value={form.icon}
                        onChange={(e) => setForm({ ...form, icon: e.target.value })}
                        className="w-full bg-transparent text-white text-sm outline-none appearance-none font-bold py-3 cursor-pointer"
                        dir="rtl"
                      >
                        {iconOptions.map((i) => (
                          <option key={i.value} value={i.value} className="bg-[#0a0f0c] text-white py-2">{i.label} ({i.value})</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Color Input with Preview */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-neutral-400">اللون المخصص (HSL)</label>
                    <div className="relative">
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full border-2 border-white/20 shadow-md" style={{ backgroundColor: `hsl(${form.color})` }} />
                      <input
                        placeholder="142 60% 45%"
                        value={form.color}
                        onChange={(e) => setForm({ ...form, color: e.target.value })}
                        className="w-full pl-5 pr-14 py-4 rounded-2xl bg-[#121A15] border border-neutral-800 text-white text-sm focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 outline-none transition-all font-mono"
                        dir="ltr"
                      />
                    </div>
                  </div>

                  {/* Sort Order */}
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-bold text-neutral-400">ترتيب العرض (Sort Order)</label>
                    <div className="relative">
                      <Hash className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
                      <input
                        type="number"
                        placeholder="1"
                        value={form.sort_order}
                        onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })}
                        className="w-full pr-12 pl-5 py-4 rounded-2xl bg-[#121A15] border border-neutral-800 text-white text-sm focus:border-emerald-500/50 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4 mt-8 pt-6 border-t border-neutral-800/50">
                  <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending || !form.name || !form.id} className="h-14 px-8 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-lg rounded-2xl shadow-xl active:scale-95 transition-all flex items-center gap-2">
                    {saveMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    {editId ? "حفظ التعديلات" : "إضافة التخصص"}
                  </Button>
                  <Button variant="ghost" onClick={resetForm} className="h-14 px-6 text-neutral-400 hover:text-white hover:bg-neutral-900 rounded-2xl font-bold">
                    إلغاء
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 🌟 Specializations Grid 🌟 */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => <div key={i} className="bg-[#0a0f0c] border border-neutral-800/50 h-32 rounded-3xl animate-pulse" />)}
          </div>
        ) : (specs || []).length === 0 ? (
          <div className="text-center py-20 bg-[#0a0f0c] border border-neutral-800/50 rounded-[2.5rem]">
            <Library className="w-16 h-16 text-neutral-800 mx-auto mb-4" />
            <h3 className="text-xl font-black text-white mb-2">لا توجد تخصصات بعد</h3>
            <p className="text-neutral-500 text-sm">أضف تخصصك الأول لتصنيف الكورسات بشكل منظم.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {(specs || []).map((spec: any, i: number) => {
              const SpecIcon = iconMap[spec.icon] || Wheat;
              const HslColor = `hsl(${spec.color})`;
              const HslBg = `hsla(${spec.color}, 0.15)`;
              const HslBorder = `hsla(${spec.color}, 0.3)`;

              return (
                <motion.div
                  key={spec.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-[#0a0f0c] border p-6 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden relative"
                  style={{ borderColor: "rgba(38, 38, 38, 0.6)" }} // Default border, changes on hover via CSS class but inline is tricky with pseudo, so we use group-hover
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = HslBorder}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = "rgba(38, 38, 38, 0.6)"}
                >
                  {/* خيال لوني ورا الأيقونة */}
                  <div className="absolute -top-10 -left-10 w-32 h-32 rounded-full blur-3xl opacity-20 transition-opacity group-hover:opacity-40" style={{ backgroundColor: HslColor }} />

                  <div className="flex items-start justify-between relative z-10">
                    <div className="flex items-center gap-4">
                      {/* الأيقونة الحية */}
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border transition-transform group-hover:scale-110" style={{ backgroundColor: HslBg, borderColor: HslBorder, color: HslColor }}>
                        <SpecIcon className="w-7 h-7" />
                      </div>
                      
                      <div className="space-y-1">
                        <h3 className="font-black text-lg text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r" style={{ backgroundImage: `linear-gradient(to right, #fff, ${HslColor})` }}>
                          {spec.name}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-neutral-500 bg-[#121A15] px-2 py-0.5 rounded border border-neutral-800">{spec.id}</span>
                          <span className="text-[10px] font-bold text-neutral-400">ترتيب: {spec.sort_order}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-2 mt-6 pt-4 border-t border-neutral-800/50 relative z-10 opacity-60 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="sm" className="h-9 text-neutral-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-xl font-bold" onClick={() => handleEdit(spec)}>
                      <Pencil className="w-4 h-4 ml-1.5" /> تعديل
                    </Button>
                    <Button variant="ghost" size="sm" className="h-9 text-neutral-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl font-bold" onClick={() => { if(window.confirm(`هل أنت متأكد من حذف تخصص "${spec.name}"؟`)) deleteMutation.mutate(spec.id) }}>
                      <Trash2 className="w-4 h-4 ml-1.5" /> حذف
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminSpecializations;
