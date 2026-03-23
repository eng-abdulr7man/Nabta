import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, Trash2, ShoppingBag, MessageCircle, 
  Loader2, Camera, Filter, X, Leaf, Sprout, Droplets, Bug, LayoutGrid, Search, Eye, Settings, Edit2, Check, CheckCircle2
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const categoryIcons: Record<string, any> = {
  "أسمدة": Leaf,
  "مبيدات فطري": Bug,
  "مبيدات حشري": Bug,
  "تقاوي": Sprout,
  "أدوات ري": Droplets,
  "الكل": LayoutGrid
};

const Marketplace = () => {
  const { user, isAdmin } = useAuth();
  
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  
  const [dbCategories, setDbCategories] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [isManageCategoriesOpen, setIsManageCategoriesOpen] = useState(false);

  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editCategoryName, setEditCategoryName] = useState("");

  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newDescription, setNewDescription] = useState("");
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

  const fetchCategories = async () => {
    const { data, error } = await supabase.from("categories").select("*").order("created_at", { ascending: true });
    if (!error && data) {
      const formattedCats = data.map(cat => ({
        dbId: cat.id, id: cat.name, label: cat.name, icon: categoryIcons[cat.name] || LayoutGrid 
      }));
      setDbCategories([{ id: "all", label: "الكل", icon: LayoutGrid }, ...formattedCats]);
      if (data.length > 0) setNewCategory(data[0].name);
    }
  };

  useEffect(() => { 
    fetchProducts(); fetchCategories();
  }, []);

  useEffect(() => {
    let result = products;
    if (activeCategory !== "all") result = result.filter(p => p.category === activeCategory);
    if (searchQuery.trim() !== "") {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(lowerQuery) || (p.description && p.description.toLowerCase().includes(lowerQuery)));
    }
    setFilteredProducts(result);
  }, [activeCategory, searchQuery, products]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);
    const file = e.target.files[0];
    const filePath = `product-images/${Math.random()}.${file.name.split('.').pop()}`;
    const { error: uploadError } = await supabase.storage.from('media').upload(filePath, file);

    if (uploadError) toast.error("فشل رفع الصورة");
    else {
      const { data } = supabase.storage.from('media').getPublicUrl(filePath);
      setImageUrl(data.publicUrl);
      toast.success("الصورة جاهزة! 📸");
    }
    setUploading(false);
  };

  const addProduct = async () => {
    if (!newName || !newPrice) return toast.error("يا هندسة كمل البيانات ناقصة!");
    const { error } = await supabase.from("products").insert([{ name: newName, price: newPrice, category: newCategory, description: newDescription, image_url: imageUrl }]);
    if (error) toast.error("حدث خطأ أثناء الإضافة");
    else {
      toast.success("تم النشر بنجاح! 🚀");
      setNewName(""); setNewPrice(""); setImageUrl(""); setNewDescription("");
      setIsModalOpen(false); fetchProducts();
    }
  };

  const deleteProduct = async (id: string) => {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (!error) { toast.success("تم مسح المنتج"); fetchProducts(); }
  };

  const addCategory = async () => {
    if(!newCategoryName.trim()) return toast.error("أدخل اسم القسم أولاً!");
    const { error } = await supabase.from("categories").insert([{ name: newCategoryName.trim() }]);
    if (error) toast.error("حدث خطأ، ممكن يكون القسم موجود بالفعل!");
    else {
      toast.success("تم إضافة القسم بنجاح 📂");
      setNewCategoryName(""); fetchCategories();
    }
  };

  const deleteCategory = async (id: string, name: string) => {
    if (!window.confirm(`متأكد إنك عايز تمسح قسم "${name}"؟`)) return;
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) toast.error("حدث خطأ أثناء مسح القسم.");
    else {
      toast.success("تم مسح القسم.");
      if (activeCategory === name) setActiveCategory("all");
      fetchCategories();
    }
  };

  const updateCategory = async (id: string, oldName: string) => {
    if (!editCategoryName.trim()) return toast.error("الاسم الجديد فارغ!");
    const { error: catError } = await supabase.from("categories").update({ name: editCategoryName.trim() }).eq("id", id);
    if (catError) toast.error("حدث خطأ، ممكن الاسم يكون مستخدم.");
    else {
      await supabase.from("products").update({ category: editCategoryName.trim() }).eq("category", oldName);
      toast.success("تم تعديل القسم بنجاح ✨");
      setEditingCategoryId(null); fetchCategories(); fetchProducts(); 
    }
  };

  return (
    // تقليل الـ padding العُلوي في الموبايل pt-20 بدل pt-28
    <div className="min-h-screen bg-[#050806] text-white font-tajawal pt-20 md:pt-28 pb-16 md:pb-20 relative overflow-hidden" dir="rtl">
      <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')] opacity-5 pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-64 md:w-96 h-64 md:h-96 bg-emerald-900/10 blur-[100px] md:blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10 max-w-7xl">
        
        {/* ---------------- HEADER ---------------- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 md:mb-10 gap-4 md:gap-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="w-full md:w-auto">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black mb-2 flex items-center gap-2 md:gap-3">
              سوق <span className="text-emerald-500">نبتة</span>
            </h1>
            <p className="text-neutral-500 text-sm md:text-lg">مستلزمات الإنتاج الزراعي بين يديك.</p>
          </motion.div>
          
          {isAdmin && (
            <motion.button 
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={() => setIsModalOpen(true)}
              // الزرار هياخد 100% عرض في الموبايل
              className="w-full md:w-auto flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 md:px-8 py-3.5 md:py-4 rounded-xl md:rounded-full font-bold text-sm md:text-base shadow-lg shadow-emerald-900/20 transition-all mt-2 md:mt-0"
            >
              <Plus className="w-5 h-5" /> إضافة صنف جديد
            </motion.button>
          )}
        </div>

        {/* ---------------- شريط البحث ---------------- */}
        <div className="mb-6 md:mb-8 max-w-xl relative">
          <div className="absolute inset-y-0 right-3.5 flex items-center pointer-events-none">
            <Search className="w-4 h-4 md:w-5 md:h-5 text-neutral-500" />
          </div>
          <input 
            type="text"
            placeholder="ابحث عن منتج..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0a0f0c] text-white pr-10 pl-4 py-3.5 md:py-4 rounded-xl md:rounded-2xl border border-white/10 focus:border-emerald-500 outline-none shadow-inner transition-colors text-sm md:text-base"
          />
        </div>

        {/* ---------------- الفلاتر (سلسة جداً عالموبايل) ---------------- */}
        <div className="flex flex-nowrap items-center gap-2 md:gap-3 mb-8 md:mb-12 pb-2 overflow-x-auto no-scrollbar scroll-smooth">
          <div className="flex-shrink-0 flex items-center gap-1.5 bg-[#0a0f0c] px-3 md:px-4 py-2 md:py-2.5 rounded-xl border border-white/5 shadow-inner">
            <Filter className="w-3.5 h-3.5 md:w-4 md:h-4 text-emerald-500" />
            <span className="text-xs md:text-sm text-neutral-500 font-bold ml-1">تصفية:</span>
          </div>
          
          {dbCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex-shrink-0 flex items-center gap-1.5 md:gap-2 px-4 md:px-6 py-2.5 md:py-3.5 rounded-xl font-bold transition-all whitespace-nowrap border text-xs md:text-sm ${
                activeCategory === cat.id 
                  ? "bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-900/20" 
                  : "bg-[#121A15]/50 border-white/5 text-neutral-400 hover:border-emerald-500/20 hover:text-white"
              }`}
            >
              <cat.icon className="w-3.5 h-3.5 md:w-4 md:h-4" />
              {cat.label}
            </button>
          ))}

          {isAdmin && (
             <button
              onClick={() => setIsManageCategoriesOpen(true)}
              className="flex-shrink-0 flex items-center gap-1.5 md:gap-2 px-4 md:px-6 py-2.5 md:py-3.5 rounded-xl font-bold transition-all whitespace-nowrap border bg-[#121A15]/50 border-emerald-500/20 text-emerald-400 hover:bg-emerald-600 hover:text-white hover:border-emerald-500 border-dashed mr-auto"
             >
               <Settings className="w-3.5 h-3.5 md:w-4 md:h-4" /> إدارة الأقسام
             </button>
          )}
        </div>

        {/* ---------------- شبكة المنتجات ---------------- */}
        {loading ? (
          <div className="text-center py-20 md:py-40 text-neutral-600 flex flex-col items-center gap-4">
            <Loader2 className="animate-spin w-10 h-10 md:w-12 md:h-12 text-emerald-500" />
            <p className="text-base md:text-lg">جاري التحميل...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 md:py-32 bg-[#0a0f0c] rounded-[1.5rem] md:rounded-[2.5rem] border border-white/5 flex flex-col items-center gap-4 md:gap-6 shadow-2xl">
            <ShoppingBag className="w-16 h-16 md:w-20 md:h-20 text-neutral-800" />
            <p className="text-neutral-500 text-lg md:text-xl font-medium">لا توجد منتجات مطابقة.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
            <AnimatePresence>
              {filteredProducts.map((p, idx) => (
                <motion.div 
                  key={p.id}
                  layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className="group bg-[#0a0f0c] rounded-[1.5rem] md:rounded-[2.5rem] border border-white/5 overflow-hidden hover:border-emerald-500/30 shadow-lg hover:shadow-2xl hover:shadow-emerald-500/5 transition-all relative flex flex-col"
                >
                  {/* الصورة للموبايل أصغر شوية h-52 */}
                  <div className="h-52 md:h-64 bg-neutral-900 relative overflow-hidden cursor-pointer" onClick={() => setSelectedProduct(p)}>
                    {p.image_url ? (
                      <>
                        <img src={p.image_url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f0c] via-transparent to-transparent opacity-90" />
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-neutral-800 bg-gradient-to-br from-neutral-900 to-black"><ShoppingBag size={48} /></div>
                    )}
                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] md:text-xs font-bold text-emerald-400 border border-white/10 shadow-lg">
                      {p.category}
                    </div>
                  </div>
                  
                  <div className="p-4 md:p-6 flex flex-col flex-1 relative z-10 -mt-4 bg-[#0a0f0c] rounded-t-2xl md:rounded-t-3xl">
                    <h4 className="text-lg md:text-xl font-bold text-white mb-1.5 truncate group-hover:text-emerald-400 transition-colors">{p.name}</h4>
                    <p className="text-neutral-400 text-xs md:text-sm mb-4 line-clamp-2 leading-relaxed">{p.description}</p>
                    
                    <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-auto">
                      <span className="text-emerald-400 font-black text-xl md:text-2xl tracking-tighter tabular-nums">{p.price}</span>
                      
                      <div className="flex gap-2">
                        <button 
                          onClick={() => setSelectedProduct(p)}
                          className="p-2.5 md:p-3 bg-white/5 hover:bg-emerald-500/20 text-neutral-300 hover:text-emerald-400 rounded-xl md:rounded-2xl border border-white/5 transition-all"
                        >
                          <Eye className="w-4 h-4 md:w-5 md:h-5" />
                        </button>
                        <a 
                          href={`https://wa.me/201019715490?text=أريد طلب: ${p.name}`}
                          className="flex items-center gap-1.5 md:gap-2 bg-emerald-600/10 hover:bg-emerald-600 text-emerald-500 hover:text-white px-4 md:px-5 py-2.5 md:py-3 rounded-xl md:rounded-2xl border border-emerald-500/20 transition-all text-xs md:text-sm font-bold"
                        >
                          <MessageCircle className="w-4 h-4" /> اطلب
                        </a>
                      </div>
                    </div>
                  </div>
                  {isAdmin && (
                    <button onClick={()=>deleteProduct(p.id)} className="absolute top-3 left-3 p-2 bg-red-500/90 hover:bg-red-600 rounded-full text-white opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity z-20 shadow-lg">
                      <Trash2 size={14}/>
                    </button>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* ========================================================= */}
        {/* ======================= MODALS ========================== */}
        {/* ========================================================= */}

        {/* ⚙️ Modal إدارة الأقسام */}
        <AnimatePresence>
          {isManageCategoriesOpen && isAdmin && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[160] bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 font-tajawal text-right" dir="rtl"
            >
              <motion.div 
                initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 10 }}
                className="bg-[#0a0f0c] w-full max-w-md rounded-[1.5rem] md:rounded-[2.5rem] border border-emerald-500/20 p-5 md:p-8 shadow-2xl relative max-h-[90dvh] flex flex-col"
              >
                <button onClick={() => setIsManageCategoriesOpen(false)} className="absolute top-4 left-4 text-neutral-500 hover:text-white bg-white/5 p-1.5 rounded-full"><X size={18}/></button>
                <h3 className="text-white font-bold mb-5 flex items-center gap-2 text-lg md:text-xl"> <Settings className="text-emerald-500 w-5 h-5" /> إدارة الأقسام</h3>
                
                <div className="flex gap-2 mb-6 border-b border-white/10 pb-5">
                  <input 
                    placeholder="اسم القسم الجديد..." 
                    value={newCategoryName} 
                    onChange={e => setNewCategoryName(e.target.value)} 
                    // text-base بيمنع زووم الآيفون التلقائي
                    className="flex-1 bg-black/40 px-3 py-2.5 rounded-lg border border-white/5 outline-none focus:border-emerald-500 text-white text-base" 
                  />
                  <button onClick={addCategory} className="bg-emerald-600 px-4 py-2.5 rounded-lg text-white font-bold hover:bg-emerald-500 transition-all text-sm">إضافة</button>
                </div>

                <div className="flex-1 overflow-y-auto pr-1 space-y-2 no-scrollbar">
                  {dbCategories.filter(c => c.id !== 'all').map((cat) => (
                    <div key={cat.dbId} className="flex items-center justify-between bg-[#121A15]/50 p-3 rounded-lg border border-white/5">
                      {editingCategoryId === cat.dbId ? (
                        <div className="flex items-center gap-2 w-full">
                          <input 
                            value={editCategoryName} 
                            onChange={e => setEditCategoryName(e.target.value)} 
                            className="flex-1 bg-black/60 px-2 py-1.5 rounded-md border border-emerald-500/50 outline-none text-white text-sm" 
                            autoFocus
                          />
                          <button onClick={() => updateCategory(cat.dbId, cat.label)} className="p-1.5 bg-emerald-600 rounded-md text-white"><Check size={14}/></button>
                          <button onClick={() => setEditingCategoryId(null)} className="p-1.5 bg-neutral-800 rounded-md text-neutral-400"><X size={14}/></button>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-2 text-white font-medium text-sm">
                            <cat.icon className="w-3.5 h-3.5 text-emerald-500" /> {cat.label}
                          </div>
                          <div className="flex gap-1.5">
                            <button onClick={() => { setEditingCategoryId(cat.dbId); setEditCategoryName(cat.label); }} className="p-1.5 text-neutral-400 bg-white/5 rounded-md"><Edit2 size={14}/></button>
                            <button onClick={() => deleteCategory(cat.dbId, cat.label)} className="p-1.5 text-red-400 bg-red-500/10 rounded-md"><Trash2 size={14}/></button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 🛠️ Modal إضافة منتج */}
        <AnimatePresence>
          {isModalOpen && isAdmin && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[150] bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 font-tajawal text-right" dir="rtl"
            >
              <motion.div 
                initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 10 }}
                className="bg-[#0a0f0c] w-full max-w-xl rounded-[1.5rem] md:rounded-[2.5rem] border border-emerald-500/20 p-5 md:p-8 shadow-2xl relative max-h-[90dvh] overflow-y-auto no-scrollbar"
              >
                <button onClick={() => setIsModalOpen(false)} className="absolute top-4 left-4 text-neutral-500 hover:text-white bg-white/5 p-1.5 rounded-full z-10"><X size={18}/></button>
                <h3 className="text-white font-bold mb-6 flex items-center gap-2 text-lg md:text-2xl"> <Plus className="text-emerald-500 w-5 h-5 md:w-6 md:h-6" /> إضافة صنف جديد</h3>
                
                <div className="space-y-3 md:space-y-4">
                  <div className="relative h-32 md:h-40 bg-black/40 border-2 border-dashed border-white/10 rounded-xl md:rounded-2xl flex items-center justify-center overflow-hidden">
                    {imageUrl ? <img src={imageUrl} className="w-full h-full object-cover" /> : (
                      <div className="text-center">
                        {uploading ? <Loader2 className="animate-spin mx-auto text-emerald-500" /> : <Camera className="mx-auto text-neutral-600 w-6 h-6 md:w-8 md:h-8 mb-1" />}
                        <span className="text-xs md:text-sm text-neutral-500 block mt-1">اضغط لرفع صورة المنتج</span>
                      </div>
                    )}
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                  </div>

                  <input placeholder="اسم المنتج" value={newName} onChange={e=>setNewName(e.target.value)} className="w-full bg-black/40 p-3 md:p-4 rounded-lg md:rounded-xl border border-white/5 outline-none focus:border-emerald-500 text-white text-base" />
                  <input placeholder="السعر" value={newPrice} onChange={e=>setNewPrice(e.target.value)} className="w-full bg-black/40 p-3 md:p-4 rounded-lg md:rounded-xl border border-white/5 outline-none focus:border-emerald-500 text-white text-base" />
                  
                  <select value={newCategory} onChange={e=>setNewCategory(e.target.value)} className="w-full bg-black/40 p-3 md:p-4 rounded-lg md:rounded-xl border border-white/5 text-neutral-300 outline-none focus:border-emerald-500 appearance-none text-base">
                    {dbCategories.filter(c => c.id !== 'all').map((cat) => (
                      <option key={cat.id} value={cat.id} className="bg-[#0a0f0c]">{cat.label}</option>
                    ))}
                  </select>
                  
                  <textarea placeholder="وصف سريع..." value={newDescription} onChange={e=>setNewDescription(e.target.value)} className="w-full bg-black/40 p-3 md:p-4 rounded-lg md:rounded-xl border border-white/5 outline-none focus:border-emerald-500 h-20 md:h-24 resize-none text-base" />
                  <button onClick={addProduct} className="w-full bg-emerald-600 py-3 md:py-4 rounded-xl text-white font-bold hover:bg-emerald-500 transition-all text-base md:text-lg shadow-lg">نشر الآن</button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 👁️ Modal تفاصيل المنتج (التصميم المظبوط للموبايل والديسك توب) */}
        <AnimatePresence>
          {selectedProduct && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 font-tajawal text-right" dir="rtl"
              onClick={() => setSelectedProduct(null)}
            >
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-[#0a0f0c] w-full max-w-4xl max-h-[90dvh] rounded-[1.5rem] md:rounded-[2rem] border border-white/10 shadow-[0_0_30px_rgba(16,185,129,0.1)] relative overflow-hidden flex flex-col md:flex-row"
              >
                <button 
                  onClick={() => setSelectedProduct(null)} 
                  className="absolute top-3 left-3 z-50 flex items-center justify-center w-8 h-8 md:w-10 md:h-10 bg-black/50 hover:bg-red-500/90 backdrop-blur-md rounded-full text-white transition-all border border-white/10"
                >
                  <X size={18}/>
                </button>
                
                {/* قسم الصورة */}
                <div className="w-full md:w-[45%] h-48 sm:h-56 md:h-auto bg-[#050806] p-4 md:p-6 flex items-center justify-center shrink-0 border-b md:border-b-0 md:border-l border-white/5">
                   <div className="relative w-full h-full max-w-[220px] md:max-w-[280px] aspect-[4/5] rounded-[1rem] md:rounded-[1.5rem] overflow-hidden border border-white/10 shadow-inner bg-black/50 p-2 md:p-4">
                      {selectedProduct.image_url ? (
                        <img src={selectedProduct.image_url} className="w-full h-full object-contain filter drop-shadow-xl" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-neutral-800"><ShoppingBag size={64} /></div>
                      )}
                   </div>
                </div>

                {/* قسم التفاصيل */}
                <div className="w-full md:w-[55%] p-5 md:p-8 flex flex-col bg-gradient-to-br from-[#0a0f0c] to-[#0f1712] overflow-hidden">
                  
                  <div className="shrink-0 mb-3 md:mb-4">
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                          <div className="flex items-center gap-1 bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-lg text-[10px] md:text-xs font-bold border border-emerald-500/20">
                            <LayoutGrid size={12} /> {selectedProduct.category}
                          </div>
                          <div className="flex items-center gap-1 bg-white/5 text-neutral-300 px-2.5 py-1 rounded-lg text-[10px] md:text-xs font-bold border border-white/5">
                            <CheckCircle2 size={12} className="text-emerald-500" /> متوفر
                          </div>
                      </div>
                      <h2 className="text-2xl md:text-4xl font-black text-white leading-tight">{selectedProduct.name}</h2>
                  </div>
                  
                  {/* سكرول الوصف بيشتغل بامتياز ع الموبايل */}
                  <div className="flex-1 overflow-y-auto pr-1 my-1 md:my-2 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-emerald-500/30">
                     <p className="text-neutral-400 text-sm md:text-base leading-relaxed whitespace-pre-wrap">
                       {selectedProduct.description || "لا يوجد وصف إضافي."}
                     </p>
                  </div>
                  
                  <div className="shrink-0 mt-3 md:mt-4 pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="block text-[10px] md:text-xs text-neutral-500 mb-0.5 font-medium">سعر المنتج</span>
                      <span className="text-emerald-400 font-black text-2xl md:text-4xl tabular-nums tracking-tighter">{selectedProduct.price}</span>
                    </div>
                    
                    <a 
                      href={`https://wa.me/201019715490?text=أريد طلب: ${selectedProduct.name}`}
                      target="_blank" rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-3 md:py-3.5 rounded-xl transition-all font-bold text-sm md:text-base w-full sm:w-auto shadow-lg"
                    >
                      <MessageCircle className="w-4 h-4 md:w-5 md:h-5" /> اطلب الآن
                    </a>
                  </div>

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
