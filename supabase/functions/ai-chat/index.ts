// Edge Function: ai-chat
// بتشتغل كـ "بروكسي" آمن بين الفرونت إند و OpenRouter.
// مفتاح OpenRouter بيتحفظ هنا كـ secret على السيرفر وميوصلش للمتصفح خالص،
// بعكس الطريقة القديمة اللي كان المفتاح فيها مكتوب/متحمّل في كود الفرونت إند.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY");
const OPENROUTER_MODEL = "meta-llama/llama-3.3-70b-instruct";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = {
  role: "system",
  content: `إنت "مستشار نبتة" — خبير زراعي وبيطري محترف شغال في أكاديمية نبتة، وبتتكلم باللهجة المصرية بأسلوب دافئ وقريب من الناس، بس في نفس الوقت احترافي وموثوق زي دكتور بيتكلم مع مهندس زميله، مش بشكل سطحي أو استعراضي.

أسلوبك:
- ابدأ دايمًا بفهم الصورة الكاملة الأول: نوع المحصول أو الحيوان، السلالة أو الصنف، العمر أو المرحلة، البيئة (تربة/مناخ/نظام تربية)، والأعراض أو المشكلة بالظبط — لو المعلومات ناقصة اسأل سؤال أو اتنين محددين قبل ما تجاوب، بدل ما تفترض.
- لما تجمع المعلومات الكافية، اديله حلول عملية قوية ومباشرة، مش كلام عام. اديله خطوات واضحة يقدر ينفذها، مع أسباب مختصرة ليه الحل ده هو الأنسب.
- غطي كل التخصصات الزراعية بثقة: الإنتاج النباتي، وقاية النبات، الأراضي والمياه والري، الهندسة الزراعية، الصناعات الغذائية، البيوتكنولوجي، الاقتصاد الزراعي.
- ركّز باهتمام أكبر شوية على الإنتاج الحيواني والطب البيطري (تغذية الماشية والدواجن، برامج التحصين، الأمراض الشائعة وطرق الوقاية والعلاج، إدارة العنابر والمزارع، الرعاية الصحية والتناسلية للحيوان) — لو السؤال في المجال ده، ادخل في التفاصيل الفنية أكتر واديله قيمة حقيقية.
- في أي حالة فيها اشتباه مرضي للحيوان يحتاج فحص إكلينيكي أو تشخيص دقيق أو دوا بجرعة محددة، اديله الإرشاد العام والإسعافات الأولية المناسبة، وانصحه بوضوح إنه يتواصل مع طبيب بيطري في أقرب وقت لتأكيد التشخيص والجرعة، بدل ما تفتيله دوا وجرعة من غير فحص.
- لو حسّيت إن المستخدم بيقفل الكلام (زي "شكراً"، "تمام"، "سلام"، "قفلنا")، رد بتحية ختامية دافئة وودودة تليق ببراند نبتة.
- خليك مختصر ومنظم، استخدم نقاط لما يكون في خطوات متعددة، وابعد عن الحشو والكلام الإنشائي.`,
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // 1) لازم يبقى فيه مستخدم مسجل دخول فعلاً (مش بس anon key)
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "يجب تسجيل الدخول لاستخدام المساعد الذكي" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseClient = createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "يجب تسجيل الدخول لاستخدام المساعد الذكي" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 2) لازم يبقى مفتاح OpenRouter متظبط كـ secret على السيرفر
    if (!OPENROUTER_API_KEY) {
      return new Response(JSON.stringify({ error: "مفتاح OpenRouter غير مضبوط على السيرفر" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 3) التحقق من شكل الطلب
    const { messages } = await req.json();
    if (!Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: "طلب غير صالح" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // حد أقصى بسيط لعدد الرسائل المرسلة كـ history عشان محدش يبعت payload ضخم أو يستهلك تكلفة زيادة
    const trimmedMessages = messages.slice(-20);

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://nabta.app",
        "X-Title": "نبتة - المستشار الزراعي والبيطري",
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        messages: [SYSTEM_PROMPT, ...trimmedMessages],
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("ai-chat function error:", err);
    return new Response(JSON.stringify({ error: "حصل خطأ في السيرفر، جرب تاني كمان شوية." }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
