import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, User, Loader2, Sparkles, Trash2, Lock } from "lucide-react";
import { Link } from "react-router-dom"; 
import { useAuth } from "@/contexts/AuthContext"; 

const GROQ_API_KEY = "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";

interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

const WELCOME_MESSAGE = "أهلاً بك في نبتة! 🌱 أنا مستشارك الزراعي الذكي. إزاي أقدر أساعدك في مزرعتك أو محصولك النهاردة؟";

const SYSTEM_PROMPT: Message = {
  role: "system",
  content: `أنت مستشار زراعي خبير في أكاديمية 'نبتة'. مهمتك مساعدة المهندسين والمزارعين. 
  1. لا تقدم الحل فوراً؛ اسأل أولاً عن البيانات (المحصول، التربة، الري).
  2. إذا شعرت أن المستخدم ينهي الحوار (شكراً، سلام، تمام، قفلنا)، رد بتحية ختامية دافئة جداً تليق ببراند نبتة.`
};

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

  // 🌟 الدالة المسؤولة عن الإرسال (تم فصلها عشان نقدر ننادي عليها من جوه ومن بره) 🌟
  const sendMessageToAi = async (messageText: string) => {
    if (!messageText.trim() || !user) return;

    const userMessage: Message = { role: "user", content: messageText };
    
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    const exitWords = ["شكرا", "مع السلامة", "سلام", "قفلنا", "شكراً", "تم"];
    const isExit = exitWords.some(word => messageText.toLowerCase().includes(word));

    try {
      const chatHistory = messages.filter(msg => msg.content !== WELCOME_MESSAGE);
      
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [SYSTEM_PROMPT, ...chatHistory, userMessage],
          temperature: 0.7,
        }),
      });

      const data = await response.json();
      if (data.choices?.[0]?.message) {
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

  // 🌟 الاستماع للأحداث الخارجية (Custom Events) 🌟
  useEffect(() => {
    const handleOpenChatWithQuery = (event: CustomEvent) => {
      const query = event.detail?.query;
      if (query && user) {
        setIsOpen(true);
        // تأخير بسيط عشان الشات يفتح الأول وبعدين يبعت الرسالة
        setTimeout(() => {
          sendMessageToAi(query);
        }, 300);
      } else if (query && !user) {
         setIsOpen(true); // لو مش مسجل، افتح الشات عشان يشوف رسالة "يجب تسجيل الدخول"
      }
    };

    window.addEventListener('openAiChat', handleOpenChatWithQuery as EventListener);
    return () => window.removeEventListener('openAiChat', handleOpenChatWithQuery as EventListener);
  }, [user, messages]); // ضفنا messages هنا عشان لما يجي يبعت رسالة تانية ياخد الـ History معاه


  return (
    <div className="fixed bottom-24 md:bottom-6 left-4 md:left-6 z-[200] font-tajawal">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="absolute bottom-16 md:bottom-20 left-0 w-[350px] md:w-[400px] h-[75vh] max-h-[550px] bg-[#0a0f0c] border border-emerald-500/20 rounded-[2rem] shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-[#121A15] border-b border-white/5 p-4 flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                  <Sparkles className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm">مستشار نبتة الذكي</h3>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {user && ( 
                  <button onClick={clearChat} title="مسح المحادثة" className="text-neutral-500 hover:text-emerald-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <button onClick={() => setIsOpen(false)} className="text-neutral-500 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* التحقق من تسجيل الدخول */}
            {!user ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-gradient-to-b from-[#0a0f0c] to-[#050806]">
                <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 mb-6 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
                  <Lock className="w-10 h-10 text-emerald-400" />
                </div>
                <h4 className="text-xl text-white font-black mb-3">عذراً، يجب تسجيل الدخول!</h4>
                <p className="text-neutral-400 text-sm mb-8 leading-relaxed">
                  هذه الميزة متاحة فقط لأعضاء أكاديمية نبتة. سجل دخولك الآن لتتمكن من التحدث مع مستشارك الزراعي الذكي.
                </p>
                <div className="flex flex-col w-full gap-3">
                  <Link 
                    to="/login" 
                    onClick={() => setIsOpen(false)}
                    className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-all shadow-lg active:scale-[0.98]"
                  >
                    تسجيل الدخول
                  </Link>
                  <Link 
                    to="/register" 
                    onClick={() => setIsOpen(false)}
                    className="w-full py-3.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-xl font-bold transition-all active:scale-[0.98]"
                  >
                    إنشاء حساب جديد
                  </Link>
                </div>
              </div>
            ) : (
              <>
                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-[#0a0f0c] to-[#050806]">
                  {messages.map((msg, idx) => (
                    <div key={idx} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                      <div className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center ${msg.role === "user" ? "bg-blue-600/20 text-blue-400" : "bg-emerald-600/20 text-emerald-400"}`}>
                        {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                      </div>
                      <div className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${
                        msg.role === "user" ? "bg-blue-600 text-white rounded-tr-none text-right" : "bg-[#121A15] text-neutral-200 border border-white/5 rounded-tl-none text-right"
                      }`} dir="rtl">
                        {msg.content.split('\n').map((line, i) => <span key={i}>{line}<br/></span>)}
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex gap-2 items-center p-4">
                      <Loader2 className="w-4 h-4 text-emerald-500 animate-spin" />
                      <span className="text-xs text-neutral-400">جاري التحليل...</span>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Form */}
                <div className="p-4 bg-[#121A15] border-t border-white/5">
                  <div className="relative flex items-center">
                    <textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
                      placeholder="اسأل مستشارك الزراعي..."
                      className="w-full bg-[#0a0f0c] border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white text-sm resize-none h-[50px] outline-none focus:border-emerald-500 text-right"
                      dir="rtl"
                    />
                    <button 
                      onClick={handleSendMessage}
                      disabled={isLoading || !input.trim()}
                      className="absolute left-2 w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white disabled:opacity-50 transition-all hover:bg-emerald-500"
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
        className="w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center shadow-2xl text-white relative z-10"
      >
        <MessageCircle className="w-6 h-6" />
      </motion.button>
    </div>
  );
};

export default AiChatWidget;
