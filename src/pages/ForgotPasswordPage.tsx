
//v2

import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Sprout, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { toast } = useToast();

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    
    if (error) {
      toast({ title: "خطأ", description: error.message, variant: "destructive" });
    } else {
      setSent(true);
    }
  };

  return (
    // الخلفية الداكنة مع إضاءات خفيفة
    <div className="min-h-screen flex items-center justify-center bg-[#050806] px-4 py-20 relative overflow-hidden font-tajawal">
      
      {/* إضاءات خلفية (Ambient Glow) */}
      <div className="absolute top-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-emerald-900/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[30vw] h-[30vw] rounded-full bg-emerald-900/10 blur-[100px] pointer-events-none" />

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
            <h1 className="text-2xl font-black text-white mb-2">استعادة كلمة المرور</h1>
            <p className="text-sm text-neutral-400">
              {sent ? "تم إرسال رابط إعادة التعيين بنجاح" : "أدخل بريدك الإلكتروني لاستعادة حسابك"}
            </p>
          </div>

          {sent ? (
            // ==========================================
            // حالة النجاح (Success State)
            // ==========================================
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-6"
            >
              <div className="w-20 h-20 rounded-2xl bg-[#121A15] border border-emerald-500/30 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(16,185,129,0.1)] relative">
                <div className="absolute inset-0 bg-emerald-500/10 animate-pulse rounded-2xl" />
                <Mail className="w-10 h-10 text-emerald-500 relative z-10" />
              </div>
              
              <div className="bg-[#121A15] border border-neutral-800 rounded-xl p-4">
                <p className="text-sm text-neutral-400 leading-relaxed">
                  تم إرسال تعليمات إعادة تعيين كلمة المرور إلى:<br/>
                  <strong className="text-white mt-2 block" dir="ltr">{email}</strong>
                </p>
              </div>

              <Link to="/login" className="block w-full">
                <Button className="w-full bg-[#121A15] hover:bg-[#1a241c] text-emerald-500 hover:text-emerald-400 border border-neutral-800 hover:border-emerald-500/30 h-14 text-base font-bold rounded-xl transition-all gap-2 flex items-center justify-center">
                  <ArrowRight className="w-4 h-4" />
                  العودة لتسجيل الدخول
                </Button>
              </Link>
            </motion.div>
          ) : (
            // ==========================================
            // حالة إدخال البريد (Form State)
            // ==========================================
            <motion.form 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6" 
              onSubmit={handleReset}
            >
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

              <Button 
                type="submit" 
                disabled={loading} 
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white h-14 text-base font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)]"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    جاري الإرسال...
                  </div>
                ) : (
                  "إرسال رابط إعادة التعيين"
                )}
              </Button>

              <Link to="/login" className="block text-center text-sm text-neutral-400 hover:text-white transition-colors mt-6 font-medium">
                تذكرت كلمة المرور؟ العودة لتسجيل الدخول
              </Link>
            </motion.form>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;
