// import { Link } from "react-router-dom";
// import { Sprout, Mail, Phone, MapPin } from "lucide-react";

// const Footer = () => {
//   return (
//     <footer className="bg-card border-t border-border mt-auto">
//       <div className="container mx-auto px-4 py-12">
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
//           {/* Brand */}
//           <div className="space-y-4">
//             <Link to="/" className="flex items-center gap-2">
//               <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center">
//                 <Sprout className="w-5 h-5 text-primary" />
//               </div>
//               <span className="font-tajawal font-bold text-lg">
//                 MuAgri<span className="text-primary">Smart</span>
//               </span>
//             </Link>
//             <p className="text-muted-foreground text-sm leading-relaxed">
//               منصة تعليمية متخصصة في العلوم الزراعية، نقدم كورسات احترافية مع أفضل المتخصصين في المجال.
//             </p>
//           </div>

//           {/* Quick Links */}
//           <div>
//             <h4 className="font-bold text-foreground mb-4">روابط سريعة</h4>
//             <ul className="space-y-2">
//               {[
//                 { label: "الكورسات", path: "/courses" },
//                 { label: "التخصصات", path: "/specializations" },
//                 { label: "عن المنصة", path: "/about" },
//                 { label: "تواصل معنا", path: "/contact" },
//               ].map((link) => (
//                 <li key={link.path}>
//                   <Link to={link.path} className="text-sm text-muted-foreground hover:text-primary transition-colors">
//                     {link.label}
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           {/* Support */}
//           <div>
//             <h4 className="font-bold text-foreground mb-4">الدعم</h4>
//             <ul className="space-y-2">
//               {[
//                 { label: "الأسئلة الشائعة", path: "/faq" },
//                 { label: "سياسة الخصوصية", path: "/privacy" },
//                 { label: "شروط الاستخدام", path: "/terms" },
//                 { label: "المساعدة", path: "/help" },
//               ].map((link) => (
//                 <li key={link.path}>
//                   <Link to={link.path} className="text-sm text-muted-foreground hover:text-primary transition-colors">
//                     {link.label}
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           {/* Contact */}
//           <div>
//             <h4 className="font-bold text-foreground mb-4">تواصل معنا</h4>
//             <ul className="space-y-3">
//               <li className="flex items-center gap-2 text-sm text-muted-foreground">
//                 <Mail className="w-4 h-4 text-primary" />
//                 wwwbgaro59@gmail.com
//               </li>
//               <li className="flex items-center gap-2 text-sm text-muted-foreground">
//                 <Phone className="w-4 h-4 text-primary" />
//                 01019715490
//               </li>
//               <li className="flex items-center gap-2 text-sm text-muted-foreground">
//                 <MapPin className="w-4 h-4 text-primary" />
//                 المنصورة - مصر
//               </li>
//             </ul>
//           </div>
//         </div>

//         <div className="border-t border-border mt-8 pt-6 text-center">
//           <p className="text-sm text-muted-foreground">
//             © {new Date().getFullYear()} MuAgriSmart Academy. جميع الحقوق محفوظة.
//           </p>
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;

//v2

import { Link } from "react-router-dom";
import { Sprout, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, ArrowLeft } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative bg-[#050806] border-t border-neutral-800/40 mt-auto overflow-hidden">
      
      {/* إضاءة خلفية خفيفة جداً */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[1px] bg-gradient-to-r from-transparent via-emerald-900/30 to-transparent" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[30vw] h-[30vw] rounded-full bg-emerald-900/5 blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          
          {/* ======================================= */}
          {/* العمود الأول: براند المنصة والنشرة البريدية (ياخد مساحة أكبر) */}
          {/* ======================================= */}
          <div className="lg:col-span-4 space-y-6">
            <Link to="/" className="flex items-center gap-3 w-fit group">
              <div className="w-10 h-10 rounded-xl bg-emerald-900/30 flex items-center justify-center border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-colors">
                <Sprout className="w-6 h-6 text-emerald-500" />
              </div>
              <span className="font-tajawal font-black text-2xl text-white tracking-tight">
                MuAgri<span className="text-emerald-500">Smart</span>
              </span>
            </Link>
            
            <p className="text-neutral-400 text-sm leading-relaxed max-w-sm">
              منصة تعليمية متخصصة في العلوم الزراعية، نقدم كورسات احترافية مع أفضل المتخصصين لنبني معاً مستقبل الزراعة الذكية.
            </p>

            {/* النشرة البريدية */}
            <div className="pt-4 space-y-3">
              <p className="text-sm font-bold text-white">اشترك في النشرة البريدية</p>
              <div className="flex items-center max-w-sm">
                <input 
                  type="email" 
                  placeholder="البريد الإلكتروني..." 
                  className="w-full bg-[#121A15] border border-neutral-800 rounded-r-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
                />
                <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-l-xl transition-colors">
                  <ArrowLeft className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* ======================================= */}
          {/* العمود الثاني: روابط سريعة */}
          {/* ======================================= */}
          <div className="lg:col-span-2 lg:justify-self-center space-y-5">
            <h4 className="font-bold text-white text-lg">روابط سريعة</h4>
            <ul className="space-y-3">
              {[
                { label: "الرئيسية", path: "/" },
                { label: "الكورسات", path: "/courses" },
                { label: "التخصصات", path: "/specializations" },
                { label: "عن المنصة", path: "/about" },
              ].map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="group flex items-center text-sm text-neutral-400 hover:text-emerald-400 transition-colors w-fit">
                    <span className="transition-transform duration-300 group-hover:-translate-x-1.5">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ======================================= */}
          {/* العمود الثالث: الدعم */}
          {/* ======================================= */}
          <div className="lg:col-span-2 lg:justify-self-center space-y-5">
            <h4 className="font-bold text-white text-lg">الدعم والمساعدة</h4>
            <ul className="space-y-3">
              {[
                { label: "الأسئلة الشائعة", path: "/faq" },
                { label: "تواصل معنا", path: "/contact" },
                { label: "سياسة الخصوصية", path: "/privacy" },
                { label: "شروط الاستخدام", path: "/terms" },
              ].map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="group flex items-center text-sm text-neutral-400 hover:text-emerald-400 transition-colors w-fit">
                    <span className="transition-transform duration-300 group-hover:-translate-x-1.5">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ======================================= */}
          {/* العمود الرابع: معلومات التواصل */}
          {/* ======================================= */}
          <div className="lg:col-span-4 space-y-5 lg:justify-self-end">
            <h4 className="font-bold text-white text-lg">تواصل معنا</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-sm text-neutral-400 hover:text-white transition-colors cursor-default">
                <div className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 text-emerald-500" />
                </div>
                wwwbgaro59@gmail.com
              </li>
              <li className="flex items-center gap-3 text-sm text-neutral-400 hover:text-white transition-colors cursor-default">
                <div className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4 text-emerald-500" />
                </div>
                <span dir="ltr">01019715490</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-neutral-400 hover:text-white transition-colors cursor-default">
                <div className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-emerald-500" />
                </div>
                المنصورة - مصر
              </li>
            </ul>
          </div>

        </div>

        {/* ======================================= */}
        {/* الشريط السفلي (حقوق النشر والسوشيال ميديا) */}
        {/* ======================================= */}
        <div className="mt-16 pt-8 border-t border-neutral-800/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-neutral-500 text-center md:text-right">
            © {new Date().getFullYear()} MuAgri<span className="text-emerald-500">Smart</span> Academy. جميع الحقوق محفوظة.
          </p>
          
          {/* أيقونات السوشيال ميديا */}
          <div className="flex items-center gap-3">
            {[
              { icon: Facebook, href: "#" },
              { icon: Twitter, href: "#" },
              { icon: Instagram, href: "#" },
              { icon: Linkedin, href: "#" },
            ].map((social, i) => {
              const Icon = social.icon;
              return (
                <a 
                  key={i}
                  href={social.href} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-[#121A15] border border-neutral-800 flex items-center justify-center text-neutral-400 hover:bg-emerald-600 hover:text-white hover:border-emerald-500 transition-all duration-300 hover:scale-110 active:scale-95"
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
