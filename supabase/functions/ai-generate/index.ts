// Edge Function: ai-generate
// بروكسي عام (متاح للزوار غير المسجلين لأن الطقس ومحصول الشهر
// بيظهروا للجميع في الصفحة الرئيسية)، لكن الـ prompts ثابتة ومبنية
// هنا في السيرفر بس — الفرونت إند بيبعت "action" + بيانات بسيطة،
// مش نص حر، عشان محدش يقدر يستخدم الفانكشن دي كـ API ذكاء اصطناعي
// مجاني مفتوح لأي حاجة تانية.

const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY");
const OPENROUTER_MODEL = "meta-llama/llama-3.3-70b-instruct";

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
      "X-Title": "نبتة",
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

  if (!OPENROUTER_API_KEY) {
    return new Response(JSON.stringify({ error: "مفتاح OpenRouter غير مضبوط على السيرفر" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const { action, data } = await req.json();

    if (action === "weather") {
      // data: { city, temp, humidity, windSpeed, isRaining }
      const { city, temp, humidity, windSpeed, isRaining } = data || {};
      if (typeof temp !== "number" || typeof humidity !== "number" || typeof windSpeed !== "number") {
        return new Response(JSON.stringify({ error: "بيانات طقس غير صالحة" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const prompt = `أنت مستشار زراعي طوارئ في مصر.
        الطقس اليوم في مدينة ${city || "مدينتك"}: الحرارة ${temp} درجة، الرطوبة ${humidity}%، وسرعة الرياح ${windSpeed} كم/ساعة. المطر: ${isRaining ? "يوجد" : "لا يوجد"}.
        اكتب نصيحة زراعية سريعة ومباشرة وتحذيرية للمزارع في جملة واحدة فقط (لا تزيد عن 15 كلمة).`;
      const content = await callOpenRouter(prompt, 0.4);
      return new Response(JSON.stringify({ content: content.replace(/["']/g, "") }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "crop") {
      const currentMonth = new Intl.DateTimeFormat("ar-EG", { month: "long" }).format(new Date());
      const prompt = `أنت خبير زراعي مصري محترف. الوقت الحالي هو شهر "${currentMonth}".
      بناءً على هذا الشهر والمناخ العام في مصر والشرق الأوسط، اقترح أفضل 3 محاصيل للزراعة الآن.
      يجب أن يكون ردك عبارة عن كائن JSON فقط (بدون أي نصوص إضافية أو علامات Markdown) بهذه الصيغة الدقيقة:
      {
        "monthName": "${currentMonth}",
        "season": "الفصل الحالي (مثال: الربيع)",
        "temp": "متوسط الحرارة (مثال: 15-25°C)",
        "water": "احتياج المياه (مثال: ري منتظم)",
        "crops": [
          { "name": "اسم المحصول", "icon": "رمز تعبيري واحد (Emoji)", "desc": "وصف زراعي مشجع ومختصر جداً في 10 كلمات" },
          { "name": "اسم المحصول", "icon": "رمز تعبيري واحد (Emoji)", "desc": "وصف زراعي مشجع ومختصر جداً في 10 كلمات" },
          { "name": "اسم المحصول", "icon": "رمز تعبيري واحد (Emoji)", "desc": "وصف زراعي مشجع ومختصر جداً في 10 كلمات" }
        ]
      }`;
      const content = await callOpenRouter(prompt, 0.3);
      return new Response(JSON.stringify({ content }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "action غير معروف" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("ai-generate function error:", err);
    return new Response(JSON.stringify({ error: "حصل خطأ في السيرفر" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
