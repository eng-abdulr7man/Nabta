import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { supabase } from "@/integrations/supabase/client";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ScrollToTop from "./components/ScrollToTop";
import SupportPage from "./pages/Support";
import AiChatWidget from "@/components/AiChatWidget";
import Marketplace from "./components/shop/Marketplace";

// --- Lazy Load Pages ---
const ArticlesPage = lazy(() => import("./pages/ArticlesPage"));
const CoursesPage = lazy(() => import("./pages/CoursesPage"));
const CourseDetailPage = lazy(() => import("./pages/CourseDetailPage"));
const SpecializationsPage = lazy(() => import("./pages/SpecializationsPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const ForgotPasswordPage = lazy(() => import("./pages/ForgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("./pages/ResetPasswordPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const LearnPage = lazy(() => import("./pages/LearnPage"));
const VerifyCertificate = lazy(() => import("./pages/VerifyCertificate"));
const MyCoursesPage = lazy(() => import("./pages/MyCoursesPage"));
const FavoritesPage = lazy(() => import("./pages/FavoritesPage"));
const ToolsPage = lazy(() => import("./pages/ToolsPage"));
const RoadmapPage = lazy(() => import("./pages/RoadmapPage"));

// 🌟 استدعاء صفحات المكتبة 🌟
const LibraryPage = lazy(() => import("./pages/LibraryPage"));
const SubjectMaterialsPage = lazy(() => import("./pages/SubjectMaterialsPage"));

// Admin Pages
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminCourses = lazy(() => import("./pages/admin/AdminCourses"));
const AdminUsers = lazy(() => import("./pages/admin/AdminUsers"));
const AdminMessages = lazy(() => import("./pages/admin/AdminMessages"));
const AdminSpecializations = lazy(() => import("./pages/admin/AdminSpecializations"));
const AdminCourseDetail = lazy(() => import("./pages/admin/AdminCourseDetail"));
const AdminActivityLog = lazy(() => import("./pages/admin/AdminActivityLog"));
const AdminArticles = lazy(() => import("./pages/admin/AdminArticles"));
const AdminYoutubeImport = lazy(() => import("./pages/admin/AdminYoutubeImport")); 
const AdminLibraryManager = lazy(() => import("./components/admin/AdminLibraryManager"));

// Support/Legal Pages
const FAQPage = lazy(() => import("./pages/FAQPage"));
const PrivacyPage = lazy(() => import("./pages/PrivacyPage"));
const TermsPage = lazy(() => import("./pages/TermsPage"));
const HelpPage = lazy(() => import("./pages/HelpPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const Loading = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#050806]">
    <div className="relative">
      <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
      <div className="absolute inset-0 bg-emerald-500/10 blur-xl rounded-full animate-pulse" />
    </div>
  </div>
);

const AuthListener = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY") {
        navigate("/reset-password", { replace: true });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  return null; 
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner position="top-center" /> 
      
      <BrowserRouter>
        <AuthProvider>
          <AuthListener />
          <AiChatWidget />
          <ScrollToTop />
          
          <Suspense fallback={<Loading />}>
            <Routes>
              {/* --- Public Routes --- */}
              <Route path="/" element={<Index />} />
              <Route path="/articles" element={<ArticlesPage />} />
              <Route path="/courses" element={<CoursesPage />} />
              <Route path="/courses/:id" element={<CourseDetailPage />} />
              <Route path="/specializations" element={<SpecializationsPage />} />
              <Route path="/roadmap" element={<RoadmapPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/verify/:certificateId" element={<VerifyCertificate />} />
              <Route path="/support" element={<SupportPage />} />
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/help" element={<HelpPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/tools" element={<ToolsPage />} />
              <Route path="/marketplace" element={<Marketplace />} />
              
              {/* 🌟 مسارات المكتبة للطلبة 🌟 */}
              <Route path="/library" element={<LibraryPage />} />
              <Route path="/library/:id" element={<SubjectMaterialsPage />} />

              {/* --- Student Protected Routes --- */}
              <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
              <Route path="/my-courses" element={<ProtectedRoute><MyCoursesPage /></ProtectedRoute>} />
              <Route path="/favorites" element={<ProtectedRoute><FavoritesPage /></ProtectedRoute>} />
              <Route path="/courses/:id/learn" element={<ProtectedRoute><LearnPage /></ProtectedRoute>} />
              
              {/* --- Admin Protected Routes --- */}
              <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
              <Route path="/admin/courses" element={<ProtectedRoute adminOnly><AdminCourses /></ProtectedRoute>} />
              <Route path="/admin/courses/:id" element={<ProtectedRoute adminOnly><AdminCourseDetail /></ProtectedRoute>} />
              <Route path="/admin/specializations" element={<ProtectedRoute adminOnly><AdminSpecializations /></ProtectedRoute>} />
              <Route path="/admin/users" element={<ProtectedRoute adminOnly><AdminUsers /></ProtectedRoute>} />
              <Route path="/admin/messages" element={<ProtectedRoute adminOnly><AdminMessages /></ProtectedRoute>} />
              <Route path="/admin/activity" element={<ProtectedRoute adminOnly><AdminActivityLog /></ProtectedRoute>} />
              <Route path="/admin/articles" element={<ProtectedRoute adminOnly><AdminArticles /></ProtectedRoute>} />
              <Route path="/admin/youtube-import" element={<ProtectedRoute adminOnly><AdminYoutubeImport /></ProtectedRoute>} />
              <Route path="/admin/library" element={<ProtectedRoute adminOnly><AdminLibraryManager /></ProtectedRoute>} />
              
              {/* --- 404 --- */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
