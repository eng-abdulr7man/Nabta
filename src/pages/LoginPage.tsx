// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";
// import { Mail, Lock, Sprout, Eye, EyeOff } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { supabase } from "@/integrations/supabase/client";
// import { useToast } from "@/hooks/use-toast";

// const LoginPage = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();
//   const { toast } = useToast();

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     const { error } = await supabase.auth.signInWithPassword({ email, password });
//     setLoading(false);
//     if (error) {
//       toast({ title: "خطأ في تسجيل الدخول", description: error.message, variant: "destructive" });
//     } else {
//       toast({ title: "تم تسجيل الدخول بنجاح" });
//       navigate("/");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-background px-4">
//       <motion.div
//         initial={{ opacity: 0, scale: 0.95 }}
//         animate={{ opacity: 1, scale: 1 }}
//         transition={{ duration: 0.4 }}
//         className="w-full max-w-md"
//       >
//         <div className="glass-card p-8 space-y-6">
//           <div className="text-center">
//             <Link to="/" className="inline-flex items-center gap-2 mb-4">
//               <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
//                 <Sprout className="w-6 h-6 text-primary" />
//               </div>
//               <span className="font-tajawal font-bold text-xl">
//                 نـَـبْـتـَـة
//               </span>
//             </Link>
//             <h1 className="text-2xl font-black text-foreground">تسجيل الدخول</h1>
//             <p className="text-sm text-muted-foreground mt-1">أهلاً بك مجدداً في المنصة</p>
//           </div>

//           <form className="space-y-4" onSubmit={handleLogin}>
//             <div>
//               <label className="text-sm font-medium text-foreground mb-1.5 block">البريد الإلكتروني</label>
//               <div className="relative">
//                 <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
//                 <input
//                   type="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   placeholder="example@email.com"
//                   className="w-full pr-10 pl-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
//                   dir="ltr"
//                   required
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="text-sm font-medium text-foreground mb-1.5 block">كلمة المرور</label>
//               <div className="relative">
//                 <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   placeholder="••••••••"
//                   className="w-full pr-10 pl-10 py-2.5 rounded-lg bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
//                   dir="ltr"
//                   required
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
//                 >
//                   {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
//                 </button>
//               </div>
//             </div>

//             <div className="flex items-center justify-between text-sm">
//               <label className="flex items-center gap-2 text-muted-foreground cursor-pointer">
//                 <input type="checkbox" className="rounded border-border" />
//                 تذكرني
//               </label>
//               <Link to="/forgot-password" className="text-primary hover:underline">
//                 نسيت كلمة المرور؟
//               </Link>
//             </div>

//             <Button
//               type="submit"
//               disabled={loading}
//               className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
//               size="lg"
//             >
//               {loading ? "جاري التسجيل..." : "تسجيل الدخول"}
//             </Button>
//           </form>

//           <p className="text-center text-sm text-muted-foreground">
//             ليس لديك حساب؟{" "}
//             <Link to="/register" className="text-primary hover:underline font-medium">
//               إنشاء حساب جديد
//             </Link>
//           </p>
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// export default LoginPage;

//v2

// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";
// import { Mail, Lock, Sprout, Eye, EyeOff, Check } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { supabase } from "@/integrations/supabase/client";
// import { useToast } from "@/hooks/use-toast";

// const LoginPage = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();
//   const { toast } = useToast();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     const { error } = await supabase.auth.signInWithPassword({ email, password });
//     setLoading(false);
//     if (error) {
//       toast({ title: "خطأ في تسجيل الدخول", description: error.message, variant: "destructive" });
//     } else {
//       toast({ title: "تم تسجيل الدخول بنجاح" });
//       navigate("/");
//     }
//   };

//   return (
//     // الخلفية الداكنة مع إضاءات خفيفة
//     <div className="min-h-screen flex items-center justify-center bg-[#050806] px-4 py-20 relative overflow-hidden font-tajawal">
      
//       {/* إضاءات خلفية (Ambient Glow) */}
//       <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-emerald-900/10 blur-[120px] pointer-events-none" />
//       <div className="absolute bottom-[-10%] right-[-10%] w-[30vw] h-[30vw] rounded-full bg-emerald-900/10 blur-[100px] pointer-events-none" />

//       <motion.div
//         initial={{ opacity: 0, scale: 0.95, y: 20 }}
//         animate={{ opacity: 1, scale: 1, y: 0 }}
//         transition={{ duration: 0.5, ease: "easeOut" }}
//         className="w-full max-w-md relative z-10"
//       >
//         {/* الكارت الزجاجي الداكن */}
//         <div className="bg-[#0a0f0c] border border-neutral-800/60 rounded-3xl p-8 sm:p-10 shadow-2xl backdrop-blur-xl">
          
//           <div className="text-center mb-8">
//             <Link to="/" className="inline-flex items-center gap-3 mb-6 group">
//               <div className="w-12 h-12 rounded-xl bg-[#121A15] border border-neutral-800 flex items-center justify-center group-hover:border-emerald-500/30 group-hover:bg-emerald-950/20 transition-all duration-300">
//                 <Sprout className="w-6 h-6 text-emerald-500" />
//               </div>
//               <span className="font-black text-2xl text-white tracking-tight">
//                 نـَـبْـتـَـة
//               </span>
//             </Link>
//             <h1 className="text-2xl font-black text-white mb-2">تسجيل الدخول</h1>
//             <p className="text-sm text-neutral-400">أهلاً بك مجدداً في المنصة</p>
//           </div>

//           <form className="space-y-5" onSubmit={handleLogin}>
            
//             {/* حقل البريد الإلكتروني */}
//             <div>
//               <label className="text-sm font-bold text-neutral-300 mb-2 block">البريد الإلكتروني</label>
//               <div className="relative group">
//                 <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500 group-focus-within:text-emerald-500 transition-colors" />
//                 <input
//                   type="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   placeholder="example@email.com"
//                   className="w-full pr-12 pl-4 py-3.5 rounded-xl bg-[#121A15] border border-neutral-800 text-white text-sm placeholder:text-neutral-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all"
//                   dir="ltr"
//                   required
//                 />
//               </div>
//             </div>

//             {/* حقل كلمة المرور */}
//             <div>
//               <label className="text-sm font-bold text-neutral-300 mb-2 block">كلمة المرور</label>
//               <div className="relative group">
//                 <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500 group-focus-within:text-emerald-500 transition-colors" />
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   placeholder="••••••••"
//                   className="w-full pr-12 pl-12 py-3.5 rounded-xl bg-[#121A15] border border-neutral-800 text-white text-sm placeholder:text-neutral-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all"
//                   dir="ltr"
//                   required
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white p-1 rounded-md transition-colors"
//                 >
//                   {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
//                 </button>
//               </div>
//             </div>

//             {/* الـ Checkbox ورابط نسيت كلمة المرور */}
//             <div className="flex items-center justify-between text-sm pt-2 pb-4">
//               <label className="flex items-center gap-3 text-sm text-neutral-400 cursor-pointer group select-none">
//                 <div className="relative flex items-center justify-center">
//                   <input type="checkbox" className="peer sr-only" />
//                   <div className="w-5 h-5 rounded-md border border-neutral-700 bg-[#121A15] peer-checked:bg-emerald-500 peer-checked:border-emerald-500 transition-all duration-300 group-hover:border-emerald-500/50 shadow-inner" />
//                   <Check className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 scale-50 peer-checked:scale-100 transition-all duration-300 pointer-events-none" strokeWidth={3} />
//                 </div>
//                 <span className="group-hover:text-neutral-300 transition-colors">تذكرني</span>
//               </label>

//               <Link to="/forgot-password" className="text-emerald-500 hover:text-emerald-400 hover:underline transition-colors font-medium">
//                 نسيت كلمة المرور؟
//               </Link>
//             </div>

//             {/* زر تسجيل الدخول */}
//             <Button
//               type="submit"
//               disabled={loading}
//               className="w-full bg-emerald-600 hover:bg-emerald-500 text-white h-14 text-base font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)]"
//             >
//               {loading ? (
//                 <div className="flex items-center gap-2">
//                   <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
//                   جاري التسجيل...
//                 </div>
//               ) : (
//                 "تسجيل الدخول"
//               )}
//             </Button>
//           </form>

//           {/* رابط إنشاء حساب */}
//           <p className="text-center text-sm text-neutral-400 mt-8">
//             ليس لديك حساب؟{" "}
//             <Link to="/register" className="text-white hover:text-emerald-400 font-bold transition-colors">
//               إنشاء حساب جديد
//             </Link>
//           </p>
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// export default LoginPage;

//v3
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, Sprout, Eye, EyeOff, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { logActivity } from "@/utils/logger";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  // جلب البريد الإلكتروني المحفوظ عند تحميل الصفحة
  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    
    if (error) {
      toast({ title: "خطأ في تسجيل الدخول", description: error.message, variant: "destructive" });
      
      // (اختياري) ممكن نسجل محاولة الدخول الفاشلة عشان المراقبة الأمنية
      logActivity("محاولة دخول فاشلة", { email: email, reason: error.message });
      
    } else {
      // حفظ أو حذف البريد الإلكتروني بناءً على اختيار "تذكرني"
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }
      
      // 🚀 السطر السحري: تسجيل النشاط بعد نجاح الدخول
      logActivity("تسجيل دخول", { method: "Email/Password", email: email });
      
      toast({ title: "تم تسجيل الدخول بنجاح" });
      navigate("/");
    }
  };
  return (
    // الخلفية الداكنة مع إضاءات خفيفة
    <div className="min-h-screen flex items-center justify-center bg-[#050806] px-4 py-20 relative overflow-hidden font-tajawal">
      
      {/* إضاءات خلفية (Ambient Glow) */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-emerald-900/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[30vw] h-[30vw] rounded-full bg-emerald-900/10 blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        {/* الكارت الزجاجي الداكن */}
        <div className="bg-[#0a0f0c] border border-neutral-800/60 rounded-3xl p-8 sm:p-10 shadow-2xl backdrop-blur-xl">
          
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-3 mb-6 group">
              <div className="w-12 h-12 rounded-xl bg-[#121A15] border border-neutral-800 flex items-center justify-center group-hover:border-emerald-500/30 group-hover:bg-emerald-950/20 transition-all duration-300">
                <Sprout className="w-6 h-6 text-emerald-500" />
              </div>
              <span className="font-black text-2xl text-white tracking-tight">
                نـَـبْـتـَـة
              </span>
            </Link>
            <h1 className="text-2xl font-black text-white mb-2">تسجيل الدخول</h1>
            <p className="text-sm text-neutral-400">أهلاً بك مجدداً في المنصة</p>
          </div>

          <form className="space-y-5" onSubmit={handleLogin}>
            
            {/* حقل البريد الإلكتروني */}
            <div>
              <label className="text-sm font-bold text-neutral-300 mb-2 block">البريد الإلكتروني</label>
              <div className="relative group">
                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500 group-focus-within:text-emerald-500 transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
                  className="w-full pr-12 pl-4 py-3.5 rounded-xl bg-[#121A15] border border-neutral-800 text-white text-sm placeholder:text-neutral-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all"
                  dir="ltr"
                  required
                />
              </div>
            </div>

            {/* حقل كلمة المرور */}
            <div>
              <label className="text-sm font-bold text-neutral-300 mb-2 block">كلمة المرور</label>
              <div className="relative group">
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500 group-focus-within:text-emerald-500 transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pr-12 pl-12 py-3.5 rounded-xl bg-[#121A15] border border-neutral-800 text-white text-sm placeholder:text-neutral-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all"
                  dir="ltr"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white p-1 rounded-md transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* الـ Checkbox ورابط نسيت كلمة المرور */}
            <div className="flex items-center justify-between text-sm pt-2 pb-4">
              <label className="flex items-center gap-3 text-sm text-neutral-400 cursor-pointer group select-none">
                <div className="relative flex items-center justify-center">
                  <input 
                    type="checkbox" 
                    className="peer sr-only" 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <div className="w-5 h-5 rounded-md border border-neutral-700 bg-[#121A15] peer-checked:bg-emerald-500 peer-checked:border-emerald-500 transition-all duration-300 group-hover:border-emerald-500/50 shadow-inner" />
                  <Check className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 scale-50 peer-checked:scale-100 transition-all duration-300 pointer-events-none" strokeWidth={3} />
                </div>
                <span className="group-hover:text-neutral-300 transition-colors">تذكرني</span>
              </label>

              <Link to="/forgot-password" className="text-emerald-500 hover:text-emerald-400 hover:underline transition-colors font-medium">
                نسيت كلمة المرور؟
              </Link>
            </div>

            {/* زر تسجيل الدخول */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white h-14 text-base font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)]"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  جاري التسجيل...
                </div>
              ) : (
                "تسجيل الدخول"
              )}
            </Button>
          </form>

          {/* رابط إنشاء حساب */}
          <p className="text-center text-sm text-neutral-400 mt-8">
            ليس لديك حساب؟{" "}
            <Link to="/register" className="text-white hover:text-emerald-400 font-bold transition-colors">
              إنشاء حساب جديد
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
