// 檢查Supabase連接狀態
import { supabase } from './supabase';

export async function checkSupabaseConnection() {
  console.log('🔍 檢查Supabase連接狀態...\n');
  
  try {
    // 檢查環境變數
    console.log('📋 環境變數檢查:');
    console.log('VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL ? '✅ 已設置' : '❌ 未設置');
    console.log('VITE_SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ 已設置' : '❌ 未設置');
    
    // 測試連接
    console.log('\n🔗 測試Supabase連接:');
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('❌ Supabase連接失敗:', error);
      return { success: false, error };
    }
    
    console.log('✅ Supabase連接成功');
    
    // 獲取用戶統計
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, name')
      .order('created_at', { ascending: false });
    
    if (usersError) {
      console.error('❌ 獲取用戶失敗:', usersError);
    } else {
      console.log(`📊 用戶數量: ${users.length}`);
      users.forEach((user, index) => {
        console.log(`   ${index + 1}. ${user.name} (${user.id})`);
      });
    }
    
    // 獲取遊戲記錄
    const { data: gameRecords, error: recordsError } = await supabase
      .from('game_records')
      .select('*')
      .order('completed_at', { ascending: false });
    
    if (recordsError) {
      console.error('❌ 獲取遊戲記錄失敗:', recordsError);
    } else {
      console.log(`🎮 遊戲記錄數量: ${gameRecords.length}`);
      
      if (gameRecords.length > 0) {
        const hasModeColumn = gameRecords[0].hasOwnProperty('mode');
        console.log(`📋 有mode欄位: ${hasModeColumn ? '是' : '否'}`);
        
        // 按用戶分組
        const userStats = {};
        gameRecords.forEach(record => {
          const userId = record.user_id;
          if (!userStats[userId]) {
            userStats[userId] = { normal: [], dopamine: [], unknown: [] };
          }
          const mode = record.mode || 'unknown';
          userStats[userId][mode].push(record);
        });
        
        console.log('\n👥 用戶分數統計:');
        Object.keys(userStats).forEach(userId => {
          const stats = userStats[userId];
          const user = users.find(u => u.id === userId);
          const userName = user?.name || `用戶${userId.slice(0, 8)}`;
          
          console.log(`\n   ${userName}:`);
          console.log(`     普通模式: ${stats.normal.length} 筆, 最高分: ${stats.normal.length > 0 ? Math.max(...stats.normal.map(r => r.score)) : '無'}`);
          console.log(`     多巴胺模式: ${stats.dopamine.length} 筆, 最高分: ${stats.dopamine.length > 0 ? Math.max(...stats.dopamine.map(r => r.score)) : '無'}`);
          console.log(`     未知模式: ${stats.unknown.length} 筆, 最高分: ${stats.unknown.length > 0 ? Math.max(...stats.unknown.map(r => r.score)) : '無'}`);
        });
      }
    }
    
    return { success: true, users, gameRecords };
    
  } catch (error) {
    console.error('❌ 檢查過程中發生錯誤:', error);
    return { success: false, error };
  }
}

// 在瀏覽器控制台中調用
if (typeof window !== 'undefined') {
  window.checkSupabaseConnection = checkSupabaseConnection;
}
