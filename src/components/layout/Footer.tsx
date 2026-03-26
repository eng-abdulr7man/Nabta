import { Link } from "react-router-dom";
import { Sprout, Mail, Phone, MapPin, Facebook, Instagram, Linkedin, Send } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative bg-[#050806] border-t border-neutral-800/40 mt-auto overflow-hidden">
      
      {/* إضاءة خلفية هادئة جداً (Ambient Light) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[1px] bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
      <div className="absolute top-0 right-0 w-[40vw] h-[40vw] rounded-full bg-emerald-900/5 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[30vw] h-[30vw] rounded-full bg-emerald-900/5 blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 lg:px-8 pt-20 relative z-10 font-tajawal">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          
          {/* ======================================= */}
          {/* العمود الأول: براند المنصة */}
          {/* ======================================= */}
          <div className="lg:col-span-4 space-y-6">
            <Link to="/" className="flex items-center gap-3 w-fit group">
              <div className="w-12 h-12 rounded-xl bg-[#121A15] border border-neutral-800 flex items-center justify-center group-hover:border-emerald-500/30 group-hover:bg-emerald-950/20 transition-all duration-300 shadow-lg group-hover:shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                <Sprout className="w-6 h-6 text-emerald-500" />
              </div>
              <span className="font-black text-3xl text-white tracking-tight">
                  نـَـبْـتـَـة
              </span>
            </Link>
            
            <p className="text-neutral-400 text-sm leading-relaxed max-w-sm font-medium">
              المنصة العربية الأولى المتخصصة في التعليم الزراعي الحديث. نقدم محتوى أكاديمي وعملي معتمد لدمج التكنولوجيا بالزراعة المستدامة.
            </p>
          </div> 

          {/* ======================================= */}
          {/* العمود الثاني: الروابط الرئيسية */}
          {/* ======================================= */}
          <div className="lg:col-span-2 space-y-6">
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
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/0 transition-colors duration-300" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ======================================= */}
          {/* العمود الثالث: الدعم والقانونية */}
          {/* ======================================= */}
          <div className="lg:col-span-2 space-y-6">
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
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/0 transition-colors duration-300" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ======================================= */}
          {/* العمود الرابع: معلومات التواصل */}
          {/* ======================================= */}
          <div className="lg:col-span-4 lg:pl-8 space-y-6">
            <h4 className="font-bold text-white text-lg">تواصل معنا</h4>
            <ul className="space-y-5">
              <li className="flex items-center gap-4 text-sm text-neutral-400 group cursor-default">
                <div className="w-10 h-10 rounded-xl bg-[#121A15] border border-neutral-800 flex items-center justify-center shrink-0 group-hover:border-emerald-500/50 group-hover:bg-emerald-900/20 group-hover:shadow-[0_0_15px_rgba(16,185,129,0.15)] transition-all duration-300">
                  <Mail className="w-4 h-4 text-emerald-500" />
                </div>
                <span className="group-hover:text-white font-medium transition-colors">wwwbgaro59@gmail.com</span>
              </li>
              <li className="flex items-center gap-4 text-sm text-neutral-400 group cursor-default">
                <div className="w-10 h-10 rounded-xl bg-[#121A15] border border-neutral-800 flex items-center justify-center shrink-0 group-hover:border-emerald-500/50 group-hover:bg-emerald-900/20 group-hover:shadow-[0_0_15px_rgba(16,185,129,0.15)] transition-all duration-300">
                  <Phone className="w-4 h-4 text-emerald-500" />
                </div>
                <span dir="ltr" className="group-hover:text-white font-medium transition-colors text-right">010 1971 5490</span>
              </li>
              <li className="flex items-center gap-4 text-sm text-neutral-400 group cursor-default">
                <div className="w-10 h-10 rounded-xl bg-[#121A15] border border-neutral-800 flex items-center justify-center shrink-0 group-hover:border-emerald-500/50 group-hover:bg-emerald-900/20 group-hover:shadow-[0_0_15px_rgba(16,185,129,0.15)] transition-all duration-300">
                  <MapPin className="w-4 h-4 text-emerald-500" />
                </div>
                <span className="group-hover:text-white font-medium transition-colors">المنصورة - جمهورية مصر العربية</span>
              </li>
            </ul>
          </div>

        </div>

        {/* ======================================= */}
        {/* الشريط السفلي (حقوق النشر وتطوير المطور) */}
        {/* pb-40 للموبايل لمنع التداخل تماماً مع زر المساعد الذكي */}
        {/* ======================================= */}
        <div className="pt-8 border-t border-neutral-800/40 flex flex-col md:flex-row items-center justify-between gap-6 pb-40 md:pb-8">
          
          <div className="flex flex-col sm:flex-row items-center gap-2 text-sm text-neutral-500 font-medium text-center">
            <span>© {new Date().getFullYear()} <span className="text-emerald-500 font-bold">نـَـبْـتـَـة</span>. جميع الحقوق محفوظة.</span>
            <span className="hidden sm:block w-1 h-1 rounded-full bg-neutral-700"></span>
            
            {/* 🌟 كريديت المطور (تواصل المطور) 🌟 */}
            <span className="mt-1 sm:mt-0">
              تطوير بـ 💚 بواسطة <a href="https://www.instagram.com/eng_abdulr7man/" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-emerald-400 transition-colors font-bold border-b border-emerald-500/0 hover:border-emerald-400 pb-0.5">م. عبدالرحمن</a>
            </span>
          </div>
          
          {/* أيقونات السوشيال ميديا للمنصة */}
          <div className="flex items-center gap-3">
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
                  className="w-10 h-10 rounded-full bg-[#121A15] border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-emerald-400 hover:border-emerald-500/30 hover:bg-emerald-900/10 hover:shadow-[0_0_15px_rgba(16,185,129,0.15)] hover:-translate-y-1 transition-all duration-300"
                >
                  <Icon className="w-4 h-4" />
                </a>
              );
            })}
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
