import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, Trash2, Package, MessageCircle, 
  Loader2, Camera, Tag, ShoppingBag 
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client"; // تأكد من المسار عندك
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  category: string;
  price: string;
  description: string;
  image_url?: string;
}

const Marketplace = () => {
  const { user, isAdmin } = useAuth(); // بنعرف إنت أدمن ولا لا من الـ Context
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // حالات الفورم
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("أسمدة");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  // 1. جلب البيانات من الداتابيس
  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) toast.error("فشل تحميل المنتجات");
    else setProducts(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  // 2. رفع الصورة لـ Supabase Storage
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `product-images/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('media') // تأكد إن عندك Bucket اسمه media
      .upload(filePath, file);

    if (uploadError) {
      toast.error("فشل رفع الصورة");
    } else {
      const { data } = supabase.storage.from('media').getPublicUrl(filePath);
      setImageUrl(data.publicUrl);
      toast.success("تم رفع الصورة بنجاح");
    }
    setUploading(false);
  };

  // 3. إضافة منتج جديد
  const addProduct = async () => {
    if (!name || !price) return toast.error("اكمل البيانات يا هندسة");

    const { error } = await supabase.from("products").insert([
      { name, price, category, description, image_url: imageUrl, admin_id: user?.id }
    ]);

    if (error) {
      toast.error("حدث خطأ أثناء الحفظ");
    } else {
      toast.success("تم إضافة المنتج للمتجر 🚀");
      setName(""); setPrice(""); setImageUrl(""); setDescription("");
      fetchProducts();
    }
  };

  // 4. حذف منتج
  const deleteProduct = async (id: string) => {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) toast.error("فشل الحذف");
    else {
      toast.success("تم إزالة المنتج");
      fetchProducts();
    }
  };

  return (
    <section className="py-20 bg-[#050806] font-tajawal text-right min-h-screen" dir="rtl">
      <div className="container mx-auto px-4 max-w-6xl">
        
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-4">سوق <span className="text-emerald-400">نبتة</span></h2>
          <p className="text-neutral-400">جميع مستلزمات الإنتاج الزراعي بين يديك.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          
          {/* 🛠️ لوحة التحكم للأدمن (عبد الرحمن فقط) */}
          {isAdmin && (
            <div className="lg:col-span-1 bg-[#0a0f0c] border border-emerald-500/20 rounded-[2.5rem] p-6 h-fit sticky top-24 shadow-2xl">
              <h3 className="text-white font-bold mb-6 flex items-center gap-2 text-lg">
                <Plus className="text-emerald-400" /> إضافة منتج جديد
              </h3>
              <div className="space-y-4">
                <div className="relative group cursor-pointer h-32 bg-black/50 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center transition-all hover:border-emerald-500/40">
                  {imageUrl ? (
                    <img src={imageUrl} className="w-full h-full object-cover rounded-2xl" />
                  ) : (
                    <>
                      {uploading ? <Loader2 className="animate-spin text-emerald-500" /> : <Camera className="text-neutral-600" />}
                      <span className="text-[10px] text-neutral-500 mt-2">ارفع صورة المنتج</span>
                    </>
                  )}
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>

                <input type="text" placeholder="اسم الصنف" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-emerald-500" />
                <input type="text" placeholder="السعر" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-emerald-500" />
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white outline-none">
                  <option value="أسمدة">أسمدة</option>
                  <option value="مبيدات">مبيدات</option>
                  <option value="تقاوي">تقاوي</option>
                </select>
                <textarea placeholder="وصف سريع..." value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white h-20 outline-none" />
                <button onClick={addProduct} className="w-full bg-emerald-600 py-4 rounded-2xl text-white font-bold hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-900/40">نشر المنتج</button>
              </div>
            </div>
          )}

          {/* 🛒 عرض المنتجات للجميع */}
          <div className={`${isAdmin ? 'lg:col-span-3' : 'lg:col-span-4'} grid grid-cols-1 md:grid-cols-2 gap-6`}>
            {loading ? (
              <div className="col-span-full flex justify-center py-20"><Loader2 className="animate-spin text-emerald-500 w-10 h-10" /></div>
            ) : (
              <AnimatePresence>
                {products.map((p) => (
                  <motion.div key={p.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-[#0a0f0c] border border-white/5 rounded-[2.5rem] p-5 hover:shadow-2xl hover:shadow-emerald-500/5 transition-all group">
                    <div className="relative h-48 bg-neutral-900 rounded-3xl mb-4 overflow-hidden">
                      {p.image_url ? <img src={p.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" /> : <div className="w-full h-full flex items-center justify-center"><ShoppingBag className="text-neutral-800 w-12 h-12" /></div>}
                      <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-emerald-400 text-[10px] font-bold px-3 py-1 rounded-full border border-white/10">{p.category}</div>
                    </div>
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-white font-bold text-xl">{p.name}</h4>
                      {isAdmin && <button onClick={() => deleteProduct(p.id)} className="text-red-500/40 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>}
                    </div>
                    <p className="text-neutral-500 text-xs mb-6 line-clamp-2">{p.description}</p>
                    <div className="flex items-center justify-between border-t border-white/5 pt-4">
                      <span className="text-emerald-400 font-black text-2xl">{p.price}</span>
                      <a href={`https://wa.me/201234567890?text=محتاج طلب: ${p.name}`} className="bg-white/5 hover:bg-emerald-600 text-white px-5 py-2 rounded-xl border border-white/10 transition-all flex items-center gap-2 font-bold text-sm"><MessageCircle className="w-4 h-4" /> اطلب</a>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Marketplace;
