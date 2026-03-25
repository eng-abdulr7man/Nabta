import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
        // 1. تحديد المدينة صامتاً (عن طريق الـ IP)
        const geoRes = await fetch("https://get.geojs.io/v1/ip/geo.json");
        const geoData = await geoRes.json();
        const lat = geoData.latitude || 31.05; // الديفولت لو فشل (إحداثيات طلخا/المنصورة)
        const lon = geoData.longitude || 31.38;
        const city = geoData.city || "مدينتك";

        // 2. جلب بيانات الطقس الدقيقة
        const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code`);
        const weatherDataRaw = await weatherRes.json();
        const current = weatherDataRaw.current;
        
        const wData = {
          city: city,
          temp: Math.round(current.temperature_2m),
          humidity: Math.round(current.relative_humidity_2m),
          windSpeed: Math.round(current.wind_speed_10m),
          isRaining: current.weather_code >= 50, // أكواد المطر في WMO
        };
        setWeather(wData);

        // 3. إرسال الطقس للـ AI لاستخراج نصيحة زراعية ذكية
        const systemPrompt = `أنت مستشار زراعي طوارئ في مصر. 
        الطقس اليوم في مدينة ${wData.city}: الحرارة ${wData.temp} درجة، الرطوبة ${wData.humidity}%، وسرعة الرياح ${wData.windSpeed} كم/ساعة. المطر: ${wData.isRaining ? 'يوجد' : 'لا يوجد'}.
        اكتب نصيحة زراعية سريعة ومباشرة وتحذيرية للمزارع في جملة واحدة فقط (لا تزيد عن 15 كلمة).
        مثال: "تجنب رش المبيدات اليوم بسبب سرعة الرياح العالية"، أو "الطقس مثالي للري، احرص على ري محاصيلك في الصباح".`;

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

  // دالة لفتح الشات الذكي للاستفسار أكثر عن الطقس
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
        <div className="h-32 bg-[#0a0f0c] border border-white/5 rounded-[2rem] animate-pulse" />
      </div>
    );
  }

  if (!weather || !aiAdvice) return null; // إخفاء القسم لو فشل التحميل عشان ميبوظش شكل الموقع

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container mx-auto px-4 max-w-6xl my-8 relative z-20"
    >
      <div className="bg-gradient-to-r from-[#0a0f0c] to-[#121A15] border border-neutral-800/60 rounded-[2rem] p-6 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center gap-6 md:gap-8">
        
        {/* إضاءة خلفية للبطاقة */}
        <div className={`absolute top-0 right-0 w-64 h-64 blur-[80px] rounded-full pointer-events-none opacity-20 ${weather.temp > 30 ? 'bg-red-500' : weather.isRaining ? 'bg-blue-500' : 'bg-emerald-500'}`} />

        {/* 1. تفاصيل الطقس (اليمين) */}
        <div className="flex items-center gap-6 md:border-l md:border-white/10 md:pl-8 w-full md:w-auto shrink-0 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-black/40 flex items-center justify-center border border-white/5 shadow-inner">
            {weather.isRaining ? <CloudRain className="w-8 h-8 text-blue-400" /> : weather.temp > 28 ? <ThermometerSun className="w-8 h-8 text-yellow-500" /> : <CloudSun className="w-8 h-8 text-emerald-400" />}
          </div>
          
          <div>
            <p className="text-sm text-neutral-400 font-bold mb-1">طقس المزرعة في <span className="text-emerald-400">{weather.city}</span></p>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-black text-white tabular-nums tracking-tighter">{weather.temp}°</span>
              <span className="text-neutral-500 text-sm mb-1 font-medium">مئوية</span>
            </div>
          </div>
        </div>

        {/* 2. قراءات سريعة (في المنتصف) */}
        <div className="flex gap-6 w-full md:w-auto shrink-0 relative z-10">
          <div className="flex items-center gap-2">
            <Droplets className="w-5 h-5 text-blue-400" />
            <div>
              <p className="text-[10px] text-neutral-500 font-bold">الرطوبة</p>
              <p className="text-sm text-white font-bold">{weather.humidity}%</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Wind className="w-5 h-5 text-neutral-400" />
            <div>
              <p className="text-[10px] text-neutral-500 font-bold">سرعة الرياح</p>
              <p className="text-sm text-white font-bold">{weather.windSpeed} كم/س</p>
            </div>
          </div>
        </div>

        {/* 3. نصيحة الذكاء الاصطناعي (اليسار) */}
        <div className="flex-1 bg-emerald-900/10 border border-emerald-500/20 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10 w-full">
          <div className="flex items-start gap-3">
            <div className="shrink-0 mt-1">
              {weather.windSpeed > 20 || weather.temp > 35 ? (
                <AlertTriangle className="w-5 h-5 text-red-400" />
              ) : (
                <Sparkles className="w-5 h-5 text-emerald-400" />
              )}
            </div>
            <div>
              <p className="text-xs font-bold text-emerald-500 mb-1 flex items-center gap-1">
                <Bot className="w-3 h-3" /> تنبيه نبتة الذكي
              </p>
              <p className="text-sm text-white leading-relaxed font-medium">
                {aiAdvice}
              </p>
            </div>
          </div>
          
          <button 
            onClick={askAiAboutWeather}
            className="shrink-0 text-xs bg-[#121A15] hover:bg-emerald-600 text-neutral-300 hover:text-white px-4 py-2.5 rounded-xl border border-white/5 transition-colors flex items-center gap-1.5 font-bold"
          >
            اسأل المساعد <ArrowLeft className="w-3 h-3" />
          </button>
        </div>

      </div>
    </motion.div>
  );
};

export default SmartWeatherAlert;
