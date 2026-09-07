import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ThermometerSun, Droplets, ShoppingBag, BookOpen } from "lucide-react";
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
    const fetchRecommendations = async () => {
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
        console.error("Fetch Error:", err);
        setError("حصلت مشكلة وإحنا بنحمّل المحتوى. جرّب تاني.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  const handleLearnMore = (cropName: string) => {
    const event = new CustomEvent('openAiChat', {
      detail: { query: `إزاي أزرع ${cropName} ومتى أفضل وقت لزراعته؟` }
    });
    window.dispatchEvent(event);
  };

  return (
    <section className="py-16 bg-background font-tajawal border-t border-border/40">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6" dir="rtl">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
              نزرع إيه في شهر <span className="text-primary">{aiData?.monthName || "..."}</span>؟
            </h2>
            <p className="text-muted-foreground mt-1.5 text-sm sm:text-base">
              حسب الجو والأرض الفترة دي، دي المحاصيل المناسبة.
            </p>
          </div>

          {aiData && !isLoading && (
            <div className="flex items-center gap-4 bg-card border border-border px-4 py-2.5 rounded-xl text-xs shrink-0">
              <div className="flex items-center gap-2 pl-3 border-l border-border">
                <ThermometerSun className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">الجو:</span>
                <span className="font-semibold text-foreground">{aiData.temp}</span>
              </div>
              <div className="flex items-center gap-2">
                <Droplets className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">الري:</span>
                <span className="font-semibold text-foreground">{aiData.water}</span>
              </div>
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-5 h-56 animate-pulse flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-10 h-10 bg-muted rounded-lg" />
                  <div className="h-5 w-1/2 bg-muted rounded" />
                  <div className="h-4 w-full bg-muted rounded" />
                </div>
                <div className="grid grid-cols-2 gap-2 pt-4 border-t border-border">
                  <div className="h-9 bg-muted rounded-lg" />
                  <div className="h-9 bg-muted rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center bg-card border border-border rounded-xl p-6 text-muted-foreground text-sm">
            <p>{error}</p>
          </div>
        ) : aiData ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5" dir="rtl">
            {aiData.crops.map((crop, idx) => (
              <div
                key={idx}
                className="bg-card border border-border rounded-xl p-5 flex flex-col justify-between transition-colors hover:border-border/80"
              >
                <div>
                  <div className="w-12 h-12 bg-muted/50 border border-border/60 rounded-xl flex items-center justify-center text-xl mb-4">
                    {crop.icon}
                  </div>
                  <h3 className="text-base font-bold text-foreground mb-1">{crop.name}</h3>
                  <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed mb-6">
                    {crop.desc}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-2 border-t border-border pt-4">
                  <Button 
                    onClick={() => handleLearnMore(crop.name)}
                    variant="outline" 
                    className="w-full h-9 bg-background border-border hover:bg-muted text-foreground text-xs font-medium rounded-lg gap-1.5"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    <span className="truncate">اعرف أكتر</span>
                  </Button>

                  <Link to={`/marketplace?q=${crop.name}`} className="w-full">
                    <Button className="w-full h-9 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-medium rounded-lg gap-1.5">
                      <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">تقاوي</span>
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default CropOfTheMonth;
