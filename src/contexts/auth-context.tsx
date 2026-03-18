import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: "USER" | "ADMIN";
  image?: string | null;
}

interface AuthContextValue {
  data: { user: SessionUser } | null;
  isPending: boolean;
  refresh: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  data: null,
  isPending: true,
  refresh: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [isPending, setIsPending] = useState(true);
  const [tick, setTick] = useState(0);

  const refresh = () => setTick((t) => t + 1);

  useEffect(() => {
    let mounted = true;

    async function loadUser(userId: string, email: string) {
      const { data } = await supabase
        .from("profiles")
        .select("name, role")
        .eq("id", userId)
        .single();

      if (mounted) {
        setUser({
          id: userId,
          email,
          name: data?.name ?? email,
          role: (data?.role as "USER" | "ADMIN") ?? "USER",
          image: null,
        });
        setIsPending(false);
      }
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        loadUser(session.user.id, session.user.email ?? "");
      } else {
        if (mounted) {
          setUser(null);
          setIsPending(false);
        }
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setIsPending(true);
        loadUser(session.user.id, session.user.email ?? "");
      } else {
        if (mounted) {
          setUser(null);
          setIsPending(false);
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [tick]);

  return (
    <AuthContext.Provider value={{ data: user ? { user } : null, isPending, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useSession() {
  return useContext(AuthContext);
}

export async function signOut() {
  return supabase.auth.signOut();
}
