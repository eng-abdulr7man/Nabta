import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, Trash2, ArrowRight, FileText, Edit3 } from "lucide-react"; // ضفنا Edit3
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const AdminArticles = () => {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // حالات النافذة المنبثقة (Modal)
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentArticleId, setCurrentArticleId] = useState(null);

  // بيانات النموذج (Form)
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

  // فتح النافذة للإضافة
  const openAddModal = () => {
    setIsEditing(false);
    setNewTitle("");
    setNewContent("");
    setNewCategory("account");
    setShowModal(true);
  };

  // فتح النافذة للتعديل
  const openEditModal = (article) => {
    setIsEditing(true);
    setCurrentArticleId(article.id);
    setNewTitle(article.title);
    setNewContent(article.content);
    setNewCategory(article.category);
    setShowModal(true);
  };

  const handleSaveArticle = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) {
      toast({ title: "خطأ", description: "يرجى ملء جميع الحقول", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);

    const articleData = {
      title: newTitle,
      content: newContent,
      category: newCategory,
    };

    let error;
    if (isEditing) {
      // عملية التعديل
      const result = await supabase
        .from("help_articles")
        .update(articleData)
        .eq("id", currentArticleId);
      error = result.error;
    } else {
      // عملية الإضافة الجديدة
      const result = await supabase.from("help_articles").insert(articleData);
      error = result.error;
    }

    setIsSubmitting(false);

    if (error) {
      toast({ title: "خطأ", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "نجاح", description: isEditing ? "تم تحديث المقال بنجاح!" : "تم نشر المقال بنجاح!" });
      setShowModal(false);
      fetchArticles();
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا المقال نهائياً؟")) return;
    const { error } = await supabase.from("help_articles").delete().eq("id", id);
    if (!error) {
      toast({ title: "تم الحذف", description: "تم مسح المقال بنجاح." });
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
              <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">إدارة المقالات</h1>
            </div>
          </div>
          
          <Button 
            onClick={openAddModal}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl h-11 px-6 shadow-[0_0_20px_rgba(16,185,129,0.2)]"
          >
            <Plus className="w-5 h-5 ml-2" />
            إضافة مقال جديد
          </Button>
        </div>

        {/* الجدول */}
        <div className="bg-[#0a0f0c] border border-neutral-800/60 rounded-2xl overflow-hidden">
          {isLoading ? (
            <div className="p-10 text-center text-emerald-500 animate-pulse font-bold">جاري تحميل البيانات...</div>
          ) : articles.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse">
                <thead className="bg-[#121A15] border-b border-neutral-800">
                  <tr>
                    <th className="px-6 py-4 text-sm font-bold text-neutral-300">المقال</th>
                    <th className="px-6 py-4 text-sm font-bold text-neutral-300">التصنيف</th>
                    <th className="px-6 py-4 text-sm font-bold text-neutral-300 text-left">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60">
                  {articles.map((article) => (
                    <tr key={article.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                            <FileText className="w-4 h-4 text-emerald-500" />
                          </div>
                          <span className="font-bold text-sm text-white">{article.title}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-bold px-2 py-1 rounded-md bg-neutral-800 text-neutral-400">
                          {article.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-left">
                        <div className="flex items-center justify-end gap-2">
                          {/* زر التعديل الجديد */}
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => openEditModal(article)}
                            className="border-neutral-800 hover:bg-emerald-500/10 hover:text-emerald-500 hover:border-emerald-500/50"
                          >
                            <Edit3 className="w-4 h-4" />
                          </Button>
                          
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleDelete(article.id)}
                            className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-20 text-center text-neutral-500 font-bold">لا توجد مقالات مضافة.</div>
          )}
        </div>

      </div>

      {/* النافذة المنبثقة (Modal) - تعمل للإضافة والتعديل */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[#0a0f0c] border border-neutral-800 w-full max-w-2xl rounded-3xl p-6 md:p-8 shadow-2xl"
          >
            <h2 className="text-2xl font-bold text-white mb-6">
              {isEditing ? "تعديل المقال" : "نشر مقال جديد"}
            </h2>
            <form onSubmit={handleSaveArticle} className="space-y-5">
              <div>
                <label className="text-sm text-neutral-400 mb-2 block">عنوان المقال</label>
                <input 
                  type="text" 
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-[#121A15] border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-all"
                  required
                />
              </div>
              <div>
                <label className="text-sm text-neutral-400 mb-2 block">التصنيف</label>
                <select 
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full bg-[#121A15] border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  <option value="account">الحساب الشخصي</option>
                  <option value="payment">المدفوعات</option>
                  <option value="course">الكورسات والمحتوى</option>
                  <option value="certificate">الشهادات</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-neutral-400 mb-2 block">المحتوى (يدعم Markdown)</label>
                <textarea 
                  rows={10}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full bg-[#121A15] border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 resize-none font-mono text-sm leading-relaxed"
                  required
                ></textarea>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="bg-transparent text-neutral-400 hover:text-white hover:bg-neutral-800"
                >
                  إلغاء
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-8"
                >
                  {isSubmitting ? "جاري الحفظ..." : isEditing ? "تحديث المقال" : "نشر المقال"}
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
