import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, Trash2, ShoppingBag, MessageCircle, 
  Loader2, Camera, Filter, X, Leaf, Sprout, Droplets, Bug, LayoutGrid
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

// --- بيانات التصنيفات الأيقونية ---
const categories = [
  { id: "all", label: "الكل", icon: LayoutGrid },
  { id: "أسمدة", label: "أسمدة", icon: Leaf },
  { id: "مبيدات فطري", label: "مبيدات فطري", icon: Bug },
  { id: "مبيدات حشري", label: "مبيدات حشري", icon: Bug },
  { id: "تقاوي", label: "تقاوي", icon: Sprout },
  { id: "أدوات ري", label: "أدوات ري", icon: Droplets },
];

const Marketplace = () => {
  const { user, isAdmin } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  
  // حالة المودال للأدمن
  const [isModalOpen, setIsModalOpen] = useState(false);

  // حالات فورم الإضافة (للأدمن فقط)
  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newCategory, setNewCategory] = useState("أسمدة");
  const [newDescription, setNewDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  // 1. جلب البيانات من الداتابيس
  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error) {
      setProducts(data || []);
      setFilteredProducts(data || []);
    }
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  // 2. نظام الفلترة الأيقوني
  useEffect(() => {
    if (activeCategory === "all") {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(p => p.category === activeCategory));
    }
  }, [activeCategory, products]);

  // 3. رفع الصورة لـ Supabase
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `product-images/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('media') // تأكد إن الـ Bucket اسمه media
      .upload(filePath, file);

    if (uploadError) {
      toast.error("فشل رفع الصورة");
    } else {
      const { data } = supabase.storage.from('media').getPublicUrl(filePath);
      setImageUrl(data.publicUrl);
      toast.success("الصورة جاهزة! 📸");
    }
    setUploading(false);
  };

  // 4. إضافة منتج جديد للأدمن
  const addProduct = async () => {
    if (!newName || !newPrice) return toast.error("يا هندسة كمل البيانات ناقصة!");
    const { error } = await supabase.from("products").insert([
      { name: newName, price: newPrice, category: newCategory, description: newDescription, image_url: imageUrl }
    ]);
    if (error) {
      toast.error("حدث خطأ أثناء الإضافة");
    } else {
      toast.success("تم النشر بنجاح! 🚀");
      setNewName(""); setNewPrice(""); setImageUrl(""); setNewDescription("");
      setIsModalOpen(false); // اقفل المودال
      fetchProducts();
    }
  };

  // 5. حذف منتج
  const deleteProduct = async (id: string) => {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (!error) { toast.success("تم مسح المنتج"); fetchProducts(); }
  };

  return (
    <div className="min-h-screen bg-[#050806] text-white font-tajawal pt-28 pb-20 relative overflow-hidden" dir="rtl">
      {/* خلفية فنية خفيفة */}
      <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')] opacity-5 pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-900/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-7xl">
        
        {/* Header الروقان */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-4xl md:text-6xl font-black mb-1.5 flex items-center gap-3">
              سوق <span className="text-emerald-500">نبتة</span>
            </h1>
            <p className="text-neutral-500 text-lg mr-12">مستلزمات الإنتاج الزراعي عالية الجودة بين يديك.</p>
          </motion.div>
          
          {isAdmin && (
            <motion.button 
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2.5 bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-full font-bold text-sm shadow-lg shadow-emerald-900/20 transition-all"
            >
              <Plus className="w-5 h-5" /> إضافة صنف جديد للمتجر
            </motion.button>
          )}
        </div>

        {/* 🏷️ شريط الفلترة الأيقوني الفخم */}
        <div className="flex flex-wrap items-center gap-3 mb-16 pb-2 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 bg-[#0a0f0c] px-4 py-2 rounded-2xl border border-white/5 shadow-inner">
            <Filter className="w-4 h-4 text-emerald-500" />
            <span className="text-sm text-neutral-500 font-bold ml-1">تصفية حسب:</span>
          </div>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-6 py-3.5 rounded-2xl font-bold transition-all whitespace-nowrap border ${
                activeCategory === cat.id 
                  ? "bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-900/20" 
                  : "bg-[#121A15]/50 border-white/5 text-neutral-400 hover:border-emerald-500/20 hover:text-white"
              }`}
            >
              <cat.icon className="w-4 h-4" />
              {cat.label}
            </button>
          ))}
        </div>

        {/* 🛒 شبكة المنتجات الراقية */}
        {loading ? (
          <div className="text-center py-40 text-neutral-600 flex flex-col items-center gap-4">
            <Loader2 className="animate-spin w-12 h-12 text-emerald-500" />
            <p className="text-lg">جاري تحميل أحدث المستلزمات...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-32 bg-[#0a0f0c] rounded-[2.5rem] border border-white/5 flex flex-col items-center gap-6 shadow-2xl">
            <ShoppingBag className="w-20 h-20 text-neutral-800" />
            <p className="text-neutral-500 text-xl font-medium">المتجر فاضي حالياً، محتاج إيه؟</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <AnimatePresence>
              {filteredProducts.map((p, idx) => (
                <motion.div 
                  key={p.id}
                  layout initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  className="group bg-[#0a0f0c] rounded-[2.5rem] border border-white/5 overflow-hidden hover:border-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-500/5 transition-all relative flex flex-col"
                >
                  <div className="h-60 bg-neutral-900 relative">
                    {p.image_url ? (
                      <img src={p.image_url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-neutral-800"><ShoppingBag size={64} /></div>
                    )}
                    <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-emerald-400 border border-white/10 shadow-lg">
                      {p.category}
                    </div>
                  </div>
                  
                  <div className="p-7 flex flex-col flex-1">
                    <h4 className="text-xl font-bold text-white mb-2 truncate group-hover:text-emerald-400 transition-colors">{p.name}</h4>
                    <p className="text-neutral-500 text-xs mb-6 line-clamp-2 leading-relaxed">{p.description}</p>
                    
                    <div className="flex items-center justify-between border-t border-white/5 pt-6 mt-auto">
                      <span className="text-emerald-400 font-black text-3xl tracking-tighter tabular-nums">{p.price}</span>
                      <a 
                        href={`https://wa.me/201234567890?text=أريد طلب: ${p.name}`}
                        className="flex items-center gap-2.5 bg-white/5 hover:bg-emerald-600 text-white px-6 py-3.5 rounded-2xl border border-white/10 transition-all text-sm font-bold shadow-lg"
                      >
                        <MessageCircle className="w-5 h-5" /> اطلب الآن
                      </a>
                    </div>
                  </div>
                  {isAdmin && (
                    <button onClick={()=>deleteProduct(p.id)} className="absolute top-4 left-4 p-2 bg-red-500/10 rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 size={16}/>
                    </button>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* 🛠️ Modal فورم الإضافة (للأدمن) - بسيطة جداً */}
        <AnimatePresence>
          {isModalOpen && isAdmin && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[150] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 font-tajawal text-right" dir="rtl"
            >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                className="bg-[#0a0f0c] w-full max-w-xl rounded-[2.5rem] border border-emerald-500/20 p-8 shadow-2xl relative"
              >
                <button onClick={() => setIsModalOpen(false)} className="absolute top-6 left-6 text-neutral-600 hover:text-white"><X /></button>
                <h3 className="text-white font-bold mb-8 flex items-center gap-2 text-2xl"> <Plus className="text-emerald-500" /> إضافة صنف جديد للمتجر</h3>
                
                <div className="space-y-4">
                  {/* رفع الصورة الشيك */}
                  <div className="relative h-32 bg-black/40 border-2 border-dashed border-white/10 rounded-2xl flex items-center justify-center overflow-hidden">
                    {imageUrl ? <img src={imageUrl} className="w-full h-full object-cover" /> : (
                      <div className="text-center">
                        {uploading ? <Loader2 className="animate-spin mx-auto text-emerald-500" /> : <Camera className="mx-auto text-neutral-700" />}
                        <span className="text-[10px] text-neutral-500 block mt-1">صورة المنتج</span>
                      </div>
                    )}
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                  </div>

                  <input placeholder="اسم المنتج" value={newName} onChange={e=>setNewName(e.target.value)} className="w-full bg-black/40 p-4 rounded-xl border border-white/5 outline-none focus:border-emerald-500 text-white" />
                  <input placeholder="السعر" value={newPrice} onChange={e=>setNewPrice(e.target.value)} className="w-full bg-black/40 p-4 rounded-xl border border-white/5 outline-none focus:border-emerald-500 text-white" />
                  <select value={newCategory} onChange={e=>setNewCategory(e.target.value)} className="w-full bg-black/40 p-4 rounded-xl border border-white/5 text-neutral-500">
                    <option value="أسمدة">أسمدة</option>
                    <option value="مبيدات فطري">مبيدات فطري</option>
                    <option value="مبيدات حشري">مبيدات حشري</option>
                    <option value="تقاوي">تقاوي</option>
                  </select>
                  <textarea placeholder="وصف سريع..." value={newDescription} onChange={e=>setNewDescription(e.target.value)} className="w-full bg-black/40 p-4 rounded-xl border border-white/5 outline-none h-20" />
                  <button onClick={addProduct} className="w-full bg-emerald-600 py-4 rounded-2xl text-white font-bold hover:bg-emerald-500 transition-all text-lg">نشر الآن</button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default Marketplace;
