import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, Trash2, ShoppingBag, MessageCircle, 
  Loader2, Camera, Filter, X, Leaf, Sprout, Droplets, Bug, LayoutGrid, Search, Eye, Settings, Edit2, Check, CheckCircle2
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import Navbar from "@/components/layout/Navbar";

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
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [dbCategories, setDbCategories] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [isManageCategoriesOpen, setIsManageCategoriesOpen] = useState(false);

  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editCategoryName, setEditCategoryName] = useState("");

  useEffect(() => {
    if (isModalOpen || selectedProduct || isManageCategoriesOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isModalOpen, selectedProduct, isManageCategoriesOpen]);

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
      if (data.length > 0 && !editingProductId) setNewCategory(data[0].name);
    }
  };

  useEffect(() => { 
    fetchProducts(); 
    fetchCategories();
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
      toast.success("الصورة جاهزة 📸");
    }
    setUploading(false);
  };

  const openAddModal = () => {
    setEditingProductId(null);
    setNewName("");
    setNewPrice("");
    setNewDescription("");
    setImageUrl("");
    if (dbCategories.length > 1) setNewCategory(dbCategories[1].id);
    setIsModalOpen(true);
  };

  const openEditModal = (product: any) => {
    setEditingProductId(product.id);
    setNewName(product.name);
    setNewPrice(product.price);
    setNewCategory(product.category);
    setNewDescription(product.description || "");
    setImageUrl(product.image_url || "");
    setIsModalOpen(true);
  };

  const handleSaveProduct = async () => {
    if (!newName || !newPrice) return toast.error("يا هندسة كمل البيانات ناقصة!");
    
    if (editingProductId) {
      const { error } = await supabase.from("products").update({ 
        name: newName, price: newPrice, category: newCategory, description: newDescription, image_url: imageUrl 
      }).eq("id", editingProductId);
      
      if (error) toast.error("حدث خطأ أثناء التعديل");
      else {
        toast.success("تم التعديل بنجاح");
        setIsModalOpen(false); 
        fetchProducts();
      }
    } else {
      const { error } = await supabase.from("products").insert([
        { name: newName, price: newPrice, category: newCategory, description: newDescription, image_url: imageUrl }
      ]);
      
      if (error) toast.error("حدث خطأ أثناء الإضافة");
      else {
        toast.success("تم النشر بنجاح");
        setIsModalOpen(false); 
        fetchProducts();
      }
    }
  };

  const deleteProduct = async (id: string) => {
    if (!window.confirm("متأكد إنك عايز تمسح المنتج ده؟")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (!error) { toast.success("تم مسح المنتج"); fetchProducts(); }
  };

  const addCategory = async () => {
    if(!newCategoryName.trim()) return toast.error("أدخل اسم القسم أولاً!");
    const { error } = await supabase.from("categories").insert([{ name: newCategoryName.trim() }]);
    if (error) toast.error("حدث خطأ، ممكن يكون القسم موجود بالفعل!");
    else {
      toast.success("تم إضافة القسم بنجاح");
      setNewCategoryName(""); 
      fetchCategories();
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
      toast.success("تم تعديل القسم بنجاح");
      setEditingCategoryId(null); 
      fetchCategories(); 
      fetchProducts(); 
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-background text-foreground font-tajawal pt-24 md:pt-28 pb-16" dir="rtl">
        <div className="container mx-auto px-4 max-w-7xl">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-border pb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold mb-1 tracking-tight">
                سوق <span className="text-primary">نبتة</span>
              </h1>
              <p className="text-muted-foreground text-sm md:text-base">مستلزمات الإنتاج الزراعي والخدمات الميدانية.</p>
            </div>
            
            {isAdmin && (
              <button 
                onClick={openAddModal}
                className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-2.5 rounded-xl font-medium text-sm transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4" /> إضافة صنف جديد
              </button>
            )}
          </div>

          {/* Search Bar */}
          <div className="mb-6 max-w-lg relative">
            <div className="absolute inset-y-0 right-3.5 flex items-center pointer-events-none text-muted-foreground">
              <Search className="w-4 h-4" />
            </div>
            <input 
              type="text"
              placeholder="ابحث عن صنف، مبيد، أو مستلزم..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-card text-foreground pr-10 pl-4 py-3 rounded-xl border border-border focus:border-primary outline-none transition-colors text-sm"
            />
          </div>

          {/* Categories Filter */}
          <div className="flex items-center gap-2 mb-8 pb-2 overflow-x-auto no-scrollbar">
            <div className="flex-shrink-0 flex items-center gap-1.5 bg-card px-3 py-2 rounded-xl border border-border text-muted-foreground text-xs font-medium">
              <Filter className="w-3.5 h-3.5 text-primary" />
              <span>التصنيف:</span>
            </div>
            
            {dbCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-colors border text-xs md:text-sm ${
                  activeCategory === cat.id 
                    ? "bg-primary border-primary text-primary-foreground shadow-sm" 
                    : "bg-card border-border text-muted-foreground hover:text-foreground hover:border-border/80"
                }`}
              >
                <cat.icon className="w-4 h-4" />
                {cat.label}
              </button>
            ))}

            {isAdmin && (
              <button
                onClick={() => setIsManageCategoriesOpen(true)}
                className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl font-medium border border-dashed border-primary/40 text-primary bg-card hover:bg-primary/5 transition-colors mr-auto text-xs"
              >
                <Settings className="w-3.5 h-3.5" /> إدارة الأقسام
              </button>
            )}
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="text-center py-24 text-muted-foreground flex flex-col items-center gap-3">
              <Loader2 className="animate-spin w-8 h-8 text-primary" />
              <p className="text-sm">جاري تحميل المنتجات...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-card rounded-2xl border border-border flex flex-col items-center gap-3">
              <ShoppingBag className="w-12 h-12 text-muted-foreground/50" />
              <p className="text-muted-foreground text-base">لا توجد منتجات مطابقة للبحث.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              <AnimatePresence>
                {filteredProducts.map((p, idx) => (
                  <motion.div 
                    key={p.id}
                    layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    transition={{ duration: 0.2, delay: idx * 0.03 }}
                    className="group bg-card rounded-xl border border-border overflow-hidden hover:border-primary/40 transition-all flex flex-col relative shadow-sm"
                  >
                    <div className="h-48 bg-muted relative overflow-hidden cursor-pointer" onClick={() => setSelectedProduct(p)}>
                      {p.image_url ? (
                        <img src={p.image_url} className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-muted"><ShoppingBag size={32} /></div>
                      )}
                      <div className="absolute top-2.5 right-2.5 bg-background/90 px-2.5 py-1 rounded-md text-[11px] font-medium text-foreground border border-border">
                        {p.category}
                      </div>
                    </div>
                    
                    <div className="p-4 flex flex-col flex-1">
                      <h4 className="text-base font-bold text-foreground mb-1 truncate group-hover:text-primary transition-colors">{p.name}</h4>
                      <p className="text-muted-foreground text-xs mb-4 line-clamp-2 leading-relaxed">{p.description}</p>
                      
                      <div className="flex items-center justify-between border-t border-border pt-3 mt-auto">
                        <span className="text-primary font-bold text-base tracking-tight tabular-nums">{p.price}</span>
                        
                        <div className="flex gap-1.5">
                          <button 
                            onClick={() => setSelectedProduct(p)}
                            className="p-2 bg-muted hover:bg-muted/80 text-foreground rounded-lg border border-border transition-colors"
                            title="عرض التفاصيل"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <a 
                            href={`https://wa.me/201019715490?text=أريد طلب: ${p.name}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground px-3 py-2 rounded-lg transition-colors text-xs font-medium"
                          >
                            <MessageCircle className="w-3.5 h-3.5" /> اطلب
                          </a>
                        </div>
                      </div>
                    </div>
                    
                    {isAdmin && (
                      <div className="absolute top-2.5 left-2.5 flex gap-1.5 opacity-90 md:opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={(e)=>{ e.stopPropagation(); openEditModal(p); }} className="p-1.5 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700">
                          <Edit2 size={13}/>
                        </button>
                        <button onClick={(e)=>{ e.stopPropagation(); deleteProduct(p.id); }} className="p-1.5 bg-red-600 text-white rounded-md shadow-sm hover:bg-red-700">
                          <Trash2 size={13}/>
                        </button>
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* Manage Categories Modal */}
          <AnimatePresence>
            {isManageCategoriesOpen && isAdmin && (
              <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 font-tajawal text-right" dir="rtl">
                <div className="bg-card w-full max-w-md rounded-2xl border border-border p-6 shadow-lg relative max-h-[90vh] flex flex-col">
                  <button onClick={() => setIsManageCategoriesOpen(false)} className="absolute top-4 left-4 text-muted-foreground hover:text-foreground"><X size={18}/></button>
                  <h3 className="text-foreground font-bold mb-4 flex items-center gap-2 text-base">
                    <Settings className="text-primary w-4 h-4" /> إدارة أقسام المنتجات
                  </h3>
                  
                  <div className="flex gap-2 mb-4 border-b border-border pb-4">
                    <input 
                      placeholder="اسم القسم الجديد..." 
                      value={newCategoryName} 
                      onChange={e => setNewCategoryName(e.target.value)} 
                      className="flex-1 bg-background px-3 py-2 rounded-xl border border-border outline-none focus:border-primary text-foreground text-sm" 
                    />
                    <button onClick={addCategory} className="bg-primary px-4 py-2 rounded-xl text-primary-foreground font-medium hover:bg-primary/90 transition-colors text-sm">إضافة</button>
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                    {dbCategories.filter(c => c.id !== 'all').map((cat) => (
                      <div key={cat.dbId} className="flex items-center justify-between bg-muted/40 p-2.5 rounded-xl border border-border">
                        {editingCategoryId === cat.dbId ? (
                          <div className="flex items-center gap-2 w-full">
                            <input 
                              value={editCategoryName} 
                              onChange={e => setEditCategoryName(e.target.value)} 
                              className="flex-1 bg-background px-2.5 py-1 rounded-lg border border-primary outline-none text-foreground text-xs" 
                              autoFocus
                            />
                            <button onClick={() => updateCategory(cat.dbId, cat.label)} className="p-1.5 bg-primary rounded-lg text-primary-foreground"><Check size={13}/></button>
                            <button onClick={() => setEditingCategoryId(null)} className="p-1.5 bg-muted rounded-lg text-muted-foreground"><X size={13}/></button>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center gap-2 text-foreground font-medium text-xs">
                              <cat.icon className="w-3.5 h-3.5 text-primary" /> {cat.label}
                            </div>
                            <div className="flex gap-1">
                              <button onClick={() => { setEditingCategoryId(cat.dbId); setEditCategoryName(cat.label); }} className="p-1.5 text-muted-foreground hover:text-foreground"><Edit2 size={13}/></button>
                              <button onClick={() => deleteCategory(cat.dbId, cat.label)} className="p-1.5 text-red-500 hover:text-red-600"><Trash2 size={13}/></button>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </AnimatePresence>

          {/* Add / Edit Product Modal */}
          <AnimatePresence>
            {isModalOpen && isAdmin && (
              <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 font-tajawal text-right" dir="rtl">
                <div className="bg-card w-full max-w-lg rounded-2xl border border-border p-6 shadow-lg relative max-h-[90vh] overflow-y-auto">
                  <button onClick={() => setIsModalOpen(false)} className="absolute top-4 left-4 text-muted-foreground hover:text-foreground"><X size={18}/></button>
                  
                  <h3 className="text-foreground font-bold mb-5 flex items-center gap-2 text-lg"> 
                    {editingProductId ? <Edit2 className="text-primary w-5 h-5" /> : <Plus className="text-primary w-5 h-5" />} 
                    {editingProductId ? "تعديل المنتج" : "إضافة صنف جديد"}
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="relative h-32 bg-background border border-dashed border-border rounded-xl flex items-center justify-center overflow-hidden">
                      {imageUrl ? <img src={imageUrl} className="w-full h-full object-cover" /> : (
                        <div className="text-center">
                          {uploading ? <Loader2 className="animate-spin mx-auto text-primary" /> : <Camera className="mx-auto text-muted-foreground w-6 h-6 mb-1" />}
                          <span className="text-xs text-muted-foreground block">اختر صورة المنتج</span>
                        </div>
                      )}
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                    </div>

                    <input placeholder="اسم المنتج" value={newName} onChange={e=>setNewName(e.target.value)} className="w-full bg-background p-3 rounded-xl border border-border outline-none focus:border-primary text-foreground text-sm" />
                    <input placeholder="السعر" value={newPrice} onChange={e=>setNewPrice(e.target.value)} className="w-full bg-background p-3 rounded-xl border border-border outline-none focus:border-primary text-foreground text-sm" />
                    
                    <select value={newCategory} onChange={e=>setNewCategory(e.target.value)} className="w-full bg-background p-3 rounded-xl border border-border text-foreground outline-none focus:border-primary text-sm">
                      {dbCategories.filter(c => c.id !== 'all').map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.label}</option>
                      ))}
                    </select>
                    
                    <textarea placeholder="وصف المنتج..." value={newDescription} onChange={e=>setNewDescription(e.target.value)} className="w-full bg-background p-3 rounded-xl border border-border outline-none focus:border-primary h-24 resize-none text-sm" />
                    
                    <button onClick={handleSaveProduct} className="w-full py-3 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-colors text-sm shadow-sm">
                      {editingProductId ? "حفظ التعديلات" : "نشر المنتج"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </AnimatePresence>

          {/* Product Details Modal */}
          <AnimatePresence>
            {selectedProduct && (
              <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 font-tajawal text-right" dir="rtl" onClick={() => setSelectedProduct(null)}>
                <div onClick={(e) => e.stopPropagation()} className="bg-card w-full max-w-3xl rounded-2xl border border-border relative overflow-hidden flex flex-col md:flex-row shadow-xl">
                  <button onClick={() => setSelectedProduct(null)} className="absolute top-3 left-3 z-10 w-8 h-8 bg-background/80 hover:bg-muted rounded-full flex items-center justify-center text-foreground border border-border transition-colors">
                    <X size={16}/>
                  </button>
                  
                  <div className="w-full md:w-1/2 h-64 md:h-auto bg-muted p-6 flex items-center justify-center border-b md:border-b-0 md:border-l border-border">
                    <div className="relative w-full h-full max-h-[300px] rounded-xl overflow-hidden bg-background border border-border p-2">
                      {selectedProduct.image_url ? (
                        <img src={selectedProduct.image_url} className="w-full h-full object-contain" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground"><ShoppingBag size={48} /></div>
                      )}
                    </div>
                  </div>

                  <div className="w-full md:w-1/2 p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-muted text-primary px-2.5 py-0.5 rounded-md text-xs font-medium border border-border">
                          {selectedProduct.category}
                        </span>
                        <span className="flex items-center gap-1 text-muted-foreground text-xs">
                          <CheckCircle2 size={12} className="text-primary" /> متوفر للمستلزمات
                        </span>
                      </div>
                      <h2 className="text-xl md:text-2xl font-bold text-foreground mb-3">{selectedProduct.name}</h2>
                      <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-wrap mb-6">
                        {selectedProduct.description || "لا يوجد وصف إضافي متوفر لهذا الصنف."}
                      </p>
                    </div>
                    
                    <div className="pt-4 border-t border-border flex items-center justify-between gap-4">
                      <div>
                        <span className="block text-[11px] text-muted-foreground">السعر</span>
                        <span className="text-primary font-bold text-xl tracking-tight">{selectedProduct.price}</span>
                      </div>
                      
                      <a 
                        href={`https://wa.me/201019715490?text=أريد طلب: ${selectedProduct.name}`}
                        target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2.5 rounded-xl transition-colors font-medium text-sm shadow-sm"
                      >
                        <MessageCircle className="w-4 h-4" /> اطلب عبر واتساب
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </>
  );
};

export default Marketplace;
