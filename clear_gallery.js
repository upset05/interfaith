const { createClient } = require('@supabase/supabase-js');
const SUPABASE_URL = "https://jdgzxvwgvmssayobbdrz.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpkZ3p4dndndm1zc2F5b2JiZHJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwMTMxMDgsImV4cCI6MjA5NDU4OTEwOH0.2OydMDLfRXz5dT0lrHwk4SVOPJom4wC86FCXDJ5FLzQ";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function clear() {
  const { error } = await supabase.from('gallery').delete().neq('id', '');
  if (error) {
    console.error('Error clearing:', error);
  } else {
    console.log('Cleared Supabase gallery table successfully.');
  }
}
clear();
