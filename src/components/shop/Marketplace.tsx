import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShoppingBag, Plus, Trash2, 
  ExternalLink, Tag, Package, 
  CheckCircle, MessageCircle 
} from "lucide-react";

// --- الواجهة التعريفية للمنتج ---
interface Product {
  id: number;
  name: string;
  category: string;
  price: string;
  description: string;
  image?: string;
}

const Marketplace = () => {
  // حالة المنتجات (ممكن نربطها بـ Database لاحقاً)
  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: "يوريا 46% - محلي", category: "أسمدة", price: "950 ج.م", description: "شيكارة 50 كجم، جودة عالية للتسميد النيتروجيني." },
    { id: 2, name: "ريدوميل جولد", category: "مبيدات فطري", price: "420 ج.م", description: "أفضل وقاية وعلاج لمرض اللفحة المتأخرة." },
  ]);

  // حالات فورم الإضافة (للأدمن فقط)
  const [isAdmin, setIsAdmin] = useState(true); // غيرها لـ false عشان تشوف شكل اليوزر العادي
  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newCategory, setNewCategory] = useState("أسمدة");

  // دالة إضافة منتج
  const addProduct = () => {
    if (newName && newPrice) {
      const newProd = {
        id: Date.now(),
        name: newName,
        price: newPrice,
        category: newCategory,
        description: "منتج معتمد من نبتة للخدمات الزراعية."
      };
      setProducts([newProd, ...products]);
      setNewName(""); setNewPrice("");
    }
  };

  // دالة حذف منتج
  const deleteProduct = (id: number) => {
    setProducts(products.filter(p => p.id !== id));
  };

  return (
    <section className="py-20 bg-[#050806] font-tajawal text-right" dir="rtl">
      <div className="container mx-auto px-4 max-w-6xl">
        
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <div>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-2">متجر <span className="text-emerald-400">نبتة</span></h2>
            <p className="text-neutral-400">مستلزمات زراعية منتقاة وموثوقة لضمان أعلى إنتاجية.</p>
          </div>
          <div className="flex items-center gap-2 bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20">
            <Package className="text-emerald-500 w-5 h-5" />
            <span className="text-emerald-500 font-bold">{products.length} منتج متاح</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* 🛠️ لوحة الإضافة (تظهر للأدمن فقط) */}
          {isAdmin && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1 bg-[#0a0f0c] border border-emerald-500/20 rounded-[2rem] p-6 h-fit sticky top-24"
            >
              <h3 className="text-white font-bold mb-6 flex items-center gap-2">
                <Plus className="text-emerald-500" /> إضافة منتج جديد
              </h3>
              <div className="space-y-4">
                <input 
                  type="text" placeholder="اسم المنتج" value={newName} onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-emerald-500"
                />
                <select 
                  value={newCategory} onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-emerald-500"
                >
                  <option value="أسمدة">أسمدة</option>
                  <option value="مبيدات">مبيدات</option>
                  <option value="تقاوي">تقاوي</option>
                  <option value="أدوات">أدوات ري</option>
                </select>
                <input 
                  type="text" placeholder="السعر (مثال: 500 ج.م)" value={newPrice} onChange={(e) => setNewPrice(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-emerald-500"
                />
                <button 
                  onClick={addProduct}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-emerald-900/20"
                >
                  حفظ المنتج في المتجر
                </button>
              </div>
            </motion.div>
          )}

          {/* 🛒 عرض المنتجات */}
          <div className={`grid grid-cols-1 md:grid-cols-2 ${isAdmin ? 'lg:col-span-3' : 'lg:col-span-4'} gap-6`}>
            <AnimatePresence>
              {products.map((product) => (
                <motion.div 
                  key={product.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                  className="group bg-[#0a0f0c] border border-white/5 rounded-[2rem] p-5 hover:border-emerald-500/30 transition-all relative overflow-hidden"
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="bg-emerald-500/10 text-emerald-500 text-[10px] font-bold px-3 py-1 rounded-full border border-emerald-500/20">
                      {product.category}
                    </span>
                    {isAdmin && (
                      <button onClick={() => deleteProduct(product.id)} className="text-red-500/50 hover:text-red-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="text-white font-bold text-xl mb-1">{product.name}</h4>
                    <p className="text-neutral-400 text-sm line-clamp-2">{product.description}</p>
                  </div>

                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/5">
                    <div>
                      <p className="text-xs text-neutral-500 mb-1">السعر التقريبي</p>
                      <p className="text-emerald-400 font-black text-lg">{product.price}</p>
                    </div>
                    <a 
                      href={`https://wa.me/201234567890?text=أريد طلب ${product.name}`}
                      className="flex items-center gap-2 bg-white/5 hover:bg-emerald-600 hover:text-white text-neutral-300 px-4 py-2 rounded-xl border border-white/10 transition-all text-sm font-bold"
                    >
                      <MessageCircle className="w-4 h-4" /> اطلب الآن
                    </a>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Marketplace;
