import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ShoppingBag, ArrowLeft, MessageCircle, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const FeaturedMarketplace = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLatestProducts = async () => {
      setIsLoading(true);
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
    <section className="py-20 bg-background font-tajawal">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* رأس القسم */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6 border-b border-border/60 pb-6" dir="rtl">
          <motion.div 
            initial={{ opacity: 0, x: 20 }} 
            whileInView={{ opacity: 1, x: 0 }} 
            viewport={{ once: true }}
            className="max-w-2xl"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
              أحدث <span className="text-primary">المنتجات والتقاوي</span>
            </h2>
            <p className="text-muted-foreground mt-2 text-sm sm:text-base">
              أفضل المستلزمات الزراعية الموثوقة لتضمن أعلى جودة لمحصولك.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            whileInView={{ opacity: 1, x: 0 }} 
            viewport={{ once: true }}
            className="shrink-0 w-full md:w-auto"
          >
            <Link to="/marketplace">
              <Button variant="outline" className="w-full md:w-auto h-12 bg-card border-border hover:border-primary hover:bg-primary/5 text-foreground rounded-xl gap-2 font-medium transition-all text-sm px-6 group">
                <ShoppingBag className="w-4 h-4 text-primary" />
                <span>تصفح المتجر بالكامل</span>
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1 text-primary" />
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* عرض المنتجات */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-muted border border-border rounded-2xl h-[360px] animate-pulse flex flex-col p-4">
                <div className="w-full h-44 bg-muted-foreground/10 rounded-xl mb-4" />
                <div className="h-5 w-3/4 bg-muted-foreground/10 rounded-md mb-2" />
                <div className="h-4 w-full bg-muted-foreground/10 rounded-md mb-auto" />
                <div className="h-10 w-full bg-muted-foreground/10 rounded-xl mt-4" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 bg-card border border-dashed border-border rounded-2xl">
            <ShoppingBag className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">لم يتم إضافة منتجات للمتجر بعد.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" dir="rtl">
            {products.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group bg-card border border-border rounded-2xl p-4 hover:border-primary/40 transition-all duration-300 flex flex-col h-full"
              >
                {/* صورة المنتج */}
                <div className="w-full h-44 bg-muted rounded-xl overflow-hidden relative mb-4 border border-border/55">
                  {product.image_url ? (
                    <img 
                      src={product.image_url} 
                      alt={product.name} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ShoppingBag className="w-10 h-10 text-muted-foreground" />
                    </div>
                  )}
                  
                  {/* تصنيف المنتج */}
                  <div className="absolute top-2.5 right-2.5 bg-background/80 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-border text-[11px] font-medium text-primary">
                    {product.category}
                  </div>
                </div>

                {/* تفاصيل المنتج */}
                <div className="flex flex-col flex-1">
                  <h3 className="text-base font-bold text-foreground mb-1.5 line-clamp-1 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-muted-foreground text-xs mb-4 line-clamp-2 leading-relaxed">
                    {product.description || "أفضل المستلزمات الزراعية متوفرة الآن في متجر نبتة."}
                  </p>
                  
                  <div className="mt-auto border-t border-border/60 pt-3">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs text-muted-foreground font-medium">السعر</span>
                      <span className="text-lg font-bold text-primary tabular-nums">{product.price} ج.م</span>
                    </div>

                    <a 
                      href={`https://wa.me/201019715490?text=أريد طلب: ${product.name}`}
                      target="_blank" rel="noopener noreferrer"
                      className="w-full block"
                    >
                      <Button className="w-full h-10 bg-primary hover:bg-primary/95 text-primary-foreground rounded-xl gap-2 text-xs font-semibold transition-all">
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>اطلب عبر واتساب</span>
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
