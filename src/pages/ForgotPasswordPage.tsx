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

  const handleReset = async (e: React.FormEvent) => {
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
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="glass-card p-8 space-y-6">
          <div className="text-center">
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <Sprout className="w-6 h-6 text-primary" />
              </div>
              <span className="font-tajawal font-bold text-xl">
                MuAgri<span className="text-primary">Smart</span>
              </span>
            </Link>
            <h1 className="text-2xl font-black text-foreground">استعادة كلمة المرور</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {sent ? "تم إرسال رابط إعادة التعيين" : "أدخل بريدك الإلكتروني لإعادة تعيين كلمة المرور"}
            </p>
          </div>

          {sent ? (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <Mail className="w-8 h-8 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">
                تم إرسال رابط إعادة تعيين كلمة المرور إلى <strong className="text-foreground">{email}</strong>. تحقق من بريدك الإلكتروني.
              </p>
              <Link to="/login">
                <Button variant="ghost" className="text-primary gap-1">
                  <ArrowRight className="w-4 h-4" />
                  العودة لتسجيل الدخول
                </Button>
              </Link>
            </div>
          ) : (
            <form className="space-y-4" onSubmit={handleReset}>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">البريد الإلكتروني</label>
                <div className="relative">
                  <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@email.com"
                    className="w-full pr-10 pl-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    dir="ltr"
                    required
                  />
                </div>
              </div>
              <Button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground hover:bg-primary/90" size="lg">
                {loading ? "جاري الإرسال..." : "إرسال رابط إعادة التعيين"}
              </Button>
              <Link to="/login" className="block text-center text-sm text-primary hover:underline">
                العودة لتسجيل الدخول
              </Link>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;
