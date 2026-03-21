import { supabase } from "@/integrations/supabase/client";

/**
 * دالة لتسجيل أي نشاط يحدث في المنصة
 * @param action نوع الحدث (مثال: "تسجيل دخول", "حذف كورس", "شراء باقة")
 * @param details تفاصيل إضافية (اختياري)
 */
export const logActivity = async (action: string, details: Record<string, any> = {}) => {
  try {
    // جلب الـ ID بتاع المستخدم الحالي (لو مسجل دخول)
    const { data: { user } } = await supabase.auth.getUser();
    
    const { error } = await supabase.from("activity_log").insert([{
      user_id: user?.id || null, // لو مفيش يوزر، هيتسجل كمجهول/نظام
      action: action,
      details: details
    }]);

    if (error) {
      console.error("فشل تسجيل النشاط:", error);
    }
  } catch (err) {
    console.error("خطأ في نظام المراقبة:", err);
  }
};
