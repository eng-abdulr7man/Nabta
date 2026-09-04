// import { Link, useLocation } from "react-router-dom";
// import { Home, BookOpen, GraduationCap, User } from "lucide-react";
// import { useAuth } from "@/contexts/AuthContext";

// const BottomNav = () => {
//   const location = useLocation();
//   const { user } = useAuth();

//   const tabs = [
//     { label: "الرئيسية", path: "/", icon: Home },
//     { label: "الكورسات", path: "/courses", icon: BookOpen },
//     { label: "التخصصات", path: "/specializations", icon: GraduationCap },
//     { label: "حسابي", path: user ? "/profile" : "/login", icon: User },
//   ];

//   return (
//     <div className="fixed bottom-0 right-0 left-0 z-50 md:hidden bg-background/95 backdrop-blur-xl border-t border-border">
//       <div className="flex items-center justify-around h-16">
//         {tabs.map((tab) => {
//           const Icon = tab.icon;
//           const isActive = location.pathname === tab.path;
//           return (
//             <Link
//               key={tab.path}
//               to={tab.path}
//               className={`flex flex-col items-center gap-1 px-3 py-1 transition-colors ${
//                 isActive ? "text-primary" : "text-muted-foreground"
//               }`}
//             >
//               <Icon className="w-5 h-5" />
//               <span className="text-[10px] font-medium">{tab.label}</span>
//             </Link>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default BottomNav;

//v2

import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { Home, BookOpen, GraduationCap, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const BottomNav = () => {
  const location = useLocation();
  const { user } = useAuth();

  const tabs = [
    { label: "الرئيسية", path: "/", icon: Home },
    { label: "الكورسات", path: "/courses", icon: BookOpen },
    { label: "التخصصات", path: "/specializations", icon: GraduationCap },
    { label: "حسابي", path: user ? "/profile" : "/login", icon: User },
  ];

  return (
    // الشريط العائم: مرفوع من تحت 4px، ومش واخد الشاشة من الأول للآخر
    <div className="fixed left-4 right-4 z-[100] md:hidden" style={{ bottom: "calc(1rem + var(--safe-bottom))" }}>
      
      {/* الحاوية الزجاجية (Glassmorphism Container) */}
      <div className="bg-[#121A15]/90 backdrop-blur-xl border border-neutral-800/60 rounded-2xl flex items-center justify-around p-2 shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
        
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = location.pathname === tab.path;

          return (
            <Link
              key={tab.path}
              to={tab.path}
              // outline-none لمنع ظهور المربع الأزرق عند الضغط في بعض المتصفحات
              className="relative flex flex-col items-center justify-center w-full py-2 outline-none -webkit-tap-highlight-color-transparent"
            >
              {/* الفقاعة الخضراء المتحركة (تظهر فقط للتاب النشط) */}
              {isActive && (
                <motion.div
                  layoutId="active-bottom-tab"
                  className="absolute inset-0 bg-emerald-500/10 border border-emerald-500/20 rounded-xl"
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                />
              )}

              {/* محتوى التاب (الأيقونة والنص) */}
              <motion.div
                whileTap={{ scale: 0.85 }} // تأثير الانكماش عند الضغط
                className={`relative z-10 flex flex-col items-center gap-1 transition-colors duration-300 ${
                  isActive ? "text-emerald-400" : "text-neutral-500 hover:text-neutral-400"
                }`}
              >
                {/* إضافة تأثير توهج للأيقونة النشطة */}
                <Icon 
                  className={`w-5 h-5 transition-all duration-300 ${
                    isActive ? "drop-shadow-[0_0_8px_rgba(16,185,129,0.5)] scale-110" : ""
                  }`} 
                />
                <span className={`text-[10px] ${isActive ? "font-bold" : "font-medium"}`}>
                  {tab.label}
                </span>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
