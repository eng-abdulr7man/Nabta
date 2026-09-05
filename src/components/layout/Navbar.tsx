import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sprout, Search, LogOut, LayoutDashboard, PlayCircle, Heart, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const navLinks = [
  { label: "الرئيسية", path: "/" },
  { label: "المتجر الزراعي", path: "/marketplace" },
  { label: "الكورسات", path: "/courses" },
  { label: "التخصصات", path: "/specializations" },
  { label: "المكتبة الأكاديمية", path: "/library" },
  { label: "أدوات نبتة", path: "/tools" },
  { label: "تواصل معنا", path: "/contact" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, signOut, isAdmin } = useAuth();

  // 1. إدارة السكرول بشكل آمن جداً
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = ''; 
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // 2. إجبار الموبايل يفك السكرول ويقفل القائمة مع أي تنقل بين الصفحات
  useEffect(() => {
    setIsOpen(false);
    setIsSearchOpen(false);
    document.body.style.overflow = '';
  }, [location.pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/courses?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      setIsSearchOpen(false);
      setIsOpen(false);
    }
  };

  const getInitial = () => {
    if (profile?.full_name) return profile.full_name.charAt(0);
    if (user?.email) return user.email.charAt(0).toUpperCase();
    return "U";
  };

  return (
    <>
      <nav className="fixed top-0 right-0 left-0 z-[100] bg-[#050806]/90 backdrop-blur-2xl border-b border-emerald-500/10 font-tajawal h-20 pt-safe flex items-center shadow-2xl">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-full">
            
            {/* الـ Logo */}
            <Link to="/" className="flex items-center gap-3 shrink-0 z-[110]">
              <div className="w-10 h-10 rounded-xl bg-[#121A15] border border-emerald-500/20 flex items-center justify-center shadow-emerald-500/10 shadow-lg group hover:border-emerald-500/50 transition-colors">
                <Sprout className="w-5 h-5 text-emerald-500 group-hover:scale-110 transition-transform" />
              </div>
              <span style={{ fontFamily: "Amiri, serif", fontSize: "28px" }} className="text-white font-bold mt-1 hover:text-emerald-400 transition-colors">
                نـَـبْـتـَـة
              </span>
            </Link>

            {/* روابط الـ Desktop */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                    location.pathname === link.path ? "bg-emerald-600/20 text-emerald-400 border border-emerald-500/30" : "text-neutral-300 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* الأكشنز */}
            <div className="flex items-center gap-2 lg:gap-3">
               
               {/* البحث في الكمبيوتر */}
               <div className="hidden sm:flex items-center relative mr-2">
                  <motion.div
                    animate={{ width: isSearchOpen ? 220 : 40 }}
                    className="flex items-center h-10 rounded-xl bg-[#121A15] border border-neutral-800 overflow-hidden"
                  >
                    <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="w-10 h-10 shrink-0 flex items-center justify-center text-neutral-400 hover:text-white transition-colors">
                      <Search className="w-4 h-4" />
                    </button>
                    <form onSubmit={handleSearch} className="flex-1 pr-2">
                      <input
                        type="text"
                        placeholder="ابحث..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-transparent border-none text-white text-xs focus:outline-none placeholder:text-neutral-600"
                      />
                    </form>
                  </motion.div>
               </div>

              {user ? (
                <div className="flex items-center gap-2 lg:gap-3">
                  {isAdmin && (
                    <Link to="/admin" className="hidden md:block">
                      <Button variant="ghost" size="sm" className="text-emerald-400 hover:bg-emerald-500/10 gap-1.5 rounded-xl h-10 font-bold border border-emerald-500/20">
                        <LayoutDashboard className="w-4 h-4" />
                        لوحة التحكم
                      </Button>
                    </Link>
                  )}

                  <Link to="/my-courses" title="كورساتي" className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-[#121A15] border-2 border-neutral-700 group hover:border-emerald-500/50 hover:bg-emerald-500/10 transition-all shadow-lg">
                    <PlayCircle className="w-4 h-4 text-neutral-400 group-hover:text-emerald-500 transition-colors" />
                  </Link>

                  <Link to="/favorites" title="المفضلة" className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-[#121A15] border-2 border-neutral-700 group hover:border-red-500/50 hover:bg-red-500/10 transition-all shadow-lg">
                    <Heart className="w-4 h-4 text-neutral-400 group-hover:text-red-500 transition-colors" />
                  </Link>

                  <Link to="/profile" title="حسابي">
                    <div className="w-10 h-10 rounded-full bg-[#121A15] border-2 border-neutral-700 flex items-center justify-center overflow-hidden hover:border-emerald-500 transition-all shadow-lg">
                      {profile?.avatar_url ? <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" /> : <span className="text-emerald-500 font-bold">{getInitial()}</span>}
                    </div>
                  </Link>

                  <Button variant="ghost" size="icon" onClick={() => signOut()} className="hidden sm:flex text-neutral-400 hover:text-red-500 hover:bg-red-500/10" title="تسجيل الخروج">
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <Link to="/login" className="hidden sm:block">
                  <Button className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl px-6 font-bold h-10 shadow-lg shadow-emerald-900/20">دخول</Button>
                </Link>
              )}

              {/* زرار المنيو للموبايل والتابلت */}
              <button 
                className="lg:hidden w-11 h-11 rounded-xl bg-[#121A15] border border-neutral-800 flex items-center justify-center text-white z-[120] hover:border-emerald-500/50 transition-colors" 
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle Menu"
              >
                {isOpen ? <X className="w-6 h-6 text-emerald-400" /> : <Menu className="w-6 h-6 text-emerald-400" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* سلايدر الموبايل والتابلت المتطور */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* خلفية مظللة مع عزل تفاعلي */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-[110] bg-black/80 backdrop-blur-md lg:hidden"
            />

            {/* محتوى اللوحة الجانبية */}
            <motion.div
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[85%] sm:w-[420px] z-[120] bg-[#070c09] border-l border-emerald-500/20 lg:hidden flex flex-col pt-24 px-6 pb-8 overflow-y-auto shadow-2xl font-tajawal"
            >
              {/* شريط البحث للهواتف */}
              <form onSubmit={handleSearch} className="relative mb-6">
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />
                <input
                  type="text"
                  placeholder="ابحث عن كورس، محصول، أو أداة..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-13 pr-12 pl-4 rounded-2xl bg-[#0f1712] border border-neutral-800 text-white text-sm outline-none focus:border-emerald-500 transition-colors shadow-inner"
                />
              </form>

              {/* الروابط والأقسام الرئيسية */}
              <div className="flex flex-col gap-2 mb-6">
                <div className="text-xs font-bold text-neutral-500 px-2 mb-1">تصفح المنصة</div>
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-4 py-3.5 rounded-2xl text-base font-bold transition-all flex items-center justify-between border ${
                      location.pathname === link.path 
                      ? "bg-gradient-to-r from-emerald-600 to-emerald-500 text-white border-emerald-400 shadow-lg shadow-emerald-900/30" 
                      : "bg-[#0f1712]/60 text-neutral-300 border-neutral-800/80 hover:bg-[#0f1712] hover:text-white"
                    }`}
                  >
                    <span>{link.label}</span>
                    <Sparkles className={`w-4 h-4 ${location.pathname === link.path ? "text-white" : "text-emerald-500/40"}`} />
                  </Link>
                ))}

                {user && isAdmin && (
                  <Link to="/admin" className="px-4 py-3.5 rounded-2xl text-base font-bold bg-emerald-950/40 text-emerald-400 border border-emerald-500/30 flex items-center gap-3 mt-2">
                    <LayoutDashboard className="w-5 h-5" />
                    لوحة تحكم المشرف
                  </Link>
                )}
              </div>

              {/* قسم المستخدم وحسابه */}
              <div className="mt-auto pt-4 border-t border-neutral-800/80 space-y-3">
                {user ? (
                  <div className="p-4 rounded-2xl bg-[#0f1712] border border-neutral-800 shadow-xl flex flex-col gap-4">
                    <Link to="/profile" className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-full bg-emerald-500/20 border-2 border-emerald-500/50 flex items-center justify-center overflow-hidden shrink-0">
                        {profile?.avatar_url ? <img src={profile.avatar_url} className="w-full h-full object-cover" /> : <span className="text-emerald-400 text-lg font-bold">{getInitial()}</span>}
                      </div>
                      <div className="min-w-0 text-right flex-1">
                        <p className="font-bold text-white text-base truncate">{profile?.full_name || "مستخدم نبتة"}</p>
                        <p className="text-xs text-neutral-400 truncate">{user.email}</p>
                      </div>
                    </Link>

                    <div className="grid grid-cols-2 gap-2">
                      <Link to="/my-courses" className="flex items-center justify-center py-3 px-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-xs gap-1.5 hover:bg-emerald-500/20 transition-all">
                        <PlayCircle className="w-4 h-4" /> كورساتي
                      </Link>
                      <Link to="/favorites" className="flex items-center justify-center py-3 px-2 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-xs gap-1.5 hover:bg-white/10 transition-all">
                        <Heart className="w-4 h-4 text-red-500" /> المفضلة
                      </Link>
                    </div>

                    <Button onClick={() => { signOut(); setIsOpen(false); }} variant="outline" className="w-full h-11 rounded-xl border-red-500/30 text-red-400 font-bold gap-2 hover:bg-red-500/10 text-xs">
                      <LogOut className="w-4 h-4" /> تسجيل الخروج
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <Link to="/login" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" className="w-full h-12 rounded-xl border-neutral-700 hover:bg-neutral-800 text-white font-bold">دخول</Button>
                    </Link>
                    <Link to="/register" onClick={() => setIsOpen(false)}>
                      <Button className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-900/30">حساب جديد</Button>
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
