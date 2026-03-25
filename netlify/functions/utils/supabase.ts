import { createClient } from "@supabase/supabase-js";

const supabaseUrl = (process.env.SUPABASE_URL || 'https://xxlyfyacvcehqbduhmyy.supabase.co').trim();
const rawServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabaseServiceKey = rawServiceKey.trim() || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.dummy';

export const supabase = createClient(supabaseUrl, supabaseServiceKey);

export const getApiKeyFromSupabase = async (userEmail: string, provider: string) => {
  if (supabaseServiceKey === 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.dummy') return null;
  
  const { data, error } = await supabase
    .from('api_keys')
    .select('api_key')
    .eq('user_email', userEmail)
    .eq('provider', provider)
    .maybeSingle();

  if (error) {
    console.error(`Error fetching ${provider} key from Supabase:`, error);
    return null;
  }
  return data?.api_key || null;
};
