import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BottomNav from "@/components/layout/BottomNav";
import { motion, AnimatePresence } from "framer-motion";
import { Search, BookOpen, ChevronDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

// --- الاستيرادات الجديدة للماركدوان ---
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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
    const { data } = await supabase.from("help_articles").select("*").order("created_at", { ascending: false });
    if (data) setArticles(data);
    setIsLoading(false);
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
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">مركز المعرفة</h1>
            <p className="text-neutral-400">دليلك الشامل لاستخدام منصة نبتة التعليمية.</p>
          </div>

          <div className="relative group">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500 group-focus-within:text-emerald-500 transition-colors" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن مشكلة أو سؤال..."
              className="w-full bg-[#121A15] border border-neutral-800 rounded-2xl py-4 pr-12 pl-4 text-white focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all"
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
                  className="w-full px-6 py-6 flex items-center justify-between text-right"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#121A15] border border-neutral-800 flex items-center justify-center shrink-0">
                      <BookOpen className="w-6 h-6 text-emerald-500" />
                    </div>
                    <span className="font-bold text-lg text-white leading-relaxed">{article.title}</span>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-neutral-500 transition-transform duration-300 ${expandedId === article.id ? "rotate-180 text-emerald-500" : ""}`} />
                </button>
                
                <AnimatePresence>
                  {expandedId === article.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-6 pb-8 pt-2 border-t border-neutral-800/40"
                    >
                      {/* --- عرض المحتوى باستخدام ReactMarkdown --- */}
                      <div className="prose prose-sm md:prose-base prose-invert max-w-none 
                        prose-headings:font-black prose-headings:text-white prose-headings:mb-4
                        prose-p:text-neutral-300 prose-p:leading-loose
                        prose-strong:text-emerald-400 prose-strong:font-bold
                        prose-blockquote:border-r-4 prose-blockquote:border-emerald-500 prose-blockquote:bg-emerald-500/5 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-l-lg
                        prose-ul:list-disc prose-li:text-neutral-300
                        prose-hr:border-neutral-800 my-4"
                      >
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {article.content}
                        </ReactMarkdown>
                      </div>
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

      <Footer />
      <BottomNav />
    </div>
  );
};

export default ArticlesPage;
