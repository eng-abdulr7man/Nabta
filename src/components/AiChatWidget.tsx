import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, User, Loader2, Sparkles, Trash2, Lock } from "lucide-react";
import { Link } from "react-router-dom"; 
import { useAuth } from "@/contexts/AuthContext"; 

const GEMINI_API_KEY = "AQ.Ab8RN6LEZcqE43PA_It5bAR0DYe8jtf3D6WYMN5PtEPEZMK9wA";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const WELCOME_MESSAGE = "أهلاً بك يا هندسة في أكاديمية نبتة! 🌱 أنا مستشارك الزراعي الذكي. قول لي، إيه أخبار الزرع أو المحصول معاك النهاردة، وإيه المشكلة أو الاستفسار اللي حابب نناقشه؟";

const SYSTEM_PROMPT_TEXT = `أنت "مستشار نبتة الذكي"، الخبير الزراعي الأول وهندسة الزراعة الحديثة في أكاديمية "نبتة". 
لديك خبرة عريقة تزيد عن 20 عاماً في إدارة المزارع، الزراعة المحمية (الصوب)، الهيدروبونيك، معالجة التربة، وبرامج التسميد والمكافحة في مصر والمنطقة.

### قواعد الرد الاحترافي:
1. **الأسلوب:** خاطب المستخدم دائماً بـ "يا هندسة" أو "يا فندم" بلغة مصرية احترافية، راقية، ودافئة تعكس خبرة حقيقية في الغيط.
2. **التشخيص الذكي (لا تتسرع في الحل):** إذا كانت تفاصيل مشكلة المستخدم ناقصة، اسأله بذكاء عن: (نوع المحصول، عمر النبات، نوع التربة طينية/رملية، نظام الري ومواعيده، وطبيعة الأعراض الظاهرة).
3. **هيكلة الردود (عند توفر التفاصيل):** عندما يطرح المستخدم مشكلة واضحة وتتوفر بياناتها، رتب إجابتك بشكل علمي وعملي ومنسق:
   - 🔬 **التشخيص الفني:** تحليل مبدئي لسبب المشكلة.
   - 💡 **التوصيات العملية (خطوة بخطوة):** برنامج علاج أو تسميد أو ري دقيق ومكتوب بنقاط واضحة.
   - ⚠️ **محاذير هامة:** أخطاء شائعة يجب تجنبها لحماية المحصول.`;

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

  // 🌟 دالة الإرسال المتوافقة مع Google Gemini API 🌟
  const sendMessageToAi = async (messageText: string) => {
    if (!messageText.trim() || !user) return;

    const userMessage: Message = { role: "user", content: messageText };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    const exitWords = ["شكرا", "مع السلامة", "سلام", "قفلنا", "شكراً", "تم", "تسلم"];
    const isExit = exitWords.some(word => messageText.toLowerCase().includes(word));

    try {
      // تجهيز تاريخ المحادثة بالهيكل الذي يطلبه Gemini API (user / model)
      const chatHistory = messages
        .filter(msg => msg.content !== WELCOME_MESSAGE)
        .map(msg => ({
          role: msg.role === "assistant" ? "model" : "user",
          parts: [{ text: msg.content }]
        }));

      // إضافة الرسالة الحالية للمصفوفة
      const contents = [
        ...chatHistory,
        { role: "user", parts: [{ text: messageText }] }
      ];

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            system_instruction: {
              parts: { text: SYSTEM_PROMPT_TEXT }
            },
            contents: contents,
            generationConfig: {
              temperature: 0.6,
            }
          }),
        }
      );

      if (!response.ok) {
        const errData = await response.text();
        console.error("Gemini API Error:", response.status, errData);
        throw new Error("Failed to fetch from Gemini API");
      }

      const data = await response.json();
      const aiResponseText = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (aiResponseText) {
        setMessages((prev) => [...prev, {
          role: "assistant",
          content: aiResponseText,
        }]);

        if (isExit) {
          setTimeout(() => {
            setIsOpen(false);
            setTimeout(clearChat, 500);
          }, 5000);
        }
      } else {
        throw new Error("Invalid response structure from Gemini");
      }
    } catch (error) {
      console.error("Fatal AI Chat Error:", error);
      setMessages((prev) => [...prev, { 
        role: "assistant", 
        content: "معلش يا هندسة، واجهنا مشكلة بسيطة في الاتصال بخدمة جوجل. جرب تبعث الرسالة تاني وهكون معاك." 
      }]);
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
    <div className="fixed bottom-24 md:bottom-6 left-4 md:left-6 z-[200] font-tajawal">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="absolute bottom-16 md:bottom-20 left-0 w-[350px] md:w-[420px] h-[78vh] max-h-[600px] bg-[#0a0f0c] border border-emerald-500/20 rounded-[2rem] shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-[#121A15] border-b border-white/5 p-4 flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                  <Sparkles className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm">مستشار نبتة الذكي (Gemini Pro)</h3>
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

            {!user ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-gradient-to-b from-[#0a0f0c] to-[#050806]">
                <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 mb-6 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
                  <Lock className="w-10 h-10 text-emerald-400" />
                </div>
                <h4 className="text-xl text-white font-black mb-3">عذراً، يجب تسجيل الدخول!</h4>
                <p className="text-neutral-400 text-sm mb-8 leading-relaxed">
                  هذه الميزة متاحة فقط لأعضاء أكاديمية نبتة. سجل دخولك الآن لتتمكن من استشارة الخبير الزراعي الذكي.
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
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-[#0a0f0c] to-[#050806]">
                  {messages.map((msg, idx) => (
                    <div key={idx} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                      <div className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center ${msg.role === "user" ? "bg-blue-600/20 text-blue-400" : "bg-emerald-600/20 text-emerald-400"}`}>
                        {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                      </div>
                      <div className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed ${
                        msg.role === "user" ? "bg-blue-600 text-white rounded-tr-none text-right" : "bg-[#121A15] text-neutral-200 border border-white/5 rounded-tl-none text-right"
                      }`} dir="rtl">
                        {msg.content.split('\n').map((line, i) => <span key={i}>{line}<br/></span>)}
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex gap-2 items-center p-4">
                      <Loader2 className="w-4 h-4 text-emerald-500 animate-spin" />
                      <span className="text-xs text-neutral-400">جاري فحص البيانات وتحضير الاستشارة الفنية عبر Gemini...</span>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <div className="p-4 bg-[#121A15] border-t border-white/5">
                  <div className="relative flex items-center">
                    <textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
                      placeholder="اكتب استشارتك الزراعية هنا..."
                      className="w-full bg-[#0a0f0c] border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white text-sm resize-none h-[52px] outline-none focus:border-emerald-500 text-right"
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

export Date export default AiChatWidget; // (استبدل السطر ده بـ export default AiChatWidget;)
