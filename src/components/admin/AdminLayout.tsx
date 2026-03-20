import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard, BookOpen, Users, MessageSquare, Settings, LogOut, Sprout, ChevronRight, GraduationCap, Menu, X, Activity, FileText
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

const sidebarLinks = [
  { label: "لوحة التحكم", path: "/admin", icon: LayoutDashboard },
  { label: "الكورسات", path: "/admin/courses", icon: BookOpen },
  { label: "التخصصات", path: "/admin/specializations", icon: GraduationCap },
  { label: "المستخدمين", path: "/admin/users", icon: Users },
  { label: "الرسائل", path: "/admin/messages", icon: MessageSquare },
  { label: "المقالات", path: "/admin/articles", icon: FileText }, // <-- تم إضافة المقالات هنا
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
    <div className={`flex flex-col h-full bg-card border-l border-border ${mobile ? "w-64" : collapsed ? "w-16" : "w-64"} transition-all duration-300`}>
      <div className="p-4 flex items-center gap-2 border-b border-border">
        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
          <Sprout className="w-4 h-4 text-primary" />
        </div>
        {(!collapsed || mobile) && (
          <span className="font-tajawal font-bold text-sm text-foreground">لوحة التحكم</span>
        )}
      </div>

      <nav className="flex-1 p-2 space-y-1">
        {sidebarLinks.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => mobile && setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {(!collapsed || mobile) && <span>{link.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-2 border-t border-border space-y-1">
        <Link to="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary" onClick={() => mobile && setMobileOpen(false)}>
          <ChevronRight className="w-4 h-4 shrink-0" />
          {(!collapsed || mobile) && <span>العودة للموقع</span>}
        </Link>
        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-destructive hover:bg-destructive/10">
          <LogOut className="w-4 h-4 shrink-0" />
          {(!collapsed || mobile) && <span>تسجيل الخروج</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex" dir="rtl">
      {/* Desktop sidebar */}
      <div className="hidden md:flex">
        <Sidebar />
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <motion.div initial={{ x: 300 }} animate={{ x: 0 }} exit={{ x: 300 }} className="absolute right-0 top-0 h-full">
            <Sidebar mobile />
          </motion.div>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="h-14 border-b border-border flex items-center justify-between px-4 bg-card">
          <button className="md:hidden text-foreground" onClick={() => setMobileOpen(true)}>
            <Menu className="w-5 h-5" />
          </button>
          <button className="hidden md:block text-muted-foreground hover:text-foreground" onClick={() => setCollapsed(!collapsed)}>
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{profile?.full_name || "المشرف"}</span>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
