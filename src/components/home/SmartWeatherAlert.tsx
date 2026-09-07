import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ThermometerSun, Wind, Droplets, AlertTriangle, Sparkles, CloudSun, CloudRain, Bot, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface WeatherData {
  city: string;
  temp: number;
  humidity: number;
  windSpeed: number;
  isRaining: boolean;
}

const SmartWeatherAlert = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [aiAdvice, setAiAdvice] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSmartWeather = async () => {
      try {
        const geoRes = await fetch("https://get.geojs.io/v1/ip/geo.json");
        const geoData = await geoRes.json();
        const lat = geoData.latitude || 31.05; 
        const lon = geoData.longitude || 31.38;
        const city = geoData.city || "مدينتك";

        const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code`);
        const weatherDataRaw = await weatherRes.json();
        const current = weatherDataRaw.current;
        
        const wData = {
          city: city,
          temp: Math.round(current.temperature_2m),
          humidity: Math.round(current.relative_humidity_2m),
          windSpeed: Math.round(current.wind_speed_10m),
          isRaining: current.weather_code >= 50, 
        };
        setWeather(wData);

        const { data: aiResult, error: aiError } = await supabase.functions.invoke("ai-generate", {
          body: { action: "weather", data: wData },
        });
        if (aiError || !aiResult?.content) throw new Error(aiResult?.error || "استجابة غير صالحة");
        setAiAdvice(aiResult.content);
        
      } catch (error) {
        console.error("Failed to fetch smart weather", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSmartWeather();
  }, []);

  const askAiAboutWeather = () => {
    if (!weather) return;
    const event = new CustomEvent('openAiChat', {
      detail: { query: `درجة الحرارة عندي ${weather.temp} درجة. إيه الإجراءات اللي لازم أعملها لحماية محصولي النهاردة؟` }
    });
    window.dispatchEvent(event);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 max-w-5xl my-6">
        <div className="h-36 bg-card border border-border rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (!weather || !aiAdvice) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="container mx-auto px-4 max-w-5xl my-6"
    >
      <div className="bg-card border border-border rounded-2xl p-5 md:p-6 shadow-sm flex flex-col lg:flex-row gap-6 items-stretch lg:items-center">
        
        {/* القسم الأول: بيانات الطقس */}
        <div className="flex flex-col sm:flex-row items-center sm:justify-between lg:justify-start gap-4 sm:gap-6 lg:border-l lg:border-border/60 lg:pl-6 shrink-0 w-full lg:w-auto">
          
          {/* درجة الحرارة والمدينة */}
          <div className="flex items-center justify-between sm:justify-start w-full sm:w-auto gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-xl bg-background border border-border flex items-center justify-center shrink-0 shadow-sm">
                {weather.isRaining ? (
                  <CloudRain className="w-6 h-6 text-blue-500" />
                ) : weather.temp > 28 ? (
                  <ThermometerSun className="w-6 h-6 text-amber-500" />
                ) : (
                  <CloudSun className="w-6 h-6 text-primary" />
                )}
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium mb-1">
                  طقس <span className="text-foreground font-semibold">{weather.city}</span>
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-foreground tabular-nums tracking-tight leading-none">{weather.temp}°</span>
                  <span className="text-muted-foreground text-xs font-normal">مئوية</span>
                </div>
              </div>
            </div>
          </div>

          <div className="hidden sm:block lg:hidden w-px h-8 bg-border" />
          <div className="block sm:hidden w-full h-px bg-border my-1" />

          {/* الرطوبة والرياح */}
          <div className="flex items-center justify-around sm:justify-start w-full sm:w-auto gap-6">
            <div className="flex items-center gap-2.5">
              <Droplets className="w-4 h-4 text-blue-500 shrink-0" />
              <div>
                <p className="text-[10px] text-muted-foreground font-medium">الرطوبة</p>
                <p className="text-sm text-foreground font-semibold tabular-nums">{weather.humidity}%</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <Wind className="w-4 h-4 text-muted-foreground shrink-0" />
              <div>
                <p className="text-[10px] text-muted-foreground font-medium">الرياح</p>
                <p className="text-sm text-foreground font-semibold tabular-nums">{weather.windSpeed} كم/س</p>
              </div>
            </div>
          </div>
        </div>

        {/* القسم الثاني: نصيحة الذكاء الاصطناعي */}
        <div className="flex-1 bg-background border border-border/80 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 w-full">
          <div className="flex items-start gap-3 w-full sm:w-auto">
            <div className="shrink-0 mt-0.5">
              {weather.windSpeed > 20 || weather.temp > 35 ? (
                <AlertTriangle className="w-4 h-4 text-red-500" />
              ) : (
                <Sparkles className="w-4 h-4 text-primary" />
              )}
            </div>
            <div>
              <p className="text-xs font-semibold text-primary mb-1 flex items-center gap-1.5">
                <Bot className="w-3.5 h-3.5" /> تنبيه نبتة الذكي
              </p>
              <p className="text-sm text-foreground leading-relaxed">
                {aiAdvice}
              </p>
            </div>
          </div>
          
          <button 
            onClick={askAiAboutWeather}
            className="w-full sm:w-auto shrink-0 text-xs bg-muted hover:bg-primary text-foreground hover:text-primary-foreground px-4 py-2.5 rounded-lg border border-border transition-colors flex items-center justify-center gap-2 font-medium"
          >
            <span>اسأل المساعد</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </motion.div>
  );
};

export default SmartWeatherAlert;
