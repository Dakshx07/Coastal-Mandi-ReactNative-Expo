import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bdzmsakyfyrlvfzpbqev.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJkem1zYWt5ZnlybHZmenBicWV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5NTQxODEsImV4cCI6MjA4MDUzMDE4MX0.cbSVmV1ylDqJKBGIv_QoOQXBJsKl4gX18TwJ7DEtArg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});
