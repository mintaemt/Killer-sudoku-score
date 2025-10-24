/**
 * 資料庫查詢工具函數
 * 提供共用的資料庫查詢邏輯，避免重複程式碼
 */

import { supabase } from './supabase';

/**
 * 資料庫統計資訊介面
 */
export interface DatabaseStats {
  totalUsers: number;
  totalNormalRecords: number;
  totalDopamineRecords: number;
  users: Array<{
    id: string;
    name: string;
    created_at: string;
  }>;
  normalRecords: any[];
  dopamineRecords: any[];
}

/**
 * 使用者統計資訊介面
 */
export interface UserStatsData {
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
}

/**
 * 獲取所有使用者資料
 * @returns 使用者列表或 null（如果查詢失敗）
 */
export async function fetchUsers() {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, name, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ 獲取使用者失敗:', error);
      return null;
    }

    return data;
  } catch (err) {
    console.error('❌ 查詢使用者時發生錯誤:', err);
    return null;
  }
}

/**
 * 獲取普通模式遊戲記錄
 * @param limit 限制返回的記錄數量（預設：無限制）
 * @returns 遊戲記錄列表或 null（如果查詢失敗）
 */
export async function fetchNormalRecords(limit?: number) {
  try {
    let query = supabase
      .from('normal_records')
      .select('*')
      .order('completed_at', { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error('❌ 獲取普通模式記錄失敗:', error);
      return null;
    }

    return data;
  } catch (err) {
    console.error('❌ 查詢普通模式記錄時發生錯誤:', err);
    return null;
  }
}

/**
 * 獲取多巴胺模式遊戲記錄
 * @param limit 限制返回的記錄數量（預設：無限制）
 * @returns 遊戲記錄列表或 null（如果查詢失敗）
 */
export async function fetchDopamineRecords(limit?: number) {
  try {
    let query = supabase
      .from('dopamine_records')
      .select('*')
      .order('completed_at', { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error('❌ 獲取多巴胺模式記錄失敗:', error);
      return null;
    }

    return data;
  } catch (err) {
    console.error('❌ 查詢多巴胺模式記錄時發生錯誤:', err);
    return null;
  }
}

/**
 * 計算使用者統計資訊
 * @param users 使用者列表
 * @param normalRecords 普通模式記錄
 * @param dopamineRecords 多巴胺模式記錄
 * @returns 使用者統計資訊陣列
 */
export function calculateUserStats(
  users: Array<{ id: string; name: string }>,
  normalRecords: Array<{ user_id: string; score: number }>,
  dopamineRecords: Array<{ user_id: string; score: number }>
): UserStatsData[] {
  const userStatsMap: Record<string, {
    normal: Array<{ score: number }>;
    dopamine: Array<{ score: number }>;
  }> = {};

  // 處理普通模式記錄
  normalRecords.forEach(record => {
    const userId = record.user_id;
    if (!userStatsMap[userId]) {
      userStatsMap[userId] = { normal: [], dopamine: [] };
    }
    userStatsMap[userId].normal.push({ score: record.score });
  });

  // 處理多巴胺模式記錄
  dopamineRecords.forEach(record => {
    const userId = record.user_id;
    if (!userStatsMap[userId]) {
      userStatsMap[userId] = { normal: [], dopamine: [] };
    }
    userStatsMap[userId].dopamine.push({ score: record.score });
  });

  // 生成統計結果
  return Object.keys(userStatsMap).map(userId => {
    const stats = userStatsMap[userId];
    const user = users.find(u => u.id === userId);
    const userName = user?.name || `使用者${userId.slice(0, 8)}`;

    return {
      userId,
      userName,
      normal: {
        count: stats.normal.length,
        bestScore: stats.normal.length > 0
          ? Math.max(...stats.normal.map(r => r.score))
          : null
      },
      dopamine: {
        count: stats.dopamine.length,
        bestScore: stats.dopamine.length > 0
          ? Math.max(...stats.dopamine.map(r => r.score))
          : null
      }
    };
  });
}

/**
 * 獲取完整的資料庫統計資訊
 * @returns 資料庫統計資訊或 null（如果查詢失敗）
 */
export async function fetchDatabaseStats(): Promise<DatabaseStats | null> {
  try {
    const [users, normalRecords, dopamineRecords] = await Promise.all([
      fetchUsers(),
      fetchNormalRecords(),
      fetchDopamineRecords()
    ]);

    if (!users || !normalRecords || !dopamineRecords) {
      return null;
    }

    return {
      totalUsers: users.length,
      totalNormalRecords: normalRecords.length,
      totalDopamineRecords: dopamineRecords.length,
      users,
      normalRecords,
      dopamineRecords
    };
  } catch (err) {
    console.error('❌ 獲取資料庫統計時發生錯誤:', err);
    return null;
  }
}

