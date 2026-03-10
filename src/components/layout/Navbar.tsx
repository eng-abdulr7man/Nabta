// import { Link, useLocation } from "react-router-dom";
// import { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { Menu, X, Sprout, LogIn, Search, User, LogOut, LayoutDashboard, BookOpen, Heart } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { useAuth } from "@/contexts/AuthContext";

// const navLinks = [
//   { label: "الرئيسية", path: "/" },
//   { label: "الكورسات", path: "/courses" },
//   { label: "التخصصات", path: "/specializations" },
//   { label: "تواصل معنا", path: "/contact" },
// ];

// const Navbar = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const location = useLocation();
//   const { user, profile, signOut, isAdmin } = useAuth();

//   return (
//     <nav className="fixed top-0 right-0 left-0 z-50 glass-card border-b border-border/50 backdrop-blur-xl bg-background/80">
//       <div className="container mx-auto px-4">
//         <div className="flex items-center justify-between h-16">
//           {/* Logo */}
//           <Link to="/" className="flex items-center gap-2">
//             <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center">
//               <Sprout className="w-5 h-5 text-primary" />
//             </div>
//             <span className="font-tajawal font-bold text-lg text-foreground">
//               {/* MuAgri<span className="text-primary">Smart</span> */}
//              <span style={{ fontFamily: "Amiri, serif", fontSize: "32px", lineHeight: 1.8 }}>
//   نـَـبْـتـَـة
// </span>
//             </span>
//           </Link>

//           {/* Desktop Nav */}
//           <div className="hidden md:flex items-center gap-1">
//             {navLinks.map((link) => (
//               <Link
//                 key={link.path}
//                 to={link.path}
//                 className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
//                   location.pathname === link.path
//                     ? "text-primary bg-primary/10"
//                     : "text-muted-foreground hover:text-foreground hover:bg-secondary"
//                 }`}
//               >
//                 {link.label}
//               </Link>
//             ))}
//           </div>

//           {/* Actions */}
//           <div className="hidden md:flex items-center gap-2">
//             <Button variant="ghost" size="icon" className="text-muted-foreground">
//               <Search className="w-4 h-4" />
//             </Button>
//             {user ? (
//               <>
//                 {isAdmin && (
//                   <Link to="/admin">
//                     <Button variant="ghost" size="sm" className="text-muted-foreground gap-1">
//                       <LayoutDashboard className="w-4 h-4" />
//                       لوحة التحكم
//                     </Button>
//                   </Link>
//                 )}
//                 <Link to="/my-courses">
//                   <Button variant="ghost" size="sm" className="text-muted-foreground gap-1">
//                     <BookOpen className="w-4 h-4" />
//                     كورساتي
//                   </Button>
//                 </Link>
//                 <Link to="/favorites">
//                   <Button variant="ghost" size="sm" className="text-muted-foreground gap-1">
//                     <Heart className="w-4 h-4" />
//                     المفضلة
//                   </Button>
//                 </Link>
//                 <Link to="/profile">
//                   <Button variant="ghost" size="sm" className="text-muted-foreground gap-1">
//                     <User className="w-4 h-4" />
//                     {"حسابي"}
//                     {/* profile?.full_name || */}
//                   </Button>
//                 </Link>
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   className="text-muted-foreground"
//                   onClick={() => signOut()}
//                 >
//                   <LogOut className="w-4 h-4" />
//                 </Button>
//               </>
//             ) : (
//               <>
//                 <Link to="/login">
//                   <Button variant="ghost" size="sm" className="text-muted-foreground">
//                     <LogIn className="w-4 h-4 ml-1" />
//                     دخول
//                   </Button>
//                 </Link>
//                 {/* <Link to="/register">
//                   <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
//                     إنشاء حساب
//                   </Button>
//                 </Link> */}
//               </>
//             )}
//           </div>

//           {/* Mobile toggle */}
//           <button
//             className="md:hidden text-foreground"
//             onClick={() => setIsOpen(!isOpen)}
//           >
//             {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
//           </button>
//         </div>
//       </div>

//       {/* Mobile Menu */}
//       <AnimatePresence>
//         {isOpen && (
//           <motion.div
//             initial={{ height: 0, opacity: 0 }}
//             animate={{ height: "auto", opacity: 1 }}
//             exit={{ height: 0, opacity: 0 }}
//             className="md:hidden overflow-hidden bg-background/95 backdrop-blur-xl border-b border-border"
//           >
//             <div className="px-4 py-4 space-y-2">
//               {navLinks.map((link) => (
//                 <Link
//                   key={link.path}
//                   to={link.path}
//                   onClick={() => setIsOpen(false)}
//                   className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
//                     location.pathname === link.path
//                       ? "text-primary bg-primary/10"
//                       : "text-muted-foreground hover:text-foreground hover:bg-secondary"
//                   }`}
//                 >
//                   {link.label}
//                 </Link>
//               ))}
//               <div className="flex gap-2 pt-2">
//                 {user ? (
//                   <>
//                     <Link to="/profile" className="flex-1" onClick={() => setIsOpen(false)}>
//                       <Button variant="outline" className="w-full border-border text-foreground">حسابي</Button>
//                     </Link>
//                     <Button
//                       variant="outline"
//                       className="border-border text-foreground"
//                       onClick={() => { signOut(); setIsOpen(false); }}
//                     >
//                       <LogOut className="w-4 h-4" />
//                     </Button>
//                   </>
//                 ) : (
//                   <>
//                     <Link to="/login" className="flex-1" onClick={() => setIsOpen(false)}>
//                       <Button variant="outline" className="w-full border-border text-foreground">دخول</Button>
//                     </Link>
//                     <Link to="/register" className="flex-1" onClick={() => setIsOpen(false)}>
//                       <Button className="w-full bg-primary text-primary-foreground">إنشاء حساب</Button>
//                     </Link>
//                   </>
//                 )}
//               </div>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </nav>
//   );
// };

// export default Navbar;

//v2
// import { Link, useLocation } from "react-router-dom";
// import { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { Menu, X, Sprout, LogIn, Search, LogOut, LayoutDashboard, BookOpen, Heart, User } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { useAuth } from "@/contexts/AuthContext";

// const navLinks = [
//   { label: "الرئيسية", path: "/" },
//   { label: "الكورسات", path: "/courses" },
//   { label: "التخصصات", path: "/specializations" },
//   { label: "تواصل معنا", path: "/contact" },
// ];

// const Navbar = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const location = useLocation();
//   const { user, profile, signOut, isAdmin } = useAuth();

//   // دالة صغيرة عشان لو مفيش صورة، نعرض أول حرف
//   const getInitial = () => {
//     if (profile?.full_name) return profile.full_name.charAt(0);
//     if (user?.email) return user.email.charAt(0).toUpperCase();
//     return "U";
//   };

//   return (
//     <nav className="fixed top-0 right-0 left-0 z-50 bg-[#050806]/80 backdrop-blur-xl border-b border-neutral-800/60 shadow-sm font-tajawal">
//       <div className="container mx-auto px-4">
//         <div className="flex items-center justify-between h-20">
          
//           {/* Logo */}
//           <Link to="/" className="flex items-center gap-3 group">
//             <div className="w-10 h-10 rounded-xl bg-[#121A15] border border-neutral-800 flex items-center justify-center group-hover:border-emerald-500/30 group-hover:bg-emerald-950/20 transition-all duration-300">
//               <Sprout className="w-5 h-5 text-emerald-500" />
//             </div>
//             <span style={{ fontFamily: "Amiri, serif", fontSize: "32px", lineHeight: 1.8 }} className="text-white mt-1">
//               نـَـبْـتـَـة
//             </span>
//           </Link>

//           {/* Desktop Nav */}
//           <div className="hidden lg:flex items-center gap-2">
//             {navLinks.map((link) => (
//               <Link
//                 key={link.path}
//                 to={link.path}
//                 className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${
//                   location.pathname === link.path
//                     ? "bg-emerald-600/10 text-emerald-400 border border-emerald-500/20"
//                     : "text-neutral-400 hover:text-white hover:bg-[#121A15] border border-transparent"
//                 }`}
//               >
//                 {link.label}
//               </Link>
//             ))}
//           </div>

//           {/* Actions (Desktop) */}
//           <div className="hidden lg:flex items-center gap-3">
//             <Button variant="ghost" size="icon" className="text-neutral-400 hover:text-white hover:bg-[#121A15] rounded-xl h-10 w-10 border border-transparent hover:border-neutral-800">
//               <Search className="w-4 h-4" />
//             </Button>
            
//             {user ? (
//               <div className="flex items-center gap-2 border-r border-neutral-800/60 pr-3">
                
//                 {isAdmin && (
//                   <Link to="/admin">
//                     <Button variant="ghost" size="sm" className="text-neutral-400 hover:text-emerald-400 hover:bg-emerald-900/10 gap-1.5 rounded-xl h-10 font-bold border border-transparent hover:border-emerald-500/20 transition-all">
//                       <LayoutDashboard className="w-4 h-4" />
//                       لوحة التحكم
//                     </Button>
//                   </Link>
//                 )}
                
//                 <Link to="/my-courses">
//                   <Button variant="ghost" size="sm" className="text-neutral-400 hover:text-emerald-400 hover:bg-emerald-900/10 gap-1.5 rounded-xl h-10 font-bold border border-transparent hover:border-emerald-500/20 transition-all">
//                     <BookOpen className="w-4 h-4" />
//                     كورساتي
//                   </Button>
//                 </Link>
                
//                 <Link to="/favorites">
//                   <Button variant="ghost" size="sm" className="text-neutral-400 hover:text-emerald-400 hover:bg-emerald-900/10 gap-1.5 rounded-xl h-10 font-bold border border-transparent hover:border-emerald-500/20 transition-all">
//                     <Heart className="w-4 h-4" />
//                     المفضلة
//                   </Button>
//                 </Link>
                
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   className="text-neutral-400 hover:text-red-400 hover:bg-red-900/10 rounded-xl h-10 w-10 border border-transparent hover:border-red-500/20 transition-all ml-1"
//                   onClick={() => signOut()}
//                   title="تسجيل الخروج"
//                 >
//                   <LogOut className="w-4 h-4" />
//                 </Button>

//                 {/* ========================================== */}
//                 {/* User Avatar (Profile Link) */}
//                 {/* ========================================== */}
//                 <Link to="/profile" className="ml-2 group">
//                   <div className="w-10 h-10 rounded-full bg-[#121A15] flex items-center justify-center overflow-hidden border-2 border-neutral-800 group-hover:border-emerald-500/50 transition-colors shadow-sm">
//                     {profile?.avatar_url ? (
//                       <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
//                     ) : (
//                       <span className="text-sm font-bold text-emerald-500">
//                         {getInitial()}
//                       </span>
//                     )}
//                   </div>
//                 </Link>

//               </div>
//             ) : (
//               <div className="flex items-center gap-3">
//                 <Link to="/login">
//                   <Button variant="ghost" className="text-neutral-300 hover:text-white hover:bg-[#121A15] gap-2 rounded-xl h-11 px-5 font-bold transition-all">
//                     <LogIn className="w-4 h-4" />
//                     تسجيل الدخول
//                   </Button>
//                 </Link>
//                 <Link to="/register">
//                   <Button className="bg-emerald-600 hover:bg-emerald-500 text-white h-11 px-6 font-bold rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.2)] transition-all">
//                     إنشاء حساب
//                   </Button>
//                 </Link>
//               </div>
//             )}
//           </div>

//           {/* Mobile toggle */}
//           <button
//             className="lg:hidden text-neutral-300 hover:text-white p-2"
//             onClick={() => setIsOpen(!isOpen)}
//           >
//             {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
//           </button>
//         </div>
//       </div>

//       {/* Mobile Menu */}
//       <AnimatePresence>
//         {isOpen && (
//           <motion.div
//             initial={{ height: 0, opacity: 0 }}
//             animate={{ height: "auto", opacity: 1 }}
//             exit={{ height: 0, opacity: 0 }}
//             className="lg:hidden overflow-hidden bg-[#0a0f0c] border-b border-neutral-800/60 shadow-xl"
//           >
//             <div className="px-4 py-6 space-y-2">
              
//               {/* User Info (Mobile Only) */}
//               {user && (
//                 <div className="flex items-center gap-3 p-4 mb-4 rounded-xl bg-[#121A15] border border-neutral-800">
//                   <div className="w-12 h-12 rounded-full bg-[#0a0f0c] flex items-center justify-center overflow-hidden border border-neutral-700 shrink-0">
//                     {profile?.avatar_url ? (
//                       <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
//                     ) : (
//                       <span className="text-base font-bold text-emerald-500">
//                         {getInitial()}
//                       </span>
//                     )}
//                   </div>
//                   <div className="flex flex-col min-w-0">
//                     <span className="font-bold text-white text-sm truncate">{profile?.full_name || "مستخدم نبتة"}</span>
//                     <span className="text-xs text-neutral-400 truncate" dir="ltr">{user.email}</span>
//                   </div>
//                 </div>
//               )}

//               {/* Links */}
//               {navLinks.map((link) => (
//                 <Link
//                   key={link.path}
//                   to={link.path}
//                   onClick={() => setIsOpen(false)}
//                   className={`block px-5 py-4 rounded-xl text-sm font-bold transition-colors ${
//                     location.pathname === link.path
//                       ? "bg-emerald-600/10 text-emerald-400 border border-emerald-500/20"
//                       : "text-neutral-400 hover:text-white hover:bg-[#121A15] border border-transparent"
//                   }`}
//                 >
//                   {link.label}
//                 </Link>
//               ))}
              
//               <div className="pt-4 mt-2 border-t border-neutral-800/60 flex flex-col gap-3">
//                 {user ? (
//                   <>
//                     {isAdmin && (
//                        <Link to="/admin" onClick={() => setIsOpen(false)}>
//                          <Button variant="outline" className="w-full justify-start border-neutral-800 bg-[#121A15] text-neutral-300 hover:text-white h-12 rounded-xl font-bold gap-3">
//                            <LayoutDashboard className="w-4 h-4 text-emerald-500" />
//                            لوحة التحكم
//                          </Button>
//                        </Link>
//                     )}
//                     <div className="grid grid-cols-2 gap-3">
//                       <Link to="/my-courses" onClick={() => setIsOpen(false)}>
//                         <Button variant="outline" className="w-full border-neutral-800 bg-[#121A15] text-neutral-300 hover:text-white h-12 rounded-xl font-bold gap-2">
//                           <BookOpen className="w-4 h-4 text-emerald-500" />
//                           كورساتي
//                         </Button>
//                       </Link>
//                       <Link to="/favorites" onClick={() => setIsOpen(false)}>
//                         <Button variant="outline" className="w-full border-neutral-800 bg-[#121A15] text-neutral-300 hover:text-white h-12 rounded-xl font-bold gap-2">
//                           <Heart className="w-4 h-4 text-emerald-500" />
//                           المفضلة
//                         </Button>
//                       </Link>
//                     </div>
                    
//                     <Link to="/profile" onClick={() => setIsOpen(false)}>
//                       <Button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white h-12 rounded-xl font-bold gap-2 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
//                         <User className="w-4 h-4" />
//                         إعدادات الحساب
//                       </Button>
//                     </Link>

//                     <Button
//                       variant="outline"
//                       className="w-full border-red-500/20 bg-red-500/5 text-red-500 hover:bg-red-500/10 h-12 rounded-xl font-bold gap-2"
//                       onClick={() => { signOut(); setIsOpen(false); }}
//                     >
//                       <LogOut className="w-4 h-4" />
//                       تسجيل الخروج
//                     </Button>
//                   </>
//                 ) : (
//                   <div className="grid grid-cols-2 gap-3">
//                     <Link to="/login" onClick={() => setIsOpen(false)}>
//                       <Button variant="outline" className="w-full border-neutral-800 bg-[#121A15] text-neutral-300 hover:text-white h-12 rounded-xl font-bold gap-2">
//                         <LogIn className="w-4 h-4" />
//                         دخول
//                       </Button>
//                     </Link>
//                     <Link to="/register" onClick={() => setIsOpen(false)}>
//                       <Button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white h-12 rounded-xl font-bold shadow-[0_0_15px_rgba(16,185,129,0.2)]">
//                         إنشاء حساب
//                       </Button>
//                     </Link>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </nav>
//   );
// };

// export default Navbar;

//v3
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { Menu, X, Sprout, LogIn, Search, LogOut, LayoutDashboard, BookOpen, Heart } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { useAuth } from "@/contexts/AuthContext";

// const navLinks = [
//   { label: "الرئيسية", path: "/" },
//   { label: "الكورسات", path: "/courses" },
//   { label: "التخصصات", path: "/specializations" },
//   { label: "تواصل معنا", path: "/contact" },
// ];

// const Navbar = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [isSearchOpen, setIsSearchOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { user, profile, signOut, isAdmin } = useAuth();

//   // دالة البحث للتوجه لصفحة الكورسات مع الكلمة المطلوبة
//   const handleSearch = (e) => {
//     e.preventDefault();
//     if (searchQuery.trim()) {
//       navigate(`/courses?q=${encodeURIComponent(searchQuery)}`);
//       setSearchQuery("");
//       setIsSearchOpen(false);
//       setIsOpen(false); // غلق قائمة الموبايل لو كانت مفتوحة
//     }
//   };

//   const getInitial = () => {
//     if (profile?.full_name) return profile.full_name.charAt(0);
//     if (user?.email) return user.email.charAt(0).toUpperCase();
//     return "U";
//   };

//   return (
//     <nav className="fixed top-0 right-0 left-0 z-50 bg-[#050806]/80 backdrop-blur-xl border-b border-neutral-800/60 shadow-sm font-tajawal">
//       <div className="container mx-auto px-4">
//         <div className="flex items-center justify-between h-20">
          
//           {/* Logo */}
//           <Link to="/" className="flex items-center gap-3 group">
//             <div className="w-10 h-10 rounded-xl bg-[#121A15] border border-neutral-800 flex items-center justify-center group-hover:border-emerald-500/30 group-hover:bg-emerald-950/20 transition-all duration-300">
//               <Sprout className="w-5 h-5 text-emerald-500" />
//             </div>
//             <span style={{ fontFamily: "Amiri, serif", fontSize: "32px", lineHeight: 1.8 }} className="text-white mt-1">
//               نـَـبْـتـَـة
//             </span>
//           </Link>

//           {/* Desktop Nav */}
//           <div className="hidden lg:flex items-center gap-2">
//             {navLinks.map((link) => (
//               <Link
//                 key={link.path}
//                 to={link.path}
//                 className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${
//                   location.pathname === link.path
//                     ? "bg-emerald-600/10 text-emerald-400 border border-emerald-500/20"
//                     : "text-neutral-400 hover:text-white hover:bg-[#121A15] border border-transparent"
//                 }`}
//               >
//                 {link.label}
//               </Link>
//             ))}
//           </div>

//           {/* Actions (Desktop) */}
//           <div className="hidden lg:flex items-center gap-3">
            
//             {/* ======================================= */}
//             {/* حقل البحث المتمدد (Expandable Search) */}
//             {/* ======================================= */}
//             <motion.div
//               animate={{ width: isSearchOpen ? 260 : 40 }}
//               transition={{ duration: 0.3, ease: "easeInOut" }}
//               className={`relative flex items-center h-10 rounded-xl overflow-hidden transition-colors ${
//                 isSearchOpen
//                   ? "bg-[#121A15] border border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
//                   : "bg-transparent border border-transparent hover:border-neutral-800 hover:bg-[#121A15]"
//               }`}
//             >
//               {!isSearchOpen ? (
//                 <button
//                   onClick={() => setIsSearchOpen(true)}
//                   className="w-10 h-10 flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
//                 >
//                   <Search className="w-4 h-4" />
//                 </button>
//               ) : (
//                 <form onSubmit={handleSearch} className="flex items-center w-full h-full px-3">
//                   <Search className="w-4 h-4 text-emerald-500 shrink-0" />
//                   <input
//                     type="text"
//                     autoFocus
//                     placeholder="ابحث عن كورس..."
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                     className="flex-1 h-full bg-transparent border-none text-white text-sm px-2 focus:outline-none w-full"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => { setIsSearchOpen(false); setSearchQuery(""); }}
//                     className="w-6 h-6 flex items-center justify-center text-neutral-500 hover:text-red-400 shrink-0 rounded-md hover:bg-red-500/10 transition-colors"
//                   >
//                     <X className="w-3.5 h-3.5" />
//                   </button>
//                 </form>
//               )}
//             </motion.div>
            
//             {user ? (
//               <div className="flex items-center gap-2 border-r border-neutral-800/60 pr-3">
//                 {isAdmin && (
//                   <Link to="/admin">
//                     <Button variant="ghost" size="sm" className="text-neutral-400 hover:text-emerald-400 hover:bg-emerald-900/10 gap-1.5 rounded-xl h-10 font-bold border border-transparent hover:border-emerald-500/20 transition-all">
//                       <LayoutDashboard className="w-4 h-4" />
//                       لوحة التحكم
//                     </Button>
//                   </Link>
//                 )}
                
//                 <Link to="/my-courses">
//                   <Button variant="ghost" size="sm" className="text-neutral-400 hover:text-emerald-400 hover:bg-emerald-900/10 gap-1.5 rounded-xl h-10 font-bold border border-transparent hover:border-emerald-500/20 transition-all">
//                     <BookOpen className="w-4 h-4" />
//                     كورساتي
//                   </Button>
//                 </Link>
                
//                 <Link to="/favorites">
//                   <Button variant="ghost" size="sm" className="text-neutral-400 hover:text-emerald-400 hover:bg-emerald-900/10 gap-1.5 rounded-xl h-10 font-bold border border-transparent hover:border-emerald-500/20 transition-all">
//                     <Heart className="w-4 h-4" />
//                     المفضلة
//                   </Button>
//                 </Link>
                
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   className="text-neutral-400 hover:text-red-400 hover:bg-red-900/10 rounded-xl h-10 w-10 border border-transparent hover:border-red-500/20 transition-all ml-1"
//                   onClick={() => signOut()}
//                   title="تسجيل الخروج"
//                 >
//                   <LogOut className="w-4 h-4" />
//                 </Button>

//                 {/* صورة المستخدم */}
//                 <Link to="/profile" className="ml-2 group">
//                   <div className="w-10 h-10 rounded-full bg-[#121A15] flex items-center justify-center overflow-hidden border-2 border-neutral-800 group-hover:border-emerald-500/50 transition-colors shadow-sm">
//                     {profile?.avatar_url ? (
//                       <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
//                     ) : (
//                       <span className="text-sm font-bold text-emerald-500">
//                         {getInitial()}
//                       </span>
//                     )}
//                   </div>
//                 </Link>
//               </div>
//             ) : (
//               <div className="flex items-center gap-3">
//                 <Link to="/login">
//                   <Button variant="ghost" className="text-neutral-300 hover:text-white hover:bg-[#121A15] gap-2 rounded-xl h-11 px-5 font-bold transition-all">
//                     <LogIn className="w-4 h-4" />
//                     تسجيل الدخول
//                   </Button>
//                 </Link>
//                 <Link to="/register">
//                   <Button className="bg-emerald-600 hover:bg-emerald-500 text-white h-11 px-6 font-bold rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.2)] transition-all">
//                     إنشاء حساب
//                   </Button>
//                 </Link>
//               </div>
//             )}
//           </div>

//           {/* Mobile toggle */}
//           <button
//             className="lg:hidden text-neutral-300 hover:text-white p-2"
//             onClick={() => setIsOpen(!isOpen)}
//           >
//             {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
//           </button>
//         </div>
//       </div>

//       {/* Mobile Menu */}
//       <AnimatePresence>
//         {isOpen && (
//           <motion.div
//             initial={{ height: 0, opacity: 0 }}
//             animate={{ height: "auto", opacity: 1 }}
//             exit={{ height: 0, opacity: 0 }}
//             className="lg:hidden overflow-hidden bg-[#0a0f0c] border-b border-neutral-800/60 shadow-xl"
//           >
//             <div className="px-4 py-6 space-y-2">
              
//               {/* نموذج البحث (للموبايل فقط) */}
//               <form onSubmit={handleSearch} className="relative mb-6 mx-1">
//                 <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
//                 <input
//                   type="text"
//                   placeholder="ابحث عن كورس..."
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   className="w-full h-12 pr-12 pl-4 rounded-xl bg-[#121A15] border border-neutral-800 text-white text-base focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all shadow-inner"
//                 />
//               </form>
              
//               {user && (
//                 <div className="flex items-center gap-3 p-4 mb-4 rounded-xl bg-[#121A15] border border-neutral-800 mx-1">
//                   <div className="w-12 h-12 rounded-full bg-[#0a0f0c] flex items-center justify-center overflow-hidden border border-neutral-700 shrink-0">
//                     {profile?.avatar_url ? (
//                       <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
//                     ) : (
//                       <span className="text-base font-bold text-emerald-500">
//                         {getInitial()}
//                       </span>
//                     )}
//                   </div>
//                   <div className="flex flex-col min-w-0">
//                     <span className="font-bold text-white text-sm truncate">{profile?.full_name || "مستخدم نبتة"}</span>
//                     <span className="text-xs text-neutral-400 truncate" dir="ltr">{user.email}</span>
//                   </div>
//                 </div>
//               )}

//               {navLinks.map((link) => (
//                 <Link
//                   key={link.path}
//                   to={link.path}
//                   onClick={() => setIsOpen(false)}
//                   className={`block px-5 py-4 rounded-xl text-sm font-bold transition-colors mx-1 ${
//                     location.pathname === link.path
//                       ? "bg-emerald-600/10 text-emerald-400 border border-emerald-500/20"
//                       : "text-neutral-400 hover:text-white hover:bg-[#121A15] border border-transparent"
//                   }`}
//                 >
//                   {link.label}
//                 </Link>
//               ))}
              
//               <div className="pt-4 mt-2 border-t border-neutral-800/60 flex flex-col gap-3 mx-1">
//                 {user ? (
//                   <>
//                     {isAdmin && (
//                        <Link to="/admin" onClick={() => setIsOpen(false)}>
//                          <Button variant="outline" className="w-full justify-start border-neutral-800 bg-[#121A15] text-neutral-300 hover:text-white h-12 rounded-xl font-bold gap-3">
//                            <LayoutDashboard className="w-4 h-4 text-emerald-500" />
//                            لوحة التحكم
//                          </Button>
//                        </Link>
//                     )}
//                     <div className="grid grid-cols-2 gap-3">
//                       <Link to="/my-courses" onClick={() => setIsOpen(false)}>
//                         <Button variant="outline" className="w-full border-neutral-800 bg-[#121A15] text-neutral-300 hover:text-white h-12 rounded-xl font-bold gap-2">
//                           <BookOpen className="w-4 h-4 text-emerald-500" />
//                           كورساتي
//                         </Button>
//                       </Link>
//                       <Link to="/favorites" onClick={() => setIsOpen(false)}>
//                         <Button variant="outline" className="w-full border-neutral-800 bg-[#121A15] text-neutral-300 hover:text-white h-12 rounded-xl font-bold gap-2">
//                           <Heart className="w-4 h-4 text-emerald-500" />
//                           المفضلة
//                         </Button>
//                       </Link>
//                     </div>
                    
//                     <Link to="/profile" onClick={() => setIsOpen(false)}>
//                       <Button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white h-12 rounded-xl font-bold gap-2 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
//                         <User className="w-4 h-4" />
//                         إعدادات الحساب
//                       </Button>
//                     </Link>

//                     <Button
//                       variant="outline"
//                       className="w-full border-red-500/20 bg-red-500/5 text-red-500 hover:bg-red-500/10 h-12 rounded-xl font-bold gap-2"
//                       onClick={() => { signOut(); setIsOpen(false); }}
//                     >
//                       <LogOut className="w-4 h-4" />
//                       تسجيل الخروج
//                     </Button>
//                   </>
//                 ) : (
//                   <div className="grid grid-cols-2 gap-3">
//                     <Link to="/login" onClick={() => setIsOpen(false)}>
//                       <Button variant="outline" className="w-full border-neutral-800 bg-[#121A15] text-neutral-300 hover:text-white h-12 rounded-xl font-bold gap-2">
//                         <LogIn className="w-4 h-4" />
//                         دخول
//                       </Button>
//                     </Link>
//                     <Link to="/register" onClick={() => setIsOpen(false)}>
//                       <Button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white h-12 rounded-xl font-bold shadow-[0_0_15px_rgba(16,185,129,0.2)]">
//                         إنشاء حساب
//                       </Button>
//                     </Link>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </nav>
//   );
// };

// export default Navbar;

// v4
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { Menu, X, Sprout, LogIn, Search, LogOut, LayoutDashboard, BookOpen, Heart, User } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { useAuth } from "@/contexts/AuthContext";

// const navLinks = [
//   { label: "الرئيسية", path: "/" },
//   { label: "الكورسات", path: "/courses" },
//   { label: "التخصصات", path: "/specializations" },
//   { label: "تواصل معنا", path: "/contact" },
// ];

// const Navbar = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [isSearchOpen, setIsSearchOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { user, profile, signOut, isAdmin } = useAuth();

//   // منع السكرول لما المنيو تكون مفتوحة عشان م يحصلش كراش في الموبايل
//   useEffect(() => {
//     if (isOpen) {
//       document.body.style.overflow = 'hidden';
//     } else {
//       document.body.style.overflow = 'unset';
//     }
//   }, [isOpen]);

//   // إغلاق المنيو عند تغيير المسار
//   useEffect(() => {
//     setIsOpen(false);
//   }, [location.pathname]);

//   const handleSearch = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (searchQuery.trim()) {
//       navigate(`/courses?q=${encodeURIComponent(searchQuery)}`);
//       setSearchQuery("");
//       setIsSearchOpen(false);
//       setIsOpen(false);
//     }
//   };

//   const getInitial = () => {
//     if (profile?.full_name) return profile.full_name.charAt(0);
//     if (user?.email) return user.email.charAt(0).toUpperCase();
//     return "U";
//   };

//   return (
//     <nav className="fixed top-0 right-0 left-0 z-[100] bg-[#050806]/80 backdrop-blur-xl border-b border-neutral-800/60 font-tajawal">
//       <div className="container mx-auto px-4">
//         <div className="flex items-center justify-between h-20">
          
//           {/* Logo */}
//           <Link to="/" className="flex items-center gap-3 shrink-0">
//             <div className="w-10 h-10 rounded-xl bg-[#121A15] border border-neutral-800 flex items-center justify-center">
//               <Sprout className="w-5 h-5 text-emerald-500" />
//             </div>
//             <span style={{ fontFamily: "Amiri, serif", fontSize: "28px" }} className="text-white hidden xs:block">
//               نـَـبْـتـَـة
//             </span>
//           </Link>

//           {/* Desktop Nav */}
//           <div className="hidden lg:flex items-center gap-1">
//             {navLinks.map((link) => (
//               <Link
//                 key={link.path}
//                 to={link.path}
//                 className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
//                   location.pathname === link.path
//                     ? "bg-emerald-600/10 text-emerald-400"
//                     : "text-neutral-400 hover:text-white"
//                 }`}
//               >
//                 {link.label}
//               </Link>
//             ))}
//           </div>

//           {/* Actions (Desktop) */}
//           <div className="hidden lg:flex items-center gap-3">
//              <motion.div
//               animate={{ width: isSearchOpen ? 240 : 40 }}
//               className="relative flex items-center h-10 rounded-xl overflow-hidden bg-[#121A15] border border-neutral-800"
//             >
//               <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="w-10 h-10 shrink-0 flex items-center justify-center text-neutral-400">
//                 <Search className="w-4 h-4" />
//               </button>
//               <form onSubmit={handleSearch} className="flex-1 pr-2">
//                 <input
//                   type="text"
//                   placeholder="ابحث..."
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   className="w-full bg-transparent border-none text-white text-xs focus:outline-none"
//                 />
//               </form>
//             </motion.div>

//             {user ? (
//               <div className="flex items-center gap-2">
//                 <Link to="/profile">
//                   <div className="w-9 h-9 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center overflow-hidden">
//                     {profile?.avatar_url ? <img src={profile.avatar_url} className="w-full h-full object-cover" /> : <span className="text-emerald-500 text-xs font-bold">{getInitial()}</span>}
//                   </div>
//                 </Link>
//                 <Button variant="ghost" size="icon" onClick={() => signOut()} className="text-neutral-500 hover:text-red-400"><LogOut className="w-4 h-4" /></Button>
//               </div>
//             ) : (
//               <Link to="/login"><Button className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl h-10 px-6 font-bold">دخول</Button></Link>
//             )}
//           </div>

//           {/* Mobile toggle */}
//           <button className="lg:hidden p-2 text-neutral-400" onClick={() => setIsOpen(!isOpen)}>
//             {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
//           </button>
//         </div>
//       </div>

//       {/* Mobile Menu - تم تحسينه لمنع الكراش */}
//       <AnimatePresence>
//         {isOpen && (
//           <motion.div
//             initial={{ x: "100%" }}
//             animate={{ x: 0 }}
//             exit={{ x: "100%" }}
//             transition={{ type: "tween", duration: 0.3 }}
//             className="fixed inset-0 top-20 z-[90] bg-[#050806] lg:hidden flex flex-col p-6 space-y-6"
//           >
//             {/* Search in Mobile */}
//             <form onSubmit={handleSearch} className="relative">
//               <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
//               <input
//                 type="text"
//                 placeholder="ابحث عن كورس..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="w-full h-14 pr-12 pl-4 rounded-2xl bg-[#121A15] border border-neutral-800 text-white focus:border-emerald-500/50 outline-none"
//               />
//             </form>

//             <div className="flex flex-col gap-2">
//               {navLinks.map((link) => (
//                 <Link
//                   key={link.path}
//                   to={link.path}
//                   className={`p-4 rounded-2xl text-lg font-bold ${
//                     location.pathname === link.path ? "bg-emerald-600/10 text-emerald-400" : "text-neutral-400"
//                   }`}
//                 >
//                   {link.label}
//                 </Link>
//               ))}
//             </div>

//             <div className="mt-auto pb-10 space-y-4">
//               {user ? (
//                 <div className="space-y-4">
//                   <Link to="/profile" className="flex items-center gap-4 p-4 rounded-2xl bg-[#121A15] border border-neutral-800">
//                     <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center overflow-hidden border border-emerald-500/30">
//                       {profile?.avatar_url ? <img src={profile.avatar_url} className="w-full h-full object-cover" /> : <span className="text-emerald-500 font-bold">{getInitial()}</span>}
//                     </div>
//                     <div>
//                       <p className="font-bold text-white text-sm">{profile?.full_name || "مستخدم نبتة"}</p>
//                       <p className="text-xs text-neutral-500">{user.email}</p>
//                     </div>
//                   </Link>
//                   <Button onClick={() => signOut()} variant="outline" className="w-full h-14 rounded-2xl border-red-500/20 bg-red-500/5 text-red-500 gap-2">
//                     <LogOut className="w-5 h-5" /> تسجيل الخروج
//                   </Button>
//                 </div>
//               ) : (
//                 <div className="grid grid-cols-2 gap-4">
//                   <Link to="/login"><Button variant="outline" className="w-full h-14 rounded-2xl border-neutral-800 text-white">دخول</Button></Link>
//                   <Link to="/register"><Button className="w-full h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white">حساب جديد</Button></Link>
//                 </div>
//               )}
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </nav>
//   );
// };

// export default Navbar;

//v5
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { Menu, X, Sprout, LogIn, Search, LogOut, LayoutDashboard, BookOpen, Heart, User } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { useAuth } from "@/contexts/AuthContext";

// const navLinks = [
//   { label: "الرئيسية", path: "/" },
//   { label: "الكورسات", path: "/courses" },
//   { label: "التخصصات", path: "/specializations" },
//   { label: "تواصل معنا", path: "/contact" },
// ];

// const Navbar = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [isSearchOpen, setIsSearchOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { user, profile, signOut, isAdmin } = useAuth();

//   // منع السكرول عند فتح المنيو
//   useEffect(() => {
//     document.body.style.overflow = isOpen ? 'hidden' : 'unset';
//   }, [isOpen]);

//   const handleSearch = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (searchQuery.trim()) {
//       navigate(`/courses?q=${encodeURIComponent(searchQuery)}`);
//       setSearchQuery("");
//       setIsSearchOpen(false);
//       setIsOpen(false);
//     }
//   };

//   const getInitial = () => {
//     if (profile?.full_name) return profile.full_name.charAt(0);
//     if (user?.email) return user.email.charAt(0).toUpperCase();
//     return "U";
//   };

//   return (
//     <nav className="fixed top-0 right-0 left-0 z-[100] bg-[#050806]/90 backdrop-blur-xl border-b border-neutral-800/60 font-tajawal h-20 flex items-center">
//       <div className="container mx-auto px-4">
//         <div className="flex items-center justify-between h-full">
          
//           {/* الـ Logo مع الاسم - ثابت ومبيختفيش */}
//           <Link to="/" className="flex items-center gap-3 shrink-0 z-[110]">
//             <div className="w-10 h-10 rounded-xl bg-[#121A15] border border-neutral-800 flex items-center justify-center shadow-emerald-500/5 shadow-lg">
//               <Sprout className="w-5 h-5 text-emerald-500" />
//             </div>
//             <span style={{ fontFamily: "Amiri, serif", fontSize: "28px" }} className="text-white mt-1">
//               نـَـبْـتـَـة
//             </span>
//           </Link>

//           {/* روابط الكمبيوتر */}
//           <div className="hidden lg:flex items-center gap-1">
//             {navLinks.map((link) => (
//               <Link
//                 key={link.path}
//                 to={link.path}
//                 className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
//                   location.pathname === link.path ? "bg-emerald-600/10 text-emerald-400" : "text-neutral-400 hover:text-white"
//                 }`}
//               >
//                 {link.label}
//               </Link>
//             ))}
//           </div>

//           {/* الأكشنز (بحث + بروفايل) */}
//           <div className="flex items-center gap-2 lg:gap-3">
//              {/* البحث في الكمبيوتر */}
//              <div className="hidden sm:flex items-center relative mr-2">
//                 <motion.div
//                   animate={{ width: isSearchOpen ? 220 : 40 }}
//                   className="flex items-center h-10 rounded-xl bg-[#121A15] border border-neutral-800 overflow-hidden"
//                 >
//                   <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="w-10 h-10 shrink-0 flex items-center justify-center text-neutral-400">
//                     <Search className="w-4 h-4" />
//                   </button>
//                   <form onSubmit={handleSearch} className="flex-1 pr-2">
//                     <input
//                       type="text"
//                       placeholder="ابحث..."
//                       value={searchQuery}
//                       onChange={(e) => setSearchQuery(e.target.value)}
//                       className="w-full bg-transparent border-none text-white text-xs focus:outline-none"
//                     />
//                   </form>
//                 </motion.div>
//              </div>

//             {user ? (
//               <div className="flex items-center gap-3">
//                 <Link to="/profile">
//                   <div className="w-10 h-10 rounded-full bg-emerald-500/10 border-2 border-neutral-800 flex items-center justify-center overflow-hidden hover:border-emerald-500/50 transition-all shadow-lg">
//                     {profile?.avatar_url ? <img src={profile.avatar_url} className="w-full h-full object-cover" /> : <span className="text-emerald-500 font-bold">{getInitial()}</span>}
//                   </div>
//                 </Link>
//                 <Button variant="ghost" size="icon" onClick={() => signOut()} className="hidden sm:flex text-neutral-500 hover:text-red-400"><LogOut className="w-4 h-4" /></Button>
//               </div>
//             ) : (
//               <Link to="/login" className="hidden sm:block"><Button className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl px-6 font-bold h-10">دخول</Button></Link>
//             )}

//             {/* زرار المنيو للموبايل */}
//             <button className="lg:hidden p-2 text-neutral-400 z-[110]" onClick={() => setIsOpen(!isOpen)}>
//               {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* سلايدر الموبايل المحسن */}
//       <AnimatePresence>
//         {isOpen && (
//           <motion.div
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -20 }}
//             className="fixed inset-0 top-0 z-[100] bg-[#050806] lg:hidden flex flex-col pt-24 p-6"
//           >
//             {/* البحث في الموبايل */}
//             <form onSubmit={handleSearch} className="relative mb-8">
//               <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
//               <input
//                 type="text"
//                 placeholder="ابحث عن كورس..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="w-full h-14 pr-12 pl-4 rounded-2xl bg-[#121A15] border border-neutral-800 text-white outline-none focus:border-emerald-500/50"
//               />
//             </form>

//             <div className="flex flex-col gap-4">
//               {navLinks.map((link) => (
//                 <Link
//                   key={link.path}
//                   to={link.path}
//                   onClick={() => setIsOpen(false)}
//                   className={`p-4 rounded-2xl text-xl font-bold transition-all ${
//                     location.pathname === link.path ? "bg-emerald-600/10 text-emerald-400 border border-emerald-500/20" : "text-neutral-300"
//                   }`}
//                 >
//                   {link.label}
//                 </Link>
//               ))}
//             </div>

//             <div className="mt-auto pb-10 space-y-4">
//               {user ? (
//                 <div className="p-4 rounded-2xl bg-[#121A15] border border-neutral-800 flex items-center justify-between">
//                   <Link to="/profile" onClick={() => setIsOpen(false)} className="flex items-center gap-3">
//                     <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center overflow-hidden">
//                       {profile?.avatar_url ? <img src={profile.avatar_url} className="w-full h-full object-cover" /> : <span className="text-emerald-500 font-bold">{getInitial()}</span>}
//                     </div>
//                     <div>
//                       <p className="font-bold text-white text-sm">{profile?.full_name || "مستخدم نبتة"}</p>
//                       <p className="text-xs text-neutral-500 truncate max-w-[150px]">{user.email}</p>
//                     </div>
//                   </Link>
//                   <button onClick={() => { signOut(); setIsOpen(false); }} className="p-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors">
//                     <LogOut className="w-5 h-5" />
//                   </button>
//                 </div>
//               ) : (
//                 <div className="grid grid-cols-2 gap-4">
//                   <Link to="/login" onClick={() => setIsOpen(false)}><Button variant="outline" className="w-full h-14 rounded-2xl border-neutral-800 text-white">دخول</Button></Link>
//                   <Link to="/register" onClick={() => setIsOpen(false)}><Button className="w-full h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white">حساب جديد</Button></Link>
//                 </div>
//               )}
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </nav>
//   );
// };

// export default Navbar;

//v5
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sprout, LogIn, Search, LogOut, LayoutDashboard, BookOpen, Heart, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const navLinks = [
  { label: "الرئيسية", path: "/" },
  { label: "الكورسات", path: "/courses" },
  { label: "التخصصات", path: "/specializations" },
  { label: "تواصل معنا", path: "/contact" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, signOut, isAdmin } = useAuth();

  // منع السكرول عند فتح المنيو لضمان الثبات
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
  }, [isOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/courses?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      setIsSearchOpen(false);
      setIsOpen(false);
    }
  };

  const getInitial = () => {
    if (profile?.full_name) return profile.full_name.charAt(0);
    if (user?.email) return user.email.charAt(0).toUpperCase();
    return "U";
  };

  return (
    <nav className="fixed top-0 right-0 left-0 z-[100] bg-[#050806] border-b border-neutral-800 font-tajawal h-20 flex items-center">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-full">
          
          {/* الـ Logo ثابت وواضح */}
          <Link to="/" className="flex items-center gap-3 shrink-0 z-[110]">
            <div className="w-10 h-10 rounded-xl bg-[#121A15] border border-neutral-800 flex items-center justify-center shadow-emerald-500/10 shadow-lg">
              <Sprout className="w-5 h-5 text-emerald-500" />
            </div>
            <span style={{ fontFamily: "Amiri, serif", fontSize: "28px" }} className="text-white font-bold mt-1">
              نـَـبْـتـَـة
            </span>
          </Link>

          {/* روابط الـ Desktop */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  location.pathname === link.path ? "bg-emerald-600/20 text-emerald-400 border border-emerald-500/30" : "text-neutral-300 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* الأكشنز */}
          <div className="flex items-center gap-2 lg:gap-3">
             {/* البحث في الكمبيوتر */}
             <div className="hidden sm:flex items-center relative mr-2">
                <motion.div
                  animate={{ width: isSearchOpen ? 220 : 40 }}
                  className="flex items-center h-10 rounded-xl bg-[#121A15] border border-neutral-800 overflow-hidden"
                >
                  <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="w-10 h-10 shrink-0 flex items-center justify-center text-neutral-400 hover:text-white">
                    <Search className="w-4 h-4" />
                  </button>
                  <form onSubmit={handleSearch} className="flex-1 pr-2">
                    <input
                      type="text"
                      placeholder="ابحث..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-transparent border-none text-white text-xs focus:outline-none placeholder:text-neutral-600"
                    />
                  </form>
                </motion.div>
             </div>

            {user ? (
              <div className="flex items-center gap-3">
                <Link to="/profile">
                  <div className="w-10 h-10 rounded-full bg-[#121A15] border-2 border-neutral-700 flex items-center justify-center overflow-hidden hover:border-emerald-500 transition-all shadow-lg">
                    {profile?.avatar_url ? <img src={profile.avatar_url} className="w-full h-full object-cover" /> : <span className="text-emerald-500 font-bold">{getInitial()}</span>}
                  </div>
                </Link>
                <Button variant="ghost" size="icon" onClick={() => signOut()} className="hidden sm:flex text-neutral-400 hover:text-red-500 hover:bg-red-500/10"><LogOut className="w-4 h-4" /></Button>
              </div>
            ) : (
              <Link to="/login" className="hidden sm:block">
                <Button className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl px-6 font-bold h-10 shadow-lg shadow-emerald-900/20">دخول</Button>
              </Link>
            )}

            {/* زرار المنيو - واضح جداً */}
            <button className="lg:hidden p-2 text-white z-[110]" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
            </button>
          </div>
        </div>
      </div>

      {/* سلايدر الموبايل (أسود معتم بالكامل) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[100] bg-[#050806] lg:hidden flex flex-col pt-24 p-6 overflow-y-auto"
          >
            {/* شريط البحث في الموبايل - تباين عالي */}
            <form onSubmit={handleSearch} className="relative mb-10">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />
              <input
                type="text"
                placeholder="ابحث عن كورس..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-14 pr-12 pl-4 rounded-2xl bg-[#0a0f0c] border border-neutral-700 text-white text-lg outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 shadow-xl"
              />
            </form>

            {/* الروابط بنصوص بيضاء واضحة */}
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`p-5 rounded-2xl text-xl font-bold transition-all border ${
                    location.pathname === link.path 
                    ? "bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-900/20" 
                    : "bg-[#0a0f0c] text-neutral-200 border-neutral-800 hover:bg-[#121A15] hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* الجزء السفلي - البروفايل أو الدخول */}
            <div className="mt-auto pt-10 pb-6 space-y-4">
              {user ? (
                <div className="p-5 rounded-3xl bg-[#0a0f0c] border border-neutral-800 shadow-2xl">
                  <div className="flex items-center justify-between mb-6">
                    <Link to="/profile" onClick={() => setIsOpen(false)} className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full bg-emerald-500/20 border-2 border-emerald-500/50 flex items-center justify-center overflow-hidden shadow-inner">
                        {profile?.avatar_url ? <img src={profile.avatar_url} className="w-full h-full object-cover" /> : <span className="text-emerald-500 text-xl font-bold">{getInitial()}</span>}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-white text-lg truncate">{profile?.full_name || "مستخدم نبتة"}</p>
                        <p className="text-sm text-neutral-500 truncate max-w-[180px]">{user.email}</p>
                      </div>
                    </Link>
                  </div>
                  <Button 
                    onClick={() => { signOut(); setIsOpen(false); }} 
                    variant="outline" 
                    className="w-full h-14 rounded-2xl border-red-500/30 bg-red-500/5 text-red-500 font-bold hover:bg-red-500 hover:text-white transition-all gap-2"
                  >
                    <LogOut className="w-5 h-5" /> تسجيل الخروج
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  <Link to="/login" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full h-14 rounded-2xl border-neutral-700 bg-transparent text-white text-lg font-bold">دخول</Button>
                  </Link>
                  <Link to="/register" onClick={() => setIsOpen(false)}>
                    <Button className="w-full h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-lg font-bold shadow-lg shadow-emerald-900/20">حساب جديد</Button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
