import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calculator, FlaskConical, CalendarDays, 
  Activity, ArrowRight, CheckCircle2, Leaf
} from "lucide-react";
import { Button } from "@/components/ui/button";

// --- دوال مساعدة لحساب التواريخ ---
const addDays = (dateString: string, days: number) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  date.setDate(date.getDate() + days);
  return date.toLocaleDateString("ar-EG", { 
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
  });
};

const SmartTools = () => {
  const [activeTab, setActiveTab] = useState<"cattle" | "soil">("cattle");

  // --- حالات حاسبة الأبقار ---
  const [matingDate, setMatingDate] = useState("");

  // --- حالات حاسبة التربة ---
  const [targetNitrogen, setTargetNitrogen] = useState("");
  const [areaSize, setAreaSize] = useState("1"); // بالفدان
  const ureaNitrogenPercent = 46; // نسبة النيتروجين في سماد اليوريا 46%

  return (
    <section className="py-24 bg-[#050806] relative overflow-hidden font-tajawal min-h-screen flex items-center">
      {/* إضاءة خلفية */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-emerald-900/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-blue-900/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10 max-w-4xl">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-5xl font-black text-white mb-4"
          >
            أدوات <span className="text-emerald-400">المهندس</span> الذكية
          </motion.h2>
          <p className="text-neutral-400">حسابات دقيقة وسريعة لمساعدتك في اتخاذ القرار الميداني.</p>
        </div>

        {/* أزرار التنقل (Tabs) */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <button
            onClick={() => setActiveTab("cattle")}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all duration-300 ${
              activeTab === "cattle" 
                ? "bg-emerald-600 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)]" 
                : "bg-[#121A15] text-neutral-400 hover:bg-[#1a241d] hover:text-white border border-white/5"
            }`}
          >
            <Activity className="w-5 h-5" />
            حاسبة الحمل والولادة (أبقار)
          </button>
          <button
            onClick={() => setActiveTab("soil")}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all duration-300 ${
              activeTab === "soil" 
                ? "bg-emerald-600 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)]" 
                : "bg-[#121A15] text-neutral-400 hover:bg-[#1a241d] hover:text-white border border-white/5"
            }`}
          >
            <FlaskConical className="w-5 h-5" />
            حاسبة التسميد النيتروجيني
          </button>
        </div>

        {/* محتوى الحاسبات */}
        <div className="bg-[#0a0f0c] border border-white/5 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
          <AnimatePresence mode="wait">
            
            {/* 🐄 حاسبة الأبقار */}
            {activeTab === "cattle" && (
              <motion.div
                key="cattle"
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                    <CalendarDays className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white">متابعة الحمل والولادة</h3>
                    <p className="text-sm text-neutral-400">أدخل تاريخ التلقيح لحساب الجدول الزمني المتوقع (متوسط 283 يوم).</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-bold text-neutral-300">تاريخ التلقيح الفعلي:</label>
                  <input 
                    type="date" 
                    value={matingDate}
                    onChange={(e) => setMatingDate(e.target.value)}
                    className="w-full bg-[#121A15] border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                {matingDate && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-white/5"
                  >
                    <div className="bg-[#121A15] p-5 rounded-2xl border border-blue-500/20 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/10 blur-xl rounded-full" />
                      <p className="text-xs text-blue-400 font-bold mb-1">موعد جس الجنين (45 يوم)</p>
                      <p className="text-sm text-white font-medium">{addDays(matingDate, 45)}</p>
                    </div>
                    <div className="bg-[#121A15] p-5 rounded-2xl border border-orange-500/20 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-16 h-16 bg-orange-500/10 blur-xl rounded-full" />
                      <p className="text-xs text-orange-400 font-bold mb-1">موعد التجفيف (223 يوم)</p>
                      <p className="text-sm text-white font-medium">{addDays(matingDate, 223)}</p>
                    </div>
                    <div className="bg-emerald-600/10 p-5 rounded-2xl border border-emerald-500/30 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/20 blur-xl rounded-full" />
                      <p className="text-xs text-emerald-400 font-bold mb-1">الولادة المتوقعة (283 يوم)</p>
                      <p className="text-sm text-white font-bold">{addDays(matingDate, 283)}</p>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* 🧪 حاسبة التربة */}
            {activeTab === "soil" && (
              <motion.div
                key="soil"
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                    <Leaf className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white">حساب احتياجات التسميد</h3>
                    <p className="text-sm text-neutral-400">حساب كمية سماد اليوريا (46% N) المطلوبة بناءً على احتياج المحصول.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-neutral-300">احتياج المحصول (كجم نيتروجين/فدان):</label>
                    <input 
                      type="number" 
                      placeholder="مثال: 70"
                      value={targetNitrogen}
                      onChange={(e) => setTargetNitrogen(e.target.value)}
                      className="w-full bg-[#121A15] border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-neutral-300">المساحة (بالفدان):</label>
                    <input 
                      type="number" 
                      min="1"
                      value={areaSize}
                      onChange={(e) => setAreaSize(e.target.value)}
                      className="w-full bg-[#121A15] border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>

                {targetNitrogen && Number(targetNitrogen) > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="pt-6 border-t border-white/5 flex flex-col items-center justify-center text-center bg-blue-900/10 rounded-2xl p-6 border border-blue-500/20"
                  >
                    <p className="text-neutral-400 mb-2">الكمية المطلوبة من سماد اليوريا (شيكارة 50 كجم):</p>
                    <div className="flex items-end gap-2">
                      <span className="text-5xl font-black text-white">
                        {Math.ceil((Number(targetNitrogen) / (ureaNitrogenPercent / 100) / 50) * Number(areaSize))}
                      </span>
                      <span className="text-blue-400 font-bold mb-1">شيكارة</span>
                    </div>
                    <p className="text-xs text-neutral-500 mt-4 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4 text-blue-500" />
                      تم الحساب على أساس أن اليوريا تحتوي على 46% نيتروجين نقي.
                    </p>
                  </motion.div>
                )}
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default SmartTools;
