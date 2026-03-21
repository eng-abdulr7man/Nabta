import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ScrollToTop from "./components/ScrollToTop";
import SupportPage from "./pages/Support";

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

// ✅ ضفنا استدعاء صفحة خريطة الطريق هنا
const RoadmapPage = lazy(() => import("./pages/RoadmapPage"));

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

// لودر شيك يتماشى مع هوية نبتة
const Loading = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#050806]">
    <div className="relative">
      <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
      <div className="absolute inset-0 bg-emerald-500/10 blur-xl rounded-full animate-pulse" />
    </div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner position="top-center" /> 
      <BrowserRouter>
        <ScrollToTop />
        <AuthProvider>
          <Suspense fallback={<Loading />}>
            <Routes>
              {/* --- Public Routes --- */}
              <Route path="/" element={<Index />} />
              <Route path="/articles" element={<ArticlesPage />} />
              <Route path="/courses" element={<CoursesPage />} />
              <Route path="/courses/:id" element={<CourseDetailPage />} />
              <Route path="/specializations" element={<SpecializationsPage />} />
              
              {/* ✅ ضفنا مسار خريطة الطريق هنا */}
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

              {/* --- Student Protected Routes --- */}
              <Route element={<ProtectedRoute />}>
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/my-courses" element={<MyCoursesPage />} />
                <Route path="/favorites" element={<FavoritesPage />} />
                <Route path="/courses/:id/learn" element={<LearnPage />} />
              </Route>
              
              {/* --- Admin Protected Routes --- */}
              <Route element={<ProtectedRoute adminOnly />}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/courses" element={<AdminCourses />} />
                <Route path="/admin/courses/:id" element={<AdminCourseDetail />} />
                <Route path="/admin/specializations" element={<AdminSpecializations />} />
                <Route path="/admin/users" element={<AdminUsers />} />
                <Route path="/admin/messages" element={<AdminMessages />} />
                <Route path="/admin/activity" element={<AdminActivityLog />} />
                <Route path="/admin/articles" element={<AdminArticles />} />
                <Route path="/admin/youtube-import" element={<AdminYoutubeImport />} />
              </Route>
              
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
