import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BottomNav from "@/components/layout/BottomNav";
import { motion, AnimatePresence } from "framer-motion";
import { Search, BookOpen, ChevronDown, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

// استيراد مكتبات الماركدوان
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from 'remark-breaks';
import rehypeRaw from 'rehype-raw';

const categories = [
  { id: "all", label: "الكل" },
  { id: "account", label: "الحساب الشخصي" },
  { id: "payment", label: "المدفوعات" },
  { id: "course", label: "الكورسات والمحتوى" },
  { id: "certificate", label: "الشهادات" },
];

const ArticlesPage = () => {
  const [searchParams] = useSearchParams();
  const queryQ = searchParams.get("q") || "";
  const queryCat = searchParams.get("category") || "all";

  const [articles, setArticles] = useState([]);
  const [searchQuery, setSearchQuery] = useState(queryQ);
  const [selectedCategory, setSelectedCategory] = useState(queryCat);
  const [expandedId, setExpandedId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("help_articles")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (data) setArticles(data);
    } catch (err) {
      console.error("Error fetching articles:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredArticles = articles.filter((article) => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          article.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#050806] text-white flex flex-col font-tajawal" dir="rtl">
      <Navbar />

      <main className="flex-1 pt-28 pb-16 container mx-auto px-4 lg:px-8 max-w-5xl relative">
        {/* تأثير الإضاءة الخلفية */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60vw] h-[60vw] rounded-full bg-emerald-900/5 blur-[120px] pointer-events-none" />

        <div className="relative z-10 mb-12 space-y-10">
          <div className="text-right">
            <h1 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight">مركز المعرفة</h1>
            <p className="text-neutral-400 text-lg max-w-2xl">كل ما تحتاجه من إجابات وشروحات لاستخدام منصة نبتة بأفضل شكل ممكن.</p>
          </div>

          {/* شريط البحث المطور */}
          <div className="relative group max-w-3xl">
            <Search className="absolute right-5 top-1/2 -translate-y-1/2 w-6 h-6 text-neutral-600 group-focus-within:text-emerald-500 transition-colors" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن سؤال أو مشكلة..."
              className="w-full bg-[#0a0f0c] border border-neutral-800 rounded-[2rem] py-5 pr-14 pl-6 text-white text-lg focus:outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 transition-all shadow-2xl"
            />
          </div>
          
          {/* التصنيفات */}
          <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`whitespace-nowrap px-6 py-3 rounded-2xl text-sm font-bold transition-all duration-300 ${
                  selectedCategory === cat.id
                    ? "bg-emerald-600 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)] scale-105"
                    : "bg-[#0a0f0c] border border-neutral-800 text-neutral-500 hover:text-white hover:border-neutral-700"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* قائمة المقالات */}
        <div className="relative z-10 space-y-5">
          {isLoading ? (
            <div className="text-center py-32 flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
              <p className="text-neutral-500 font-bold animate-pulse">جاري جلب المقالات...</p>
            </div>
          ) : filteredArticles.length > 0 ? (
            filteredArticles.map((article) => (
              <div 
                key={article.id} 
                className={`bg-[#0a0f0c] border rounded-[2rem] overflow-hidden transition-all duration-500 ${
                  expandedId === article.id ? "border-emerald-500/30 shadow-[0_0_40px_rgba(16,185,129,0.05)]" : "border-neutral-800/60 hover:border-neutral-700"
                }`}
              >
                <button
                  onClick={() => setExpandedId(expandedId === article.id ? null : article.id)}
                  className="w-full px-6 py-7 flex items-center justify-between text-right group"
                >
                  <div className="flex items-center gap-5">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-500 ${
                      expandedId === article.id ? "bg-emerald-600 text-white rotate-6" : "bg-[#121A15] border border-neutral-800 text-emerald-500 group-hover:scale-110"
                    }`}>
                      <BookOpen className="w-7 h-7" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <span className="font-black text-xl text-white leading-tight group-hover:text-emerald-400 transition-colors">
                        {article.title}
                      </span>
                      <span className="text-xs text-neutral-500 flex items-center gap-2 font-bold">
                        <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                        نُشر في: {new Date(article.created_at).toLocaleDateString('ar-EG')}
                      </span>
                    </div>
                  </div>
                  <ChevronDown className={`w-6 h-6 text-neutral-600 transition-transform duration-500 ${expandedId === article.id ? "rotate-180 text-emerald-500" : "group-hover:translate-y-1"}`} />
                </button>
                
                <AnimatePresence>
                  {expandedId === article.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: "circOut" }}
                      className="px-8 pb-10 pt-2 border-t border-neutral-800/40"
                    >
                      {/* عرض المقال بتنسيق الماركدوان الاحترافي */}
                      <div className="prose prose-lg prose-invert max-w-none 
                        prose-headings:font-black prose-headings:text-white prose-headings:mb-6
                        prose-p:text-neutral-300 prose-p:leading-[2] prose-p:text-justify
                        prose-strong:text-emerald-400 prose-strong:font-black
                        prose-blockquote:border-r-4 prose-blockquote:border-emerald-600 prose-blockquote:bg-emerald-950/20 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-l-2xl prose-blockquote:italic
                        prose-ul:list-disc prose-ul:pr-6 prose-li:text-neutral-300 prose-li:mb-2
                        prose-hr:border-neutral-800 prose-hr:my-10
                        prose-img:rounded-3xl prose-img:shadow-2xl"
                      >
                        <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]} rehypePlugins={[rehypeRaw]}>
                          {article.content}
                        </ReactMarkdown>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))
          ) : (
            <div className="text-center py-32 bg-[#0a0f0c] border border-dashed border-neutral-800 rounded-[3rem]">
              <div className="w-24 h-24 bg-neutral-900/50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-neutral-700" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">لا توجد نتائج</h3>
              <p className="text-neutral-500">حاول البحث بكلمات أخرى أو اختر تصنيفاً مختلفاً.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
};

export default ArticlesPage;
