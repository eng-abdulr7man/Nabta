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
  is_suspended?: boolean; // ضفنا العمود الجديد هنا
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

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error) throw error;

      // 🛑 الفحص الجوهري: لو الحساب موقوف، اطرد المستخدم فوراً
      if (data?.is_suspended) {
        await supabase.auth.signOut();
        setProfile(null);
        setUser(null);
        setSession(null);
        setRoles([]);
        
        toast({
          title: "حسابك موقوف 🚫",
          description: "تم إيقاف صلاحية الوصول لهذا الحساب. يرجى التواصل مع الإدارة.",
          variant: "destructive",
        });
        return;
      }

      setProfile(data as Profile | null);
    } catch (err) {
      console.error("Error fetching profile:", err);
      setProfile(null);
    }
  };

  const fetchRoles = async (userId: string) => {
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId);
    setRoles((data || []).map((r: any) => r.role as AppRole));
  };

  const refreshProfile = async () => {
    if (user) {
      await Promise.all([fetchProfile(user.id), fetchRoles(user.id)]);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
    setRoles([]);
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          // فحص البروفايل فور تسجيل الدخول أو تغيير الحالة
          await fetchProfile(session.user.id);
          await fetchRoles(session.user.id);
        } else {
          setProfile(null);
          setRoles([]);
        }
        setLoading(false);
      }
    );

    // Initial check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
        fetchRoles(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const isAdmin = roles.includes("admin") || roles.includes("owner");

  return (
    <AuthContext.Provider value={{ user, session, profile, roles, loading, isAdmin, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
