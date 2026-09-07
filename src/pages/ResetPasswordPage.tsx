
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
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-20 relative overflow-hidden font-tajawal">
      
      {/* إضاءات خلفية (Ambient Glow) */}


      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        {/* الكارت الزجاجي الداكن */}
        <div className="bg-muted border border-border rounded-3xl p-8 sm:p-10 shadow-2xl backdrop-blur-xl">
          
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-muted border border-border flex items-center justify-center mx-auto mb-6 hover:border-primary/20 hover:bg-accent transition-all duration-300">
              <Sprout className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-2xl font-black text-foreground mb-2">كلمة مرور جديدة</h1>
            <p className="text-sm text-muted-foreground">قم بتعيين كلمة مرور جديدة وقوية لحسابك</p>
          </div>

          <form className="space-y-6" onSubmit={handleUpdate}>
            
            {/* حقل كلمة المرور الجديدة */}
            <div>
              <label className="text-sm font-bold text-foreground mb-2 block">كلمة المرور الجديدة</label>
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

            {/* زر التحديث */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-14 text-base font-bold rounded-xl transition-all  hover: mt-4"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  جاري التحديث...
                </div>
              ) : ( "تحديث كلمة المرور"
              )}
            </Button>
          </form>

        </div>
      </motion.div>
    </div>
  );
};

export default ResetPasswordPage;
