import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://gtqpzbrrtscxscaihofo.supabase.co'
const supabaseAnonKey = 'sb_publishable_58JKs2xR7FzEpng-WovKLw_3iooEIFs'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)