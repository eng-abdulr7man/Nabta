import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, User, Sprout, Eye, EyeOff, Check, Phone, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const RegisterPage = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState(""); // 1. إضافة حالة الهاتف
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false); 
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!acceptTerms) {
      toast({ title: "تنبيه", description: "يجب الموافقة على شروط الاستخدام أولاً", variant: "destructive" });
      return;
    }
    
    // التحقق المبدئي من رقم الهاتف (اختياري: للتأكد إنه مش أقل من 11 رقم في مصر مثلاً)
    if (phone.length < 10) {
      toast({ title: "تنبيه", description: "يُرجى إدخال رقم هاتف صحيح", variant: "destructive" });
      return;
    }
    
    setLoading(true);
    
    // 2. إرسال البيانات للـ Supabase بما فيها رقم الهاتف
    const { data: authData, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: { 
          full_name: fullName,
          phone: phone // تسجيل الهاتف في الـ Metadata
        },
      },
    });

    // 3. (خطوة تأكيدية) تحديث جدول profiles مباشرة لو الايميل مش بيحتاج تفعيل
    // لو الايميل بيحتاج تفعيل (Email Confirmation)، الخطوة دي ممكن تفشل لأن المستخدم لسه مش مسجل دخول
    // الأفضل دايماً يكون فيه Database Trigger بينقل الـ phone من الـ metadata لجدول profiles
    if (authData?.user && !error) {
       await supabase.from('profiles').update({ phone: phone }).eq('user_id', authData.user.id);
    }

    setLoading(false);
    
    if (error) {
      toast({ title: "خطأ في إنشاء الحساب", description: error.message, variant: "destructive" });
    } else {
      toast({
        title: "تم إنشاء الحساب بنجاح",
        description: "تم انشاء الحساب بنجاح قم بتسجيل الدخول الان !",
      });
      navigate("/login");
    }
  };

  return (
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
            <h1 className="text-2xl font-black text-white mb-2">إنشاء حساب جديد</h1>
            <p className="text-sm text-neutral-400">انضم إلى مجتمع نـَـبْـتـَـة وابدأ رحلتك التعليمية</p>
          </div>

          <form className="space-y-5" onSubmit={handleRegister}>
            
            {/* حقل الاسم */}
            <div>
              <label className="text-sm font-bold text-neutral-300 mb-2 block">الاسم بالكامل</label>
              <div className="relative group">
                <User className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500 group-focus-within:text-emerald-500 transition-colors" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="أدخل اسمك الكامل"
                  className="w-full pr-12 pl-4 py-3.5 rounded-xl bg-[#121A15] border border-neutral-800 text-white text-sm placeholder:text-neutral-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all"
                  required
                />
              </div>
            </div>

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

            {/* 📱 حقل رقم الهاتف (الجديد) */}
            <div>
              <label className="text-sm font-bold text-neutral-300 mb-2 block">رقم الهاتف</label>
              <div className="relative group">
                <Phone className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500 group-focus-within:text-emerald-500 transition-colors" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="01xxxxxxxxx"
                  className="w-full pr-12 pl-4 py-3.5 rounded-xl bg-[#121A15] border border-neutral-800 text-white text-sm placeholder:text-neutral-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all"
                  dir="ltr"
                  required
                />
              </div>
              {/* هينت (Hint) احترافي يوضح سبب طلب الرقم */}
              <div className="flex items-start gap-1.5 mt-2 text-emerald-500/80 bg-emerald-500/5 p-2 rounded-lg border border-emerald-500/10">
                <Info className="w-4 h-4 shrink-0 mt-0.5" />
                <p className="text-xs leading-relaxed">
                  يُرجى إدخال رقم هاتف صحيح، سيتم استخدامه فقط لسهولة التواصل معك وتقديم الدعم الفني عند الحاجة.
                </p>
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

            {/* الـ Checkbox للموافقة على الشروط */}
            <div className="pt-2 pb-2">
              <label className="flex items-start gap-3 text-sm text-neutral-400 cursor-pointer group select-none">
                <div className="relative flex items-center justify-center shrink-0 mt-0.5">
                  <input 
                    type="checkbox" 
                    className="peer sr-only" 
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                  />
                  <div className="w-5 h-5 rounded-md border border-neutral-700 bg-[#121A15] peer-checked:bg-emerald-500 peer-checked:border-emerald-500 transition-all duration-300 group-hover:border-emerald-500/50 shadow-inner" />
                  <Check className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 scale-50 peer-checked:scale-100 transition-all duration-300 pointer-events-none" strokeWidth={3} />
                </div>
                <span className="group-hover:text-neutral-300 transition-colors leading-relaxed">
                  أوافق على <Link to="/terms" className="text-emerald-500 hover:text-emerald-400 hover:underline">شروط الاستخدام</Link> و <Link to="/privacy" className="text-emerald-500 hover:text-emerald-400 hover:underline">سياسة الخصوصية</Link>
                </span>
              </label>
            </div>

            {/* زر إنشاء الحساب */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white h-14 text-base font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)]"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  جاري إنشاء الحساب...
                </div>
              ) : (
                "إنشاء الحساب"
              )}
            </Button>
          </form>

          {/* رابط تسجيل الدخول */}
          <p className="text-center text-sm text-neutral-400 mt-8">
            لديك حساب بالفعل؟{" "}
            <Link to="/login" className="text-white hover:text-emerald-400 font-bold transition-colors">
              تسجيل الدخول
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
