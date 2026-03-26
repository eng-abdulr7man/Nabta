import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ShoppingBag, ArrowLeft, MessageCircle, Tag, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const FeaturedMarketplace = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLatestProducts = async () => {
      setIsLoading(true);
      // هنسحب أحدث 4 منتجات فقط لعرضهم في الرئيسية
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(4);

      if (!error && data) {
        setProducts(data);
      }
      setIsLoading(false);
    };

    fetchLatestProducts();
  }, []);

  return (
    <section className="py-24 relative overflow-hidden bg-[#050806] font-tajawal">
      {/* إضاءات خلفية خفيفة للمتجر */}
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-emerald-900/10 blur-[150px] rounded-full pointer-events-none -translate-y-1/2" />
      
      <div className="container mx-auto px-4 relative z-10 max-w-7xl">
        
        {/* هيدر السكشن */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6 border-b border-white/5 pb-6">
          <motion.div 
            initial={{ opacity: 0, x: 20 }} 
            whileInView={{ opacity: 1, x: 0 }} 
            viewport={{ once: true }}
            className="max-w-2xl text-right" dir="rtl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-bold mb-4">
              <Tag className="w-4 h-4" />
              سوق نبتة
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">
              أحدث <span className="text-emerald-500">المنتجات والتقاوي</span>
            </h2>
            <p className="text-neutral-400 mt-4 text-lg">
              وفرنا لك أفضل المستلزمات الزراعية الموثوقة لتضمن أعلى جودة لمحصولك، اطلبها الآن تصلك أينما كنت.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            whileInView={{ opacity: 1, x: 0 }} 
            viewport={{ once: true }}
            className="shrink-0 w-full md:w-auto"
          >
            <Link to="/marketplace">
              <Button variant="outline" className="w-full md:w-auto h-14 bg-transparent border-neutral-700 hover:border-emerald-500 hover:bg-emerald-500/10 text-white rounded-xl gap-2 font-bold transition-all text-base px-8 group">
                <ShoppingBag className="w-5 h-5 text-emerald-500" />
                تصفح المتجر بالكامل
                <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1 text-emerald-500" />
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* عرض المنتجات */}
        {isLoading ? (
          // Skeleton للمنتجات أثناء التحميل
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-[#0a0f0c] border border-neutral-800/60 rounded-[2rem] h-[380px] animate-pulse flex flex-col p-4">
                <div className="w-full h-48 bg-[#121A15] rounded-2xl mb-4" />
                <div className="h-6 w-3/4 bg-[#121A15] rounded-md mb-2" />
                <div className="h-4 w-full bg-[#121A15] rounded-md mb-auto" />
                <div className="h-12 w-full bg-[#121A15] rounded-xl mt-4" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          // لو مفيش منتجات
          <div className="text-center py-20 bg-[#0a0f0c] border border-dashed border-neutral-800 rounded-[2rem]">
            <ShoppingBag className="w-12 h-12 text-neutral-600 mx-auto mb-4" />
            <p className="text-neutral-400 text-lg">لم يتم إضافة منتجات للمتجر بعد.</p>
          </div>
        ) : (
          // شبكة المنتجات الأربعة
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" dir="rtl">
            {products.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group bg-gradient-to-br from-[#0a0f0c] to-[#121A15] border border-neutral-800/60 rounded-[2rem] p-4 hover:border-emerald-500/30 transition-all duration-300 hover:-translate-y-2 shadow-lg hover:shadow-2xl hover:shadow-emerald-500/10 flex flex-col h-full"
              >
                {/* صورة المنتج */}
                <div className="w-full h-48 sm:h-52 bg-[#1a241d] rounded-2xl overflow-hidden relative mb-5 border border-white/5">
                  {product.image_url ? (
                    <img 
                      src={product.image_url} 
                      alt={product.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ShoppingBag className="w-12 h-12 text-neutral-700" />
                    </div>
                  )}
                  {/* شريط متدرج فوق الصورة */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f0c] via-transparent to-transparent opacity-80" />
                  
                  {/* تصنيف المنتج */}
                  <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 shadow-lg z-10">
                    <span className="text-xs font-bold text-emerald-400">{product.category}</span>
                  </div>
                </div>

                {/* تفاصيل المنتج */}
                <div className="flex flex-col flex-1">
                  <h3 className="text-xl font-bold text-white mb-2 line-clamp-1 group-hover:text-emerald-400 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-neutral-400 text-sm mb-4 line-clamp-2 leading-relaxed">
                    {product.description || "أفضل المستلزمات الزراعية متوفرة الآن في متجر نبتة."}
                  </p>
                  
                  <div className="mt-auto border-t border-white/5 pt-4">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs text-neutral-500 font-bold">السعر</span>
                      <span className="text-2xl font-black text-emerald-400 tabular-nums tracking-tighter">{product.price}</span>
                    </div>

                    <a 
                      href={`https://wa.me/201019715490?text=أريد طلب: ${product.name}`}
                      target="_blank" rel="noopener noreferrer"
                      className="w-full block"
                    >
                      <Button className="w-full h-12 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl gap-2 font-bold shadow-[0_0_15px_rgba(16,185,129,0.2)] transition-all group-hover:shadow-[0_0_25px_rgba(16,185,129,0.4)]">
                        <MessageCircle className="w-4 h-4" /> اطلب عبر واتساب
                      </Button>
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedMarketplace;
