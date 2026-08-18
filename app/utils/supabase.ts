import { createClient } from "@supabase/supabase-js";

// These utilize the environment variables we discussed
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey);

// Use placeholders to avoid crashing during initialization if variables are missing
export const supabase = createClient(
  supabaseUrl || "https://placeholder-url.supabase.co", 
  supabaseKey || "placeholder-key"
);