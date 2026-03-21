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
    <div className="min-h-screen bg-[#050806] text-white flex flex-col font-tajawal selection:bg-emerald-500/30" dir="rtl">
      <Navbar />

      <main className="flex-1 pt-32 pb-24 container mx-auto px-4 lg:px-8 max-w-4xl relative">
        {/* تأثير الإضاءة الخلفية */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-emerald-600/5 blur-[120px] pointer-events-none -z-10" />

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="relative z-10 mb-16 text-center md:text-right space-y-8">
            <div>
              <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight leading-tight">
                مركز المساعدة <span className="text-emerald-500">ونبض المعرفة</span>
              </h1>
              <p className="text-neutral-400 text-lg md:text-xl max-w-3xl leading-relaxed">
                دليلك الكامل للإجابة على تساؤلاتك حول منصة نبتة التعليمية.
              </p>
            </div>

            {/* شريط البحث */}
            <div className="relative group max-w-2xl mx-auto md:mr-0">
              <Search className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500 group-focus-within:text-emerald-500 transition-colors" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن سؤال، كورس، أو مشكلة..."
                className="w-full bg-[#0a0f0c] border border-neutral-800 rounded-3xl py-5 pr-14 pl-6 text-white text-md focus:outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 transition-all shadow-xl placeholder:text-neutral-600"
              />
            </div>
            
            {/* التصنيفات */}
            <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`whitespace-nowrap px-6 py-2.5 rounded-full text-xs font-black border transition-all duration-300 ${
                    selectedCategory === cat.id
                      ? "bg-emerald-600 border-emerald-500 text-white shadow-lg"
                      : "bg-[#0a0f0c] border-neutral-800 text-neutral-500 hover:text-white"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* قائمة المقالات */}
          <div className="space-y-4 relative z-10">
            {isLoading ? (
              <div className="py-20 flex flex-col items-center gap-4">
                <div className="w-10 h-10 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
              </div>
            ) : filteredArticles.length > 0 ? (
              filteredArticles.map((article, index) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  key={article.id} 
                  className={`group border rounded-3xl transition-all duration-300 ${
                    expandedId === article.id 
                    ? "bg-[#0a0f0c] border-emerald-500/30 ring-1 ring-emerald-500/10 shadow-2xl" 
                    : "bg-[#0a0f0c]/40 border-neutral-800/60 hover:border-neutral-700"
                  }`}
                >
                  <button
                    onClick={() => setExpandedId(expandedId === article.id ? null : article.id)}
                    className="w-full px-6 py-6 flex items-center justify-between text-right"
                  >
                    <div className="flex items-center gap-5">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-300 ${
                        expandedId === article.id ? "bg-emerald-500 text-white" : "bg-neutral-900 text-emerald-500"
                      }`}>
                        <BookOpen className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className={`font-black text-lg transition-colors ${expandedId === article.id ? "text-emerald-400" : "text-white"}`}>
                          {article.title}
                        </h3>
                        <p className="text-[11px] text-neutral-500 font-bold mt-1">
                          نُشر بتاريخ {new Date(article.created_at).toLocaleDateString('ar-EG')}
                        </p>
                      </div>
                    </div>
                    <ChevronDown className={`w-5 h-5 text-neutral-600 transition-transform duration-500 ${expandedId === article.id ? "rotate-180 text-emerald-500" : ""}`} />
                  </button>
                  
                  <AnimatePresence>
                    {expandedId === article.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="px-8 pb-10 pt-4 border-t border-neutral-800/40">
                          <div className="prose prose-invert prose-emerald max-w-none 
                            prose-p:text-neutral-300 prose-p:leading-relaxed prose-p:text-lg
                            prose-headings:font-black prose-headings:text-white
                            prose-strong:text-emerald-400 prose-strong:font-black
                            prose-ul:list-disc prose-ul:pr-6 prose-ul:text-neutral-300
                            prose-blockquote:border-r-4 prose-blockquote:border-l-0 prose-blockquote:border-emerald-500 
                            prose-blockquote:bg-[#121A15] prose-blockquote:px-6 prose-blockquote:py-2 prose-blockquote:rounded-l-2xl
                            prose-img:rounded-3xl prose-img:shadow-2xl prose-img:mx-auto"
                          >
                            <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]} rehypePlugins={[rehypeRaw]}>
                              {article.content}
                            </ReactMarkdown>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-20 bg-[#0a0f0c] border border-neutral-800 rounded-3xl">
                <p className="text-neutral-500 font-bold">لم نجد أي نتائج لبحثك.</p>
              </div>
            )}
          </div>
        </motion.div>
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
};

export default ArticlesPage;
