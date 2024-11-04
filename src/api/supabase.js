import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://exbmkuafyiqtjfvtzxje.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4Ym1rdWFmeWlxdGpmdnR6eGplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA3Mzc2MzEsImV4cCI6MjA0NjMxMzYzMX0.a64q6dHmc1OpQYx-SJeieulZabYAA7-axuKewJnz3is";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
