import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hirffrdxvjutnqccssbv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhpcmZmcmR4dmp1dG5xY2Nzc2J2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE4OTAwOTcsImV4cCI6MjA0NzQ2NjA5N30.6GAyxBw3CgHCQ3GEnlYhdZCDQuCJV0sjDMQLDV1DdMo';
export const supabase = createClient(supabaseUrl, supabaseKey);
