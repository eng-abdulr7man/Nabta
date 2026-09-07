import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { CalendarDays, ThermometerSun, Droplets, ShoppingBag, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

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

      try {
        const { data: aiResult, error: aiError } = await supabase.functions.invoke("ai-generate", {
          body: { action: "crop" },
        });

        if (aiError || !aiResult?.content) throw new Error(aiResult?.error || "استجابة غير صالحة");

        let jsonString = aiResult.content.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsedData = JSON.parse(jsonString) as AiCropData;
        setAiData(parsedData);
      } catch (err) {
        console.error("AI Fetch Error:", err);
        setError("لم نتمكن من جلب التوصيات الذكية حالياً. يرجى المحاولة لاحقاً.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAiRecommendations();
  }, []);

  const handleLearnWithAi = (cropName: string) => {
    const event = new CustomEvent('openAiChat', {
      detail: { query: `كيف أزرع ${cropName} ومتى أفضل وقت لزراعته؟` }
    });
    window.dispatchEvent(event);
  };

  return (
    <section className="py-20 bg-background font-tajawal">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6" dir="rtl">
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-3">
              <CalendarDays className="w-3.5 h-3.5" />
              التقويم الزراعي الذكي
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
              نزرع ايه في شهر <span className="text-primary">{aiData?.monthName || "..."}</span>؟
            </h2>
            <p className="text-muted-foreground mt-2 max-w-xl text-sm sm:text-base">
              توصيات حية مدعومة بالذكاء الاصطناعي بناءً على حالة الطقس والموسم الزراعي الحالي.
            </p>
          </motion.div>

          {aiData && !isLoading && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex gap-4 bg-card border border-border p-3.5 rounded-2xl shadow-sm shrink-0">
              <div className="flex items-center gap-3 pl-4 border-l border-border/60">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center">
                  <ThermometerSun className="w-4 h-4 text-amber-500" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground font-medium">متوسط الحرارة</p>
                  <p className="text-foreground text-xs font-bold">{aiData.temp}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 pr-2">
                <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <Droplets className="w-4 h-4 text-blue-500" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground font-medium">احتياج المياه</p>
                  <p className="text-foreground text-xs font-bold">{aiData.water}</p>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-muted border border-border rounded-2xl p-6 h-[340px] animate-pulse flex flex-col">
                <div className="w-14 h-14 bg-muted-foreground/10 rounded-xl mb-5" />
                <div className="h-5 w-1/2 bg-muted-foreground/10 rounded-md mb-3" />
                <div className="h-4 w-full bg-muted-foreground/10 rounded-md mb-2" />
                <div className="h-4 w-3/4 bg-muted-foreground/10 rounded-md" />
                <div className="mt-auto grid grid-cols-2 gap-2 pt-4">
                  <div className="h-10 bg-muted-foreground/10 rounded-xl" />
                  <div className="h-10 bg-muted-foreground/10 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-red-400 text-sm">
            <p>{error}</p>
          </div>
        ) : aiData ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6" dir="rtl">
            {aiData.crops.map((crop, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="group bg-card border border-border rounded-2xl p-5 hover:border-primary/40 transition-all duration-300 flex flex-col h-full"
              >
                <div className="w-14 h-14 bg-muted border border-border/60 rounded-xl flex items-center justify-center text-2xl mb-5 group-hover:scale-105 transition-transform duration-300 shrink-0">
                  {crop.icon}
                </div>
                <h3 className="text-lg font-bold text-foreground mb-1.5">{crop.name}</h3>
                <p className="text-muted-foreground text-xs sm:text-sm mb-6 leading-relaxed">
                  {crop.desc}
                </p>
                
                <div className="mt-auto grid grid-cols-2 gap-2 border-t border-border/60 pt-4">
                  <Button 
                    onClick={() => handleLearnWithAi(crop.name)}
                    variant="outline" 
                    className="w-full h-10 bg-card border-border hover:bg-primary/5 text-foreground hover:text-primary rounded-xl gap-1.5 font-medium transition-all text-xs"
                  >
                    <Bot className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span className="truncate">اتعلم زراعته</span>
                  </Button>

                  <Link to={`/marketplace?q=${crop.name}`} className="w-full">
                    <Button className="w-full h-10 bg-primary hover:bg-primary/95 text-primary-foreground rounded-xl gap-1.5 font-semibold transition-all text-xs">
                      <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">شراء تقاوي</span>
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
