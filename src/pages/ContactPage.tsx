import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BottomNav from "@/components/layout/BottomNav";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Send, MessageCircle } from "lucide-react";
import { useState } from "react";

const ContactPage = () => {
  const [type, setType] = useState("inquiry");

  const types = [
    { value: "inquiry", label: "استفسار" },
    { value: "suggestion", label: "اقتراح" },
    { value: "complaint", label: "شكوى" },
    { value: "support", label: "دعم فني" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 pt-24 pb-20 md:pb-8">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            <div className="text-center mb-8">
              <h1 className="text-3xl font-black text-foreground mb-2">تواصل معنا</h1>
              <p className="text-muted-foreground">نحن هنا لمساعدتك، أرسل لنا رسالتك</p>
            </div>

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
                  placeholder="عنوان الرسالة"
                  className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">الرسالة</label>
                <textarea
                  rows={5}
                  placeholder="اكتب رسالتك هنا..."
                  className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                />
              </div>

              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 gap-2" size="lg">
                <Send className="w-4 h-4" />
                إرسال الرسالة
              </Button>
            </div>

            {/* Direct contact */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <a
                href="https://wa.me/201234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 glass-card p-4 flex items-center gap-3 hover-lift cursor-pointer"
              >
                <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="font-bold text-foreground text-sm">واتساب</p>
                  <p className="text-xs text-muted-foreground">تواصل مباشر</p>
                </div>
              </a>
              <a
                href="https://t.me/agrismart"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 glass-card p-4 flex items-center gap-3 hover-lift cursor-pointer"
              >
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
