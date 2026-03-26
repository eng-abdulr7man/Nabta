import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ThermometerSun, Wind, Droplets, AlertTriangle, Sparkles, CloudSun, CloudRain, Bot, ArrowLeft } from "lucide-react";

const GROQ_API_KEY = "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";

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

        const systemPrompt = `أنت مستشار زراعي طوارئ في مصر. 
        الطقس اليوم في مدينة ${wData.city}: الحرارة ${wData.temp} درجة، الرطوبة ${wData.humidity}%، وسرعة الرياح ${wData.windSpeed} كم/ساعة. المطر: ${wData.isRaining ? 'يوجد' : 'لا يوجد'}.
        اكتب نصيحة زراعية سريعة ومباشرة وتحذيرية للمزارع في جملة واحدة فقط (لا تزيد عن 15 كلمة).`;

        const aiRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${GROQ_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [{ role: "user", content: systemPrompt }],
            temperature: 0.4,
          }),
        });

        const aiDataRaw = await aiRes.json();
        setAiAdvice(aiDataRaw.choices[0].message.content.replace(/["']/g, ""));
        
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
      <div className="container mx-auto px-4 max-w-6xl my-8">
        {/* Skeleton متجاوب */}
        <div className="h-40 lg:h-32 bg-[#0a0f0c] border border-white/5 rounded-[2rem] animate-pulse" />
      </div>
    );
  }

  if (!weather || !aiAdvice) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container mx-auto px-4 max-w-6xl my-4 lg:my-8 relative z-20 font-tajawal"
    >
      <div className="bg-gradient-to-r from-[#0a0f0c] to-[#121A15] border border-neutral-800/60 rounded-[2rem] p-5 md:p-6 shadow-2xl relative overflow-hidden flex flex-col lg:flex-row gap-5 lg:gap-8 items-stretch lg:items-center">
        
        {/* إضاءة خلفية للبطاقة */}
        <div className={`absolute top-0 right-0 w-64 h-64 blur-[80px] rounded-full pointer-events-none opacity-20 ${weather.temp > 30 ? 'bg-red-500' : weather.isRaining ? 'bg-blue-500' : 'bg-emerald-500'}`} />

        {/* 🌟 القسم الأول: معلومات الطقس (مرن للموبايل والتابلت) 🌟 */}
        <div className="flex flex-col sm:flex-row items-center sm:justify-between lg:justify-start gap-4 sm:gap-6 lg:border-l lg:border-white/10 lg:pl-8 shrink-0 w-full lg:w-auto relative z-10">
          
          {/* الأيقونة ودرجة الحرارة */}
          <div className="flex items-center justify-between sm:justify-start w-full sm:w-auto gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-black/40 flex items-center justify-center border border-white/5 shadow-inner shrink-0">
                {weather.isRaining ? <CloudRain className="w-7 h-7 text-blue-400" /> : weather.temp > 28 ? <ThermometerSun className="w-7 h-7 text-yellow-500" /> : <CloudSun className="w-7 h-7 text-emerald-400" />}
              </div>
              <div>
                <p className="text-xs md:text-sm text-neutral-400 font-bold mb-0.5">طقس <span className="text-emerald-400">{weather.city}</span></p>
                <div className="flex items-end gap-1">
                  <span className="text-3xl md:text-4xl font-black text-white tabular-nums tracking-tighter leading-none">{weather.temp}°</span>
                  <span className="text-neutral-500 text-xs md:text-sm font-medium mb-0.5">مئوية</span>
                </div>
              </div>
            </div>
          </div>

          {/* الفاصل الزخرفي (يظهر كخط أفقي في الموبايل، وعمودي في التابلت) */}
          <div className="hidden sm:block lg:hidden w-px h-10 bg-white/10" />
          <div className="block sm:hidden w-full h-px bg-white/5 my-1" />

          {/* الرطوبة والرياح */}
          <div className="flex items-center justify-around sm:justify-start w-full sm:w-auto gap-6 sm:gap-8">
            <div className="flex items-center gap-2.5">
              <Droplets className="w-5 h-5 text-blue-400 shrink-0" />
              <div>
                <p className="text-[10px] text-neutral-500 font-bold leading-none mb-1">الرطوبة</p>
                <p className="text-sm text-white font-bold leading-none">{weather.humidity}%</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <Wind className="w-5 h-5 text-neutral-400 shrink-0" />
              <div>
                <p className="text-[10px] text-neutral-500 font-bold leading-none mb-1">سرعة الرياح</p>
                <p className="text-sm text-white font-bold leading-none">{weather.windSpeed} كم/س</p>
              </div>
            </div>
          </div>
        </div>

        {/* 🌟 القسم الثاني: نصيحة الذكاء الاصطناعي 🌟 */}
        <div className="flex-1 bg-emerald-900/10 border border-emerald-500/20 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10 w-full">
          <div className="flex items-start gap-3 w-full sm:w-auto">
            <div className="shrink-0 mt-1">
              {weather.windSpeed > 20 || weather.temp > 35 ? (
                <AlertTriangle className="w-5 h-5 text-red-400" />
              ) : (
                <Sparkles className="w-5 h-5 text-emerald-400" />
              )}
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold text-emerald-500 mb-1.5 flex items-center gap-1.5">
                <Bot className="w-3.5 h-3.5" /> تنبيه نبتة الذكي
              </p>
              <p className="text-sm text-white leading-relaxed font-medium break-words">
                {aiAdvice}
              </p>
            </div>
          </div>
          
          <button 
            onClick={askAiAboutWeather}
            className="w-full sm:w-auto shrink-0 text-xs bg-[#121A15] hover:bg-emerald-600 text-neutral-300 hover:text-white px-5 py-3 sm:py-2.5 rounded-xl border border-white/5 transition-colors flex items-center justify-center gap-2 font-bold mt-2 sm:mt-0"
          >
            اسأل المساعد <ArrowLeft className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </motion.div>
  );
};

export default SmartWeatherAlert;
