// import { useState, useEffect, useCallback, useRef } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { supabase } from "@/integrations/supabase/client";
// import { useAuth } from "@/contexts/AuthContext";
// import { useToast } from "@/hooks/use-toast";
// import { useCourse, useCourseSections, useSectionLessons } from "@/hooks/useCourses";
// import { motion } from "framer-motion";
// import { CheckCircle, Circle, ChevronDown, ChevronUp, Award, ArrowRight } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Progress } from "@/components/ui/progress";
// import CertificateModal from "@/components/courses/CertificateModal";

// const LearnPage = () => {
//   const { id } = useParams();
//   const { user, profile } = useAuth();
//   const { toast } = useToast();
//   const queryClient = useQueryClient();
//   const navigate = useNavigate();
//   const ytPlayerRef = useRef<any>(null);
//   const saveIntervalRef = useRef<NodeJS.Timeout>();

//   const { data: course } = useCourse(id!);
//   const { data: sections } = useCourseSections(id!);
//   const sectionIds = (sections || []).map((s) => s.id);
//   const { data: lessons } = useSectionLessons(sectionIds);

//   const [currentLessonId, setCurrentLessonId] = useState<string | null>(null);
//   const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
//   const [showCertModal, setShowCertModal] = useState(false);
//   const [certData, setCertData] = useState<any>(null);

//   // Get progress
//   const { data: progress } = useQuery({
//     queryKey: ["lesson-progress", id, user?.id],
//     queryFn: async () => {
//       if (!lessons) return [];
//       const lessonIds = lessons.map((l) => l.id);
//       const { data } = await supabase
//         .from("lesson_progress")
//         .select("*")
//         .eq("user_id", user!.id)
//         .in("lesson_id", lessonIds);
//       return data || [];
//     },
//     enabled: !!lessons && !!user,
//   });

//   // Get enrollment for last_lesson_id
//   const { data: enrollment } = useQuery({
//     queryKey: ["enrollment-learn", id, user?.id],
//     queryFn: async () => {
//       const { data } = await supabase
//         .from("enrollments")
//         .select("*")
//         .eq("course_id", id!)
//         .eq("user_id", user!.id)
//         .single();
//       return data;
//     },
//     enabled: !!user,
//   });

//   // Set initial lesson
//   useEffect(() => {
//     if (lessons && lessons.length > 0 && !currentLessonId) {
//       const lastLesson = enrollment?.last_lesson_id;
//       setCurrentLessonId(lastLesson || lessons[0].id);
//       setExpandedSections(new Set(sectionIds));
//     }
//   }, [lessons, enrollment]);

//   const currentLesson = lessons?.find((l) => l.id === currentLessonId);
//   const completedCount = (progress || []).filter((p: any) => p.completed).length;
//   const totalLessons = lessons?.length || 0;
//   const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

//   // YouTube player
//   useEffect(() => {
//     if (!currentLesson?.video_url) return;
//     const videoId = extractYouTubeId(currentLesson.video_url);
//     if (!videoId) return;

//     const loadPlayer = () => {
//       if (ytPlayerRef.current) ytPlayerRef.current.destroy();
//       ytPlayerRef.current = new (window as any).YT.Player("yt-player", {
//         videoId,
//         playerVars: { rel: 0, modestbranding: 1, hl: "ar" },
//         events: {
//           onReady: (e: any) => {
//             const savedProgress = (progress || []).find((p: any) => p.lesson_id === currentLessonId);
//             if (savedProgress && savedProgress.video_position > 0) {
//               e.target.seekTo(savedProgress.video_position, true);
//             }
//           },
//         },
//       });
//     };

//     if ((window as any).YT?.Player) {
//       loadPlayer();
//     } else {
//       const tag = document.createElement("script");
//       tag.src = "https://www.youtube.com/iframe_api";
//       document.head.appendChild(tag);
//       (window as any).onYouTubeIframeAPIReady = loadPlayer;
//     }

//     return () => {
//       if (saveIntervalRef.current) clearInterval(saveIntervalRef.current);
//     };
//   }, [currentLessonId, currentLesson?.video_url]);

//   // Auto-save position every 10s
//   useEffect(() => {
//     if (saveIntervalRef.current) clearInterval(saveIntervalRef.current);
//     saveIntervalRef.current = setInterval(() => {
//       if (ytPlayerRef.current?.getCurrentTime && currentLessonId && user) {
//         const pos = ytPlayerRef.current.getCurrentTime();
//         supabase.from("lesson_progress").upsert({
//           user_id: user.id,
//           lesson_id: currentLessonId,
//           video_position: pos,
//         }, { onConflict: "user_id,lesson_id" }).then(() => {});
//       }
//     }, 10000);
//     return () => { if (saveIntervalRef.current) clearInterval(saveIntervalRef.current); };
//   }, [currentLessonId, user]);

//   // Update last_lesson_id in enrollment
//   useEffect(() => {
//     if (currentLessonId && user && id) {
//       supabase.from("enrollments").update({ last_lesson_id: currentLessonId }).eq("user_id", user.id).eq("course_id", id).then(() => {});
//     }
//   }, [currentLessonId]);

//   const markComplete = useMutation({
//     mutationFn: async (lessonId: string) => {
//       const { error } = await supabase.from("lesson_progress").upsert({
//         user_id: user!.id,
//         lesson_id: lessonId,
//         completed: true,
//         completed_at: new Date().toISOString(),
//       }, { onConflict: "user_id,lesson_id" });
//       if (error) throw error;
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["lesson-progress", id] });
//       const newCompleted = completedCount + 1;
//       if (newCompleted >= totalLessons && totalLessons > 0) {
//         issueCertificate();
//       }
//     },
//   });

//   const issueCertificate = async () => {
//     try {
//       const { data: existing } = await supabase
//         .from("certificates")
//         .select("*")
//         .eq("user_id", user!.id)
//         .eq("course_id", id!)
//         .maybeSingle();
//       if (existing) {
//         // Already has certificate, just show modal
//         setCertData({
//           learnerName: profile?.full_name || user!.email || "",
//           courseName: course?.title || "",
//           certificateNumber: existing.certificate_number,
//           issuedAt: existing.issued_at,
//           instructor: course?.instructor,
//         });
//         setShowCertModal(true);
//         return;
//       }
//       const { data: newCert, error } = await supabase.from("certificates").insert({
//         user_id: user!.id,
//         course_id: id!,
//         certificate_number: "",
//       }).select().single();
//       if (!error && newCert) {
//         setCertData({
//           learnerName: profile?.full_name || user!.email || "",
//           courseName: course?.title || "",
//           certificateNumber: newCert.certificate_number,
//           issuedAt: newCert.issued_at,
//           instructor: course?.instructor,
//         });
//         setShowCertModal(true);
//       }
//     } catch {}
//   };

//   const isLessonCompleted = (lessonId: string) => {
//     return (progress || []).some((p: any) => p.lesson_id === lessonId && p.completed);
//   };

//   const toggleSection = (sectionId: string) => {
//     setExpandedSections((prev) => {
//       const next = new Set(prev);
//       next.has(sectionId) ? next.delete(sectionId) : next.add(sectionId);
//       return next;
//     });
//   };

//   const goToNextLesson = () => {
//     if (!lessons || !currentLessonId) return;
//     const idx = lessons.findIndex((l) => l.id === currentLessonId);
//     if (idx < lessons.length - 1) {
//       setCurrentLessonId(lessons[idx + 1].id);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-background" dir="rtl">
//       <div className="flex flex-col lg:flex-row h-screen">
//         {/* Video area */}
//         <div className="flex-1 flex flex-col">
//           <div className="h-14 border-b border-border flex items-center justify-between px-4 bg-card shrink-0">
//             <div className="flex items-center gap-3">
//               <button onClick={() => navigate(`/courses/${id}`)} className="text-muted-foreground hover:text-foreground">
//                 <ArrowRight className="w-5 h-5" />
//               </button>
//               <h1 className="font-bold text-sm text-foreground truncate">{course?.title}</h1>
//             </div>
//             <div className="flex items-center gap-2">
//               <span className="text-xs text-muted-foreground">{progressPercent}%</span>
//               <Progress value={progressPercent} className="w-24 h-2" />
//             </div>
//           </div>

//           <div className="flex-1 bg-black flex items-center justify-center">
//             {currentLesson?.video_url ? (
//               <div className="w-full aspect-video max-h-full">
//                 <div id="yt-player" className="w-full h-full" />
//               </div>
//             ) : (
//               <p className="text-muted-foreground">لا يوجد فيديو لهذا الدرس</p>
//             )}
//           </div>

//           <div className="p-4 bg-card border-t border-border shrink-0 overflow-y-auto max-h-[40vh]">
//             <div className="flex items-center justify-between mb-3">
//               <h2 className="font-bold text-foreground">{currentLesson?.title}</h2>
//               <div className="flex gap-2">
//                 {currentLessonId && !isLessonCompleted(currentLessonId) && (
//                   <Button size="sm" onClick={() => markComplete.mutate(currentLessonId)} className="bg-primary text-primary-foreground gap-1">
//                     <CheckCircle className="w-4 h-4" />
//                     إكمال الدرس
//                   </Button>
//                 )}
//                 <Button size="sm" variant="outline" onClick={goToNextLesson}>الدرس التالي</Button>
//               </div>
//             </div>

//             {/* Lesson file */}
//             {currentLesson && (currentLesson as any).file_url && (
//               <div className="mb-3 flex items-center gap-2 p-2.5 rounded-lg bg-primary/5 border border-primary/20">
//                 <Award className="w-4 h-4 text-primary shrink-0" />
//                 <a
//                   href={(currentLesson as any).file_url}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="text-sm text-primary hover:underline truncate"
//                 >
//                   📎 تحميل ملف الدرس
//                 </a>
//               </div>
//             )}

//             {/* Lesson content text */}
//             {currentLesson && (currentLesson as any).content && (
//               <div className="prose prose-sm prose-invert max-w-none text-muted-foreground leading-relaxed whitespace-pre-wrap text-sm">
//                 {(currentLesson as any).content}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Sidebar */}
//         <div className="w-full lg:w-80 border-r border-border bg-card overflow-y-auto shrink-0 max-h-[40vh] lg:max-h-full">
//           <div className="p-3 border-b border-border">
//             <p className="text-xs text-muted-foreground">التقدم: {completedCount}/{totalLessons} درس</p>
//           </div>
//           {(sections || []).map((section) => {
//             const sectionLessons = (lessons || []).filter((l) => l.section_id === section.id);
//             const isExpanded = expandedSections.has(section.id);
//             return (
//               <div key={section.id}>
//                 <button
//                   onClick={() => toggleSection(section.id)}
//                   className="w-full px-4 py-3 flex items-center justify-between text-sm font-bold text-foreground bg-secondary/50 hover:bg-secondary border-b border-border"
//                 >
//                   <span className="truncate">{section.title}</span>
//                   {isExpanded ? <ChevronUp className="w-4 h-4 shrink-0" /> : <ChevronDown className="w-4 h-4 shrink-0" />}
//                 </button>
//                 {isExpanded && (
//                   <div>
//                     {sectionLessons.map((lesson) => {
//                       const completed = isLessonCompleted(lesson.id);
//                       const isCurrent = lesson.id === currentLessonId;
//                       return (
//                         <button
//                           key={lesson.id}
//                           onClick={() => setCurrentLessonId(lesson.id)}
//                           className={`w-full px-4 py-2.5 flex items-center gap-2 text-sm border-b border-border transition-colors ${
//                             isCurrent ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary"
//                           }`}
//                         >
//                           {completed ? (
//                             <CheckCircle className="w-4 h-4 text-primary shrink-0" />
//                           ) : (
//                             <Circle className="w-4 h-4 shrink-0" />
//                           )}
//                           <span className="truncate text-right">{lesson.title}</span>
//                         </button>
//                       );
//                     })}
//                   </div>
//                 )}
//               </div>
//             );
//           })}
//         </div>
//       </div>

//       {/* Certificate Modal */}
//       {certData && (
//         <CertificateModal
//           open={showCertModal}
//           onClose={() => setShowCertModal(false)}
//           {...certData}
//         />
//       )}
//     </div>
//   );
// };

// function extractYouTubeId(url: string): string | null {
//   const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/))([^&?\s]+)/);
//   return match ? match[1] : null;
// }

// export default LearnPage;

//v2
import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useCourse, useCourseSections, useSectionLessons } from "@/hooks/useCourses";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Circle, ChevronDown, ChevronUp, ArrowRight, PlayCircle, FileText, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import CertificateModal from "@/components/courses/CertificateModal";

const LearnPage = () => {
  const { id } = useParams();
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const ytPlayerRef = useRef<any>(null);
  const saveIntervalRef = useRef<NodeJS.Timeout>();

  const { data: course } = useCourse(id!);
  const { data: sections } = useCourseSections(id!);
  const sectionIds = (sections || []).map((s) => s.id);
  const { data: lessons } = useSectionLessons(sectionIds);

  const [currentLessonId, setCurrentLessonId] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [showCertModal, setShowCertModal] = useState(false);
  const [certData, setCertData] = useState<any>(null);

  // Get progress
  const { data: progress } = useQuery({
    queryKey: ["lesson-progress", id, user?.id],
    queryFn: async () => {
      if (!lessons) return [];
      const lessonIds = lessons.map((l) => l.id);
      const { data } = await supabase
        .from("lesson_progress")
        .select("*")
        .eq("user_id", user!.id)
        .in("lesson_id", lessonIds);
      return data || [];
    },
    enabled: !!lessons && !!user,
  });

  // Get enrollment for last_lesson_id
  const { data: enrollment } = useQuery({
    queryKey: ["enrollment-learn", id, user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("enrollments")
        .select("*")
        .eq("course_id", id!)
        .eq("user_id", user!.id)
        .single();
      return data;
    },
    enabled: !!user,
  });

  // Set initial lesson
  useEffect(() => {
    if (lessons && lessons.length > 0 && !currentLessonId) {
      const lastLesson = enrollment?.last_lesson_id;
      setCurrentLessonId(lastLesson || lessons[0].id);
      setExpandedSections(new Set(sectionIds));
    }
  }, [lessons, enrollment]);

  const currentLesson = lessons?.find((l) => l.id === currentLessonId);
  const completedCount = (progress || []).filter((p: any) => p.completed).length;
  const totalLessons = lessons?.length || 0;
  const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  // YouTube player
  useEffect(() => {
    if (!currentLesson?.video_url) return;
    const videoId = extractYouTubeId(currentLesson.video_url);
    if (!videoId) return;

    const loadPlayer = () => {
      if (ytPlayerRef.current) ytPlayerRef.current.destroy();
      ytPlayerRef.current = new (window as any).YT.Player("yt-player", {
        videoId,
        playerVars: { rel: 0, modestbranding: 1, hl: "ar", color: "white" },
        events: {
          onReady: (e: any) => {
            const savedProgress = (progress || []).find((p: any) => p.lesson_id === currentLessonId);
            if (savedProgress && savedProgress.video_position > 0) {
              e.target.seekTo(savedProgress.video_position, true);
            }
          },
        },
      });
    };

    if ((window as any).YT?.Player) {
      loadPlayer();
    } else {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(tag);
      (window as any).onYouTubeIframeAPIReady = loadPlayer;
    }

    return () => {
      if (saveIntervalRef.current) clearInterval(saveIntervalRef.current);
    };
  }, [currentLessonId, currentLesson?.video_url]);

  // Auto-save position every 10s
  useEffect(() => {
    if (saveIntervalRef.current) clearInterval(saveIntervalRef.current);
    saveIntervalRef.current = setInterval(() => {
      if (ytPlayerRef.current?.getCurrentTime && currentLessonId && user) {
        const pos = ytPlayerRef.current.getCurrentTime();
        supabase.from("lesson_progress").upsert({
          user_id: user.id,
          lesson_id: currentLessonId,
          video_position: pos,
        }, { onConflict: "user_id,lesson_id" }).then(() => {});
      }
    }, 10000);
    return () => { if (saveIntervalRef.current) clearInterval(saveIntervalRef.current); };
  }, [currentLessonId, user]);

  // Update last_lesson_id in enrollment
  useEffect(() => {
    if (currentLessonId && user && id) {
      supabase.from("enrollments").update({ last_lesson_id: currentLessonId }).eq("user_id", user.id).eq("course_id", id).then(() => {});
    }
  }, [currentLessonId]);

  const markComplete = useMutation({
    mutationFn: async (lessonId: string) => {
      const { error } = await supabase.from("lesson_progress").upsert({
        user_id: user!.id,
        lesson_id: lessonId,
        completed: true,
        completed_at: new Date().toISOString(),
      }, { onConflict: "user_id,lesson_id" });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lesson-progress", id] });
      const newCompleted = completedCount + 1;
      if (newCompleted >= totalLessons && totalLessons > 0) {
        issueCertificate();
      } else {
        toast({ title: "ممتاز!", description: "تم إكمال الدرس بنجاح، استمر يا بطل." });
      }
    },
  });

  const issueCertificate = async () => {
    try {
      const { data: existing } = await supabase
        .from("certificates")
        .select("*")
        .eq("user_id", user!.id)
        .eq("course_id", id!)
        .maybeSingle();
      if (existing) {
        setCertData({
          learnerName: profile?.full_name || user!.email || "",
          courseName: course?.title || "",
          certificateNumber: existing.certificate_number,
          issuedAt: existing.issued_at,
          instructor: course?.instructor,
        });
        setShowCertModal(true);
        return;
      }
      const { data: newCert, error } = await supabase.from("certificates").insert({
        user_id: user!.id,
        course_id: id!,
        certificate_number: "",
      }).select().single();
      if (!error && newCert) {
        setCertData({
          learnerName: profile?.full_name || user!.email || "",
          courseName: course?.title || "",
          certificateNumber: newCert.certificate_number,
          issuedAt: newCert.issued_at,
          instructor: course?.instructor,
        });
        setShowCertModal(true);
      }
    } catch {}
  };

  const isLessonCompleted = (lessonId: string) => {
    return (progress || []).some((p: any) => p.lesson_id === lessonId && p.completed);
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      next.has(sectionId) ? next.delete(sectionId) : next.add(sectionId);
      return next;
    });
  };

  const goToNextLesson = () => {
    if (!lessons || !currentLessonId) return;
    const idx = lessons.findIndex((l) => l.id === currentLessonId);
    if (idx < lessons.length - 1) {
      setCurrentLessonId(lessons[idx + 1].id);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-[#050806] font-tajawal overflow-hidden" dir="rtl">
      
      {/* ======================================= */}
      {/* الشريط العلوي (Top Header) */}
      {/* ======================================= */}
      <div className="h-16 border-b border-neutral-800/60 bg-[#0a0f0c] flex items-center justify-between px-4 lg:px-6 shrink-0 z-20 shadow-md">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(`/courses/${id}`)} 
            className="w-10 h-10 rounded-full flex items-center justify-center bg-[#121A15] border border-neutral-800 text-neutral-400 hover:text-white hover:border-emerald-500/50 transition-all"
            title="العودة للكورس"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
          <div className="hidden sm:block">
            <h1 className="font-bold text-sm text-white truncate max-w-md">{course?.title}</h1>
            <p className="text-xs text-neutral-500 mt-0.5">{completedCount} من {totalLessons} درس مكتمل</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end">
            <span className="text-xs font-bold text-emerald-500">{progressPercent}%</span>
          </div>
          <Progress 
            value={progressPercent} 
            className="w-24 sm:w-32 h-2.5 bg-neutral-800 overflow-hidden rounded-full [&>div]:bg-emerald-500" 
          />
        </div>
      </div>

      {/* ======================================= */}
      {/* التخطيط الأساسي (استوديو + قائمة جانبية) */}
      {/* ======================================= */}
      <div className="flex flex-col lg:flex-row h-[calc(100vh-4rem)]">
        
        {/* 1. العمود الأيمن: قائمة الدروس (Sidebar) */}
        {/* في الموبايل بتنزل تحت، في الكمبيوتر بتبقى يمين */}
        <div className="order-2 lg:order-1 w-full lg:w-[350px] border-l border-neutral-800/60 bg-[#0a0f0c] flex flex-col shrink-0 h-[40vh] lg:h-full z-10">
          <div className="p-4 border-b border-neutral-800/60 bg-[#121A15]">
            <h3 className="font-bold text-white text-sm">محتوى الكورس</h3>
          </div>
          
          <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-neutral-800 [&::-webkit-scrollbar-track]:bg-transparent">
            {(sections || []).map((section) => {
              const sectionLessons = (lessons || []).filter((l) => l.section_id === section.id);
              const isExpanded = expandedSections.has(section.id);
              return (
                <div key={section.id} className="border-b border-neutral-800/40">
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full px-5 py-4 flex items-center justify-between text-sm font-bold text-neutral-300 hover:text-white bg-[#0a0f0c] hover:bg-[#121A15] transition-colors"
                  >
                    <span className="truncate text-right leading-relaxed">{section.title}</span>
                    {isExpanded ? <ChevronUp className="w-4 h-4 shrink-0 text-emerald-500" /> : <ChevronDown className="w-4 h-4 shrink-0 text-neutral-500" />}
                  </button>
                  
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }} 
                        animate={{ height: "auto", opacity: 1 }} 
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden bg-[#050806]"
                      >
                        {sectionLessons.map((lesson) => {
                          const completed = isLessonCompleted(lesson.id);
                          const isCurrent = lesson.id === currentLessonId;
                          return (
                            <button
                              key={lesson.id}
                              onClick={() => setCurrentLessonId(lesson.id)}
                              className={`w-full px-5 py-3.5 flex items-start gap-3 text-sm transition-all border-r-2 ${
                                isCurrent 
                                  ? "bg-emerald-900/10 border-emerald-500 text-emerald-400" 
                                  : "border-transparent text-neutral-400 hover:bg-[#121A15] hover:text-white"
                              }`}
                            >
                              <div className="mt-0.5 shrink-0">
                                {completed ? (
                                  <CheckCircle className={`w-4 h-4 ${isCurrent ? 'text-emerald-500' : 'text-emerald-600'}`} />
                                ) : isCurrent ? (
                                  <PlayCircle className="w-4 h-4 text-emerald-500" />
                                ) : (
                                  <Circle className="w-4 h-4 text-neutral-600" />
                                )}
                              </div>
                              <span className="truncate text-right leading-relaxed font-medium">{lesson.title}</span>
                            </button>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. العمود الأيسر: منطقة الفيديو والتفاصيل */}
        <div className="order-1 lg:order-2 flex-1 flex flex-col bg-[#050806] overflow-hidden relative">
          
          {/* مساحة الفيديو */}
          <div className="w-full bg-black shrink-0 aspect-video lg:max-h-[70vh] flex items-center justify-center shadow-2xl relative z-10">
            {currentLesson?.video_url ? (
              <div id="yt-player" className="w-full h-full" />
            ) : (
              <div className="flex flex-col items-center justify-center text-neutral-500 gap-3">
                <PlayCircle className="w-12 h-12 opacity-50" />
                <p>لا يوجد فيديو متاح لهذا الدرس حالياً</p>
              </div>
            )}
          </div>

          {/* مساحة ما تحت الفيديو (التفاصيل والملفات) */}
          <div className="flex-1 overflow-y-auto p-5 lg:p-8 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-neutral-800 [&::-webkit-scrollbar-track]:bg-transparent">
            <div className="max-w-4xl mx-auto space-y-6">
              
              {/* العنوان وأزرار التحكم */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800/60 pb-6">
                <h2 className="text-2xl font-black text-white leading-relaxed">{currentLesson?.title}</h2>
                
                <div className="flex items-center gap-3 shrink-0">
                  {currentLessonId && !isLessonCompleted(currentLessonId) && (
                    <Button 
                      onClick={() => markComplete.mutate(currentLessonId)} 
                      disabled={markComplete.isPending}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-11 px-5 rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.2)] transition-all flex items-center gap-2"
                    >
                      {markComplete.isPending ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <Check className="w-4 h-4" />
                      )}
                      إكمال الدرس
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    onClick={goToNextLesson}
                    className="bg-transparent border-neutral-700 text-neutral-300 hover:bg-[#121A15] hover:text-white h-11 px-5 rounded-xl font-bold transition-all"
                  >
                    الدرس التالي
                  </Button>
                </div>
              </div>

              {/* الملف المرفق */}
              {currentLesson && (currentLesson as any).file_url && (
                <a
                  href={(currentLesson as any).file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 p-4 rounded-2xl bg-[#121A15] border border-neutral-800 hover:border-emerald-500/30 hover:bg-emerald-950/20 transition-all group w-full sm:w-auto"
                >
                  <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center group-hover:bg-emerald-500/10 transition-colors">
                    <FileText className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">تحميل مرفقات الدرس</span>
                    <span className="text-xs text-neutral-500 font-sans tracking-wider mt-0.5">PDF / DOC / ZIP</span>
                  </div>
                </a>
              )}

              {/* محتوى نصي للدرس */}
              {currentLesson && (currentLesson as any).content && (
                <div className="bg-[#0a0f0c] border border-neutral-800/60 rounded-3xl p-6 lg:p-8 mt-6">
                  <div className="prose prose-sm md:prose-base prose-invert max-w-none text-neutral-300 leading-loose whitespace-pre-wrap">
                    {(currentLesson as any).content}
                  </div>
                </div>
              )}
              
            </div>
          </div>
        </div>

      </div>

      {/* نافذة الشهادة */}
      {certData && (
        <CertificateModal
          open={showCertModal}
          onClose={() => setShowCertModal(false)}
          {...certData}
        />
      )}
    </div>
  );
};

function extractYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/))([^&?\s]+)/);
  return match ? match[1] : null;
}

export default LearnPage;
