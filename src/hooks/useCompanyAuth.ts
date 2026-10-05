import { useState, useCallback, useEffect, createContext, useContext, ReactNode, createElement } from "react";
import { supabase } from "@/lib/supabase";

export interface CompanyProfile {
  id: string;
  companyName: string;
  companyType: string;
  contactName: string;
  contactEmail: string;
}

async function loadCompany(uid: string): Promise<CompanyProfile | null> {
  const { data: row, error } = await supabase
    .from("companies")
    .select("*")
    .eq("id", uid)
    .maybeSingle();

  if (error || !row) return null;

  return {
    id: row.id,
    companyName: row.company_name,
    companyType: row.company_type,
    contactName: row.contact_name,
    contactEmail: row.contact_email
  };
}

function useCompanyAuthState() {
  const [company, setCompany] = useState<CompanyProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    supabase.auth.getSession().then(async ({ data }) => {
      const uid = data.session?.user.id;
      const c = uid ? await loadCompany(uid) : null;
      if (active) {
        setCompany(c);
        setLoading(false);
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const uid = session?.user.id;
      const c = uid ? await loadCompany(uid) : null;
      if (active) setCompany(c);
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const register = useCallback(
    async (companyName: string, companyType: string, contactName: string, contactEmail: string, password: string) => {
      const { data, error } = await supabase.auth.signUp({ email: contactEmail, password });
      if (error) throw error;
      const uid = data.user?.id;
      if (!uid) throw new Error("Inscription impossible : aucune session créée.");

      const { error: insertError } = await supabase.from("companies").insert({
        id: uid,
        company_name: companyName,
        company_type: companyType,
        contact_name: contactName,
        contact_email: contactEmail
      });
      if (insertError) throw insertError;

      const newCompany: CompanyProfile = {
        id: uid, companyName, companyType, contactName, contactEmail
      };
      setCompany(newCompany);
      return newCompany;
    },
    []
  );

  const login = useCallback(async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    const uid = data.user.id;
    const c = await loadCompany(uid);
    if (!c) {
      await supabase.auth.signOut();
      throw new Error("Ce compte n'est pas un compte entreprise. Utilisez la connexion apprenant.");
    }
    setCompany(c);
    return c;
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setCompany(null);
  }, []);

  return { company, loading, register, login, logout };
}

type CompanyAuthContextValue = ReturnType<typeof useCompanyAuthState>;

const CompanyAuthContext = createContext<CompanyAuthContextValue | null>(null);

export function CompanyAuthProvider({ children }: { children: ReactNode }) {
  const value = useCompanyAuthState();
  return createElement(CompanyAuthContext.Provider, { value }, children);
}

export function useCompanyAuth() {
  const ctx = useContext(CompanyAuthContext);
  if (!ctx) {
    throw new Error("useCompanyAuth doit être utilisé à l'intérieur d'un <CompanyAuthProvider>");
  }
  return ctx;
}
