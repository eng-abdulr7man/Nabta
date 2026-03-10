// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";
// import { Lock, Sprout, Eye, EyeOff } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { supabase } from "@/integrations/supabase/client";
// import { useToast } from "@/hooks/use-toast";

// const ResetPasswordPage = () => {
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();
//   const { toast } = useToast();

//   const handleUpdate = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     const { error } = await supabase.auth.updateUser({ password });
//     setLoading(false);
//     if (error) {
//       toast({ title: "خطأ", description: error.message, variant: "destructive" });
//     } else {
//       toast({ title: "تم تغيير كلمة المرور بنجاح" });
//       navigate("/");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-background px-4">
//       <motion.div
//         initial={{ opacity: 0, scale: 0.95 }}
//         animate={{ opacity: 1, scale: 1 }}
//         className="w-full max-w-md"
//       >
//         <div className="glass-card p-8 space-y-6">
//           <div className="text-center">
//             <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center mx-auto mb-4">
//               <Sprout className="w-6 h-6 text-primary" />
//             </div>
//             <h1 className="text-2xl font-black text-foreground">كلمة مرور جديدة</h1>
//             <p className="text-sm text-muted-foreground mt-1">أدخل كلمة المرور الجديدة</p>
//           </div>

//           <form className="space-y-4" onSubmit={handleUpdate}>
//             <div>
//               <label className="text-sm font-medium text-foreground mb-1.5 block">كلمة المرور الجديدة</label>
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
//                   minLength={6}
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
//             <Button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground hover:bg-primary/90" size="lg">
//               {loading ? "جاري التحديث..." : "تحديث كلمة المرور"}
//             </Button>
//           </form>
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// export default ResetPasswordPage;

//v2

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, Sprout, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const ResetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    
    if (error) {
      toast({ title: "خطأ", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "تم تغيير كلمة المرور بنجاح" });
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
            <div className="w-12 h-12 rounded-xl bg-[#121A15] border border-neutral-800 flex items-center justify-center mx-auto mb-6 hover:border-emerald-500/30 hover:bg-emerald-950/20 transition-all duration-300">
              <Sprout className="w-6 h-6 text-emerald-500" />
            </div>
            <h1 className="text-2xl font-black text-white mb-2">كلمة مرور جديدة</h1>
            <p className="text-sm text-neutral-400">قم بتعيين كلمة مرور جديدة وقوية لحسابك</p>
          </div>

          <form className="space-y-6" onSubmit={handleUpdate}>
            
            {/* حقل كلمة المرور الجديدة */}
            <div>
              <label className="text-sm font-bold text-neutral-300 mb-2 block">كلمة المرور الجديدة</label>
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
                  minLength={6}
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

            {/* زر التحديث */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white h-14 text-base font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] mt-4"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  جاري التحديث...
                </div>
              ) : (
                "تحديث كلمة المرور"
              )}
            </Button>
          </form>

        </div>
      </motion.div>
    </div>
  );
};

export default ResetPasswordPage;
