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
  is_suspended?: boolean;
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

// 🛡️ مكون الحماية من الحظر (داخلي)
const BanGuard = ({ children, profile, signOut }: { children: ReactNode, profile: Profile | null, signOut: () => void }) => {
  const { toast } = useToast();
  
  useEffect(() => {
    if (profile?.is_suspended) {
      toast({
        title: "الحساب معطل 🚫",
        description: "يرجى التواصل مع الإدارة لاستعادة الوصول.",
        variant: "destructive",
      });
      signOut();
    }
  }, [profile, signOut, toast]);

  if (profile?.is_suspended) return null; // منعه من رؤية أي شيء فوراً
  return <>{children}</>;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async (userId: string) => {
    try {
      const [pRes, rRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("user_id", userId).maybeSingle(),
        supabase.from("user_roles").select("role").eq("user_id", userId)
      ]);
      setProfile(pRes.data as Profile | null);
      setRoles((rRes.data || []).map((r: any) => r.role as AppRole));
    } catch (err) {
      console.error("Auth Data Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
    setRoles([]);
    setLoading(false);
  };

  useEffect(() => {
    // جلب الجلسة الأولية
    supabase.auth.getSession().then(({ data: { session: initSession } }) => {
      setSession(initSession);
      setUser(initSession?.user ?? null);
      if (initSession?.user) {
        fetchUserData(initSession.user.id);
      } else {
        setLoading(false);
      }
    });

    // مراقبة التغييرات
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      if (currentSession?.user) {
        fetchUserData(currentSession.user.id);
      } else {
        setProfile(null);
        setRoles([]);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const isAdmin = roles.includes("admin") || roles.includes("owner");

  return (
    <AuthContext.Provider value={{ 
      user, session, profile, roles, loading, isAdmin, 
      signOut: handleSignOut, 
      refreshProfile: () => user ? fetchUserData(user.id) : Promise.resolve() 
    }}>
      {loading ? (
        <div className="h-screen w-full flex items-center justify-center bg-black">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <BanGuard profile={profile} signOut={handleSignOut}>
          {children}
        </BanGuard>
      )}
    </AuthContext.Provider>
  );
};
