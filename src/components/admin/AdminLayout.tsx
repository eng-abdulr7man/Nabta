import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, BookOpen, Users, MessageSquare, Settings, LogOut, Sprout, 
  ChevronRight, GraduationCap, Menu, X, Activity, FileText, Youtube, 
  ChevronLeft, Sparkles, ShieldCheck, Library // 🌟 استدعاء أيقونة المكتبة
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

const sidebarLinks = [
  { group: "الرئيسية", items: [
    { label: "لوحة التحكم", path: "/admin", icon: LayoutDashboard },
    { label: "سجل النشاطات", path: "/admin/activity", icon: Activity },
  ]},
  { group: "المحتوى التعليمي", items: [
    { label: "الكورسات", path: "/admin/courses", icon: BookOpen },
    { label: "استيراد يوتيوب", path: "/admin/youtube-import", icon: Youtube },
    { label: "التخصصات", path: "/admin/specializations", icon: GraduationCap },
    // 🌟 إضافة رابط المكتبة هنا 🌟
    { label: "المكتبة الأكاديمية", path: "/admin/library", icon: Library },
  ]},
  { group: "الإدارة والتواصل", items: [
    { label: "المستخدمين", path: "/admin/users", icon: Users },
    { label: "المقالات", path: "/admin/articles", icon: FileText },
    { label: "الرسائل", path: "/admin/messages", icon: MessageSquare },
  ]}
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
    <div className={`flex flex-col h-full bg-[#0a0f0c]/80 backdrop-blur-xl border-l border-white/5 ${mobile ? "w-72" : collapsed ? "w-20" : "w-64"} transition-all duration-500 ease-in-out z-50`}>
      {/* Logo Section */}
      <div className="p-6 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0">
            <Sprout className="w-6 h-6 text-white" />
          </div>
          {(!collapsed || mobile) && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col">
              <span className="font-tajawal font-black text-white text-base leading-none">نبتة</span>
              <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest mt-1">Admin Panel</span>
            </motion.div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-8 overflow-y-auto custom-scrollbar">
        {sidebarLinks.map((group, gIdx) => (
          <div key={gIdx} className="space-y-2">
            {(!collapsed || mobile) && (
              <h3 className="text-[10px] font-black text-neutral-600 uppercase tracking-[0.2em] px-4 mb-4">
                {group.group}
              </h3>
            )}
            <div className="space-y-1">
              {group.items.map((link, lIdx) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => mobile && setMobileOpen(false)}
                    className={`group relative flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 ${
                      isActive 
                        ? "text-emerald-400" 
                        : "text-neutral-500 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {isActive && (
                      <motion.div 
                        layoutId="activeTab"
                        className="absolute inset-0 bg-emerald-500/10 rounded-2xl border border-emerald-500/20"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <Icon className={`w-5 h-5 shrink-0 transition-transform group-hover:scale-110 ${isActive ? "text-emerald-500" : ""}`} />
                    {(!collapsed || mobile) && (
                      <span className="text-sm font-bold relative z-10">{link.label}</span>
                    )}
                    {isActive && !collapsed && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-auto" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-white/5 space-y-2">
        <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-neutral-500 hover:text-white hover:bg-white/5 transition-all">
          <ChevronRight className="w-5 h-5" />
          {(!collapsed || mobile) && <span>الخروج من الإدارة</span>}
        </Link>
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-rose-500 hover:bg-rose-500/10 transition-all"
        >
          <LogOut className="w-5 h-5" />
          {(!collapsed || mobile) && <span>تسجيل الخروج</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050806] flex font-tajawal text-white selection:bg-emerald-500/30" dir="rtl">
      {/* Desktop sidebar */}
      <div className="hidden md:flex sticky top-0 h-screen z-50">
        <Sidebar />
      </div>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-[100] md:hidden">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-md" 
              onClick={() => setMobileOpen(false)} 
            />
            <motion.div 
              initial={{ x: 300 }} animate={{ x: 0 }} exit={{ x: 300 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 h-full shadow-2xl"
            >
              <Sidebar mobile />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen max-w-full overflow-hidden">
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-[#0a0f0c]/50 backdrop-blur-xl sticky top-0 z-40">
          <div className="flex items-center gap-6">
            <button className="md:hidden p-2.5 bg-white/5 rounded-xl hover:bg-white/10 transition-colors" onClick={() => setMobileOpen(true)}>
              <Menu className="w-6 h-6 text-emerald-500" />
            </button>
            <button className="hidden md:flex p-2 bg-white/5 rounded-xl text-neutral-400 hover:text-white hover:bg-white/10 transition-all" onClick={() => setCollapsed(!collapsed)}>
              {collapsed ? <ChevronLeft className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="hidden sm:flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <h2 className="text-[11px] font-black text-neutral-500 uppercase tracking-[0.2em]">النظام الإداري المركزي</h2>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end hidden xs:flex">
              <span className="text-sm font-black text-white">{profile?.full_name || "المدير العام"}</span>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-tighter">صلاحية كاملة</span>
              </div>
            </div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#121A15] to-[#1a251e] border border-white/10 flex items-center justify-center text-emerald-500 font-black shadow-lg shadow-black/40 text-lg"
            >
              {profile?.full_name?.charAt(0) || "A"}
            </motion.div>
          </div>
        </header>

        <main className="flex-1 p-6 md:p-10 relative overflow-y-auto custom-scrollbar">
          {/* تأثيرات إضاءة خلفية احترافية */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-500/5 blur-[150px] rounded-full" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-blue-500/5 blur-[130px] rounded-full" />
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
