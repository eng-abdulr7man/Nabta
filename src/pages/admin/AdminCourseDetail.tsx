import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, ChevronDown, ChevronUp, Video, FileText, Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCourse } from "@/hooks/useCourses";
import { useAuth } from "@/contexts/AuthContext";

const AdminCourseDetail = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data: course } = useCourse(id!);

  const { data: sections, isLoading: loadingSections } = useQuery({
    queryKey: ["admin-sections", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("sections").select("*").eq("course_id", id!).order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  const sectionIds = (sections || []).map((s: any) => s.id);
  const { data: lessons } = useQuery({
    queryKey: ["admin-lessons", sectionIds],
    queryFn: async () => {
      const { data, error } = await supabase.from("lessons").select("*").in("section_id", sectionIds).order("sort_order");
      if (error) throw error;
      return data;
    },
    enabled: sectionIds.length > 0,
  });

  const [showSectionForm, setShowSectionForm] = useState(false);
  const [editSectionId, setEditSectionId] = useState<string | null>(null);
  const [sectionTitle, setSectionTitle] = useState("");

  const [showLessonForm, setShowLessonForm] = useState<string | null>(null);
  const [editLessonId, setEditLessonId] = useState<string | null>(null);
  const [lessonForm, setLessonForm] = useState({ title: "", video_url: "", duration_minutes: 0, content: "", file_url: "" });
  const [uploading, setUploading] = useState(false);

  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["admin-sections", id] });
    queryClient.invalidateQueries({ queryKey: ["admin-lessons"] });
  };

  const logActivity = async (action: string, details: any = {}) => {
    if (user) {
      await supabase.from("activity_log").insert({ user_id: user.id, action, details });
    }
  };

  // Section mutations
  const saveSection = useMutation({
    mutationFn: async () => {
      const order = (sections?.length || 0) + 1;
      if (editSectionId) {
        const { error } = await supabase.from("sections").update({ title: sectionTitle }).eq("id", editSectionId);
        if (error) throw error;
        await logActivity("تحديث قسم", { section_title: sectionTitle, course_id: id });
      } else {
        const { error } = await supabase.from("sections").insert({ title: sectionTitle, course_id: id!, sort_order: order });
        if (error) throw error;
        await logActivity("إضافة قسم", { section_title: sectionTitle, course_id: id });
      }
    },
    onSuccess: () => {
      toast({ title: editSectionId ? "تم تحديث القسم" : "تم إضافة القسم" });
      invalidate();
      setShowSectionForm(false);
      setEditSectionId(null);
      setSectionTitle("");
    },
    onError: (err: any) => toast({ title: "خطأ", description: err.message, variant: "destructive" }),
  });

  const deleteSection = useMutation({
    mutationFn: async (sId: string) => {
      const section = sections?.find((s: any) => s.id === sId);
      await supabase.from("lessons").delete().eq("section_id", sId);
      const { error } = await supabase.from("sections").delete().eq("id", sId);
      if (error) throw error;
      await logActivity("حذف قسم", { section_title: section?.title, course_id: id });
    },
    onSuccess: () => { toast({ title: "تم حذف القسم" }); invalidate(); },
  });

  // File upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const filePath = `${id}/${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage.from("lesson-files").upload(filePath, file);
    if (uploadError) {
      toast({ title: "خطأ في رفع الملف", description: uploadError.message, variant: "destructive" });
      setUploading(false);
      return;
    }
    const { data: urlData } = supabase.storage.from("lesson-files").getPublicUrl(filePath);
    setLessonForm((prev) => ({ ...prev, file_url: urlData.publicUrl }));
    setUploading(false);
    toast({ title: "تم رفع الملف بنجاح" });
  };

  // Lesson mutations
  const saveLesson = useMutation({
    mutationFn: async (sectionId: string) => {
      const sectionLessons = (lessons || []).filter((l: any) => l.section_id === sectionId);
      const order = sectionLessons.length + 1;
      if (editLessonId) {
        const { error } = await supabase.from("lessons").update(lessonForm).eq("id", editLessonId);
        if (error) throw error;
        await logActivity("تحديث درس", { lesson_title: lessonForm.title, course_id: id });
      } else {
        const { error } = await supabase.from("lessons").insert({ ...lessonForm, section_id: sectionId, sort_order: order });
        if (error) throw error;
        await logActivity("إضافة درس", { lesson_title: lessonForm.title, course_id: id });
      }
    },
    onSuccess: () => {
      toast({ title: editLessonId ? "تم تحديث الدرس" : "تم إضافة الدرس" });
      invalidate();
      setShowLessonForm(null);
      setEditLessonId(null);
      setLessonForm({ title: "", video_url: "", duration_minutes: 0, content: "", file_url: "" });
    },
    onError: (err: any) => toast({ title: "خطأ", description: err.message, variant: "destructive" }),
  });

  const deleteLesson = useMutation({
    mutationFn: async (lId: string) => {
      const lesson = (lessons || []).find((l: any) => l.id === lId);
      const { error } = await supabase.from("lessons").delete().eq("id", lId);
      if (error) throw error;
      await logActivity("حذف درس", { lesson_title: lesson?.title, course_id: id });
    },
    onSuccess: () => { toast({ title: "تم حذف الدرس" }); invalidate(); },
  });

  const toggleSection = (sId: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      next.has(sId) ? next.delete(sId) : next.add(sId);
      return next;
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-black text-foreground">{course?.title || "..."}</h1>
          <p className="text-sm text-muted-foreground mt-1">إدارة الأقسام والدروس</p>
        </div>

        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">الأقسام</h2>
          <Button size="sm" className="bg-primary text-primary-foreground gap-1" onClick={() => { setShowSectionForm(true); setEditSectionId(null); setSectionTitle(""); }}>
            <Plus className="w-4 h-4" /> إضافة قسم
          </Button>
        </div>

        {showSectionForm && (
          <div className="glass-card p-4 flex gap-2">
            <input
              placeholder="عنوان القسم"
              value={sectionTitle}
              onChange={(e) => setSectionTitle(e.target.value)}
              className="flex-1 px-4 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <Button size="sm" onClick={() => saveSection.mutate()} disabled={saveSection.isPending} className="bg-primary text-primary-foreground">حفظ</Button>
            <Button size="sm" variant="outline" onClick={() => { setShowSectionForm(false); setEditSectionId(null); }}>إلغاء</Button>
          </div>
        )}

        {loadingSections ? (
          <div className="space-y-3">
            {Array.from({ length: 2 }).map((_, i) => <div key={i} className="glass-card h-16 animate-pulse" />)}
          </div>
        ) : (
          <div className="space-y-3">
            {(sections || []).map((section: any) => {
              const sectionLessons = (lessons || []).filter((l: any) => l.section_id === section.id);
              const isExpanded = expandedSections.has(section.id);

              return (
                <div key={section.id} className="glass-card overflow-hidden">
                  <div className="px-4 py-3 flex items-center justify-between bg-secondary/50">
                    <button onClick={() => toggleSection(section.id)} className="flex items-center gap-2 flex-1 text-right">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      <span className="font-bold text-sm text-foreground">{section.title}</span>
                      <span className="text-xs text-muted-foreground">({sectionLessons.length} دروس)</span>
                    </button>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setEditSectionId(section.id); setSectionTitle(section.title); setShowSectionForm(true); }}>
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => deleteSection.mutate(section.id)}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="divide-y divide-border">
                      {sectionLessons.map((lesson: any) => (
                        <div key={lesson.id} className="px-4 py-2.5 flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <Video className="w-4 h-4 text-muted-foreground shrink-0" />
                            <span className="text-foreground truncate">{lesson.title}</span>
                            {lesson.file_url && <FileText className="w-3.5 h-3.5 text-primary shrink-0" />}
                            {lesson.content && <span className="text-[10px] text-primary bg-primary/10 px-1.5 rounded shrink-0">نص</span>}
                            {lesson.duration_minutes > 0 && (
                              <span className="text-xs text-muted-foreground shrink-0">{lesson.duration_minutes} د</span>
                            )}
                          </div>
                          <div className="flex gap-1 shrink-0">
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => {
                              setEditLessonId(lesson.id);
                              setLessonForm({
                                title: lesson.title,
                                video_url: lesson.video_url || "",
                                duration_minutes: lesson.duration_minutes || 0,
                                content: lesson.content || "",
                                file_url: lesson.file_url || "",
                              });
                              setShowLessonForm(section.id);
                            }}>
                              <Pencil className="w-3.5 h-3.5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => deleteLesson.mutate(lesson.id)}>
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </div>
                      ))}

                      {showLessonForm === section.id ? (
                        <div className="p-4 space-y-3 bg-secondary/30">
                          <input
                            placeholder="عنوان الدرس"
                            value={lessonForm.title}
                            onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                          />
                          <input
                            placeholder="رابط فيديو YouTube"
                            value={lessonForm.video_url}
                            onChange={(e) => setLessonForm({ ...lessonForm, video_url: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                            dir="ltr"
                          />
                          <input
                            type="number"
                            placeholder="المدة بالدقائق"
                            value={lessonForm.duration_minutes || ""}
                            onChange={(e) => setLessonForm({ ...lessonForm, duration_minutes: parseInt(e.target.value) || 0 })}
                            className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                          />
                          
                          {/* Content text */}
                          <div>
                            <label className="text-xs font-medium text-muted-foreground mb-1 block">نص أسفل الدرس (اختياري)</label>
                            <textarea
                              placeholder="أضف شرحاً أو ملاحظات للدرس..."
                              value={lessonForm.content}
                              onChange={(e) => setLessonForm({ ...lessonForm, content: e.target.value })}
                              rows={4}
                              className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                            />
                          </div>

                          {/* File upload */}
                          <div>
                            <label className="text-xs font-medium text-muted-foreground mb-1 block">ملف مرفق (اختياري)</label>
                            {lessonForm.file_url ? (
                              <div className="flex items-center gap-2 p-2 rounded-lg bg-primary/5 border border-primary/20">
                                <FileText className="w-4 h-4 text-primary shrink-0" />
                                <a href={lessonForm.file_url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary truncate flex-1 hover:underline">
                                  {lessonForm.file_url.split("/").pop()}
                                </a>
                                <button onClick={() => setLessonForm({ ...lessonForm, file_url: "" })} className="text-destructive hover:text-destructive/80">
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ) : (
                              <label className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary border border-dashed border-border text-muted-foreground text-sm cursor-pointer hover:border-primary/50 transition-colors">
                                <Upload className="w-4 h-4" />
                                <span>{uploading ? "جاري الرفع..." : "اختر ملفاً"}</span>
                                <input type="file" className="hidden" onChange={handleFileUpload} disabled={uploading} />
                              </label>
                            )}
                          </div>

                          <div className="flex gap-2">
                            <Button size="sm" onClick={() => saveLesson.mutate(section.id)} disabled={saveLesson.isPending} className="bg-primary text-primary-foreground">حفظ</Button>
                            <Button size="sm" variant="outline" onClick={() => { setShowLessonForm(null); setEditLessonId(null); }}>إلغاء</Button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setShowLessonForm(section.id);
                            setEditLessonId(null);
                            setLessonForm({ title: "", video_url: "", duration_minutes: 0, content: "", file_url: "" });
                          }}
                          className="w-full px-4 py-2.5 text-xs text-primary hover:bg-primary/5 transition-colors flex items-center gap-1 justify-center"
                        >
                          <Plus className="w-3.5 h-3.5" /> إضافة درس
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {!loadingSections && (!sections || sections.length === 0) && (
          <div className="text-center py-12 text-muted-foreground">
            <p>لا توجد أقسام بعد. أضف قسماً لبدء إضافة الدروس.</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminCourseDetail;
