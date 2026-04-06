import { createClient } from '@supabase/supabase-js';

// Ye dono values aapne Supabase dashboard se leni hain
const supabaseUrl = 'https://poxtajllifhrkrxqyjgq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBveHRhamxsaWZocmtyeHF5amdxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzMDkyOTAsImV4cCI6MjA5MDg4NTI5MH0.Oh-DZ_1nsBQw6lJEFwfZgZv-OxawRkhNPjBkLEhEoh4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);


