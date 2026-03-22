import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, User, Loader2, Sparkles } from "lucide-react";

// ⚠️ المفتاح بتاعك - يفضل نقله لـ .env لاحقاً
const GROQ_API_KEY = "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";

interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

const WELCOME_MESSAGE = "أهلاً بك في نبتة! 🌱 أنا مستشارك الزراعي الذكي (بموديل Llama 3.3). لو عندك أي مشكلة في الزرع، قولي وهنحلها سوا.";

// التعليمات الصارمة للاسيستنت الزراعي
const SYSTEM_PROMPT: Message = {
  role: "system",
  content: `أنت مستشار زراعي خبير في أكاديمية 'نبتة'. 
  مهمتك: تشخيص المشكلات الزراعية وتقديم حلول علمية.
  قاعدتك الذهبية: لا تعطِ حلاً مباشراً أبداً من أول رسالة. 
  عندما يذكر المستخدم مشكلة (مثل اصفرار أوراق، آفات، ضعف إنتاج):
  1. اسأل عن البيانات الأساسية (نوع المحصول، عمره، نوع التربة، نظام الري، والتسميد الأخير).
  2. اسأل سؤالاً أو اثنين بحد أقصى في كل رد لتجنب إرهاق المستخدم.
  3. بعد جمع البيانات، قدم تشخيصاً دقيقاً وبرنامجاً علاجياً واضحاً.
  اللغة: مصرية مهنية بسيطة.`
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
      // فلترة رسالة الترحيب من التاريخ المرسل للـ API لمنع الـ 400
      const chatHistory = messages.filter(msg => msg.content !== WELCOME_MESSAGE);
      
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile", // الموديل اللي طلبته
          messages: [SYSTEM_PROMPT, ...chatHistory, userMessage],
          temperature: 0.7,
          max_tokens: 1024,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Groq Error:", JSON.stringify(errorData, null, 2));
        throw new Error("API Error");
      }

      const data = await response.json();
      if (data.choices?.[0]?.message) {
        setMessages((prev) => [...prev, {
          role: "assistant",
          content: data.choices[0].message.content,
        }]);
      }
    } catch (error) {
      setMessages((prev) => [...prev, { role: "assistant", content: "معلش يا هندسة، حصل دروب في الشبكة. جرب تبعت تاني." }]);
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
            className="absolute bottom-20 left-0 w-[350px] md:w-[400px] h-[550px] bg-[#0a0f0c] border border-emerald-500/20 rounded-[2rem] shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-[#121A15] border-b border-white/5 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                  <Sparkles className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm">مستشار نبتة الذكي</h3>
                  <p className="text-[10px] text-emerald-500">Llama 3.3 Versatile</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-neutral-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-[#0a0f0c] to-[#050806]">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                  <div className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center ${msg.role === "user" ? "bg-blue-600/20 text-blue-400" : "bg-emerald-600/20 text-emerald-400"}`}>
                    {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === "user" ? "bg-blue-600 text-white rounded-tr-none" : "bg-[#121A15] text-neutral-200 border border-white/5 rounded-tl-none"
                  }`}>
                    {msg.content.split('\n').map((line, i) => <span key={i}>{line}<br/></span>)}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-2 items-center p-4">
                  <Loader2 className="w-4 h-4 text-emerald-500 animate-spin" />
                  <span className="text-xs text-neutral-400">بيفكر في حل لمشكلتك...</span>
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
                  onKeyDown={handleKeyPress}
                  placeholder="اوصف المشكلة اللي عندك..."
                  className="w-full bg-[#0a0f0c] border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white text-sm resize-none h-[50px] outline-none focus:border-emerald-500"
                  rows={1}
                />
                <button 
                  onClick={handleSendMessage}
                  disabled={isLoading || !input.trim()}
                  className="absolute left-2 w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center shadow-2xl text-white"
      >
        <MessageCircle className="w-6 h-6" />
      </motion.button>
    </div>
  );
};

export default AiChatWidget;
