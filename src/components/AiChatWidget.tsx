import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, User, Loader2, Sparkles, LogOut } from "lucide-react";

const GROQ_API_KEY = "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";

interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

const WELCOME_MESSAGE = "أهلاً بك في نبتة! 🌱 أنا مستشارك الزراعي الذكي. كيف يمكنني مساعدتك اليوم؟";
const EXIT_MESSAGE = "سعدت بمساعدتك يا هندسة! 🌱 بالتوفيق في مزرعتك، وفي انتظارك دائماً في نبتة. سلام!";

const SYSTEM_PROMPT: Message = {
  role: "system",
  content: `أنت مستشار زراعي في 'نبتة'. 
  1. شخّص المشاكل بالأسئلة أولاً.
  2. إذا شعرت أن المستخدم ينهي الحوار (مثل: شكراً، مع السلامة، تمام)، قم بالرد بتحية ختامية دافئة تليق بمهندس زراعي.`
};

const AiChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{ role: "assistant", content: WELCOME_MESSAGE }]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // دالة لمسح الشات وإغلاقه
  const handleCloseAndClear = () => {
    setIsOpen(false);
    setTimeout(() => {
      setMessages([{ role: "assistant", content: WELCOME_MESSAGE }]);
    }, 500);
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    const userMessage: Message = { role: "user", content: userMsg };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // فحص بسيط لإغلاق الشات إذا كانت الرسالة توحي بالنهاية
    const exitWords = ["شكرا", "مع السلامة", "سلام", "اقفل", "خلصنا", "شكراً"];
    const isExit = exitWords.some(word => userMsg.toLowerCase().includes(word));

    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Authorization": `Bearer ${GROQ_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [SYSTEM_PROMPT, ...messages.filter(m => m.content !== WELCOME_MESSAGE), userMessage],
          temperature: 0.7,
        }),
      });

      const data = await response.json();
      if (data.choices?.[0]?.message) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.choices[0].message.content }]);
        
        // إذا كان المستخدم ينهي المحادثة، نغلق الشات تلقائياً بعد ثوانٍ
        if (isExit) {
          setTimeout(() => handleCloseAndClear(), 5000); 
        }
      }
    } catch (error) {
      setMessages((prev) => [...prev, { role: "assistant", content: "عذراً، حاول مجدداً." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-[200] font-tajawal text-right" dir="rtl">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
            className="absolute bottom-20 left-0 w-[350px] md:w-[400px] h-[550px] bg-[#0a0f0c] border border-emerald-500/20 rounded-[2rem] shadow-2xl flex flex-col overflow-hidden"
          >
            <div className="bg-[#121A15] p-4 flex items-center justify-between border-b border-white/5">
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                <span className="text-white font-bold">مستشار نبتة</span>
              </div>
              <button onClick={handleCloseAndClear} className="text-neutral-400 hover:text-red-400">
                <LogOut className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                  <div className={`p-3 rounded-2xl text-sm ${msg.role === "user" ? "bg-emerald-600 text-white" : "bg-[#121A15] text-neutral-200 border border-white/5"}`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-[#121A15] flex gap-2">
              <input 
                value={input} onChange={(e) => setInput(e.target.value)} 
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="اكتب هنا..." className="flex-1 bg-black border border-white/10 rounded-xl p-2 text-white outline-none"
              />
              <button onClick={handleSendMessage} className="bg-emerald-600 p-2 rounded-xl text-white"><Send className="w-4 h-4" /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button onClick={() => setIsOpen(!isOpen)} className="w-14 h-14 rounded-full bg-emerald-600 flex items-center justify-center text-white shadow-xl">
        {isOpen ? <X /> : <MessageCircle />}
      </button>
    </div>
  );
};

export default AiChatWidget;
