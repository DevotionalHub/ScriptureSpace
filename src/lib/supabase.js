import { createClient } from '@supabase/supabase-js'

// These are safe to use in a browser. For another project, set VITE_SUPABASE_URL
// and VITE_SUPABASE_ANON_KEY in a local .env file.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://yjefiadfhdqnxlnxycul.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_9fYGWOCU_Sd65cleswrd7w_v06x22rO'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})

export const ADMIN_EMAIL = 'sixtusonoriode2@gmail.com'
