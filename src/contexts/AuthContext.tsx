import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";

type AppRole = "owner" | "admin" | "user";

interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone: string;
  avatar_url: string;
  is_suspended?: boolean; // العمود اللي ضفناه في السكيمه
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  roles: AppRole[];
  loading: boolean;
  isAdmin: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // 🛡️ دالة ذكية لجلب البيانات والتحقق من الحظر في خطوة واحدة
  const initializeUserData = async (userId: string) => {
    try {
      const [profileRes, rolesRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("user_id", userId).maybeSingle(),
        supabase.from("user_roles").select("role").eq("user_id", userId)
      ]);

      if (profileRes.data?.is_suspended) {
        // 🛑 إذا كان المستخدم محظوراً، نخرجه فوراً
        await supabase.auth.signOut();
        setProfile(null);
        setRoles([]);
        setUser(null);
        setSession(null);
        
        toast({
          title: "عذراً، الحساب معطل 🚫",
          description: "تم إيقاف صلاحية الوصول لهذا الحساب من قبل الإدارة.",
          variant: "destructive",
        });
        return;
      }

      setProfile(profileRes.data as Profile | null);
      setRoles((rolesRes.data || []).map((r: any) => r.role as AppRole));
    } catch (err) {
      console.error("Auth Init Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
    setRoles([]);
    setLoading(false);
  };

  useEffect(() => {
    // 1. فحص الجلسة عند تحميل الصفحة لأول مرة
    const checkInitialSession = async () => {
      const { data: { session: initialSession } } = await supabase.auth.getSession();
      setSession(initialSession);
      setUser(initialSession?.user ?? null);
      
      if (initialSession?.user) {
        await initializeUserData(initialSession.user.id);
      } else {
        setLoading(false);
      }
    };

    checkInitialSession();

    // 2. الاستماع لأي تغيير في حالة الدخول (Login/Logout/Token Refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        // نحدث الجلسة واليوزر فوراً
        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        if (event === "SIGNED_IN" && currentSession?.user) {
          await initializeUserData(currentSession.user.id);
        } else if (event === "SIGNED_OUT") {
          setProfile(null);
          setRoles([]);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const isAdmin = roles.includes("admin") || roles.includes("owner");

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        session, 
        profile, 
        roles, 
        loading, 
        isAdmin, 
        signOut, 
        refreshProfile: () => user ? initializeUserData(user.id) : Promise.resolve() 
      }}
    >
      {/* 🛑 لا نعرض محتوى الموقع إلا بعد التأكد من حالة المستخدم */}
      {!loading && children}
    </AuthContext.Provider>
  );
};
