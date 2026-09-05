// Edge Function: admin-ai
// بروكسي مخصص لميزات الأدمن اللي بتستخدم ذكاء اصطناعي (رد ذكي على
// رسائل التواصل، ووصف كورس عند استيراد بلايليست يوتيوب). بيتأكد إن
// اللي بينده أدمن فعلاً قبل ما يكمل — مش أي مستخدم مسجل دخول بس.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY");
const OPENROUTER_MODEL = "meta-llama/llama-3.3-70b-instruct";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

async function callOpenRouter(prompt: string, temperature = 0.5) {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://nabta.app",
      "X-Title": "نبتة - لوحة الإدارة",
    },
    body: JSON.stringify({
      model: OPENROUTER_MODEL,
      messages: [{ role: "user", content: prompt }],
      temperature,
    }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error?.message || "OpenRouter error");
  return data.choices?.[0]?.message?.content?.trim() ?? "";
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "يجب تسجيل الدخول" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseClient = createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "يجب تسجيل الدخول" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // التأكد إن المستخدم أدمن فعلاً (مش أي مستخدم عادي)
    const { data: isAdminData } = await supabaseClient.rpc("is_admin", { _user_id: user.id });
    if (!isAdminData) {
      return new Response(JSON.stringify({ error: "هذه الميزة متاحة للأدمن فقط" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!OPENROUTER_API_KEY) {
      return new Response(JSON.stringify({ error: "مفتاح OpenRouter غير مضبوط على السيرفر" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { action, data } = await req.json();

    if (action === "message-reply") {
      const { userName, subject, message } = data || {};
      if (!subject || !message) {
        return new Response(JSON.stringify({ error: "بيانات ناقصة" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const prompt = `أنت موظف دعم فني محترف في منصة "نبتة" للتعليم الزراعي.
      اكتب رداً مهذباً جداً وودوداً على هذه الرسالة من ${userName || "الطالب"}.
      موضوع الرسالة: ${subject}
      نص الرسالة: ${message}
      تنبيه: اجعل الرد قصيراً، مباشراً، ومكتوباً باللغة العربية الفصحى. لا تضف أي مقدمات أو ملاحظات خارجية.`;
      const content = await callOpenRouter(prompt, 0.6);
      return new Response(JSON.stringify({ content }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "course-description") {
      const { courseName } = data || {};
      if (!courseName) {
        return new Response(JSON.stringify({ error: "اسم الكورس مطلوب" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const prompt = `أنت خبير محتوى تعليمي زراعي في منصة نبتة 🌱. اكتب وصفاً تسويقياً احترافياً ومبسطاً لكورس بعنوان '${courseName}' في 4 أسطر احترافية باللغة العربية فقط. بدون مقدمات.`;
      const content = await callOpenRouter(prompt, 0.5);
      return new Response(JSON.stringify({ content }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "action غير معروف" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("admin-ai function error:", err);
    return new Response(JSON.stringify({ error: "حصل خطأ في السيرفر" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
