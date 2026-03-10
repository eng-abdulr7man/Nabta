// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useQuery } from "@tanstack/react-query";
// import { motion } from "framer-motion";
// import { Camera, Save, LogOut, Award, Download } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { useAuth } from "@/contexts/AuthContext";
// import { supabase } from "@/integrations/supabase/client";
// import { useToast } from "@/hooks/use-toast";
// import Navbar from "@/components/layout/Navbar";
// import Footer from "@/components/layout/Footer";
// import BottomNav from "@/components/layout/BottomNav";
// import { downloadCertificatePDF } from "@/lib/generateCertificatePDF";

// const ProfilePage = () => {
//   const { user, profile, signOut, refreshProfile } = useAuth();
//   const [fullName, setFullName] = useState("");
//   const [phone, setPhone] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [uploading, setUploading] = useState(false);
//   const navigate = useNavigate();
//   const { toast } = useToast();

//   useEffect(() => {
//     if (profile) {
//       setFullName(profile.full_name);
//       setPhone(profile.phone || "");
//     }
//   }, [profile]);

//   const { data: certificates } = useQuery({
//     queryKey: ["profile-certificates", user?.id],
//     queryFn: async () => {
//       const { data, error } = await supabase
//         .from("certificates")
//         .select("*, courses(title, instructor)")
//         .eq("user_id", user!.id)
//         .order("issued_at", { ascending: false });
//       if (error) throw error;
//       return data;
//     },
//     enabled: !!user,
//   });

//   if (!user) {
//     navigate("/login");
//     return null;
//   }

//   const handleSave = async () => {
//     setLoading(true);
//     const { error } = await supabase
//       .from("profiles")
//       .update({ full_name: fullName, phone })
//       .eq("user_id", user.id);
//     setLoading(false);
//     if (error) {
//       toast({ title: "خطأ", description: error.message, variant: "destructive" });
//     } else {
//       await refreshProfile();
//       toast({ title: "تم حفظ التغييرات بنجاح" });
//     }
//   };

//   const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     setUploading(true);
//     const filePath = `${user.id}/${Date.now()}-${file.name}`;
//     const { error: uploadError } = await supabase.storage.from("avatars").upload(filePath, file);
//     if (uploadError) {
//       toast({ title: "خطأ في رفع الصورة", description: uploadError.message, variant: "destructive" });
//       setUploading(false);
//       return;
//     }
//     const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(filePath);
//     await supabase.from("profiles").update({ avatar_url: urlData.publicUrl }).eq("user_id", user.id);
//     await refreshProfile();
//     setUploading(false);
//     toast({ title: "تم تحديث الصورة بنجاح" });
//   };

//   const handleLogout = async () => {
//     await signOut();
//     navigate("/");
//   };

//   const handleDownloadCert = (cert: any) => {
//     downloadCertificatePDF({
//       learnerName: profile?.full_name || user.email || "",
//       courseName: cert.courses?.title || "",
//       certificateNumber: cert.certificate_number,
//       issuedAt: cert.issued_at,
//       instructor: cert.courses?.instructor,
//     });
//   };

//   return (
//     <div className="min-h-screen flex flex-col bg-background">
//       <Navbar />
//       <main className="flex-1 pt-24 pb-20 md:pb-8">
//         <div className="container mx-auto px-4 max-w-2xl">
//           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
//             <h1 className="text-3xl font-black text-foreground">الملف الشخصي</h1>

//             {/* Avatar */}
//             <div className="glass-card p-6 flex flex-col items-center gap-4">
//               <div className="relative">
//                 <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border-2 border-primary/20">
//                   {profile?.avatar_url ? (
//                     <img src={profile.avatar_url} alt="avatar" className="w-full h-full object-cover" />
//                   ) : (
//                     <span className="text-3xl font-bold text-primary">
//                       {fullName?.charAt(0) || "U"}
//                     </span>
//                   )}
//                 </div>
//                 <label className="absolute bottom-0 left-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center cursor-pointer hover:bg-primary/90 transition-colors">
//                   <Camera className="w-4 h-4" />
//                   <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} disabled={uploading} />
//                 </label>
//               </div>
//               <p className="text-sm text-muted-foreground">{user.email}</p>
//             </div>

//             {/* Info */}
//             <div className="glass-card p-6 space-y-4">
//               <div>
//                 <label className="text-sm font-medium text-foreground mb-1.5 block">الاسم الكامل</label>
//                 <input
//                   type="text"
//                   value={fullName}
//                   onChange={(e) => setFullName(e.target.value)}
//                   className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
//                 />
//               </div>
//               <div>
//                 <label className="text-sm font-medium text-foreground mb-1.5 block">رقم الهاتف</label>
//                 <input
//                   type="tel"
//                   value={phone}
//                   onChange={(e) => setPhone(e.target.value)}
//                   className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
//                   dir="ltr"
//                 />
//               </div>
//               <Button onClick={handleSave} disabled={loading} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
//                 <Save className="w-4 h-4" />
//                 {loading ? "جاري الحفظ..." : "حفظ التغييرات"}
//               </Button>
//             </div>

//             {/* Certificates */}
//             {certificates && certificates.length > 0 && (
//               <div className="glass-card p-6 space-y-4">
//                 <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
//                   <Award className="w-5 h-5 text-primary" />
//                   شهاداتي
//                 </h2>
//                 <div className="space-y-3">
//                   {certificates.map((cert: any) => (
//                     <div key={cert.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 border border-border">
//                       <div>
//                         <p className="text-sm font-medium text-foreground">{cert.courses?.title}</p>
//                         <p className="text-xs text-muted-foreground" dir="ltr">{cert.certificate_number}</p>
//                       </div>
//                       <Button
//                         size="sm"
//                         variant="ghost"
//                         className="text-primary gap-1"
//                         onClick={() => handleDownloadCert(cert)}
//                       >
//                         <Download className="w-4 h-4" />
//                         PDF
//                       </Button>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             <Button onClick={handleLogout} variant="outline" className="w-full border-destructive text-destructive hover:bg-destructive/10 gap-2">
//               <LogOut className="w-4 h-4" />
//               تسجيل الخروج
//             </Button>
//           </motion.div>
//         </div>
//       </main>
//       <Footer />
//       <BottomNav />
//     </div>
//   );
// };

// export default ProfilePage;

//v2
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Camera, Save, LogOut, Award, Download, User as UserIcon, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BottomNav from "@/components/layout/BottomNav";
import { downloadCertificatePDF } from "@/lib/generateCertificatePDF";

const ProfilePage = () => {
  const { user, profile, signOut, refreshProfile } = useAuth();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // تمرير لأعلى الصفحة عند الفتح
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || "");
      setPhone(profile.phone || "");
    }
  }, [profile]);

  const { data: certificates } = useQuery({
    queryKey: ["profile-certificates", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("certificates")
        .select("*, courses(title, instructor)")
        .eq("user_id", user!.id)
        .order("issued_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  if (!user) {
    navigate("/login");
    return null;
  }

  const handleSave = async () => {
    setLoading(true);
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: fullName, phone })
      .eq("user_id", user.id);
    setLoading(false);
    
    if (error) {
      toast({ title: "خطأ", description: error.message, variant: "destructive" });
    } else {
      await refreshProfile();
      toast({ title: "تم التحديث", description: "تم حفظ بياناتك بنجاح." });
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const filePath = `${user.id}/${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage.from("avatars").upload(filePath, file);
    
    if (uploadError) {
      toast({ title: "خطأ في رفع الصورة", description: uploadError.message, variant: "destructive" });
      setUploading(false);
      return;
    }
    
    const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(filePath);
    await supabase.from("profiles").update({ avatar_url: urlData.publicUrl }).eq("user_id", user.id);
    await refreshProfile();
    setUploading(false);
    toast({ title: "تم التحديث", description: "تم تغيير الصورة الشخصية بنجاح." });
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const handleDownloadCert = (cert) => {
    downloadCertificatePDF({
      learnerName: profile?.full_name || user.email || "",
      courseName: cert.courses?.title || "",
      certificateNumber: cert.certificate_number,
      issuedAt: cert.issued_at,
      instructor: cert.courses?.instructor,
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#050806] font-tajawal selection:bg-emerald-500/30">
      <Navbar />
      
      <main className="flex-1 pt-32 pb-24 md:pb-16 relative overflow-hidden">
        
        {/* إضاءات خلفية (Ambient Glows) */}
        <div className="absolute top-0 right-[-10%] w-[40vw] h-[40vw] rounded-full bg-emerald-900/10 blur-[150px] pointer-events-none" />
        <div className="absolute bottom-[20%] left-[-10%] w-[30vw] h-[30vw] rounded-full bg-emerald-900/5 blur-[120px] pointer-events-none" />

        <div className="container mx-auto px-4 max-w-3xl relative z-10">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            
            {/* الهيدر */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#121A15] border border-neutral-800 text-emerald-400 text-sm font-medium shadow-[0_0_20px_rgba(16,185,129,0.05)] mx-auto mb-4">
                <UserIcon className="w-4 h-4" />
                حسابي الشخصي
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                مرحباً بك، <span className="text-transparent bg-clip-text bg-gradient-to-l from-emerald-400 to-green-600">{profile?.full_name?.split(' ')[0] || "يا صديقي"}</span>
              </h1>
            </div>

            {/* ======================================= */}
            {/* 1. قسم الصورة الشخصية والإيميل */}
            {/* ======================================= */}
            <div className="bg-[#0a0f0c] border border-neutral-800/60 rounded-3xl p-8 flex flex-col items-center gap-5 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-[200px] bg-emerald-900/10 blur-[80px] pointer-events-none rounded-full" />
              
              <div className="relative z-10">
                <div className="w-28 h-28 rounded-full bg-[#121A15] flex items-center justify-center overflow-hidden border-4 border-[#050806] shadow-[0_0_30px_rgba(16,185,129,0.15)] ring-1 ring-neutral-800">
                  {uploading ? (
                    <div className="w-8 h-8 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
                  ) : profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt="avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-4xl font-black text-emerald-500/50">
                      {fullName?.charAt(0) || user.email?.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                
                <label className="absolute bottom-0 left-0 w-10 h-10 rounded-full bg-emerald-600 border-4 border-[#0a0f0c] text-white flex items-center justify-center cursor-pointer hover:bg-emerald-500 transition-colors shadow-lg">
                  <Camera className="w-4 h-4" />
                  <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} disabled={uploading} />
                </label>
              </div>
              
              <div className="text-center z-10">
                <div className="flex items-center justify-center gap-2 text-neutral-400 bg-[#121A15] border border-neutral-800 px-4 py-2 rounded-xl text-sm">
                  <Mail className="w-4 h-4 text-emerald-500" />
                  <span dir="ltr">{user.email}</span>
                </div>
              </div>
            </div>

            {/* ======================================= */}
            {/* 2. قسم البيانات الشخصية */}
            {/* ======================================= */}
            <div className="bg-[#0a0f0c] border border-neutral-800/60 rounded-3xl p-8 space-y-6 shadow-xl">
              <h2 className="text-xl font-bold text-white mb-2">المعلومات الأساسية</h2>
              
              <div className="space-y-5">
                <div>
                  <label className="text-sm font-bold text-neutral-400 mb-2 block">الاسم بالكامل</label>
                  <div className="relative group">
                    <UserIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500 group-focus-within:text-emerald-500 transition-colors" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="أدخل اسمك الكامل"
                      className="w-full pr-12 pl-4 py-3.5 rounded-xl bg-[#121A15] border border-neutral-800 text-white text-base placeholder:text-neutral-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all shadow-inner"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-bold text-neutral-400 mb-2 block">رقم الهاتف</label>
                  <div className="relative group">
                    <Phone className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500 group-focus-within:text-emerald-500 transition-colors" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="01xxxxxxxxx"
                      className="w-full pr-12 pl-4 py-3.5 rounded-xl bg-[#121A15] border border-neutral-800 text-white text-base placeholder:text-neutral-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all shadow-inner"
                      dir="ltr"
                    />
                  </div>
                </div>

                <Button 
                  onClick={handleSave} 
                  disabled={loading} 
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white h-14 text-base font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] flex items-center justify-center gap-2 mt-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Save className="w-5 h-5" />
                  )}
                  {loading ? "جاري الحفظ..." : "حفظ التعديلات"}
                </Button>
              </div>
            </div>

            {/* ======================================= */}
            {/* 3. قسم الشهادات */}
            {/* ======================================= */}
            {certificates && certificates.length > 0 && (
              <div className="bg-[#0a0f0c] border border-neutral-800/60 rounded-3xl p-8 space-y-5 shadow-xl">
                <h2 className="text-xl font-bold text-white flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-[#121A15] flex items-center justify-center border border-neutral-800">
                    <Award className="w-5 h-5 text-emerald-500" />
                  </div>
                  سجل الشهادات
                </h2>
                
                <div className="space-y-3">
                  {certificates.map((cert) => (
                    <div key={cert.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#121A15] border border-neutral-800/60 hover:border-emerald-500/30 transition-all group">
                      <div>
                        <p className="font-bold text-white group-hover:text-emerald-400 transition-colors">{cert.courses?.title}</p>
                        <p className="text-xs text-neutral-500 mt-1 font-sans tracking-wider" dir="ltr">ID: {cert.certificate_number}</p>
                      </div>
                      <Button
                        size="sm"
                        className="bg-[#0a0f0c] border border-neutral-700 hover:border-emerald-500 text-neutral-300 hover:text-white hover:bg-emerald-600 gap-2 rounded-lg h-10 w-full sm:w-auto transition-all"
                        onClick={() => handleDownloadCert(cert)}
                      >
                        <Download className="w-4 h-4" />
                        تحميل PDF
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ======================================= */}
            {/* 4. زر تسجيل الخروج */}
            {/* ======================================= */}
            <div className="pt-4">
              <Button 
                onClick={handleLogout} 
                variant="outline" 
                className="w-full bg-red-500/5 hover:bg-red-500/10 border-red-500/20 hover:border-red-500/50 text-red-500 h-14 rounded-xl font-bold transition-all gap-2"
              >
                <LogOut className="w-5 h-5" />
                تسجيل الخروج من الحساب
              </Button>
            </div>

          </motion.div>
        </div>
      </main>
      
      <Footer />
      <BottomNav />
    </div>
  );
};

export default ProfilePage;
