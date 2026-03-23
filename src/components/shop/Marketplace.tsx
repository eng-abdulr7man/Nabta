import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, Trash2, ShoppingBag, MessageCircle, 
  Loader2, Camera, Filter, X, Leaf, Sprout, Droplets, Bug, LayoutGrid, Search, Eye, Settings, Edit2, Check, CheckCircle2
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

// خريطة الأيقونات للأقسام الافتراضية
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
  
  // حالات المنتجات
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  
  // حالات الأقسام والبحث
  const [dbCategories, setDbCategories] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  const [loading, setLoading] = useState(true);
  
  // حالات النوافذ المنبثقة (Modals)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [isManageCategoriesOpen, setIsManageCategoriesOpen] = useState(false);

  // حالات إدارة الأقسام
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editCategoryName, setEditCategoryName] = useState("");

  // حالات فورم إضافة منتج
  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  // 1. جلب المنتجات من الداتابيس
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

  // 2. جلب الأقسام من الداتابيس
  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("created_at", { ascending: true });
      
    if (!error && data) {
      const formattedCats = data.map(cat => ({
        dbId: cat.id,
        id: cat.name,
        label: cat.name,
        icon: categoryIcons[cat.name] || LayoutGrid 
      }));
      setDbCategories([{ id: "all", label: "الكل", icon: LayoutGrid }, ...formattedCats]);
      
      if (data.length > 0) {
        setNewCategory(data[0].name);
      }
    }
  };

  useEffect(() => { 
    fetchProducts(); 
    fetchCategories();
  }, []);

  // 3. نظام الفلترة والبحث المدمج
  useEffect(() => {
    let result = products;

    if (activeCategory !== "all") {
      result = result.filter(p => p.category === activeCategory);
    }

    if (searchQuery.trim() !== "") {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(lowerQuery) || 
        (p.description && p.description.toLowerCase().includes(lowerQuery))
      );
    }

    setFilteredProducts(result);
  }, [activeCategory, searchQuery, products]);

  // رفع الصورة لـ Supabase
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `product-images/${fileName}`;

    const { error: uploadError } = await supabase.storage.from('media').upload(filePath, file);

    if (uploadError) {
      toast.error("فشل رفع الصورة");
    } else {
      const { data } = supabase.storage.from('media').getPublicUrl(filePath);
      setImageUrl(data.publicUrl);
      toast.success("الصورة جاهزة! 📸");
    }
    setUploading(false);
  };

  // إضافة منتج جديد
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
      setIsModalOpen(false);
      fetchProducts();
    }
  };

  // حذف منتج
  const deleteProduct = async (id: string) => {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (!error) { toast.success("تم مسح المنتج"); fetchProducts(); }
  };

  // عمليات إدارة الأقسام
  const addCategory = async () => {
    if(!newCategoryName.trim()) return toast.error("أدخل اسم القسم أولاً!");
    const { error } = await supabase.from("categories").insert([{ name: newCategoryName.trim() }]);
    if (error) {
      toast.error("حدث خطأ، ممكن يكون القسم موجود بالفعل!");
    } else {
      toast.success("تم إضافة القسم بنجاح 📂");
      setNewCategoryName("");
      fetchCategories();
    }
  };

  const deleteCategory = async (id: string, name: string) => {
    if (!window.confirm(`متأكد إنك عايز تمسح قسم "${name}"؟`)) return;
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) {
      toast.error("حدث خطأ أثناء مسح القسم.");
    } else {
      toast.success("تم مسح القسم.");
      if (activeCategory === name) setActiveCategory("all");
      fetchCategories();
    }
  };

  const updateCategory = async (id: string, oldName: string) => {
    if (!editCategoryName.trim()) return toast.error("الاسم الجديد فارغ!");
    const { error: catError } = await supabase.from("categories").update({ name: editCategoryName.trim() }).eq("id", id);
    if (catError) {
      toast.error("حدث خطأ، ممكن الاسم يكون مستخدم.");
    } else {
      await supabase.from("products").update({ category: editCategoryName.trim() }).eq("category", oldName);
      toast.success("تم تعديل القسم وتحديث منتجاته بنجاح ✨");
      setEditingCategoryId(null);
      fetchCategories();
      fetchProducts(); 
    }
  };

  return (
    <div className="min-h-screen bg-[#050806] text-white font-tajawal pt-28 pb-20 relative overflow-hidden" dir="rtl">
      <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')] opacity-5 pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-900/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-7xl">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
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
              <Plus className="w-5 h-5" /> إضافة صنف جديد
            </motion.button>
          )}
        </div>

        {/* 🔍 شريط البحث */}
        <div className="mb-8 max-w-xl relative">
          <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-neutral-500" />
          </div>
          <input 
            type="text"
            placeholder="ابحث عن منتج بالاسم أو الوصف..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0a0f0c] text-white pr-12 pl-4 py-4 rounded-2xl border border-white/10 focus:border-emerald-500 outline-none shadow-inner transition-colors"
          />
        </div>

        {/* 🏷️ شريط الفلترة */}
        <div className="flex flex-wrap items-center gap-3 mb-16 pb-2 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 bg-[#0a0f0c] px-4 py-2 rounded-2xl border border-white/5 shadow-inner">
            <Filter className="w-4 h-4 text-emerald-500" />
            <span className="text-sm text-neutral-500 font-bold ml-1">تصفية حسب:</span>
          </div>
          
          {dbCategories.map((cat) => (
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

          {isAdmin && (
             <button
              onClick={() => setIsManageCategoriesOpen(true)}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl font-bold transition-all whitespace-nowrap border bg-[#121A15]/50 border-emerald-500/20 text-emerald-400 hover:bg-emerald-600 hover:text-white hover:border-emerald-500 border-dashed ml-auto"
             >
               <Settings className="w-4 h-4" />
               إدارة الأقسام
             </button>
          )}
        </div>

        {/* 🛒 شبكة المنتجات */}
        {loading ? (
          <div className="text-center py-40 text-neutral-600 flex flex-col items-center gap-4">
            <Loader2 className="animate-spin w-12 h-12 text-emerald-500" />
            <p className="text-lg">جاري تحميل أحدث المستلزمات...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-32 bg-[#0a0f0c] rounded-[2.5rem] border border-white/5 flex flex-col items-center gap-6 shadow-2xl">
            <ShoppingBag className="w-20 h-20 text-neutral-800" />
            <p className="text-neutral-500 text-xl font-medium">لا توجد منتجات مطابقة לבحثك.</p>
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
                  <div className="h-64 bg-neutral-900 relative overflow-hidden cursor-pointer" onClick={() => setSelectedProduct(p)}>
                    {p.image_url ? (
                      <>
                        <img src={p.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f0c] via-transparent to-transparent opacity-80" />
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-neutral-800 bg-gradient-to-br from-neutral-900 to-black"><ShoppingBag size={64} /></div>
                    )}
                    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-emerald-400 border border-white/10 shadow-lg">
                      {p.category}
                    </div>
                  </div>
                  
                  <div className="p-6 flex flex-col flex-1 relative z-10 -mt-6 bg-[#0a0f0c] rounded-t-3xl">
                    <h4 className="text-xl font-bold text-white mb-2 truncate group-hover:text-emerald-400 transition-colors">{p.name}</h4>
                    <p className="text-neutral-400 text-sm mb-6 line-clamp-2 leading-relaxed">{p.description}</p>
                    
                    <div className="flex items-center justify-between border-t border-white/5 pt-5 mt-auto">
                      <span className="text-emerald-400 font-black text-2xl tracking-tighter tabular-nums">{p.price}</span>
                      
                      <div className="flex gap-2">
                        <button 
                          onClick={() => setSelectedProduct(p)}
                          className="p-3 bg-white/5 hover:bg-emerald-500/20 text-neutral-300 hover:text-emerald-400 rounded-2xl border border-white/5 transition-all"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <a 
                          href={`https://wa.me/201019715490?text=أريد طلب: ${p.name}`}
                          className="flex items-center gap-2 bg-emerald-600/10 hover:bg-emerald-600 text-emerald-500 hover:text-white px-5 py-3 rounded-2xl border border-emerald-500/20 transition-all text-sm font-bold"
                        >
                          <MessageCircle className="w-4 h-4" /> اطلب
                        </a>
                      </div>
                    </div>
                  </div>
                  {isAdmin && (
                    <button onClick={()=>deleteProduct(p.id)} className="absolute top-4 left-4 p-2.5 bg-red-500/90 hover:bg-red-600 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity z-20 shadow-lg shadow-red-500/20">
                      <Trash2 size={16}/>
                    </button>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* ⚙️ Modal إدارة الأقسام */}
        <AnimatePresence>
          {isManageCategoriesOpen && isAdmin && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[160] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 font-tajawal text-right" dir="rtl"
            >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                className="bg-[#0a0f0c] w-full max-w-md rounded-[2.5rem] border border-emerald-500/20 p-8 shadow-2xl relative max-h-[85vh] flex flex-col"
              >
                <button onClick={() => setIsManageCategoriesOpen(false)} className="absolute top-6 left-6 text-neutral-600 hover:text-white"><X /></button>
                <h3 className="text-white font-bold mb-6 flex items-center gap-2 text-2xl"> <Settings className="text-emerald-500" /> إدارة الأقسام</h3>
                
                <div className="flex gap-2 mb-8 border-b border-white/10 pb-6">
                  <input 
                    placeholder="اسم القسم الجديد..." 
                    value={newCategoryName} 
                    onChange={e => setNewCategoryName(e.target.value)} 
                    className="flex-1 bg-black/40 px-4 py-3 rounded-xl border border-white/5 outline-none focus:border-emerald-500 text-white text-sm" 
                  />
                  <button onClick={addCategory} className="bg-emerald-600 px-6 py-3 rounded-xl text-white font-bold hover:bg-emerald-500 transition-all shadow-lg text-sm">إضافة</button>
                </div>

                <div className="flex-1 overflow-y-auto pr-2 space-y-3 no-scrollbar">
                  {dbCategories.filter(c => c.id !== 'all').map((cat) => (
                    <div key={cat.dbId} className="flex items-center justify-between bg-[#121A15]/50 p-4 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                      {editingCategoryId === cat.dbId ? (
                        <div className="flex items-center gap-2 w-full">
                          <input 
                            value={editCategoryName} 
                            onChange={e => setEditCategoryName(e.target.value)} 
                            className="flex-1 bg-black/60 px-3 py-2 rounded-lg border border-emerald-500/50 outline-none text-white text-sm" 
                            autoFocus
                          />
                          <button onClick={() => updateCategory(cat.dbId, cat.label)} className="p-2 bg-emerald-600 rounded-lg text-white hover:bg-emerald-500"><Check size={16}/></button>
                          <button onClick={() => setEditingCategoryId(null)} className="p-2 bg-neutral-800 rounded-lg text-neutral-400 hover:text-white"><X size={16}/></button>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-3 text-white font-medium">
                            <cat.icon className="w-4 h-4 text-emerald-500" />
                            {cat.label}
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => { setEditingCategoryId(cat.dbId); setEditCategoryName(cat.label); }} className="p-2 text-neutral-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors"><Edit2 size={16}/></button>
                            <button onClick={() => deleteCategory(cat.dbId, cat.label)} className="p-2 text-neutral-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 size={16}/></button>
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
              className="fixed inset-0 z-[150] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 font-tajawal text-right" dir="rtl"
            >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                className="bg-[#0a0f0c] w-full max-w-xl rounded-[2.5rem] border border-emerald-500/20 p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto no-scrollbar"
              >
                <button onClick={() => setIsModalOpen(false)} className="absolute top-6 left-6 text-neutral-600 hover:text-white"><X /></button>
                <h3 className="text-white font-bold mb-8 flex items-center gap-2 text-2xl"> <Plus className="text-emerald-500" /> إضافة صنف جديد</h3>
                
                <div className="space-y-4">
                  <div className="relative h-40 bg-black/40 border-2 border-dashed border-white/10 rounded-2xl flex items-center justify-center overflow-hidden hover:border-emerald-500/50 transition-colors">
                    {imageUrl ? <img src={imageUrl} className="w-full h-full object-cover" /> : (
                      <div className="text-center">
                        {uploading ? <Loader2 className="animate-spin mx-auto text-emerald-500" /> : <Camera className="mx-auto text-neutral-600 w-8 h-8 mb-2" />}
                        <span className="text-sm text-neutral-400 block mt-1">اضغط لرفع صورة المنتج</span>
                      </div>
                    )}
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                  </div>

                  <input placeholder="اسم المنتج" value={newName} onChange={e=>setNewName(e.target.value)} className="w-full bg-black/40 p-4 rounded-xl border border-white/5 outline-none focus:border-emerald-500 text-white" />
                  <input placeholder="السعر" value={newPrice} onChange={e=>setNewPrice(e.target.value)} className="w-full bg-black/40 p-4 rounded-xl border border-white/5 outline-none focus:border-emerald-500 text-white" />
                  
                  <select value={newCategory} onChange={e=>setNewCategory(e.target.value)} className="w-full bg-black/40 p-4 rounded-xl border border-white/5 text-neutral-300 outline-none focus:border-emerald-500 appearance-none">
                    {dbCategories.filter(c => c.id !== 'all').map((cat) => (
                      <option key={cat.id} value={cat.id} className="bg-[#0a0f0c]">{cat.label}</option>
                    ))}
                  </select>
                  
                  <textarea placeholder="وصف سريع..." value={newDescription} onChange={e=>setNewDescription(e.target.value)} className="w-full bg-black/40 p-4 rounded-xl border border-white/5 outline-none focus:border-emerald-500 h-24 resize-none" />
                  <button onClick={addProduct} className="w-full bg-emerald-600 py-4 rounded-2xl text-white font-bold hover:bg-emerald-500 transition-all text-lg shadow-lg shadow-emerald-900/20">نشر الآن</button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 👁️ Modal تفاصيل المنتج (التصميم البريميوم الجديد) */}
        <AnimatePresence>
          {selectedProduct && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 font-tajawal text-right" dir="rtl"
              onClick={() => setSelectedProduct(null)}
            >
              <motion.div 
                initial={{ scale: 0.9, y: 30, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.9, y: 30, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-[#0a0f0c] w-full max-w-5xl rounded-[2rem] border border-white/10 shadow-[0_0_50px_rgba(16,185,129,0.1)] relative overflow-hidden flex flex-col md:flex-row"
              >
                {/* زر إغلاق زجاجي */}
                <button 
                  onClick={() => setSelectedProduct(null)} 
                  className="absolute top-4 left-4 z-50 flex items-center justify-center w-10 h-10 bg-black/40 hover:bg-red-500/80 backdrop-blur-md rounded-full text-white transition-all duration-300 border border-white/10"
                >
                  <X size={20}/>
                </button>
                
                {/* قسم الصورة المؤطرة الفخمة */}
                <div className="md:w-1/2 relative h-72 md:h-auto bg-[#050806] p-4 md:p-6 flex items-center justify-center">
                   <div className="w-full h-full relative rounded-[1.5rem] overflow-hidden border border-white/5 group shadow-inner">
                      {selectedProduct.image_url ? (
                        <img src={selectedProduct.image_url} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-neutral-800 bg-neutral-900/50"><ShoppingBag size={80} /></div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                   </div>
                </div>

                {/* قسم التفاصيل */}
                <div className="md:w-1/2 p-6 md:p-10 flex flex-col bg-gradient-to-br from-[#0a0f0c] to-[#0f1712]">
                  
                  {/* الشارات */}
                  <div className="flex flex-wrap items-center gap-3 mb-6">
                      <div className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-xl text-sm font-bold border border-emerald-500/20">
                        <LayoutGrid size={16} /> 
                        {selectedProduct.category}
                      </div>
                      <div className="flex items-center gap-1.5 bg-white/5 text-neutral-300 px-4 py-2 rounded-xl text-sm font-bold border border-white/5">
                        <CheckCircle2 size={16} className="text-emerald-500" />
                        متوفر في المخزن
                      </div>
                  </div>

                  {/* الاسم والوصف */}
                  <h2 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight">{selectedProduct.name}</h2>
                  
                  <div className="prose prose-invert max-w-none mb-8 flex-1">
                     <p className="text-neutral-400 text-lg leading-relaxed whitespace-pre-wrap">
                       {selectedProduct.description || "لا يوجد وصف إضافي لهذا المنتج."}
                     </p>
                  </div>
                  
                  {/* السعر وزر الطلب الساحر */}
                  <div className="mt-auto pt-8 border-t border-white/10 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                    <div>
                      <span className="block text-sm text-neutral-500 mb-2 font-medium">سعر المنتج</span>
                      <div className="flex items-baseline gap-1">
                          <span className="text-emerald-400 font-black text-5xl tabular-nums tracking-tighter">{selectedProduct.price}</span>
                      </div>
                    </div>
                    
                    <a 
                      href={`https://wa.me/201019715490?text=أريد طلب: ${selectedProduct.name}`}
                      target="_blank" rel="noopener noreferrer"
                      className="group relative flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-2xl transition-all font-bold text-lg w-full sm:w-auto overflow-hidden shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)]"
                    >
                      <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                      <MessageCircle className="w-6 h-6 relative z-10" /> 
                      <span className="relative z-10">طلب عبر واتساب</span>
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
