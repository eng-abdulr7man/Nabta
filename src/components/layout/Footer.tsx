import { Link } from "react-router-dom";
import { Sprout, Mail, Phone, MapPin, Facebook, Instagram, Linkedin, Send } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative bg-[#050806] border-t border-neutral-800/40 mt-auto overflow-hidden font-tajawal">
      
      {/* إضاءة خلفية هادئة */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[1px] bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
      <div className="absolute top-0 right-0 w-[40vw] h-[40vw] rounded-full bg-emerald-900/5 blur-[150px] pointer-events-none" />
      
      <div className="container mx-auto px-4 lg:px-8 pt-16 md:pt-20 relative z-10">
        
        {/* ======================================= */}
        {/* التوزيعة الرئيسية (4 أعمدة متساوية) */}
        {/* ======================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-8 mb-16">
          
          {/* العمود الأول: براند المنصة + السوشيال ميديا */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-3 w-fit group">
              <div className="w-12 h-12 rounded-xl bg-[#121A15] border border-neutral-800 flex items-center justify-center group-hover:border-emerald-500/30 transition-all duration-300 shadow-lg">
                <Sprout className="w-6 h-6 text-emerald-500" />
              </div>
              <span className="font-black text-3xl text-white tracking-tight">نـَـبْـتـَـة</span>
            </Link>
            
            <p className="text-neutral-400 text-sm leading-relaxed font-medium">
              المنصة العربية الأولى المتخصصة في التعليم الزراعي الحديث. نقدم محتوى أكاديمي وعملي معتمد لدمج التكنولوجيا بالزراعة المستدامة.
            </p>

            {/* 🌟 السوشيال ميديا هنا مكانها أشيك وأرتب 🌟 */}
            <div className="flex items-center gap-3 pt-2">
              {[
                { icon: Facebook, href: "https://www.facebook.com/share/18Dbz2ppwn/" },
                { icon: Send, href: "https://t.me/eng_abdulr7man" },
                { icon: Instagram, href: "https://www.instagram.com/eng_abdulr7man/" },
                { icon: Linkedin, href: "https://www.linkedin.com/in/eng_abdulr7man" },
              ].map((social, i) => {
                const Icon = social.icon;
                return (
                  <a 
                    key={i}
                    href={social.href} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-[#121A15] border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-emerald-400 hover:border-emerald-500/30 hover:bg-emerald-900/10 transition-all duration-300"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div> 

          {/* العمود الثاني: الروابط الرئيسية */}
          <div className="space-y-6 lg:px-4">
            <h4 className="font-bold text-white text-lg">استكشف</h4>
            <ul className="space-y-4">
              {[
                { label: "تصفح الكورسات", path: "/courses" },
                { label: "سوق نبتة", path: "/marketplace" },
                { label: "التخصصات الزراعية", path: "/specializations" },
                { label: "المقالات والأخبار", path: "/articles" },
              ].map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-sm font-medium text-neutral-400 hover:text-emerald-400 transition-colors inline-flex items-center gap-2 hover:-translate-x-2 transform duration-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-neutral-700 transition-colors duration-300" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* العمود الثالث: الدعم */}
          <div className="space-y-6">
            <h4 className="font-bold text-white text-lg">المساعدة</h4>
            <ul className="space-y-4">
              {[
                { label: "من نحن", path: "/about" },
                { label: "الأسئلة الشائعة", path: "/faq" },
                { label: "سياسة الخصوصية", path: "/privacy" },
                { label: "شروط الاستخدام", path: "/terms" },
              ].map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-sm font-medium text-neutral-400 hover:text-emerald-400 transition-colors inline-flex items-center gap-2 hover:-translate-x-2 transform duration-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-neutral-700 transition-colors duration-300" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* العمود الرابع: معلومات التواصل */}
          <div className="space-y-6">
            <h4 className="font-bold text-white text-lg">تواصل معنا</h4>
            <ul className="space-y-5">
              <li className="flex items-center gap-4 text-sm text-neutral-400 group cursor-default">
                <div className="w-10 h-10 rounded-xl bg-[#121A15] border border-neutral-800 flex items-center justify-center shrink-0 group-hover:border-emerald-500/50 transition-all duration-300">
                  <Mail className="w-4 h-4 text-emerald-500" />
                </div>
                <span className="group-hover:text-white font-medium transition-colors">wwwbgaro59@gmail.com</span>
              </li>
              <li className="flex items-center gap-4 text-sm text-neutral-400 group cursor-default">
                <div className="w-10 h-10 rounded-xl bg-[#121A15] border border-neutral-800 flex items-center justify-center shrink-0 group-hover:border-emerald-500/50 transition-all duration-300">
                  <Phone className="w-4 h-4 text-emerald-500" />
                </div>
                <span dir="ltr" className="group-hover:text-white font-medium transition-colors text-right">0101 971 5490</span>
              </li>
              <li className="flex items-center gap-4 text-sm text-neutral-400 group cursor-default">
                <div className="w-10 h-10 rounded-xl bg-[#121A15] border border-neutral-800 flex items-center justify-center shrink-0 group-hover:border-emerald-500/50 transition-all duration-300">
                  <MapPin className="w-4 h-4 text-emerald-500" />
                </div>
                <span className="group-hover:text-white font-medium transition-colors">المنصورة - مصر</span>
              </li>
            </ul>
          </div>

        </div>

        {/* ======================================= */}
        {/* الشريط السفلي (حقوق النشر في المنتصف) */}
        {/* ======================================= */}
        <div className="pt-8 border-t border-neutral-800/40 flex flex-col items-center justify-center gap-3 pb-32 md:pb-8 text-center">
          <p className="text-sm text-neutral-500 font-medium">
            © {new Date().getFullYear()} <span className="text-emerald-500 font-bold">نـَـبْـتـَـة</span>. جميع الحقوق محفوظة.
          </p>
          <p className="text-sm text-neutral-500 font-medium">
            تطوير بـ بواسطة <a href="https://www.instagram.com/eng_abdulr7man/" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-emerald-400 transition-colors font-bold border-b border-emerald-500/0 hover:border-emerald-400 pb-0.5">3bdulr7man</a>
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
