import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowLeft, Loader2, Leaf, Bug, Droplets, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";

const GROQ_API_KEY = "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";

const AiAnalyzerSection = () => {
  const [problemText, setProblemText] = useState("");
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!problemText.trim()) return;
    
    setIsLoading(true);
    setAiResponse(null);
    setError(null);

    const systemPrompt = `أنت مهندس زراعي خبير تعمل في منصة 'نبتة'. 
    مهمتك: تحليل المشكلة الزراعية التي يكتبها المستخدم وإعطاء نصيحة سريعة ودقيقة ومختصرة (لا تتجاوز 4 أسطر).
    اقترح في النهاية إما منتج زراعي (مبيد/سماد) لحل المشكلة، أو كورس لتعلم المزيد.`;

    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: problemText }
          ],
          temperature: 0.7,
          max_tokens: 250,
        }),
      });

      const data = await response.json();
      if (data.choices?.[0]?.message) {
        setAiResponse(data.choices[0].message.content);
      } else {
        throw new Error("استجابة غير صالحة من الخادم");
      }
    } catch (err) {
      setError("حدث خطأ أثناء الاتصال بالمستشار الذكي. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsLoading(false);
    }
  };

  const suggestions = [
    "ورق الطماطم به بقع صفراء وبنية",
    "ثمار المانجو تتساقط قبل النضج",
    "التربة تحتفظ بالماء وتسبب عفن الجذور"
  ];

  return (
    <section className="py-24 relative overflow-hidden bg-[#050806] font-tajawal">
      {/* تأثيرات الإضاءة */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-900/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10 max-w-5xl">
        <div className="flex flex-col lg:flex-row gap-12 items-center bg-gradient-to-r from-[#0a0f0c] to-[#0f1712] border border-white/5 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
          
          {/* زخرفة هندسية */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[url('/grid.svg')] opacity-10 pointer-events-none" />

          {/* النصوص (اليمين) */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            className="w-full lg:w-1/2 space-y-6 text-right" dir="rtl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-bold">
              <Sparkles className="w-4 h-4" />
              تكنولوجيا الذكاء الاصطناعي
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">
              اسأل <span className="text-emerald-500">نبتة الذكية</span> عن مشكلة محصولك
            </h2>
            <p className="text-neutral-400 text-lg leading-relaxed">
              صف لنا الأعراض التي تظهر على نباتاتك أو مشكلتك الزراعية، وسيقوم مستشارنا الذكي بتحليلها واقتراح الحلول الفورية (علاجات، أسمدة، أو نصائح ري).
            </p>

            <div className="flex gap-4 pt-4 text-neutral-500">
              <div className="flex flex-col items-center gap-2 bg-[#121A15] p-3 rounded-xl border border-white/5 shrink-0 w-24">
                <Leaf className="w-6 h-6 text-green-500" />
                <span className="text-xs font-bold text-neutral-300">أمراض ورقية</span>
              </div>
              <div className="flex flex-col items-center gap-2 bg-[#121A15] p-3 rounded-xl border border-white/5 shrink-0 w-24">
                <Bug className="w-6 h-6 text-orange-500" />
                <span className="text-xs font-bold text-neutral-300">حشرات</span>
              </div>
              <div className="flex flex-col items-center gap-2 bg-[#121A15] p-3 rounded-xl border border-white/5 shrink-0 w-24">
                <Droplets className="w-6 h-6 text-blue-500" />
                <span className="text-xs font-bold text-neutral-300">نقص عناصر</span>
              </div>
            </div>
          </motion.div>

          {/* التفاعل (اليسار) */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            className="w-full lg:w-1/2 relative z-10" dir="rtl"
          >
            <div className="bg-[#121A15]/80 backdrop-blur-xl border border-neutral-800/80 rounded-3xl p-6 shadow-[0_0_30px_rgba(16,185,129,0.05)]">
              
              {/* الاقتراحات السريعة */}
              <div className="flex flex-wrap gap-2 mb-4">
                {suggestions.map((s, i) => (
                  <button 
                    key={i} 
                    onClick={() => setProblemText(s)}
                    className="text-xs px-3 py-1.5 bg-white/5 hover:bg-emerald-500/20 text-neutral-400 hover:text-emerald-400 border border-white/5 rounded-full transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>

              <textarea
                value={problemText}
                onChange={(e) => setProblemText(e.target.value)}
                placeholder="اكتب هنا: مثلاً أطراف أوراق الذرة محترقة..."
                className="w-full h-32 bg-[#0a0f0c] border border-neutral-800 rounded-2xl p-4 text-white text-sm outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 resize-none transition-all placeholder:text-neutral-600 mb-4"
              />

              {aiResponse ? (
                <div className="mb-4 bg-emerald-900/10 border border-emerald-500/20 rounded-2xl p-4 relative overflow-hidden">
                   <Bot className="absolute top-3 right-3 text-emerald-500/20 w-10 h-10" />
                   <p className="text-emerald-100 text-sm leading-relaxed whitespace-pre-wrap relative z-10 font-medium">
                     {aiResponse}
                   </p>
                   <button 
                     onClick={() => { setAiResponse(null); setProblemText(""); }}
                     className="text-xs text-neutral-400 hover:text-emerald-400 underline mt-3 block relative z-10"
                   >
                     سؤال جديد
                   </button>
                </div>
              ) : error ? (
                <div className="mb-4 bg-red-900/10 border border-red-500/20 rounded-2xl p-4 text-red-400 text-sm">
                  {error}
                </div>
              ) : null}

              <Button
                onClick={handleAnalyze}
                disabled={isLoading || !problemText.trim() || !!aiResponse}
                className="w-full h-12 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg transition-all"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" /> جاري تحليل المشكلة...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2 w-full">
                    <Sparkles className="w-4 h-4" /> بدء التحليل الذكي
                  </div>
                )}
              </Button>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default AiAnalyzerSection;
