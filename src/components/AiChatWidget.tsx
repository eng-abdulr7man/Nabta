import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, User, Loader2, Sparkles } from "lucide-react";

// ⚠️ المفتاح بتاعك آمن هنا حالياً، بس زي ما اتفقنا لازم يتشال في الـ Production
const GROQ_API_KEY = "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";

interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

const WELCOME_MESSAGE = "أهلاً يا هندسة! 🌱 أنا الموديل اللي كنت شغال معاك في الأول، ورجعتلك تاني عشان نطلع أحلى وصف لكورسات 'نبتة'. اؤمرني محتاج وصف لأي كورس؟";

const SYSTEM_PROMPT: Message = {
  role: "system",
  content: `أنت خبير محتوى تعليمي في أكاديمية نبتة. 
  استخدم خبرتك في الزراعة لكتابة وصف احترافي للكورسات. 
  يجب أن يتضمن الوصف: 
  1. مقدمة جذابة. 
  2. محاور الكورس (ماذا ستتعلم). 
  3. الفئة المستهدفة.
  اجعل الأسلوب مهني ومصري بسيط.`
};

const AiChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: WELCOME_MESSAGE }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // بنفلتر أي رسايل ترحيب قديمة ونبعت بس الـ System والـ User عشان الـ 400
      const chatHistory = messages.filter(msg => msg.content !== WELCOME_MESSAGE);
      
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // ✅ رجعنا للموديل اللي إنت عايزه واللي كان شغال طلقة
          model: "llama-3.1-70b-versatile", 
          messages: [SYSTEM_PROMPT, ...chatHistory, userMessage],
          temperature: 0.7,
          max_tokens: 1024,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Groq API Error:", JSON.stringify(errorData, null, 2));
        throw new Error("API Error");
      }

      const data = await response.json();
      
      if (data.choices && data.choices.length > 0) {
        const botMessage: Message = {
          role: "assistant",
          content: data.choices[0].message.content,
        };
        setMessages((prev) => [...prev, botMessage]);
      }
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "حصلت مشكلة بسيطة في الربط، جرب تبعت تاني يا هندسة." }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-[200] font-tajawal">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="absolute bottom-20 left-0 w-[350px] md:w-[450px] h-[600px] bg-[#0a0f0c] border border-emerald-500/20 rounded-[2rem] shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-[#121A15] border-b border-white/5 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                  <Sparkles className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="text-white font-bold text-sm">نبتة AI - خبير المحتوى</h3>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-[#0a0f0c] to-[#050806]">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                  <div className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center ${msg.role === "user" ? "bg-blue-600/20 text-blue-400" : "bg-emerald-600/20 text-emerald-400"}`}>
                    {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === "user" ? "bg-blue-600 text-white rounded-tr-none" : "bg-[#121A15] text-neutral-200 border border-white/5 rounded-tl-none"
                  }`}>
                    {msg.content.split('\n').map((line, i) => <span key={i}>{line}<br/></span>)}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex items-center gap-2 text-emerald-500 text-xs p-4">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  جاري صياغة الوصف...
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-[#121A15] border-t border-white/5 flex gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="اسم الكورس إيه؟"
                className="flex-1 bg-[#0a0f0c] border border-white/10 rounded-xl p-3 text-white text-sm resize-none h-[50px] outline-none focus:border-emerald-500/50"
              />
              <button 
                onClick={handleSendMessage}
                disabled={isLoading || !input.trim()}
                className="bg-emerald-600 p-3 rounded-xl text-white hover:bg-emerald-500 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 rounded-full bg-emerald-600 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.4)] text-white"
      >
        <MessageCircle />
      </motion.button>
    </div>
  );
};

export default AiChatWidget;
