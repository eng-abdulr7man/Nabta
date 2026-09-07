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
    <div
      className="fixed bottom-0 right-0 left-0 z-[100] md:hidden bg-background/95 backdrop-blur-md border-t border-border pb-safe"
    >
      <div className="flex items-center justify-around h-16">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = location.pathname === tab.path;
          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={`flex flex-col items-center justify-center gap-1 w-full h-full tap-feedback ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[11px] font-medium">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
