import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, Trash2, ShoppingBag, MessageCircle, 
  Loader2, Camera, Filter, X, Leaf, Sprout, Droplets, Bug
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

// التصنيفات المتاحة
const categories = [
  { id: "all", label: "الكل", icon: LayoutGrid },
  { id: "أسمدة", label: "أسمدة", icon: Leaf },
  { id: "مبيدات", label: "مبيدات", icon: Bug },
  { id: "تقاوي", label: "تقاوي وفسايل", icon: Sprout },
  { id: "ري", label: "أدوات ري", icon: Droplets },
];

const Marketplace = () => {
  const { isAdmin } = useAuth();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // حالات الفورم
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("أسمدة");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    if (!error) {
      setProducts(data || []);
      setFilteredProducts(data || []);
    }
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  // نظام الفلترة
  useEffect(() => {
    if (activeCategory === "all") {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(p => p.category === activeCategory));
    }
  }, [activeCategory, products]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);
    const file = e.target.files[0];
    const filePath = `product-images/${Math.random()}-${file.name}`;
    const { error: uploadError } = await supabase.storage.from('media').upload(filePath, file);
    if (!uploadError) {
      const { data } = supabase.storage.from('media').getPublicUrl(filePath);
      setImageUrl(data.publicUrl);
      toast.success("الصورة جاهزة! 📸");
    }
    setUploading(false);
  };

  const addProduct = async () => {
    if (!name || !price) return toast.error("كمل البيانات يا هندسة!");
    const { error } = await supabase.from("products").insert([{ name, price, category, description, image_url: imageUrl }]);
    if (!error) {
      toast.success("تم النشر في المتجر! 🚀");
      setName(""); setPrice(""); setImageUrl(""); setDescription("");
      setIsModalOpen(false);
      fetchProducts();
    }
  };

  const deleteProduct = async (id: string) => {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (!error) { toast.success("تم الحذف"); fetchProducts(); }
  };

  return (
    <div className="min-h-screen bg-[#050806] text-white font-tajawal pt-28 pb-24" dir="rtl">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-4xl md:text-6xl font-black mb-2 tracking-tight">سوق <span className="text-emerald-500 underline decoration-emerald-500/30">نبتة</span></h1>
            <p className="text-neutral-500 text-lg">أفضل الخامات الزراعية لإنتاجية تفوق التوقعات.</p>
          </motion.div>
          
          {isAdmin && (
            <button 
              onClick={() => setIsModalOpen(true)}
              className="group flex items-center gap-3 bg-white text-black px-8 py-4 rounded-full font-bold hover:bg-emerald-500 hover:text-white transition-all shadow-xl"
            >
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
              إضافة صنف للمتجر
            </button>
          )}
        </div>

        {/* 🏷️ شريط الفلترة الزمردي */}
        <div className="flex flex-wrap gap-3 mb-12 pb-4 overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all whitespace-nowrap border ${
                activeCategory === cat.id 
                ? "bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-900/20" 
                : "bg-[#0a0f0c] border-white/5 text-neutral-400 hover:border-white/20"
              }`}
            >
              <cat.icon className="w-4 h-4" />
              {cat.label}
            </button>
          ))}
        </div>

        {/* Grid المنتجات */}
        {loading ? (
          <div className="py-40 text-center"><Loader2 className="animate-spin mx-auto text-emerald-500 w-12 h-12" /></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((p) => (
                <motion.div 
                  key={p.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="group bg-[#0a0f0c] rounded-[2.5rem] border border-white/5 overflow-hidden hover:border-emerald-500/30 transition-all flex flex-col"
                >
                  <div className="h-64 bg-neutral-900 relative">
                    {p.image_url ? (
                      <img src={p.image_url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-neutral-800"><ShoppingBag size={64} /></div>
                    )}
                    <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-2xl text-[10px] font-bold text-emerald-400 border border-white/10">
                      {p.category}
                    </div>
                  </div>
                  
                  <div className="p-7 flex flex-col flex-1">
                    <h4 className="text-xl font-bold text-white mb-2">{p.name}</h4>
                    <p className="text-neutral-500 text-xs mb-6 line-clamp-2 leading-relaxed">{p.description}</p>
                    
                    <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/5">
                      <span className="text-emerald-400 font-black text-2xl tracking-tighter">{p.price}</span>
                      <a 
                        href={`https://wa.me/201234567890?text=طلب منتج: ${p.name}`}
                        className="p-3 bg-emerald-600/10 text-emerald-500 rounded-xl hover:bg-emerald-600 hover:text-white transition-all"
                      >
                        <MessageCircle size={22} />
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

        {/* Modal الإضافة (نفس الكود السابق مع تحسينات بسيطة) */}
        {/* ... (Modal Code) */}
      </div>
    </div>
  );
};

export default Marketplace;
