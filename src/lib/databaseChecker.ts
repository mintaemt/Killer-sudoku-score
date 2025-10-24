/**
 * 資料庫狀態檢查 API
 * 提供完整的資料庫狀態檢查與報告生成功能
 */

import { supabase } from './supabase';
import {
  fetchUsers,
  fetchNormalRecords,
  fetchDopamineRecords,
  calculateUserStats
} from './databaseUtils';

/**
 * 資料庫狀態報告介面
 */
interface DatabaseStatusReport {
  summary: {
    totalUsers: number;
    totalNormalRecords: number;
    totalDopamineRecords: number;
    totalNormalLeaderboardRecords: number;
    totalDopamineLeaderboardRecords: number;
  };
  users: Array<{
    id: string;
    name: string;
    created_at: string;
  }>;
  userStats: Array<{
    userId: string;
    userName: string;
    normal: {
      count: number;
      bestScore: number | null;
    };
    dopamine: {
      count: number;
      bestScore: number | null;
    };
  }>;
  errors: {
    users: any;
    normalRecords: any;
    dopamineRecords: any;
    normalLeaderboard: any;
    dopamineLeaderboard: any;
  };
}

/**
 * 檢查資料庫狀態並生成完整報告
 * @returns 資料庫狀態報告或錯誤訊息
 */
export async function checkDatabaseStatus(): Promise<DatabaseStatusReport | { error: string; details: any }> {
  try {
    console.log('🔍 檢查資料庫狀態...\n');

    // 使用共用函數獲取資料
    const users = await fetchUsers();
    const normalRecords = await fetchNormalRecords();
    const dopamineRecords = await fetchDopamineRecords();

    // 處理獲取失敗的情況
    if (!users) {
      return { error: '獲取用戶失敗', details: null };
    }

    if (!normalRecords) {
      return { error: '獲取普通模式記錄失敗', details: null };
    }

    if (!dopamineRecords) {
      return { error: '獲取多巴胺模式記錄失敗', details: null };
    }

    // 檢查排行榜視圖
    const { data: normalLeaderboard, error: normalLeaderboardError } = await supabase
      .from('normal_leaderboard')
      .select('*')
      .limit(10);

    const { data: dopamineLeaderboard, error: dopamineLeaderboardError } = await supabase
      .from('dopamine_leaderboard')
      .select('*')
      .limit(10);

    // 計算使用者統計
    const userStats = calculateUserStats(users, normalRecords, dopamineRecords);

    // 生成報告
    const report: DatabaseStatusReport = {
      summary: {
        totalUsers: users.length,
        totalNormalRecords: normalRecords.length,
        totalDopamineRecords: dopamineRecords.length,
        totalNormalLeaderboardRecords: normalLeaderboard?.length || 0,
        totalDopamineLeaderboardRecords: dopamineLeaderboard?.length || 0
      },
      users: users.map(user => ({
        id: user.id,
        name: user.name,
        created_at: user.created_at
      })),
      userStats,
      errors: {
        users: null,
        normalRecords: null,
        dopamineRecords: null,
        normalLeaderboard: normalLeaderboardError,
        dopamineLeaderboard: dopamineLeaderboardError
      }
    };

    console.log('📊 資料庫狀態報告:');
    console.log(JSON.stringify(report, null, 2));
    
    return report;

  } catch (error) {
    console.error('❌ 檢查資料庫時發生錯誤:', error);
    return {
      error: '檢查資料庫失敗',
      details: error instanceof Error ? error.message : String(error)
    };
  }
}

// 在瀏覽器控制台中調用
if (typeof window !== 'undefined') {
  window.checkDatabaseStatus = checkDatabaseStatus;
}
