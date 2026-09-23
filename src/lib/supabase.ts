import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!url || !key) {
  console.warn(
    "Supabase n'est pas configuré (VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY manquants). " +
    "Le suivi partagé des testeurs ne fonctionnera pas."
  );
}

export const supabase = createClient(url ?? "", key ?? "");

export const ADMIN_PASSCODE = import.meta.env.VITE_ADMIN_PASSCODE ?? "";
