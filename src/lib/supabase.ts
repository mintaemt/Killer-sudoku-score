import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// 環境變數檢查：如果缺失則警告但不阻塞應用程式啟動
if (!supabaseUrl || !supabaseKey) {
  console.warn('⚠️ Missing Supabase environment variables.')
  console.warn('   VITE_SUPABASE_URL:', supabaseUrl ? '✓ Set' : '✗ Missing')
  console.warn('   VITE_SUPABASE_ANON_KEY:', supabaseKey ? '✓ Set' : '✗ Missing')
  console.warn('   Database features will be disabled. App will run in demo mode.')
}

// 使用預設值避免應用程式崩潰（demo mode）
const url = supabaseUrl || 'https://placeholder.supabase.co'
const key = supabaseKey || 'placeholder-key'

export const supabase = createClient(url, key, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
})

// 導出環境變數狀態供其他模組檢查
export const isSupabaseConfigured = !!(supabaseUrl && supabaseKey)
