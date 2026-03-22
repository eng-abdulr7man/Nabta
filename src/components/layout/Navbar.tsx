//v7
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sprout, LogIn, Search, LogOut, LayoutDashboard, BookOpen, Heart, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

// ✅ ضفنا "أدوات زراعية" هنا عشان تظهر في كل مكان (ديسك توب وموبايل)
const navLinks = [
  { label: "الرئيسية", path: "/" },
  { label: "الكورسات", path: "/courses" },
  { label: "التخصصات", path: "/specializations" },
  { label: "أدوات زراعية", path: "/tools" }, // <-- التعديل هنا
  { label: "تواصل معنا", path: "/contact" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, signOut, isAdmin } = useAuth();

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
  }, [isOpen]);

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
    <nav className="fixed top-0 right-0 left-0 z-[100] bg-[#050806] border-b border-neutral-800 font-tajawal h-20 flex items-center shadow-2xl">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-full">
          
          {/* الـ Logo ثابت */}
          <Link to="/" className="flex items-center gap-3 shrink-0 z-[110]">
            <div className="w-10 h-10 rounded-xl bg-[#121A15] border border-neutral-800 flex items-center justify-center shadow-emerald-500/10 shadow-lg group hover:border-emerald-500/50 transition-colors">
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
                
                {/* لوحة التحكم (بتظهر للأدمن بس) */}
                {isAdmin && (
                  <Link to="/admin" className="hidden md:block">
                    <Button variant="ghost" size="sm" className="text-emerald-400 hover:bg-emerald-500/10 gap-1.5 rounded-xl h-10 font-bold border border-emerald-500/20">
                      <LayoutDashboard className="w-4 h-4" />
                      لوحة التحكم
                    </Button>
                  </Link>
                )}

                <Link to="/profile">
                  <div className="w-10 h-10 rounded-full bg-[#121A15] border-2 border-neutral-700 flex items-center justify-center overflow-hidden hover:border-emerald-500 transition-all shadow-lg">
                    {profile?.avatar_url ? <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" /> : <span className="text-emerald-500 font-bold">{getInitial()}</span>}
                  </div>
                </Link>

                <Button variant="ghost" size="icon" onClick={() => signOut()} className="hidden sm:flex text-neutral-400 hover:text-red-500 hover:bg-red-500/10">
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Link to="/login" className="hidden sm:block">
                <Button className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl px-6 font-bold h-10 shadow-lg shadow-emerald-900/20">دخول</Button>
              </Link>
            )}

            {/* زرار المنيو */}
            <button className="lg:hidden p-2 text-white z-[110]" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
            </button>
          </div>
        </div>
      </div>

      {/* سلايدر الموبايل (أسود صريح ومعتم) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className="fixed inset-0 z-[100] bg-[#050806] lg:hidden flex flex-col pt-24 p-6 overflow-y-auto"
          >
            {/* البحث موبايل */}
            <form onSubmit={handleSearch} className="relative mb-8">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />
              <input
                type="text"
                placeholder="ابحث عن كورس..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-14 pr-12 pl-4 rounded-2xl bg-[#0a0f0c] border border-neutral-700 text-white text-lg outline-none focus:border-emerald-500 shadow-xl"
              />
            </form>

            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`p-5 rounded-2xl text-xl font-bold transition-all border ${
                    location.pathname === link.path 
                    ? "bg-emerald-600 text-white border-emerald-500 shadow-lg" 
                    : "bg-[#0a0f0c] text-neutral-200 border-neutral-800"
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              {/* لوحة التحكم في الموبايل */}
              {user && isAdmin && (
                <Link to="/admin" onClick={() => setIsOpen(false)} className="p-5 rounded-2xl text-xl font-bold bg-emerald-900/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-3">
                  <LayoutDashboard className="w-6 h-6" />
                  لوحة التحكم
                </Link>
              )}
            </div>

            <div className="mt-auto pt-10 pb-6 space-y-4">
              {user ? (
                <div className="p-5 rounded-3xl bg-[#0a0f0c] border border-neutral-800 shadow-2xl">
                  <Link to="/profile" onClick={() => setIsOpen(false)} className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-full bg-emerald-500/20 border-2 border-emerald-500/50 flex items-center justify-center overflow-hidden">
                      {profile?.avatar_url ? <img src={profile.avatar_url} className="w-full h-full object-cover" /> : <span className="text-emerald-500 text-xl font-bold">{getInitial()}</span>}
                    </div>
                    <div className="min-w-0 text-right">
                      <p className="font-bold text-white text-lg truncate">{profile?.full_name || "مستخدم نبتة"}</p>
                      <p className="text-sm text-neutral-500 truncate max-w-[180px]">{user.email}</p>
                    </div>
                  </Link>
                  <Button onClick={() => { signOut(); setIsOpen(false); }} variant="outline" className="w-full h-14 rounded-2xl border-red-500/30 text-red-500 font-bold gap-2 hover:bg-red-500/10">
                    <LogOut className="w-5 h-5" /> تسجيل الخروج
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  <Link to="/login" onClick={() => setIsOpen(false)}><Button variant="outline" className="w-full h-14 rounded-2xl border-neutral-700 hover:bg-neutral-800 text-white text-lg font-bold">دخول</Button></Link>
                  <Link to="/register" onClick={() => setIsOpen(false)}><Button className="w-full h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-lg font-bold">حساب جديد</Button></Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
