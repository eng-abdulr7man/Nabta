import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X, Sprout, Search, LogOut, LayoutDashboard, PlayCircle, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const navLinks = [
  { label: "الرئيسية", path: "/" },
  { label: "المتجر الزراعي", path: "/marketplace" },
  { label: "الكورسات", path: "/courses" },
  { label: "التخصصات", path: "/specializations" },
  { label: "المكتبة", path: "/library" },
  { label: "أدوات نبتة", path: "/tools" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, signOut, isAdmin } = useAuth();

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/courses?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
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
      <nav className="fixed top-0 right-0 left-0 z-[100] bg-background/95 backdrop-blur-md border-b border-border h-16 pt-safe flex items-center">
        <div className="container mx-auto flex items-center justify-between h-full">
          {/* الشعار */}
          <Link to="/" className="flex items-center gap-2 shrink-0 z-[110]">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <Sprout className="w-5 h-5 text-primary" />
            </div>
            <span className="font-bold text-xl text-foreground">نبْتَة</span>
          </Link>

          {/* روابط سطح المكتب */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === link.path
                    ? "text-primary bg-accent"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {/* البحث - سطح المكتب */}
            <form onSubmit={handleSearch} className="hidden md:flex items-center relative">
              <Search className="absolute right-3 w-4 h-4 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                placeholder="ابحث عن كورس أو أداة..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48 lg:w-60 h-9 rounded-md bg-muted border border-transparent pr-9 pl-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors"
              />
            </form>

            {user ? (
              <div className="flex items-center gap-1">
                {isAdmin && (
                  <Link to="/admin" className="hidden md:block">
                    <Button variant="ghost" size="sm" className="gap-1.5 text-primary">
                      <LayoutDashboard className="w-4 h-4" />
                      لوحة التحكم
                    </Button>
                  </Link>
                )}
                <Link to="/my-courses" title="كورساتي" className="hidden sm:block">
                  <Button variant="ghost" size="icon">
                    <PlayCircle className="w-4 h-4" />
                  </Button>
                </Link>
                <Link to="/favorites" title="المفضلة" className="hidden sm:block">
                  <Button variant="ghost" size="icon">
                    <Heart className="w-4 h-4" />
                  </Button>
                </Link>
                <Link to="/profile" title="حسابي">
                  <div className="w-9 h-9 rounded-full bg-accent border border-border flex items-center justify-center overflow-hidden">
                    {profile?.avatar_url ? (
                      <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-primary font-semibold text-sm">{getInitial()}</span>
                    )}
                  </div>
                </Link>
                <Button variant="ghost" size="icon" onClick={() => signOut()} className="hidden sm:flex" title="تسجيل الخروج">
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Link to="/login" className="hidden sm:block">
                <Button size="sm">دخول</Button>
              </Link>
            )}

            <button
              className="lg:hidden w-9 h-9 rounded-md flex items-center justify-center text-foreground hover:bg-muted z-[120]"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="القائمة"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* قائمة الموبايل */}
      {isOpen && (
        <div className="fixed inset-0 z-[110] lg:hidden">
          <div className="absolute inset-0 bg-foreground/40" onClick={() => setIsOpen(false)} />
          <div className="absolute top-0 right-0 bottom-0 w-[85%] max-w-sm bg-background border-l border-border flex flex-col pt-20 px-5 pb-6 overflow-y-auto">
            <form onSubmit={handleSearch} className="relative mb-5">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="ابحث عن كورس أو أداة..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 rounded-md bg-muted pr-9 pl-3 text-sm outline-none border border-transparent focus:border-primary"
              />
            </form>

            <div className="flex flex-col gap-1 mb-5">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-3 rounded-md text-base font-medium ${
                    location.pathname === link.path ? "text-primary bg-accent" : "text-foreground hover:bg-muted"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {user && isAdmin && (
                <Link to="/admin" className="px-3 py-3 rounded-md text-base font-medium text-primary flex items-center gap-2">
                  <LayoutDashboard className="w-4 h-4" />
                  لوحة تحكم المشرف
                </Link>
              )}
            </div>

            <div className="mt-auto pt-4 border-t border-border">
              {user ? (
                <div className="space-y-3">
                  <Link to="/profile" className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-accent flex items-center justify-center overflow-hidden shrink-0">
                      {profile?.avatar_url ? (
                        <img src={profile.avatar_url} className="w-full h-full object-cover" alt="" />
                      ) : (
                        <span className="text-primary font-semibold">{getInitial()}</span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-foreground truncate">{profile?.full_name || "حسابي"}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                  </Link>
                  <div className="grid grid-cols-2 gap-2">
                    <Link to="/my-courses">
                      <Button variant="outline" className="w-full gap-1.5" size="sm">
                        <PlayCircle className="w-4 h-4" /> كورساتي
                      </Button>
                    </Link>
                    <Link to="/favorites">
                      <Button variant="outline" className="w-full gap-1.5" size="sm">
                        <Heart className="w-4 h-4" /> المفضلة
                      </Button>
                    </Link>
                  </div>
                  <Button onClick={() => signOut()} variant="ghost" className="w-full gap-2 text-destructive">
                    <LogOut className="w-4 h-4" /> تسجيل الخروج
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link to="/login">
                    <Button variant="outline" className="w-full">دخول</Button>
                  </Link>
                  <Link to="/register">
                    <Button className="w-full">حساب جديد</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
