/**
 * Supabase 連接狀態檢查工具
 * 檢查資料庫連接、環境變數配置，並輸出統計資訊
 */

import { supabase } from './supabase';
import {
  fetchUsers,
  fetchNormalRecords,
  fetchDopamineRecords,
  calculateUserStats
} from './databaseUtils';

/**
 * 連接檢查結果介面
 */
interface ConnectionCheckResult {
  success: boolean;
  error?: any;
  users?: any[];
  normalRecords?: any[];
  dopamineRecords?: any[];
}

/**
 * 檢查 Supabase 連接狀態
 * @returns 連接檢查結果
 */
export async function checkSupabaseConnection(): Promise<ConnectionCheckResult> {
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
    
    // 使用共用函數獲取資料
    const users = await fetchUsers();
    const normalRecords = await fetchNormalRecords();
    const dopamineRecords = await fetchDopamineRecords();
    
    if (!users) {
      console.error('❌ 獲取用戶失敗');
    } else {
      console.log(`📊 用戶數量: ${users.length}`);
      users.forEach((user, index) => {
        console.log(`   ${index + 1}. ${user.name} (${user.id})`);
      });
    }
    
    if (!normalRecords) {
      console.error('❌ 獲取普通模式記錄失敗');
    } else {
      console.log(`🎮 普通模式記錄數量: ${normalRecords.length}`);
    }
    
    if (!dopamineRecords) {
      console.error('❌ 獲取多巴胺模式記錄失敗');
    } else {
      console.log(`🎮 多巴胺模式記錄數量: ${dopamineRecords.length}`);
    }
    
    // 合併統計
    const totalRecords = (normalRecords?.length || 0) + (dopamineRecords?.length || 0);
    console.log(`📊 總遊戲記錄數量: ${totalRecords}`);
    
    if (totalRecords > 0 && users && normalRecords && dopamineRecords) {
      const userStats = calculateUserStats(users, normalRecords, dopamineRecords);
      
      console.log('\n👥 用戶分數統計:');
      userStats.forEach(stat => {
        console.log(`\n   ${stat.userName}:`);
        console.log(`     普通模式: ${stat.normal.count} 筆, 最高分: ${stat.normal.bestScore ?? '無'}`);
        console.log(`     多巴胺模式: ${stat.dopamine.count} 筆, 最高分: ${stat.dopamine.bestScore ?? '無'}`);
      });
    }
    
    return { success: true, users, normalRecords, dopamineRecords };
    
  } catch (error) {
    console.error('❌ 檢查過程中發生錯誤:', error);
    return { success: false, error };
  }
}

// 在瀏覽器控制台中調用
if (typeof window !== 'undefined') {
  window.checkSupabaseConnection = checkSupabaseConnection;
}
