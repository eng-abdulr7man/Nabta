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
  const [phone, setPhone] = useState(""); // حالة رقم الهاتف
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false); 
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!acceptTerms) {
      toast({ title: "تنبيه", description: "يجب الموافقة على شروط الاستخدام أولاً", variant: "destructive" });
      return;
    }

    // تحقق بسيط من طول رقم الهاتف
    if (phone.length < 10) {
      toast({ title: "تنبيه", description: "يُرجى إدخال رقم هاتف صحيح", variant: "destructive" });
      return;
    }
    
    setLoading(true);
    
    // إنشاء الحساب وتسجيل البيانات الإضافية في الـ Metadata
    const { data: authData, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: { 
          full_name: fullName,
          phone: phone 
        },
      },
    });

    // ملحوظة: رقم الهاتف بيتحفظ تلقائيًا في جدول profiles بواسطة
    // الـ trigger (handle_new_user) اللي بياخده من raw_user_meta_data
    // مباشرة عند إنشاء المستخدم، فمفيش داعي لاستدعاء .update() هنا
    // (كان بيفشل بصمت لو تأكيد الإيميل مفعّل لأن مفيش session وقتها).

    setLoading(false);
    
    if (error) {
      toast({ title: "خطأ في إنشاء الحساب", description: error.message, variant: "destructive" });
    } else {
      toast({
        title: "تم إنشاء الحساب بنجاح",
        description: "تم انشاء الحساب بنجاح قم بتسجيل الدخول الان !",
      });
      // توجيه المستخدم لصفحة الدخول مع تمرير الإيميل عشان يظهر هناك تلقائي
      navigate("/login", { state: { registeredEmail: email } });
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
            <h1 className="text-2xl font-black text-foreground mb-2">إنشاء حساب جديد</h1>
            <p className="text-sm text-muted-foreground">انضم إلى مجتمع نـَـبْـتـَـة وابدأ رحلتك التعليمية</p>
          </div>

          <form className="space-y-5" onSubmit={handleRegister}>
            
            {/* حقل الاسم */}
            <div>
              <label className="text-sm font-bold text-foreground mb-2 block">الاسم بالكامل</label>
              <div className="relative group">
                <User className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="أدخل اسمك الكامل"
                  className="w-full pr-12 pl-4 py-3.5 rounded-xl bg-muted border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/20 focus:ring-1 focus:ring-primary transition-all"
                  required
                />
              </div>
            </div>

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

            {/* حقل رقم الهاتف */}
            <div>
              <label className="text-sm font-bold text-foreground mb-2 block">رقم الهاتف</label>
              <div className="relative group">
                <Phone className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="01xxxxxxxxx"
                  className="w-full pr-12 pl-4 py-3.5 rounded-xl bg-muted border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/20 focus:ring-1 focus:ring-primary transition-all"
                  dir="ltr"
                  required
                />
              </div>
              <div className="flex items-start gap-1.5 mt-2 text-primary/80 bg-accent p-2 rounded-lg border border-primary/20">
                <Info className="w-4 h-4 shrink-0 mt-0.5" />
                <p className="text-xs leading-relaxed">
                  يُرجى إدخال رقم هاتف صحيح، سيتم استخدامه فقط لسهولة التواصل معك وتقديم الدعم الفني عند الحاجة.
                </p>
              </div>
            </div>

            {/* حقل كلمة المرور */}
            <div>
              <label className="text-sm font-bold text-foreground mb-2 block">كلمة المرور</label>
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
                  minLength={6}
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

            {/* الـ Checkbox للموافقة على الشروط */}
            <div className="pt-2 pb-2">
              <label className="flex items-start gap-3 text-sm text-muted-foreground cursor-pointer group select-none">
                <div className="relative flex items-center justify-center shrink-0 mt-0.5">
                  <input 
                    type="checkbox" 
                    className="peer sr-only" 
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                  />
                  <div className="w-5 h-5 rounded-md border border-border bg-muted peer-checked:bg-primary peer-checked:border-emerald-500 transition-all duration-300 group-hover:border-primary/20 shadow-inner" />
                  <Check className="absolute w-3.5 h-3.5 text-foreground opacity-0 peer-checked:opacity-100 scale-50 peer-checked:scale-100 transition-all duration-300 pointer-events-none" strokeWidth={3} />
                </div>
                <span className="group-hover:text-foreground transition-colors leading-relaxed">
                  أوافق على <Link to="/terms" className="text-primary hover:text-primary hover:underline">شروط الاستخدام</Link> و <Link to="/privacy" className="text-primary hover:text-primary hover:underline">سياسة الخصوصية</Link>
                </span>
              </label>
            </div>

            {/* زر إنشاء الحساب */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-14 text-base font-bold rounded-xl transition-all  hover:"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  جاري إنشاء الحساب...
                </div>
              ) : ( "إنشاء الحساب"
              )}
            </Button>
          </form>

          {/* رابط تسجيل الدخول */}
          <p className="text-center text-sm text-muted-foreground mt-8">
            لديك حساب بالفعل؟{" "}
            <Link to="/login" className="text-foreground hover:text-primary font-bold transition-colors">
              تسجيل الدخول
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
