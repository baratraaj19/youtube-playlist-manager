// lib/supabase.ts
import { createClient } from "@supabase/supabase-js"

// Initialize Supabase client with your Supabase URL and anon key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Create the Supabase client instance
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
