import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, Trash2, ArrowRight, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const AdminArticles = () => {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // حالات نافذة الإضافة
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newCategory, setNewCategory] = useState("account");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    setIsLoading(true);
    const { data, error } = await supabase.from("help_articles").select("*").order("created_at", { ascending: false });
    if (!error && data) setArticles(data);
    setIsLoading(false);
  };

  const handleAddArticle = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) {
      toast({ title: "خطأ", description: "يرجى ملء جميع الحقول", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    const { error } = await supabase.from("help_articles").insert({
      title: newTitle,
      content: newContent,
      category: newCategory,
    });
    setIsSubmitting(false);

    if (error) {
      toast({ title: "خطأ", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "نجاح", description: "تم نشر المقال بنجاح!" });
      setShowAddModal(false);
      setNewTitle("");
      setNewContent("");
      fetchArticles();
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا المقال نهائياً؟")) return;
    const { error } = await supabase.from("help_articles").delete().eq("id", id);
    if (!error) {
      toast({ title: "تم الحذف", description: "تم مسح المقال." });
      setArticles(articles.filter((a) => a.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-[#050806] text-white p-6 md:p-10 font-tajawal" dir="rtl">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* الترويسة */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link to="/admin" className="p-2 bg-[#121A15] border border-neutral-800 rounded-xl text-neutral-400 hover:text-white transition-colors">
              <ArrowRight className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">إدارة مقالات المساعدة</h1>
              <p className="text-neutral-400 mt-1">أضف، عدل، أو احذف مقالات مركز المعرفة.</p>
            </div>
          </div>
          
          <Button 
            onClick={() => setShowAddModal(true)}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl h-11 px-6 shadow-[0_0_20px_rgba(16,185,129,0.2)]"
          >
            <Plus className="w-5 h-5 ml-2" />
            إضافة مقال جديد
          </Button>
        </div>

        {/* جدول المقالات */}
        <div className="bg-[#0a0f0c] border border-neutral-800/60 rounded-2xl overflow-hidden">
          {isLoading ? (
            <div className="p-10 text-center text-emerald-500 animate-pulse">جاري التحميل...</div>
          ) : articles.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-right">
                <thead className="bg-[#121A15] border-b border-neutral-800">
                  <tr>
                    <th className="px-6 py-4 text-sm font-bold text-neutral-300">عنوان المقال</th>
                    <th className="px-6 py-4 text-sm font-bold text-neutral-300">التصنيف</th>
                    <th className="px-6 py-4 text-sm font-bold text-neutral-300">تاريخ النشر</th>
                    <th className="px-6 py-4 text-sm font-bold text-neutral-300 text-left">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60">
                  {articles.map((article) => (
                    <tr key={article.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <FileText className="w-4 h-4 text-emerald-500" />
                          <span className="font-bold text-sm text-white">{article.title}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-400">
                        {article.category === "account" ? "الحساب الشخصي" :
                         article.category === "payment" ? "المدفوعات" :
                         article.category === "course" ? "الكورسات" : "الشهادات"}
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-500" dir="ltr">
                        {new Date(article.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-left">
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDelete(article.id)}
                          className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-20 text-center text-neutral-500">لا يوجد مقالات مضافة حتى الآن.</div>
          )}
        </div>

      </div>

      {/* نافذة الإضافة المنبثقة */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[#0a0f0c] border border-neutral-800 w-full max-w-2xl rounded-3xl p-6 md:p-8 shadow-2xl"
          >
            <h2 className="text-2xl font-bold text-white mb-6">نشر مقال جديد</h2>
            <form onSubmit={handleAddArticle} className="space-y-5">
              <div>
                <label className="text-sm text-neutral-400 mb-2 block">عنوان المقال</label>
                <input 
                  type="text" 
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-[#121A15] border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>
              <div>
                <label className="text-sm text-neutral-400 mb-2 block">التصنيف</label>
                <select 
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full bg-[#121A15] border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="account">الحساب الشخصي</option>
                  <option value="payment">المدفوعات</option>
                  <option value="course">الكورسات والمحتوى</option>
                  <option value="certificate">الشهادات</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-neutral-400 mb-2 block">المحتوى</label>
                <textarea 
                  rows={8}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full bg-[#121A15] border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 resize-none"
                  required
                ></textarea>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  className="bg-transparent text-neutral-400 hover:text-white hover:bg-neutral-800"
                >
                  إلغاء
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                >
                  {isSubmitting ? "جاري النشر..." : "نشر المقال"}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminArticles;
