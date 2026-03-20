import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BottomNav from "@/components/layout/BottomNav";
import { motion, AnimatePresence } from "framer-motion";
import { Search, BookOpen, Plus, Trash2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const categories = [
  { id: "all", label: "الكل" },
  { id: "account", label: "الحساب الشخصي" },
  { id: "payment", label: "المدفوعات" },
  { id: "course", label: "الكورسات والمحتوى" },
  { id: "certificate", label: "الشهادات" },
];

const ArticlesPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const queryQ = searchParams.get("q") || "";
  const queryCat = searchParams.get("category") || "all";

  const [articles, setArticles] = useState([]);
  const [searchQuery, setSearchQuery] = useState(queryQ);
  const [selectedCategory, setSelectedCategory] = useState(queryCat);
  const [expandedId, setExpandedId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // حالات نافذة إضافة مقال
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newCategory, setNewCategory] = useState("account");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 🔥 الضربة القاضية: إجبار النظام على رؤيتك كأدمن بدون أي شروط
  const isAdmin = true; 

  useEffect(() => {
    window.scrollTo(0, 0);
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
      toast({ title: "خطأ", description: "يرجى ملء العنوان والمحتوى", variant: "destructive" });
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
    if (!window.confirm("هل أنت متأكد من حذف هذا المقال؟")) return;
    const { error } = await supabase.from("help_articles").delete().eq("id", id);
    if (!error) {
      toast({ title: "تم الحذف", description: "تم حذف المقال بنجاح." });
      setArticles(articles.filter((a) => a.id !== id));
    }
  };

  const filteredArticles = articles.filter((article) => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          article.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#050806] text-white flex flex-col font-tajawal">
      <Navbar />

      <main className="flex-1 pt-28 pb-16 container mx-auto px-4 lg:px-8 max-w-5xl relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[50vw] h-[50vw] rounded-full bg-emerald-900/10 blur-[150px] pointer-events-none" />

        <div className="relative z-10 mb-12 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-white mb-3">مركز المعرفة (اختبار)</h1>
              <p className="text-neutral-400">ابحث عن إجابات لأسئلتك أو تصفح المقالات المتاحة.</p>
            </div>
            
            {isAdmin && (
              <Button 
                onClick={() => setShowAddModal(true)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl h-12 px-6 flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.2)]"
              >
                <Plus className="w-5 h-5" />
                مقال جديد
              </Button>
            )}
          </div>

          <div className="relative">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن مشكلة أو سؤال..."
              className="w-full bg-[#121A15] border border-neutral-800 rounded-2xl py-4 pr-12 pl-4 text-white focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20"
            />
          </div>
          
          <div className="flex gap-3 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`whitespace-nowrap px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  selectedCategory === cat.id
                    ? "bg-emerald-600 text-white shadow-lg"
                    : "bg-[#0a0f0c] border border-neutral-800 text-neutral-400 hover:text-white hover:bg-[#121A15]"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div className="relative z-10 space-y-4">
          {isLoading ? (
            <div className="text-center py-20 text-emerald-500 animate-pulse font-bold">جاري تحميل المقالات...</div>
          ) : filteredArticles.length > 0 ? (
            filteredArticles.map((article) => (
              <div key={article.id} className="bg-[#0a0f0c] border border-neutral-800/60 rounded-2xl overflow-hidden transition-all hover:border-emerald-500/30">
                <button
                  onClick={() => setExpandedId(expandedId === article.id ? null : article.id)}
                  className="w-full px-6 py-5 flex items-center justify-between text-right"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#121A15] border border-neutral-800 flex items-center justify-center shrink-0">
                      <BookOpen className="w-5 h-5 text-emerald-500" />
                    </div>
                    <span className="font-bold text-lg text-white">{article.title}</span>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-neutral-500 transition-transform ${expandedId === article.id ? "rotate-180 text-emerald-500" : ""}`} />
                </button>
                
                <AnimatePresence>
                  {expandedId === article.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-6 pb-6 pt-2 border-t border-neutral-800/40"
                    >
                      <div className="prose prose-invert max-w-none text-neutral-300 leading-loose whitespace-pre-wrap">
                        {article.content}
                      </div>
                      
                      {isAdmin && (
                        <div className="mt-6 flex justify-end">
                          <Button 
                            variant="destructive" 
                            onClick={() => handleDelete(article.id)}
                            className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white text-sm h-9 px-4 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4 ml-2" />
                            حذف المقال
                          </Button>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))
          ) : (
            <div className="text-center py-20 bg-[#0a0f0c] border border-neutral-800/60 rounded-3xl">
              <BookOpen className="w-12 h-12 text-neutral-600 mx-auto mb-4" />
              <p className="text-neutral-400 font-bold">لم نتمكن من العثور على مقالات تطابق بحثك.</p>
            </div>
          )}
        </div>
      </main>

      {isAdmin && showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
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

      <Footer />
      <BottomNav />
    </div>
  );
};

export default ArticlesPage;
