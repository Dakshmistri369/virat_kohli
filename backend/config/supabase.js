import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

let supabase = null;
let isConnected = false;

if (supabaseUrl && supabaseAnonKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
    isConnected = true;
    console.log('🚀 Supabase client initialized successfully.');
  } catch (error) {
    console.error('❌ Failed to initialize Supabase client:', error.message);
    isConnected = false;
  }
} else {
  console.warn('⚠️ Supabase environment credentials (SUPABASE_URL, SUPABASE_ANON_KEY) are missing.');
  console.log('Backend will operate in Mock Database Mode using local seedData.');
}

export { supabase, isConnected };
