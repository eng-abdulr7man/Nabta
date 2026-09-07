import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, User, Loader2, Sparkles, Trash2, Lock } from "lucide-react";
import { Link } from "react-router-dom"; 
import { useAuth } from "@/contexts/AuthContext"; 
import { supabase } from "@/integrations/supabase/client";

interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

const WELCOME_MESSAGE = "أهلاً بيك في نبتة يا هندسة! 🌱 أنا مستشارك الزراعي والبيطري، جاهز أساعدك في أي حاجة سواء زرع أو تربية حيوان. احكيلي مشكلتك إيه؟";

const AiChatWidget = () => {
  const { user } = useAuth(); 
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{ role: "assistant", content: WELCOME_MESSAGE }]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const clearChat = () => {
    setMessages([{ role: "assistant", content: WELCOME_MESSAGE }]);
  };

  const sendMessageToAi = async (messageText: string) => {
    if (!messageText.trim() || !user) return;

    const userMessage: Message = { role: "user", content: messageText };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    const exitWords = ["شكرا", "مع السلامة", "سلام", "قفلنا", "شكراً", "تم"];
    const isExit = exitWords.some(word => messageText.toLowerCase().includes(word));

    try {
      const chatHistory = messages.filter(msg => msg.content !== WELCOME_MESSAGE);

      const { data, error: fnError } = await supabase.functions.invoke("ai-chat", {
        body: { messages: [...chatHistory, userMessage] },
      });

      if (fnError) throw fnError;

      if (data?.choices?.[0]?.message) {
        setMessages((prev) => [...prev, {
          role: "assistant",
          content: data.choices[0].message.content,
        }]);

        if (isExit) {
          setTimeout(() => {
            setIsOpen(false);
            setTimeout(clearChat, 500);
          }, 5000);
        }
      } else {
        setMessages((prev) => [...prev, { role: "assistant", content: data?.error || "معلش يا هندسة، حصل خطأ في الرد من المساعد. جرب تاني كمان شوية." }]);
      }
    } catch (error) {
      setMessages((prev) => [...prev, { role: "assistant", content: "معلش يا هندسة، حصل دروب في الشبكة. جرب تاني." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = () => {
    if (!input.trim()) return;
    sendMessageToAi(input.trim());
    setInput("");
  };

  useEffect(() => {
    const handleOpenChatWithQuery = (event: CustomEvent) => {
      const query = event.detail?.query;
      if (query && user) {
        setIsOpen(true);
        setTimeout(() => {
          sendMessageToAi(query);
        }, 300);
      } else if (query && !user) {
         setIsOpen(true);
      }
    };

    window.addEventListener('openAiChat', handleOpenChatWithQuery as EventListener);
    return () => window.removeEventListener('openAiChat', handleOpenChatWithQuery as EventListener);
  }, [user, messages]);

  return (
    <div className="fixed bottom-24 md:bottom-6 left-4 md:left-6 z-[200]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-16 md:bottom-20 left-0 w-[360px] sm:w-[400px] h-[75vh] max-h-[580px] bg-background border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-card border-b border-border px-4 py-3.5 flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                  <Sparkles className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h3 className="text-foreground font-semibold text-sm">مستشار نبتة الذكي</h3>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {user && ( 
                  <button onClick={clearChat} title="مسح المحادثة" className="text-muted-foreground hover:text-primary transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Unauthenticated State */}
            {!user ? (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-background">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 mb-4">
                  <Lock className="w-8 h-8 text-primary" />
                </div>
                <h4 className="text-lg text-foreground font-bold mb-2">عذراً، يجب تسجيل الدخول!</h4>
                <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                  هذه الميزة متاحة فقط لأعضاء أكاديمية نبتة. سجل دخولك الآن لتتمكن من التحدث مع مستشارك الزراعي.
                </p>
                <div className="flex flex-col w-full gap-2.5">
                  <Link 
                    to="/login" 
                    onClick={() => setIsOpen(false)}
                    className="w-full py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-medium text-sm transition-all shadow-sm"
                  >
                    تسجيل الدخول
                  </Link>
                  <Link 
                    to="/register" 
                    onClick={() => setIsOpen(false)}
                    className="w-full py-2.5 bg-muted border border-border hover:bg-accent text-foreground rounded-xl font-medium text-sm transition-all"
                  >
                    إنشاء حساب جديد
                  </Link>
                </div>
              </div>
            ) : (
              <>
                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background">
                  {messages.map((msg, idx) => (
                    <div key={idx} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                      <div className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center ${msg.role === "user" ? "bg-primary/20 text-primary" : "bg-card border border-border text-primary"}`}>
                        {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                      </div>
                      <div className={`max-w-[80%] p-3.5 rounded-2xl text-sm leading-relaxed ${
                        msg.role === "user" ? "bg-primary text-primary-foreground rounded-tr-none text-right" : "bg-card border border-border text-foreground rounded-tl-none text-right shadow-sm"
                      }`} dir="rtl">
                        {msg.content.split('\n').map((line, i) => <span key={i}>{line}<br/></span>)}
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex gap-2 items-center p-2">
                      <Loader2 className="w-4 h-4 text-primary animate-spin" />
                      <span className="text-xs text-muted-foreground">جاري التحليل...</span>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Form */}
                <div className="p-3 bg-card border-t border-border">
                  <div className="relative flex items-center">
                    <textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
                      placeholder="اسأل مستشارك الزراعي..."
                      className="w-full bg-background border border-input rounded-xl pl-12 pr-4 py-2.5 text-foreground text-sm resize-none h-[44px] outline-none focus:border-primary transition-colors text-right"
                      dir="rtl"
                    />
                    <button 
                      onClick={handleSendMessage}
                      disabled={isLoading || !input.trim()}
                      className="absolute left-1.5 w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground disabled:opacity-40 transition-all hover:bg-primary/90"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg relative z-10 transition-colors"
        aria-label="فتح محادثة المستشار الزراعي"
      >
        <MessageCircle className="w-6 h-6" />
      </motion.button>
    </div>
  );
};

export default AiChatWidget;
