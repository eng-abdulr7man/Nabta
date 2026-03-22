import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FlaskConical, CalendarDays, Activity, 
  CheckCircle2, Leaf, Droplets, LayoutGrid, 
  Calculator, TrendingDown 
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
  const [activeTab, setActiveTab] = useState<"cattle" | "soil" | "pesticide" | "density" | "irrigation" | "savings">("cattle");

  // 1. حالات حاسبة الأبقار
  const [matingDate, setMatingDate] = useState("");

  // 2. حالات حاسبة التربة
  const [targetNitrogen, setTargetNitrogen] = useState("");
  const [areaSize, setAreaSize] = useState("1");
  const ureaNitrogenPercent = 46;

  // 3. حالات حاسبة المبيدات
  const [tankVolume, setTankVolume] = useState("");
  const [doseRate, setDoseRate] = useState("");

  // 4. حالات الكثافة النباتية
  const [rowSpace, setRowSpace] = useState("");
  const [plantSpace, setPlantSpace] = useState("");
  const [densityArea, setDensityArea] = useState("1");

  // 5. حالات حاسبة الري (جديد)
  const [dripperFlow, setDripperFlow] = useState(""); // لتر/ساعة
  const [dripperCount, setDripperCount] = useState(""); // عدد النقاطات بالفدان

  // 6. حالات مقارنة التوفير (جديد)
  const [prodAPrice, setProdAPrice] = useState("");
  const [prodARate, setProdARate] = useState("");
  const [prodBPrice, setProdBPrice] = useState("");
  const [prodBRate, setProdBRate] = useState("");

  const costA = (Number(prodAPrice) * Number(prodARate));
  const costB = (Number(prodBPrice) * Number(prodBRate));

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
          <p className="text-neutral-400 text-lg">كل ما تحتاجه لاتخاذ قرارات زراعية دقيقة في مكان واحد.</p>
        </div>

        {/* أزرار التنقل (Tabs) */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {[
            { id: "cattle", label: "الأبقار", icon: Activity, color: "#059669" },
            { id: "soil", label: "التسميد", icon: FlaskConical, color: "#2563eb" },
            { id: "pesticide", label: "المبيدات", icon: Droplets, color: "#9333ea" },
            { id: "density", label: "الكثافة", icon: LayoutGrid, color: "#ea580c" },
            { id: "irrigation", label: "الري", icon: Droplets, color: "#0ea5e9" },
            { id: "savings", label: "التوفير", icon: TrendingDown, color: "#f59e0b" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold transition-all duration-300 ${
                activeTab === tab.id 
                  ? "text-white shadow-lg" 
                  : "bg-[#121A15] text-neutral-400 hover:bg-[#1a241d] hover:text-white border border-white/5"
              }`}
              style={activeTab === tab.id ? { backgroundColor: tab.color } : {}}
            >
              <tab.icon className="w-5 h-5" />
              <span className="text-sm md:text-base">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* محتوى الحاسبات */}
        <div className="bg-[#0a0f0c] border border-white/5 rounded-[2.5rem] p-6 md:p-12 shadow-2xl relative overflow-hidden min-h-[450px]">
          <AnimatePresence mode="wait">
            
            {/* 🐄 1. حاسبة الأبقار */}
            {activeTab === "cattle" && (
              <motion.div key="cattle" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20"><CalendarDays className="w-6 h-6 text-emerald-400" /></div>
                  <h3 className="text-2xl font-black text-white">متابعة الحمل والولادة</h3>
                </div>
                <input type="date" value={matingDate} onChange={(e) => setMatingDate(e.target.value)} className="w-full bg-[#121A15] border border-white/10 rounded-xl px-4 py-4 text-white outline-none focus:border-emerald-500" />
                {matingDate && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
                    <div className="bg-[#121A15] p-5 rounded-2xl border border-blue-500/20"><p className="text-xs text-blue-400 font-bold">جس الجنين (45 يوم)</p><p className="text-white">{addDays(matingDate, 45)}</p></div>
                    <div className="bg-[#121A15] p-5 rounded-2xl border border-orange-500/20"><p className="text-xs text-orange-400 font-bold">التجفيف (223 يوم)</p><p className="text-white">{addDays(matingDate, 223)}</p></div>
                    <div className="bg-emerald-600/20 p-5 rounded-2xl border border-emerald-500/30"><p className="text-xs text-emerald-400 font-bold">الولادة المتوقعة</p><p className="text-white font-bold">{addDays(matingDate, 283)}</p></div>
                  </div>
                )}
              </motion.div>
            )}

            {/* 💧 5. حاسبة الري (جديد) */}
            {activeTab === "irrigation" && (
              <motion.div key="irrigation" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-sky-500/10 flex items-center justify-center border border-sky-500/20"><Droplets className="w-6 h-6 text-sky-400" /></div>
                  <h3 className="text-2xl font-black text-white">تخطيط احتياجات الري</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2"><label className="text-sm text-neutral-300">تصريف النقاط (لتر/ساعة):</label><input type="number" placeholder="مثال: 4" value={dripperFlow} onChange={(e) => setDripperFlow(e.target.value)} className="w-full bg-[#121A15] border border-white/10 rounded-xl px-4 py-4 text-white outline-none focus:border-sky-500" /></div>
                  <div className="space-y-2"><label className="text-sm text-neutral-300">عدد النقاطات بالفدان:</label><input type="number" placeholder="مثال: 7000" value={dripperCount} onChange={(e) => setDripperCount(e.target.value)} className="w-full bg-[#121A15] border border-white/10 rounded-xl px-4 py-4 text-white outline-none focus:border-sky-500" /></div>
                </div>
                {dripperFlow && dripperCount && (
                  <div className="bg-sky-900/20 p-8 rounded-2xl border border-sky-500/30 text-center">
                    <p className="text-neutral-400 mb-2">إجمالي تصريف المياه للفدان في الساعة:</p>
                    <span className="text-5xl font-black text-white">{(Number(dripperFlow) * Number(dripperCount) / 1000).toFixed(1)}</span>
                    <span className="text-sky-400 font-bold mr-2">متر مكعب</span>
                  </div>
                )}
              </motion.div>
            )}

            {/* 💰 6. حاسبة التوفير (جديد) */}
            {activeTab === "savings" && (
              <motion.div key="savings" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20"><TrendingDown className="w-6 h-6 text-amber-400" /></div>
                  <h3 className="text-2xl font-black text-white">مقارنة التكلفة الاقتصادية</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-white/5 p-6 rounded-3xl space-y-4">
                    <h4 className="text-amber-400 font-bold border-b border-white/5 pb-2">المنتج الأول (أ)</h4>
                    <input type="number" placeholder="السعر" value={prodAPrice} onChange={(e) => setProdAPrice(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white" />
                    <input type="number" placeholder="المعدل (سم/فدان)" value={prodARate} onChange={(e) => setProdARate(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white" />
                  </div>
                  <div className="bg-white/5 p-6 rounded-3xl space-y-4">
                    <h4 className="text-emerald-400 font-bold border-b border-white/5 pb-2">المنتج الثاني (ب)</h4>
                    <input type="number" placeholder="السعر" value={prodBPrice} onChange={(e) => setProdBPrice(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white" />
                    <input type="number" placeholder="المعدل (سم/فدان)" value={prodBRate} onChange={(e) => setProdBRate(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white" />
                  </div>
                </div>
                {costA > 0 && costB > 0 && (
                  <div className="bg-emerald-900/20 p-6 rounded-2xl border border-emerald-500/20 text-center">
                    <p className="text-white text-lg">
                      {costA < costB ? "المنتج الأول (أ)" : "المنتج الثاني (ب)"} يوفر لك 
                      <span className="text-emerald-400 font-bold mx-2">{Math.abs(costA - costB).toFixed(2)}</span> جنيه للفدان!
                    </p>
                  </div>
                )}
              </motion.div>
            )}

            {/* باقي الحاسبات (Soil, Pesticide, Density) يتم استكمالها بنفس الستايل من كودك القديم */}
            {activeTab === "soil" && (
               <motion.div key="soil" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-8">
                  <div className="flex items-center gap-4"><div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20"><FlaskConical className="w-6 h-6 text-blue-400" /></div><h3 className="text-2xl font-black text-white">تسميد اليوريا</h3></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input type="number" placeholder="احتياج النيتروجين (كجم/فدان)" value={targetNitrogen} onChange={(e) => setTargetNitrogen(e.target.value)} className="bg-[#121A15] border border-white/10 rounded-xl p-4 text-white" />
                    <input type="number" placeholder="المساحة بالفدان" value={areaSize} onChange={(e) => setAreaSize(e.target.value)} className="bg-[#121A15] border border-white/10 rounded-xl p-4 text-white" />
                  </div>
                  {targetNitrogen && <div className="text-center p-6 bg-blue-600/10 rounded-2xl border border-blue-500/20"><span className="text-4xl font-black text-white">{Math.ceil((Number(targetNitrogen)/0.46/50)*Number(areaSize))}</span><p className="text-blue-400 font-bold">شيكارة يوريا 46%</p></div>}
               </motion.div>
            )}

            {activeTab === "pesticide" && (
               <motion.div key="pesticide" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-8">
                  <div className="flex items-center gap-4"><div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20"><Droplets className="w-6 h-6 text-purple-400" /></div><h3 className="text-2xl font-black text-white">خلط المبيدات</h3></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input type="number" placeholder="سعة الخزان (لتر)" value={tankVolume} onChange={(e) => setTankVolume(e.target.value)} className="bg-[#121A15] border border-white/10 rounded-xl p-4 text-white" />
                    <input type="number" placeholder="الجرعة (سم/100لتر)" value={doseRate} onChange={(e) => setDoseRate(e.target.value)} className="bg-[#121A15] border border-white/10 rounded-xl p-4 text-white" />
                  </div>
                  {tankVolume && doseRate && <div className="text-center p-6 bg-purple-600/10 rounded-2xl border border-purple-500/20"><span className="text-4xl font-black text-white">{((Number(tankVolume)*Number(doseRate))/100).toFixed(1)}</span><p className="text-purple-400 font-bold">سم³ مبيد للخزان</p></div>}
               </motion.div>
            )}

            {activeTab === "density" && (
               <motion.div key="density" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-8">
                  <div className="flex items-center gap-4"><div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20"><LayoutGrid className="w-6 h-6 text-orange-400" /></div><h3 className="text-2xl font-black text-white">الكثافة النباتية</h3></div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <input type="number" placeholder="بين الخطوط (سم)" value={rowSpace} onChange={(e) => setRowSpace(e.target.value)} className="bg-[#121A15] border border-white/10 rounded-xl p-4 text-white" />
                    <input type="number" placeholder="بين النباتات (سم)" value={plantSpace} onChange={(e) => setPlantSpace(e.target.value)} className="bg-[#121A15] border border-white/10 rounded-xl p-4 text-white" />
                    <input type="number" placeholder="الفدان" value={densityArea} onChange={(e) => setDensityArea(e.target.value)} className="bg-[#121A15] border border-white/10 rounded-xl p-4 text-white" />
                  </div>
                  {rowSpace && plantSpace && <div className="text-center p-6 bg-orange-600/10 rounded-2xl border border-orange-500/20"><span className="text-4xl font-black text-white">{Math.floor((Number(densityArea)*4200*10000)/(Number(rowSpace)*Number(plantSpace))).toLocaleString()}</span><p className="text-orange-400 font-bold">نبات / فدان</p></div>}
               </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default SmartTools;
