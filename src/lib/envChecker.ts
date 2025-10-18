// 環境變數檢查工具
export function checkEnvironment() {
  console.log('🔍 檢查環境變數...');
  
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  console.log('VITE_SUPABASE_URL:', supabaseUrl ? '✅ 已設置' : '❌ 未設置');
  console.log('VITE_SUPABASE_ANON_KEY:', supabaseKey ? '✅ 已設置' : '❌ 未設置');
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ 環境變數未正確設置！');
    console.log('請檢查 .env 文件是否包含：');
    console.log('VITE_SUPABASE_URL=your_supabase_url');
    console.log('VITE_SUPABASE_ANON_KEY=your_supabase_anon_key');
    return false;
  }
  
  console.log('✅ 環境變數設置正確');
  return true;
}

// 測試Supabase連接
export async function testSupabaseConnection() {
  console.log('🔗 測試Supabase連接...');
  
  try {
    const { createClient } = await import('@supabase/supabase-js');
    
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('環境變數未設置');
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // 測試連接
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('❌ Supabase連接失敗:', error);
      return false;
    }
    
    console.log('✅ Supabase連接成功');
    return true;
    
  } catch (error) {
    console.error('❌ 測試連接時發生錯誤:', error);
    return false;
  }
}

// 在瀏覽器控制台中調用
if (typeof window !== 'undefined') {
  window.checkEnvironment = checkEnvironment;
  window.testSupabaseConnection = testSupabaseConnection;
}
