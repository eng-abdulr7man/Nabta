import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BottomNav from "@/components/layout/BottomNav";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Send, MessageCircle, LogIn } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

const ContactPage = () => {
  const [type, setType] = useState("inquiry");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const types = [
    { value: "inquiry", label: "استفسار" },
    { value: "suggestion", label: "اقتراح" },
    { value: "complaint", label: "شكوى" },
    { value: "support", label: "دعم فني" },
  ];

  const handleSubmit = async () => {
    if (!subject.trim() || !message.trim()) {
      toast({ title: "يرجى ملء جميع الحقول", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("contact_messages").insert({
      user_id: user!.id,
      type,
      subject,
      message,
    });
    setLoading(false);
    if (error) {
      toast({ title: "خطأ", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "تم إرسال رسالتك بنجاح" });
      setSubject("");
      setMessage("");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 pt-24 pb-20 md:pb-8">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-black text-foreground mb-2">تواصل معنا</h1>
              <p className="text-muted-foreground">نحن هنا لمساعدتك، أرسل لنا رسالتك</p>
            </div>

            {!user ? (
              <div className="glass-card p-8 text-center space-y-4">
                <LogIn className="w-12 h-12 text-muted-foreground/30 mx-auto" />
                <p className="text-lg text-foreground font-bold">يجب تسجيل الدخول أولاً</p>
                <p className="text-sm text-muted-foreground">قم بتسجيل الدخول لإرسال رسالتك</p>
                <div className="flex gap-3 justify-center">
                  <Link to="/login">
                    <Button className="bg-primary text-primary-foreground">تسجيل الدخول</Button>
                  </Link>
                  <Link to="/register">
                    <Button variant="outline" className="border-border text-foreground">إنشاء حساب</Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="glass-card p-6 space-y-5">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">نوع الرسالة</label>
                  <div className="flex flex-wrap gap-2">
                    {types.map((t) => (
                      <button
                        key={t.value}
                        onClick={() => setType(t.value)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          type === t.value
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">الموضوع</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="عنوان الرسالة"
                    className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">الرسالة</label>
                  <textarea
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="اكتب رسالتك هنا..."
                    className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  />
                </div>

                <Button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
                  size="lg"
                >
                  <Send className="w-4 h-4" />
                  {loading ? "جاري الإرسال..." : "إرسال الرسالة"}
                </Button>
              </div>
            )}

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <a href="https://wa.me/201234567890" target="_blank" rel="noopener noreferrer" className="flex-1 glass-card p-4 flex items-center gap-3 hover-lift cursor-pointer">
                <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="font-bold text-foreground text-sm">واتساب</p>
                  <p className="text-xs text-muted-foreground">تواصل مباشر</p>
                </div>
              </a>
              <a href="https://t.me/agrismart" target="_blank" rel="noopener noreferrer" className="flex-1 glass-card p-4 flex items-center gap-3 hover-lift cursor-pointer">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <Send className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="font-bold text-foreground text-sm">تيليجرام</p>
                  <p className="text-xs text-muted-foreground">تواصل مباشر</p>
                </div>
              </a>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
};

export default ContactPage;
