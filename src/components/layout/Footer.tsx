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

// import { Link } from "react-router-dom";
// import { Sprout, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, ArrowLeft } from "lucide-react";

// const Footer = () => {
//   return (
//     <footer className="relative bg-[#050806] border-t border-neutral-800/40 mt-auto overflow-hidden">
      
//       {/* إضاءة خلفية خفيفة جداً */}
//       <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[1px] bg-gradient-to-r from-transparent via-emerald-900/30 to-transparent" />
//       <div className="absolute bottom-[-10%] left-[-5%] w-[30vw] h-[30vw] rounded-full bg-emerald-900/5 blur-[120px] pointer-events-none" />

//       <div className="container mx-auto px-4 lg:px-8 py-16 relative z-10">
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          
//           {/* ======================================= */}
//           {/* العمود الأول: براند المنصة والنشرة البريدية (ياخد مساحة أكبر) */}
//           {/* ======================================= */}
//           <div className="lg:col-span-4 space-y-6">
//             <Link to="/" className="flex items-center gap-3 w-fit group">
//               <div className="w-10 h-10 rounded-xl bg-emerald-900/30 flex items-center justify-center border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-colors">
//                 <Sprout className="w-6 h-6 text-emerald-500" />
//               </div>
//               <span className="font-tajawal font-black text-2xl text-white tracking-tight">
//                 MuAgri<span className="text-emerald-500">Smart</span>
//               </span>
//             </Link>
            
//             <p className="text-neutral-400 text-sm leading-relaxed max-w-sm">
//               منصة تعليمية متخصصة في العلوم الزراعية، نقدم كورسات احترافية مع أفضل المتخصصين لنبني معاً مستقبل الزراعة الذكية.
//             </p>

//             {/* النشرة البريدية */}
//             <div className="pt-4 space-y-3">
//               <p className="text-sm font-bold text-white">اشترك في النشرة البريدية</p>
//               <div className="flex items-center max-w-sm">
//                 <input 
//                   type="email" 
//                   placeholder="البريد الإلكتروني..." 
//                   className="w-full bg-[#121A15] border border-neutral-800 rounded-r-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
//                 />
//                 <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-l-xl transition-colors">
//                   <ArrowLeft className="w-5 h-5" />
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* ======================================= */}
//           {/* العمود الثاني: روابط سريعة */}
//           {/* ======================================= */}
//           <div className="lg:col-span-2 lg:justify-self-center space-y-5">
//             <h4 className="font-bold text-white text-lg">روابط سريعة</h4>
//             <ul className="space-y-3">
//               {[
//                 { label: "الرئيسية", path: "/" },
//                 { label: "الكورسات", path: "/courses" },
//                 { label: "التخصصات", path: "/specializations" },
//                 { label: "عن المنصة", path: "/about" },
//               ].map((link) => (
//                 <li key={link.path}>
//                   <Link to={link.path} className="group flex items-center text-sm text-neutral-400 hover:text-emerald-400 transition-colors w-fit">
//                     <span className="transition-transform duration-300 group-hover:-translate-x-1.5">{link.label}</span>
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           {/* ======================================= */}
//           {/* العمود الثالث: الدعم */}
//           {/* ======================================= */}
//           <div className="lg:col-span-2 lg:justify-self-center space-y-5">
//             <h4 className="font-bold text-white text-lg">الدعم والمساعدة</h4>
//             <ul className="space-y-3">
//               {[
//                 { label: "الأسئلة الشائعة", path: "/faq" },
//                 { label: "تواصل معنا", path: "/contact" },
//                 { label: "سياسة الخصوصية", path: "/privacy" },
//                 { label: "شروط الاستخدام", path: "/terms" },
//               ].map((link) => (
//                 <li key={link.path}>
//                   <Link to={link.path} className="group flex items-center text-sm text-neutral-400 hover:text-emerald-400 transition-colors w-fit">
//                     <span className="transition-transform duration-300 group-hover:-translate-x-1.5">{link.label}</span>
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           {/* ======================================= */}
//           {/* العمود الرابع: معلومات التواصل */}
//           {/* ======================================= */}
//           <div className="lg:col-span-4 space-y-5 lg:justify-self-end">
//             <h4 className="font-bold text-white text-lg">تواصل معنا</h4>
//             <ul className="space-y-4">
//               <li className="flex items-center gap-3 text-sm text-neutral-400 hover:text-white transition-colors cursor-default">
//                 <div className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center shrink-0">
//                   <Mail className="w-4 h-4 text-emerald-500" />
//                 </div>
//                 wwwbgaro59@gmail.com
//               </li>
//               <li className="flex items-center gap-3 text-sm text-neutral-400 hover:text-white transition-colors cursor-default">
//                 <div className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center shrink-0">
//                   <Phone className="w-4 h-4 text-emerald-500" />
//                 </div>
//                 <span dir="ltr">01019715490</span>
//               </li>
//               <li className="flex items-center gap-3 text-sm text-neutral-400 hover:text-white transition-colors cursor-default">
//                 <div className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center shrink-0">
//                   <MapPin className="w-4 h-4 text-emerald-500" />
//                 </div>
//                 المنصورة - مصر
//               </li>
//             </ul>
//           </div>

//         </div>

//         {/* ======================================= */}
//         {/* الشريط السفلي (حقوق النشر والسوشيال ميديا) */}
//         {/* ======================================= */}
//         <div className="mt-16 pt-8 border-t border-neutral-800/50 flex flex-col md:flex-row items-center justify-between gap-4">
//           <p className="text-sm text-neutral-500 text-center md:text-right">
//             © {new Date().getFullYear()} MuAgri<span className="text-emerald-500">Smart</span> Academy. جميع الحقوق محفوظة.
//           </p>
          
//           {/* أيقونات السوشيال ميديا */}
//           <div className="flex items-center gap-3">
//             {[
//               { icon: Facebook, href: "#" },
//               { icon: Twitter, href: "#" },
//               { icon: Instagram, href: "#" },
//               { icon: Linkedin, href: "#" },
//             ].map((social, i) => {
//               const Icon = social.icon;
//               return (
//                 <a 
//                   key={i}
//                   href={social.href} 
//                   target="_blank" 
//                   rel="noopener noreferrer"
//                   className="w-10 h-10 rounded-full bg-[#121A15] border border-neutral-800 flex items-center justify-center text-neutral-400 hover:bg-emerald-600 hover:text-white hover:border-emerald-500 transition-all duration-300 hover:scale-110 active:scale-95"
//                 >
//                   <Icon className="w-4 h-4" />
//                 </a>
//               );
//             })}
//           </div>
//         </div>

//       </div>
//     </footer>
//   );
// };

// export default Footer;

// v3
// import { Link } from "react-router-dom";
// import { Sprout, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, ArrowLeft, Rocket } from "lucide-react";
// import { Button } from "@/components/ui/button";

// const Footer = () => {
//   return (
//     <footer className="relative bg-[#050806] border-t border-neutral-800/40 mt-auto overflow-hidden">
      
//       {/* إضاءات خلفية (Ambient Glows) */}
//       <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[1px] bg-gradient-to-r from-transparent via-emerald-900/40 to-transparent" />
//       <div className="absolute top-[20%] left-[-5%] w-[40vw] h-[40vw] rounded-full bg-emerald-900/5 blur-[150px] pointer-events-none" />

//       {/* ======================================= */}
//       {/* 1. قسم الدعوة لاتخاذ إجراء (Pre-Footer CTA) */}
//       {/* ======================================= */}
//       <div className="border-b border-neutral-800/50 bg-[#0a0f0c]">
//         <div className="container mx-auto px-4 lg:px-8 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
//           <div className="flex items-center gap-4 text-center md:text-right">
//             <div className="w-14 h-14 rounded-2xl bg-emerald-900/20 border border-emerald-500/20 flex items-center justify-center shrink-0 mx-auto md:mx-0">
//               <Rocket className="w-6 h-6 text-emerald-500" />
//             </div>
//             <div>
//               <h3 className="text-2xl font-black text-white mb-1">هل أنت مستعد لبدء رحلتك؟</h3>
//               <p className="text-neutral-400 text-sm">انضم لآلاف المتدربين وابدأ في تطوير مهاراتك الزراعية اليوم.</p>
//             </div>
//           </div>
          
//           <Link to="/register" className="shrink-0 w-full md:w-auto">
//             <Button 
//               size="lg"
//               className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-500 text-white px-8 h-14 text-base font-bold transition-all rounded-2xl shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)]"
//             >
//               إنشاء حساب مجاني
//             </Button>
//           </Link>
//         </div>
//       </div>

//       <div className="container mx-auto px-4 lg:px-8 pt-16 relative z-10">
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          
//           {/* ======================================= */}
//           {/* العمود الأول: براند المنصة والنشرة البريدية */}
//           {/* ======================================= */}
//           <div className="lg:col-span-5 space-y-8">
//             <Link to="/" className="flex items-center gap-3 w-fit group">
//               <div className="w-12 h-12 rounded-xl bg-emerald-900/30 flex items-center justify-center border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-colors">
//                 <Sprout className="w-7 h-7 text-emerald-500" />
//               </div>
//               <span className="font-tajawal font-black text-3xl text-white tracking-tight">
//                 MuAgri<span className="text-emerald-500">Smart</span>
//               </span>
//             </Link>
            
//             <p className="text-neutral-400 text-base leading-relaxed max-w-md">
//               المنصة العربية الأولى المتخصصة في التعليم الزراعي الحديث. نقدم كورسات معتمدة من نخبة الخبراء لدمج التكنولوجيا بالزراعة المستدامة.
//             </p>

//             {/* النشرة البريدية (Premium Input) */}
//             <div className="space-y-3">
//               <p className="text-sm font-bold text-white uppercase tracking-wider">اشترك ليصلك كل جديد</p>
//               <div className="flex items-center max-w-md relative group">
//                 <input 
//                   type="email" 
//                   placeholder="أدخل بريدك الإلكتروني" 
//                   className="w-full bg-[#121A15] border border-neutral-800 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:border-emerald-500/50 focus:bg-[#16201a] transition-all"
//                 />
//                 <button className="absolute left-2 bg-white hover:bg-emerald-500 text-black hover:text-white w-10 h-10 rounded-xl flex items-center justify-center transition-colors">
//                   <ArrowLeft className="w-5 h-5" />
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* ======================================= */}
//           {/* العمود الثاني: الروابط */}
//           {/* ======================================= */}
//           <div className="lg:col-span-2 lg:col-start-7 space-y-6">
//             <h4 className="font-bold text-white text-lg border-b border-neutral-800 pb-2 inline-block">روابط سريعة</h4>
//             <ul className="space-y-4">
//               {[
//                 { label: "تصفح الكورسات", path: "/courses" },
//                 { label: "التخصصات الزراعية", path: "/specializations" },
//                 { label: "من نحن", path: "/about" },
//                 { label: "المدونة الزراعية", path: "/blog" },
//               ].map((link) => (
//                 <li key={link.path}>
//                   <Link to={link.path} className="group flex items-center text-sm text-neutral-400 hover:text-emerald-400 transition-colors w-fit">
//                     <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/0 group-hover:bg-emerald-500 ml-2 transition-all" />
//                     <span className="transition-transform duration-300 group-hover:-translate-x-1">{link.label}</span>
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           {/* ======================================= */}
//           {/* العمود الثالث: الدعم والقانونية */}
//           {/* ======================================= */}
//           <div className="lg:col-span-2 space-y-6">
//             <h4 className="font-bold text-white text-lg border-b border-neutral-800 pb-2 inline-block">المساعدة</h4>
//             <ul className="space-y-4">
//               {[
//                 { label: "الأسئلة الشائعة", path: "/faq" },
//                 { label: "سياسة الخصوصية", path: "/privacy" },
//                 { label: "شروط الاستخدام", path: "/terms" },
//                 { label: "تواصل معنا", path: "/contact" },
//               ].map((link) => (
//                 <li key={link.path}>
//                   <Link to={link.path} className="group flex items-center text-sm text-neutral-400 hover:text-emerald-400 transition-colors w-fit">
//                     <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/0 group-hover:bg-emerald-500 ml-2 transition-all" />
//                     <span className="transition-transform duration-300 group-hover:-translate-x-1">{link.label}</span>
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           {/* ======================================= */}
//           {/* العمود الرابع: معلومات التواصل */}
//           {/* ======================================= */}
//           <div className="lg:col-span-2 space-y-6">
//             <h4 className="font-bold text-white text-lg border-b border-neutral-800 pb-2 inline-block">تواصل معنا</h4>
//             <ul className="space-y-5">
//               <li className="flex items-start gap-3 text-sm text-neutral-400 transition-colors">
//                 <Mail className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
//                 <span className="hover:text-white cursor-pointer transition-colors">wwwbgaro59@gmail.com</span>
//               </li>
//               <li className="flex items-start gap-3 text-sm text-neutral-400 transition-colors">
//                 <Phone className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
//                 <span dir="ltr" className="hover:text-white cursor-pointer transition-colors">01019715490</span>
//               </li>
//               <li className="flex items-start gap-3 text-sm text-neutral-400 transition-colors">
//                 <MapPin className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
//                 <span>المنصورة - مصر</span>
//               </li>
//             </ul>
//           </div>

//         </div>

//         {/* ======================================= */}
//         {/* الشريط السفلي (حقوق النشر والسوشيال ميديا) */}
//         {/* أضفنا pb-28 للموبايل عشان ترفع المحتوى فوق الـ Bottom Nav، و pb-8 للكمبيوتر */}
//         {/* ======================================= */}
//         <div className="mt-16 pt-8 border-t border-neutral-800/50 flex flex-col md:flex-row items-center justify-between gap-6 pb-28 md:pb-8">
//           <p className="text-sm text-neutral-500 text-center md:text-right font-medium">
//             © {new Date().getFullYear()} MuAgri<span className="text-emerald-500">Smart</span> Academy. جميع الحقوق محفوظة.
//           </p>
          
//           {/* أيقونات السوشيال ميديا */}
//           <div className="flex items-center gap-3">
//             {[
//               { icon: Facebook, href: "#" },
//               { icon: Twitter, href: "#" },
//               { icon: Instagram, href: "#" },
//               { icon: Linkedin, href: "#" },
//             ].map((social, i) => {
//               const Icon = social.icon;
//               return (
//                 <a 
//                   key={i}
//                   href={social.href} 
//                   target="_blank" 
//                   rel="noopener noreferrer"
//                   className="w-10 h-10 rounded-xl bg-[#121A15] border border-neutral-800 flex items-center justify-center text-neutral-400 hover:bg-emerald-600 hover:text-white hover:border-emerald-500 transition-all duration-300 hover:scale-110 hover:-translate-y-1 active:scale-95"
//                 >
//                   <Icon className="w-4 h-4" />
//                 </a>
//               );
//             })}
//           </div>
//         </div>

//       </div>
//     </footer>
//   );
// };

// export default Footer;

// v4
import { Link } from "react-router-dom";
import { Sprout, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, ArrowLeft } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative bg-[#050806] border-t border-neutral-800/40 mt-auto overflow-hidden">
      
      {/* إضاءة خلفية هادئة جداً (Ambient Light) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[1px] bg-gradient-to-r from-transparent via-emerald-900/30 to-transparent" />
      <div className="absolute top-0 right-0 w-[40vw] h-[40vw] rounded-full bg-emerald-900/5 blur-[150px] pointer-events-none" />

      <div className="container mx-auto px-4 lg:px-8 pt-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          
          {/* ======================================= */}
          {/* العمود الأول: براند المنصة والنشرة البريدية (أخذ 4 أعمدة) */}
          {/* ======================================= */}
          <div className="lg:col-span-4 space-y-8">
            <Link to="/" className="flex items-center gap-3 w-fit group">
              <div className="w-10 h-10 rounded-xl bg-[#121A15] border border-neutral-800 flex items-center justify-center group-hover:border-emerald-500/30 group-hover:bg-emerald-950/20 transition-all duration-300">
                <Sprout className="w-5 h-5 text-emerald-500" />
              </div>
              <span className="font-tajawal font-black text-2xl text-white tracking-tight">
                MuAgri<span className="text-emerald-500">Smart</span>
              </span>
            </Link>
            
            <p className="text-neutral-400 text-sm leading-relaxed max-w-sm">
              المنصة العربية الأولى المتخصصة في التعليم الزراعي الحديث. نقدم محتوى أكاديمي وعملي معتمد لدمج التكنولوجيا بالزراعة المستدامة.
            </p>

            {/* النشرة البريدية (تصميم SaaS احترافي) */}
            <div className="space-y-4 pt-2">
              <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest">انضم لنشرتنا البريدية</p>
              <div className="flex items-center relative group max-w-sm bg-[#0a0f0c] border border-neutral-800/80 rounded-2xl p-1 focus-within:border-emerald-500/50 focus-within:ring-1 focus-within:ring-emerald-500/20 transition-all duration-300">
                <input 
                  type="email" 
                  placeholder="أدخل بريدك الإلكتروني..." 
                  className="w-full bg-transparent px-4 py-2.5 text-sm text-white placeholder:text-neutral-600 focus:outline-none"
                />
                <button className="bg-emerald-600 hover:bg-emerald-500 text-white w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all shadow-md">
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* ======================================= */}
          {/* العمود الثاني: الروابط الرئيسية */}
          {/* ======================================= */}
          <div className="lg:col-span-2 lg:col-start-6 space-y-6">
            <h4 className="font-semibold text-white text-base">استكشف</h4>
            <ul className="space-y-4">
              {[
                { label: "تصفح الكورسات", path: "/courses" },
                { label: "التخصصات الزراعية", path: "/specializations" },
                { label: "من نحن", path: "/about" },
                { label: "المقالات والأخبار", path: "/blog" },
              ].map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-sm text-neutral-400 hover:text-emerald-400 transition-colors inline-block hover:-translate-x-1 transform duration-300">
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
            <h4 className="font-semibold text-white text-base">المساعدة</h4>
            <ul className="space-y-4">
              {[
                { label: "الأسئلة الشائعة", path: "/faq" },
                { label: "سياسة الخصوصية", path: "/privacy" },
                { label: "شروط الاستخدام", path: "/terms" },
                { label: "مركز الدعم", path: "/support" },
              ].map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-sm text-neutral-400 hover:text-emerald-400 transition-colors inline-block hover:-translate-x-1 transform duration-300">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ======================================= */}
          {/* العمود الرابع: معلومات التواصل */}
          {/* ======================================= */}
          <div className="lg:col-span-3 space-y-6">
            <h4 className="font-semibold text-white text-base">تواصل معنا</h4>
            <ul className="space-y-5">
              <li className="flex items-center gap-3 text-sm text-neutral-400 group cursor-default">
                <div className="w-8 h-8 rounded-lg bg-[#121A15] border border-neutral-800 flex items-center justify-center shrink-0 group-hover:border-emerald-500/30 transition-colors">
                  <Mail className="w-3.5 h-3.5 text-emerald-500" />
                </div>
                <span className="group-hover:text-white transition-colors">wwwbgaro59@gmail.com</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-neutral-400 group cursor-default">
                <div className="w-8 h-8 rounded-lg bg-[#121A15] border border-neutral-800 flex items-center justify-center shrink-0 group-hover:border-emerald-500/30 transition-colors">
                  <Phone className="w-3.5 h-3.5 text-emerald-500" />
                </div>
                <span dir="ltr" className="group-hover:text-white transition-colors">01019715490</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-neutral-400 group cursor-default">
                <div className="w-8 h-8 rounded-lg bg-[#121A15] border border-neutral-800 flex items-center justify-center shrink-0 group-hover:border-emerald-500/30 transition-colors">
                  <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                </div>
                <span className="group-hover:text-white transition-colors">المنصورة - مصر</span>
              </li>
            </ul>
          </div>

        </div>

        {/* ======================================= */}
        {/* الشريط السفلي (حقوق النشر والسوشيال ميديا) */}
        {/* pb-28 للموبايل لمنع التداخل مع الشريط العائم */}
        {/* ======================================= */}
        <div className="pt-8 border-t border-neutral-800/40 flex flex-col md:flex-row items-center justify-between gap-6 pb-28 md:pb-8">
          
          <div className="flex items-center gap-2 text-sm text-neutral-500 font-medium">
            <span>© {new Date().getFullYear()} MuAgriSmart.</span>
            <span className="hidden sm:inline">جميع الحقوق محفوظة.</span>
          </div>
          
          {/* أيقونات السوشيال ميديا (تصميم Minimal) */}
          <div className="flex items-center gap-2">
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
                  className="w-10 h-10 rounded-full flex items-center justify-center text-neutral-500 hover:text-white hover:bg-[#121A15] transition-all duration-300"
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
