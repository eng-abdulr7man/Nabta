import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, Sprout, Eye, EyeOff, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // 1. الأولوية الذكية لتعبئة الإيميل
  const [email, setEmail] = useState(() => {
    // الأولوية الأولى: إيميل جاي من صفحة التسجيل
    const registeredEmail = location.state?.registeredEmail;
    if (registeredEmail) return registeredEmail;

    // الأولوية الثانية: إيميل محفوظ من تسجيل دخول سابق
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) return savedEmail;

    // الأولوية الثالثة: خانة فاضية
    return "";
  });

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // حالة "تذكرني" تكون شغالة تلقائياً لو فيه إيميل محفوظ
  const [rememberMe, setRememberMe] = useState(() => {
    return !!localStorage.getItem("rememberedEmail");
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);
    
    if (error) {
      toast({ 
        title: "خطأ في تسجيل الدخول", 
        description: "تأكد من صحة البريد الإلكتروني وكلمة المرور", 
        variant: "destructive" 
      });
    } else {
      // 2. إدارة خاصية "تذكرني"
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      toast({
        title: "أهلاً بك مجدداً! 👋",
        description: "تم تسجيل الدخول بنجاح",
      });
      navigate("/"); // تحويل للصفحة الرئيسية
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-20 relative overflow-hidden font-tajawal">
      
      {/* إضاءات خلفية */}


      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-muted border border-border rounded-3xl p-8 sm:p-10 shadow-2xl backdrop-blur-xl">
          
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-3 mb-6 group">
              <div className="w-12 h-12 rounded-xl bg-muted border border-border flex items-center justify-center group-hover:border-primary/20 group-hover:bg-accent transition-all duration-300">
                <Sprout className="w-6 h-6 text-primary" />
              </div>
              <span className="font-black text-2xl text-foreground tracking-tight">
                نـَـبْـتـَـة
              </span>
            </Link>
            <h1 className="text-2xl font-black text-foreground mb-2">تسجيل الدخول</h1>
            <p className="text-sm text-muted-foreground">مرحباً بك مجدداً في نبتة</p>
          </div>

          <form className="space-y-5" onSubmit={handleLogin}>
            
            {/* حقل البريد الإلكتروني */}
            <div>
              <label className="text-sm font-bold text-foreground mb-2 block">البريد الإلكتروني</label>
              <div className="relative group">
                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
                  className="w-full pr-12 pl-4 py-3.5 rounded-xl bg-muted border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/20 focus:ring-1 focus:ring-primary transition-all"
                  dir="ltr"
                  required
                />
              </div>
            </div>

            {/* حقل كلمة المرور */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-bold text-foreground">كلمة المرور</label>
                <Link to="/forgot-password" className="text-xs text-primary hover:text-primary transition-colors">
                  نسيت كلمة المرور؟
                </Link>
              </div>
              <div className="relative group">
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pr-12 pl-12 py-3.5 rounded-xl bg-muted border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/20 focus:ring-1 focus:ring-primary transition-all"
                  dir="ltr"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 rounded-md transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* الـ Checkbox لـ "تذكرني" */}
            <div className="pt-1 pb-3">
              <label className="flex items-center gap-3 text-sm text-muted-foreground cursor-pointer group w-fit select-none">
                <div className="relative flex items-center justify-center shrink-0">
                  <input 
                    type="checkbox" 
                    className="peer sr-only" 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <div className="w-5 h-5 rounded-md border border-border bg-muted peer-checked:bg-primary peer-checked:border-emerald-500 transition-all duration-300 group-hover:border-primary/20 shadow-inner" />
                  <Check className="absolute w-3.5 h-3.5 text-foreground opacity-0 peer-checked:opacity-100 scale-50 peer-checked:scale-100 transition-all duration-300 pointer-events-none" strokeWidth={3} />
                </div>
                <span className="group-hover:text-foreground transition-colors">
                  تذكر بيانات الدخول
                </span>
              </label>
            </div>

            {/* زر الدخول */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-14 text-base font-bold rounded-xl transition-all  hover:"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  جاري الدخول...
                </div>
              ) : ( "تسجيل الدخول"
              )}
            </Button>
          </form>

          {/* رابط إنشاء حساب */}
          <p className="text-center text-sm text-muted-foreground mt-8">
            ليس لديك حساب بعد؟{" "}
            <Link to="/register" className="text-foreground hover:text-primary font-bold transition-colors">
              إنشاء حساب جديد
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
