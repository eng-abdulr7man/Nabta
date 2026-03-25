import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { CalendarDays, ArrowLeft, ThermometerSun, Droplets, ShoppingBag, BookOpen, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const GROQ_API_KEY = "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";

// واجهة البيانات اللي هنستقبلها من الذكاء الاصطناعي
interface AiCropData {
  monthName: string;
  season: string;
  temp: string;
  water: string;
  crops: {
    name: string;
    icon: string;
    desc: string;
  }[];
}

const CropOfTheMonth = () => {
  const [aiData, setAiData] = useState<AiCropData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAiRecommendations = async () => {
      setIsLoading(true);
      setError(null);

      // جلب اسم الشهر الحالي برمجياً باللغة العربية
      const currentMonth = new Intl.DateTimeFormat('ar-EG', { month: 'long' }).format(new Date());

      // هندسة الأوامر (Prompt Engineering) لإجبار الـ AI على إرجاع JSON متوافق مع تصميمنا
      const systemPrompt = `أنت خبير زراعي مصري محترف. الوقت الحالي هو شهر "${currentMonth}".
      بناءً على هذا الشهر والمناخ العام في مصر والشرق الأوسط، اقترح أفضل 3 محاصيل للزراعة الآن.
      يجب أن يكون ردك عبارة عن كائن JSON فقط (بدون أي نصوص إضافية أو علامات Markdown) بهذه الصيغة الدقيقة:
      {
        "monthName": "${currentMonth}",
        "season": "الفصل الحالي (مثال: الربيع)",
        "temp": "متوسط الحرارة (مثال: 15-25°C)",
        "water": "احتياج المياه (مثال: ري منتظم)",
        "crops": [
          { "name": "اسم المحصول", "icon": "رمز تعبيري واحد (Emoji)", "desc": "وصف زراعي مشجع ومختصر جداً في 10 كلمات" },
          { "name": "اسم المحصول", "icon": "رمز تعبيري واحد (Emoji)", "desc": "وصف زراعي مشجع ومختصر جداً في 10 كلمات" },
          { "name": "اسم المحصول", "icon": "رمز تعبيري واحد (Emoji)", "desc": "وصف زراعي مشجع ومختصر جداً في 10 كلمات" }
        ]
      }`;

      try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${GROQ_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [{ role: "user", content: systemPrompt }],
            temperature: 0.3, // تقليل العشوائية لضمان دقة الـ JSON
          }),
        });

        const data = await response.json();
        
        if (data.choices?.[0]?.message?.content) {
          // تنظيف الرد تحسباً لو الـ AI أضاف علامات ```json
          let jsonString = data.choices[0].message.content.replace(/```json/g, '').replace(/```/g, '').trim();
          const parsedData = JSON.parse(jsonString) as AiCropData;
          setAiData(parsedData);
        } else {
          throw new Error("استجابة غير صالحة");
        }
      } catch (err) {
        console.error("AI Fetch Error:", err);
        setError("لم نتمكن من جلب التوصيات الذكية حالياً. يرجى المحاولة لاحقاً.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAiRecommendations();
  }, []);

  return (
    <section className="py-24 relative overflow-hidden bg-[#050806] font-tajawal">
      {/* إضاءات وجماليات الخلفية */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-900/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-yellow-900/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10 max-w-6xl">
        
        {/* Header القسم */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-bold mb-4">
              <CalendarDays className="w-4 h-4" />
              التقويم الزراعي الذكي
            </div>
            
            <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">
              ماذا نزرع في شهر <span className="text-transparent bg-clip-text bg-gradient-to-l from-emerald-400 to-yellow-500">{aiData?.monthName || "..."}</span>؟
            </h2>
            
            <p className="text-neutral-400 mt-4 max-w-xl text-lg">
              توصيات حية من مستشار نبتة الذكي مدعومة بالذكاء الاصطناعي بناءً على حالة الطقس والموسم الزراعي الحالي.
            </p>
          </motion.div>

          {/* ظروف الشهر الجوية (تظهر فقط إذا تم التحميل) */}
          {aiData && !isLoading && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="flex gap-4 bg-[#0a0f0c] p-4 rounded-2xl border border-white/5 shadow-xl shrink-0"
            >
              <div className="flex items-center gap-3 pr-4 border-l border-white/10">
                <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center">
                  <ThermometerSun className="w-5 h-5 text-yellow-500" />
                </div>
                <div>
                  <p className="text-xs text-neutral-500">متوسط الحرارة</p>
                  <p className="text-white font-bold">{aiData.temp}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 pl-2">
                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <Droplets className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-xs text-neutral-500">احتياج المياه</p>
                  <p className="text-white font-bold">{aiData.water}</p>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* حالة التحميل أو الخطأ أو عرض الكروت */}
        {isLoading ? (
          // Skeleton Loader فخم أثناء التفكير
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-[#0a0f0c] border border-neutral-800/60 rounded-[2rem] p-6 h-[350px] animate-pulse flex flex-col">
                <div className="w-16 h-16 bg-[#121A15] rounded-2xl mb-6" />
                <div className="h-6 w-1/2 bg-[#121A15] rounded-md mb-4" />
                <div className="h-4 w-full bg-[#121A15] rounded-md mb-2" />
                <div className="h-4 w-3/4 bg-[#121A15] rounded-md" />
                <div className="mt-auto grid grid-cols-2 gap-3 pt-5">
                  <div className="h-12 bg-[#121A15] rounded-xl" />
                  <div className="h-12 bg-[#121A15] rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center bg-red-500/10 border border-red-500/20 rounded-2xl p-8 text-red-400">
            <p>{error}</p>
          </div>
        ) : aiData ? (
          // الكروت التفاعلية للمحاصيل (من الـ AI)
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {aiData.crops.map((crop, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="group bg-gradient-to-br from-[#0a0f0c] to-[#121A15] border border-neutral-800/60 rounded-[2rem] p-6 hover:border-emerald-500/30 transition-all duration-300 hover:-translate-y-2 shadow-lg hover:shadow-2xl hover:shadow-emerald-500/10 flex flex-col h-full"
              >
                <div className="w-16 h-16 bg-[#1a241d] rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-inner border border-white/5 group-hover:scale-110 transition-transform duration-300">
                  {crop.icon}
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{crop.name}</h3>
                <p className="text-neutral-400 text-sm mb-8 leading-relaxed">
                  {crop.desc}
                </p>
                
                <div className="mt-auto grid grid-cols-2 gap-3 border-t border-white/5 pt-5">
                  <Link to={`/courses?q=${crop.name}`} className="w-full">
                    <Button variant="outline" className="w-full h-12 bg-transparent border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300 rounded-xl gap-2 font-bold transition-all text-xs lg:text-sm px-0">
                      <BookOpen className="w-4 h-4" /> تعلم زراعته
                    </Button>
                  </Link>
                  <Link to={`/marketplace?q=${crop.name}`} className="w-full">
                    <Button className="w-full h-12 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl gap-2 font-bold shadow-[0_0_15px_rgba(16,185,129,0.2)] transition-all text-xs lg:text-sm px-0">
                      <ShoppingBag className="w-4 h-4" /> شراء التقاوي
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        ) : null}

      </div>
    </section>
  );
};

export default CropOfTheMonth;
