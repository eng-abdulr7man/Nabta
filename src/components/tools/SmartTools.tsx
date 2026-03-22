import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FlaskConical, CalendarDays, Activity, 
  CheckCircle2, Leaf, Droplets, LayoutGrid 
} from "lucide-react";

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
  // --- حالة التنقل بين الحاسبات ---
  const [activeTab, setActiveTab] = useState<"cattle" | "soil" | "pesticide" | "density">("cattle");

  // 1. حالات حاسبة الأبقار
  const [matingDate, setMatingDate] = useState("");

  // 2. حالات حاسبة التربة
  const [targetNitrogen, setTargetNitrogen] = useState("");
  const [areaSize, setAreaSize] = useState("1"); // بالفدان
  const ureaNitrogenPercent = 46;

  // 3. حالات حاسبة المبيدات
  const [tankVolume, setTankVolume] = useState(""); // سعة خزان الرش (لتر)
  const [doseRate, setDoseRate] = useState(""); // الجرعة الموصى بها (سم³ / 100 لتر)

  // 4. حالات الكثافة النباتية
  const [rowSpace, setRowSpace] = useState(""); // المسافة بين الخطوط (سم)
  const [plantSpace, setPlantSpace] = useState(""); // المسافة بين النباتات (سم)
  const [densityArea, setDensityArea] = useState("1"); // المساحة بالفدان

  return (
    <section className="py-24 bg-[#050806] relative overflow-hidden font-tajawal min-h-screen flex items-center">
      {/* إضاءة خلفية */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-emerald-900/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-blue-900/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-5xl">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-5xl font-black text-white mb-4"
          >
            أدوات <span className="text-emerald-400">نبتة</span> الذكية
          </motion.h2>
          <p className="text-neutral-400 text-lg">حسابات حقلية دقيقة لمساعدتك في اتخاذ القرار الميداني بسرعة.</p>
        </div>

        {/* أزرار التنقل (Tabs) */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {[
            { id: "cattle", label: "الحمل والولادة", icon: Activity, color: "emerald" },
            { id: "soil", label: "تسميد اليوريا", icon: FlaskConical, color: "blue" },
            { id: "pesticide", label: "خلط المبيدات", icon: Droplets, color: "purple" },
            { id: "density", label: "الكثافة النباتية", icon: LayoutGrid, color: "orange" },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold transition-all duration-300 ${
                  isActive 
                    ? `bg-${tab.color}-600 text-white shadow-[0_0_20px_rgba(var(--${tab.color}-600),0.3)]` 
                    : "bg-[#121A15] text-neutral-400 hover:bg-[#1a241d] hover:text-white border border-white/5"
                }`}
                // خدعة بسيطة لتلوين الزرار النشط حسب نوعه
                style={isActive ? { backgroundColor: tab.id === 'cattle' ? '#059669' : tab.id === 'soil' ? '#2563eb' : tab.id === 'pesticide' ? '#9333ea' : '#ea580c' } : {}}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm md:text-base">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* محتوى الحاسبات */}
        <div className="bg-[#0a0f0c] border border-white/5 rounded-[2.5rem] p-6 md:p-12 shadow-2xl relative overflow-hidden min-h-[400px]">
          <AnimatePresence mode="wait">
            
            {/* 🐄 1. حاسبة الأبقار */}
            {activeTab === "cattle" && (
              <motion.div
                key="cattle"
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shrink-0">
                    <CalendarDays className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white">متابعة الحمل والولادة (أبقار)</h3>
                    <p className="text-sm text-neutral-400 mt-1">أدخل تاريخ التلقيح لحساب الجدول الزمني المتوقع (متوسط 283 يوم).</p>
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
                    <div className="bg-emerald-600/10 p-5 rounded-2xl border border-emerald-500/30 relative overflow-hidden shadow-lg shadow-emerald-900/20">
                      <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/20 blur-xl rounded-full" />
                      <p className="text-xs text-emerald-400 font-bold mb-1">الولادة المتوقعة (283 يوم)</p>
                      <p className="text-sm text-white font-bold">{addDays(matingDate, 283)}</p>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* 🧪 2. حاسبة التربة */}
            {activeTab === "soil" && (
              <motion.div
                key="soil"
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 shrink-0">
                    <Leaf className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white">احتياجات التسميد النيتروجيني</h3>
                    <p className="text-sm text-neutral-400 mt-1">حساب كمية سماد اليوريا (46% N) المطلوبة بناءً على احتياج المحصول.</p>
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
                    className="pt-6 border-t border-white/5 flex flex-col items-center justify-center text-center bg-blue-900/10 rounded-2xl p-6 border border-blue-500/20 mt-4"
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

            {/* 💧 3. حاسبة خلط المبيدات */}
            {activeTab === "pesticide" && (
              <motion.div
                key="pesticide"
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20 shrink-0">
                    <Droplets className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white">معايرة وخلط المبيدات</h3>
                    <p className="text-sm text-neutral-400 mt-1">احسب كمية المبيد المطلوبة بدقة لكل موتور رش أو خزان.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-neutral-300">سعة خزان الرش (لتر):</label>
                    <input 
                      type="number" 
                      placeholder="مثال: 20 (موتور ظهر) أو 600 (موتور كبير)"
                      value={tankVolume}
                      onChange={(e) => setTankVolume(e.target.value)}
                      className="w-full bg-[#121A15] border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-purple-500 transition-colors"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-neutral-300">الجرعة الموصى بها (سم³ أو جرام / 100 لتر):</label>
                    <input 
                      type="number" 
                      placeholder="مثال: 50"
                      value={doseRate}
                      onChange={(e) => setDoseRate(e.target.value)}
                      className="w-full bg-[#121A15] border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-purple-500 transition-colors"
                    />
                  </div>
                </div>

                {tankVolume && doseRate && Number(tankVolume) > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="pt-6 border-t border-white/5 flex flex-col items-center justify-center text-center bg-purple-900/10 rounded-2xl p-6 border border-purple-500/20 mt-4"
                  >
                    <p className="text-neutral-400 mb-2">كمية المبيد الواجب إضافتها لهذا الخزان:</p>
                    <div className="flex items-end gap-2">
                      <span className="text-5xl font-black text-white">
                        {((Number(tankVolume) * Number(doseRate)) / 100).toFixed(1)}
                      </span>
                      <span className="text-purple-400 font-bold mb-1">سم³ / جرام</span>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* 🌱 4. حاسبة الكثافة النباتية */}
            {activeTab === "density" && (
              <motion.div
                key="density"
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20 shrink-0">
                    <LayoutGrid className="w-6 h-6 text-orange-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white">حاسبة الكثافة النباتية</h3>
                    <p className="text-sm text-neutral-400 mt-1">تحديد التعداد النباتي في الفدان لضبط كمية التقاوي والمسافات.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-neutral-300">المسافة بين الخطوط (سم):</label>
                    <input 
                      type="number" 
                      placeholder="مثال: 70"
                      value={rowSpace}
                      onChange={(e) => setRowSpace(e.target.value)}
                      className="w-full bg-[#121A15] border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-orange-500 transition-colors"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-neutral-300">المسافة بين الجور/النباتات (سم):</label>
                    <input 
                      type="number" 
                      placeholder="مثال: 30"
                      value={plantSpace}
                      onChange={(e) => setPlantSpace(e.target.value)}
                      className="w-full bg-[#121A15] border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-orange-500 transition-colors"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-neutral-300">المساحة (بالفدان):</label>
                    <input 
                      type="number" 
                      value={densityArea}
                      onChange={(e) => setDensityArea(e.target.value)}
                      className="w-full bg-[#121A15] border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-orange-500 transition-colors"
                    />
                  </div>
                </div>

                {rowSpace && plantSpace && Number(rowSpace) > 0 && Number(plantSpace) > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="pt-6 border-t border-white/5 flex flex-col items-center justify-center text-center bg-orange-900/10 rounded-2xl p-6 border border-orange-500/20 mt-4"
                  >
                    <p className="text-neutral-400 mb-2">إجمالي عدد النباتات المتوقع:</p>
                    <div className="flex items-end gap-2">
                      <span className="text-5xl font-black text-white">
                        {Math.floor((Number(densityArea) * 4200 * 10000) / (Number(rowSpace) * Number(plantSpace))).toLocaleString('en-US')}
                      </span>
                      <span className="text-orange-400 font-bold mb-1">نبات</span>
                    </div>
                    <p className="text-xs text-neutral-500 mt-4">
                      *مساحة الفدان = 4200 متر مربع. تم الحساب بافتراض نبات واحد في الجورة.
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
