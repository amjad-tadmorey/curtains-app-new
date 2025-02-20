import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://vdjblatinyspmrqpbdaf.supabase.co'
const supabaseKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZkamJsYXRpbnlzcG1ycXBiZGFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk3NjE1MDMsImV4cCI6MjA0NTMzNzUwM30.x76riu6w0eU0AyhmAANBX6uHmY7DWLUD8TJNGIgDyYE"
const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase