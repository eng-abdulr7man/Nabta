import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard, BookOpen, Users, MessageSquare, Settings, LogOut, Sprout, 
  ChevronRight, GraduationCap, Menu, X, Activity, FileText, Youtube // ضفنا أيقونة اليوتيوب هنا
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

const sidebarLinks = [
  { label: "لوحة التحكم", path: "/admin", icon: LayoutDashboard },
  { label: "الكورسات", path: "/admin/courses", icon: BookOpen },
  { label: "استيراد يوتيوب", path: "/admin/youtube-import", icon: Youtube }, // <-- الزرار الجديد هنا
  { label: "التخصصات", path: "/admin/specializations", icon: GraduationCap },
  { label: "المستخدمين", path: "/admin/users", icon: Users },
  { label: "الرسائل", path: "/admin/messages", icon: MessageSquare },
  { label: "المقالات", path: "/admin/articles", icon: FileText },
  { label: "سجل النشاطات", path: "/admin/activity", icon: Activity },
];

const AdminLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut, profile } = useAuth();

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const Sidebar = ({ mobile = false }) => (
    <div className={`flex flex-col h-full bg-card border-l border-border ${mobile ? "w-64" : collapsed ? "w-16" : "w-64"} transition-all duration-300 shadow-xl`}>
      <div className="p-4 flex items-center gap-2 border-b border-border">
        <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
          <Sprout className="w-4 h-4 text-emerald-500" />
        </div>
        {(!collapsed || mobile) && (
          <span className="font-tajawal font-bold text-sm text-foreground tracking-tight">نبتة | لوحة المشرف</span>
        )}
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto scrollbar-hide">
        {sidebarLinks.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => mobile && setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-bold transition-all ${
                isActive
                  ? "bg-emerald-500/10 text-emerald-500 shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-emerald-500" : ""}`} />
              {(!collapsed || mobile) && <span>{link.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-border space-y-1">
        <Link to="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-bold text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors" onClick={() => mobile && setMobileOpen(false)}>
          <ChevronRight className="w-4 h-4 shrink-0" />
          {(!collapsed || mobile) && <span>العودة للموقع</span>}
        </Link>
        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-bold text-red-500 hover:bg-red-500/10 transition-colors">
          <LogOut className="w-4 h-4 shrink-0" />
          {(!collapsed || mobile) && <span>تسجيل الخروج</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050806] flex font-tajawal" dir="rtl">
      {/* Desktop sidebar */}
      <div className="hidden md:flex sticky top-0 h-screen">
        <Sidebar />
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <motion.div 
            initial={{ x: 300 }} 
            animate={{ x: 0 }} 
            exit={{ x: 300 }} 
            className="absolute right-0 top-0 h-full shadow-2xl"
          >
            <Sidebar mobile />
          </motion.div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen max-w-full overflow-hidden">
        <header className="h-16 border-b border-border flex items-center justify-between px-6 bg-card/50 backdrop-blur-md sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-foreground p-2 hover:bg-secondary rounded-lg" onClick={() => setMobileOpen(true)}>
              <Menu className="w-6 h-6" />
            </button>
            <button className="hidden md:block text-muted-foreground hover:text-foreground p-2 hover:bg-secondary rounded-lg transition-colors" onClick={() => setCollapsed(!collapsed)}>
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-sm font-black text-muted-foreground hidden sm:block">نظام إدارة المحتوى</h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end hidden xs:flex">
              <span className="text-xs font-black text-white">{profile?.full_name || "المدير العام"}</span>
              <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-tighter">Admin Access</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 font-black">
              {profile?.full_name?.charAt(0) || "A"}
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 bg-[#050806] relative">
          {/* تأثير توهج خلفي بسيط */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/5 blur-[120px] rounded-full" />
          </div>
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
