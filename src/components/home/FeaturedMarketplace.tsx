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
    <section className="py-24 relative overflow-hidden bg-background font-tajawal">
      {/* إضاءات خلفية خفيفة للمتجر */}

      <div className="container mx-auto px-4 relative z-10 max-w-7xl">
        
        {/* هيدر السكشن */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6 border-b border-border pb-6">
          <motion.div 
            initial={{ opacity: 0, x: 20 }} 
            whileInView={{ opacity: 1, x: 0 }} 
            viewport={{ once: true }}
            className="max-w-2xl text-right" dir="rtl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent border border-primary/20 text-primary text-sm font-bold mb-4">
              <Tag className="w-4 h-4" />
              سوق نبتة
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-foreground leading-tight">
              أحدث <span className="text-primary">المنتجات والتقاوي</span>
            </h2>
            <p className="text-muted-foreground mt-4 text-lg">
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
              <Button variant="outline" className="w-full md:w-auto h-14 bg-transparent border-border hover:border-primary hover:bg-accent text-foreground rounded-xl gap-2 font-bold transition-all text-base px-8 group">
                <ShoppingBag className="w-5 h-5 text-primary" />
                تصفح المتجر بالكامل
                <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1 text-primary" />
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* عرض المنتجات */}
        {isLoading ? (
          // Skeleton للمنتجات أثناء التحميل
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-muted border border-border rounded-[2rem] h-[380px] animate-pulse flex flex-col p-4">
                <div className="w-full h-48 bg-muted rounded-2xl mb-4" />
                <div className="h-6 w-3/4 bg-muted rounded-md mb-2" />
                <div className="h-4 w-full bg-muted rounded-md mb-auto" />
                <div className="h-12 w-full bg-muted rounded-xl mt-4" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          // لو مفيش منتجات
          <div className="text-center py-20 bg-muted border border-dashed border-border rounded-[2rem]">
            <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground text-lg">لم يتم إضافة منتجات للمتجر بعد.</p>
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
                className="group bg-gradient-to-br  border border-border rounded-[2rem] p-4 hover:border-primary/20 transition-all duration-300 hover:-translate-y-2 shadow-lg hover:shadow-2xl hover: flex flex-col h-full"
              >
                {/* صورة المنتج */}
                <div className="w-full h-48 sm:h-52 bg-muted rounded-2xl overflow-hidden relative mb-5 border border-border">
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
                  <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-border shadow-lg z-10">
                    <span className="text-xs font-bold text-primary">{product.category}</span>
                  </div>
                </div>

                {/* تفاصيل المنتج */}
                <div className="flex flex-col flex-1">
                  <h3 className="text-xl font-bold text-foreground mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2 leading-relaxed">
                    {product.description || "أفضل المستلزمات الزراعية متوفرة الآن في متجر نبتة."}
                  </p>
                  
                  <div className="mt-auto border-t border-border pt-4">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs text-muted-foreground font-bold">السعر</span>
                      <span className="text-2xl font-black text-primary tabular-nums tracking-tighter">{product.price}</span>
                    </div>

                    <a 
                      href={`https://wa.me/201019715490?text=أريد طلب: ${product.name}`}
                      target="_blank" rel="noopener noreferrer"
                      className="w-full block"
                    >
                      <Button className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl gap-2 font-bold  transition-all group-hover:">
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
