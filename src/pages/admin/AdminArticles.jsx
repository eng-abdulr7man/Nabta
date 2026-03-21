import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, Trash2, ArrowRight, FileText, Edit3, Calendar, Tag } from "lucide-react";
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
    try {
      const { data, error } = await supabase
        .from("help_articles")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      if (data) setArticles(data);
    } catch (error) {
      toast({ title: "خطأ في التحميل", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
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
      const result = await supabase
        .from("help_articles")
        .update(articleData)
        .eq("id", currentArticleId);
      error = result.error;
    } else {
      const result = await supabase.from("help_articles").insert(articleData);
      error = result.error;
    }

    setIsSubmitting(false);

    if (error) {
      toast({ title: "خطأ", description: error.message, variant: "destructive" });
    } else {
      toast({ 
        title: "تم بنجاح", 
        description: isEditing ? "تم تحديث المقال بنجاح" : "تم نشر المقال بنجاح" 
      });
      setShowModal(false);
      fetchArticles();
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا المقال نهائياً؟")) return;
    const { error } = await supabase.from("help_articles").delete().eq("id", id);
    if (!error) {
      toast({ title: "تم الحذف", description: "تم مسح المقال من قاعدة البيانات." });
      setArticles(articles.filter((a) => a.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-[#050806] text-white p-4 md:p-10 font-tajawal" dir="rtl">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* الترويسة */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Link to="/admin" className="p-3 bg-[#121A15] border border-neutral-800 rounded-2xl text-neutral-400 hover:text-white transition-all hover:scale-110">
              <ArrowRight className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">إدارة مركز المعرفة</h1>
              <p className="text-neutral-500 text-sm mt-1">تحكم في المقالات التعليمية والمساعدة.</p>
            </div>
          </div>
          
          <Button 
            onClick={openAddModal}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl h-12 px-6 shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all active:scale-95"
          >
            <Plus className="w-5 h-5 ml-2" />
            إضافة مقال جديد
          </Button>
        </div>

        {/* جدول المقالات المطور */}
        <div className="bg-[#0a0f0c] border border-neutral-800/60 rounded-3xl overflow-hidden shadow-2xl">
          {isLoading ? (
            <div className="p-20 text-center flex flex-col items-center gap-4">
              <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-emerald-500 font-bold">جاري تحميل المقالات...</p>
            </div>
          ) : articles.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-right">
                <thead className="bg-[#121A15]/50 border-b border-neutral-800">
                  <tr>
                    <th className="px-6 py-5 text-sm font-bold text-neutral-400">المقال</th>
                    <th className="px-6 py-5 text-sm font-bold text-neutral-400">التصنيف</th>
                    <th className="px-6 py-5 text-sm font-bold text-neutral-400 text-center">التاريخ</th>
                    <th className="px-6 py-5 text-sm font-bold text-neutral-400 text-left">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/40">
                  {articles.map((article) => (
                    <tr key={article.id} className="hover:bg-white/[0.01] transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-center shrink-0 group-hover:bg-emerald-500/10 transition-colors">
                            <FileText className="w-5 h-5 text-emerald-500" />
                          </div>
                          <span className="font-bold text-[15px] text-white line-clamp-1">{article.title}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-xs font-bold text-neutral-400 bg-neutral-900/50 w-fit px-3 py-1.5 rounded-lg border border-neutral-800">
                          <Tag className="w-3 h-3 text-emerald-600" />
                          {article.category}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-xs text-neutral-300 font-mono">
                            {new Date(article.created_at).toLocaleDateString('ar-EG')}
                          </span>
                          <span className="text-[10px] text-neutral-600 uppercase font-bold">Created At</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-left">
                        <div className="flex items-center justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => openEditModal(article)}
                            className="w-9 h-9 border-neutral-800 bg-transparent hover:bg-emerald-500/10 hover:text-emerald-500 hover:border-emerald-500/50 transition-all"
                          >
                            <Edit3 className="w-4 h-4" />
                          </Button>
                          
                          <Button 
                            variant="destructive" 
                            size="icon"
                            onClick={() => handleDelete(article.id)}
                            className="w-9 h-9 bg-red-500/5 text-red-500 border border-red-500/10 hover:bg-red-500 hover:text-white transition-all"
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
            <div className="p-24 text-center">
              <div className="w-20 h-20 bg-neutral-900 rounded-full flex items-center justify-center mx-auto mb-6 border border-neutral-800">
                <FileText className="w-10 h-10 text-neutral-700" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">لا توجد مقالات مضافة</h3>
              <p className="text-neutral-500 max-w-xs mx-auto mb-8">ابدأ بإضافة أول مقال لمساعدة طلاب نبتة في رحلتهم.</p>
              <Button onClick={openAddModal} variant="outline" className="border-emerald-500/50 text-emerald-500 hover:bg-emerald-500 hover:text-white">
                أضف مقالك الأول الآن
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* النافذة المنبثقة (Modal) */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            className="bg-[#0a0f0c] border border-neutral-800 w-full max-w-3xl rounded-[2.5rem] p-6 md:p-10 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden relative"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-50" />
            
            <h2 className="text-3xl font-black text-white mb-8 flex items-center gap-3">
              {isEditing ? <Edit3 className="w-7 h-7 text-emerald-500" /> : <Plus className="w-7 h-7 text-emerald-500" />}
              {isEditing ? "تعديل محتوى المقال" : "نشر مقال جديد"}
            </h2>

            <form onSubmit={handleSaveArticle} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-neutral-400 mr-1">عنوان المقال</label>
                  <input 
                    type="text" 
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="مثال: كيف تحصل على شهادتك؟"
                    className="w-full bg-[#121A15] border border-neutral-800 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-all font-bold placeholder:text-neutral-700"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-neutral-400 mr-1">التصنيف</label>
                  <select 
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-[#121A15] border border-neutral-800 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-emerald-500 appearance-none cursor-pointer font-bold"
                  >
                    <option value="account">👤 الحساب الشخصي</option>
                    <option value="payment">💳 المدفوعات</option>
                    <option value="course">📚 الكورسات والمحتوى</option>
                    <option value="certificate">🎓 الشهادات</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-sm font-bold text-neutral-400 mr-1">محتوى المقال (يدعم Markdown)</label>
                  <span className="text-[10px] bg-neutral-800 px-2 py-0.5 rounded text-neutral-500 font-mono">RICH TEXT ENABLED</span>
                </div>
                <textarea 
                  rows={12}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="# اكتب عنوانك هنا..."
                  className="w-full bg-[#121A15] border border-neutral-800 rounded-3xl px-6 py-5 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-all resize-none font-mono text-sm leading-loose placeholder:text-neutral-700 shadow-inner"
                  required
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-4 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="text-neutral-500 hover:text-white font-bold transition-colors px-4"
                >
                  إلغاء
                </button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-black px-10 h-14 rounded-2xl shadow-lg shadow-emerald-900/20 disabled:opacity-50 transition-all hover:-translate-y-1 active:scale-95"
                >
                  {isSubmitting ? "جاري الحفظ..." : isEditing ? "حفظ التعديلات" : "نشر المقال الآن"}
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
