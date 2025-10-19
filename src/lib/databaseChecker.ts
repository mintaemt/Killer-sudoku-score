// 資料庫狀態檢查API
import { supabase } from './supabase';

export async function checkDatabaseStatus() {
  try {
    console.log('🔍 檢查資料庫狀態...\n');

    // 1. 檢查用戶
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, name, created_at')
      .order('created_at', { ascending: false });

    if (usersError) {
      console.error('❌ 獲取用戶失敗:', usersError);
      return { error: '獲取用戶失敗', details: usersError };
    }

    // 2. 檢查普通模式記錄
    const { data: normalRecords, error: normalRecordsError } = await supabase
      .from('normal_records')
      .select('*')
      .order('completed_at', { ascending: false });

    if (normalRecordsError) {
      console.error('❌ 獲取普通模式記錄失敗:', normalRecordsError);
      return { error: '獲取普通模式記錄失敗', details: normalRecordsError };
    }

    // 3. 檢查多巴胺模式記錄
    const { data: dopamineRecords, error: dopamineRecordsError } = await supabase
      .from('dopamine_records')
      .select('*')
      .order('completed_at', { ascending: false });

    if (dopamineRecordsError) {
      console.error('❌ 獲取多巴胺模式記錄失敗:', dopamineRecordsError);
      return { error: '獲取多巴胺模式記錄失敗', details: dopamineRecordsError };
    }

    // 4. 檢查普通模式排行榜
    const { data: normalLeaderboard, error: normalLeaderboardError } = await supabase
      .from('normal_leaderboard')
      .select('*')
      .limit(10);

    // 5. 檢查多巴胺模式排行榜
    const { data: dopamineLeaderboard, error: dopamineLeaderboardError } = await supabase
      .from('dopamine_leaderboard')
      .select('*')
      .limit(10);

    // 6. 按用戶分組統計
    const userStats = {};
    
    // 處理普通模式記錄
    if (normalRecords) {
      normalRecords.forEach(record => {
        const userId = record.user_id;
        if (!userStats[userId]) {
          userStats[userId] = {
            normal: [],
            dopamine: []
          };
        }
        userStats[userId].normal.push(record);
      });
    }

    // 處理多巴胺模式記錄
    if (dopamineRecords) {
      dopamineRecords.forEach(record => {
        const userId = record.user_id;
        if (!userStats[userId]) {
          userStats[userId] = {
            normal: [],
            dopamine: []
          };
        }
        userStats[userId].dopamine.push(record);
      });
    }

    // 7. 生成報告
    const report = {
      summary: {
        totalUsers: users.length,
        totalNormalRecords: normalRecords?.length || 0,
        totalDopamineRecords: dopamineRecords?.length || 0,
        totalNormalLeaderboardRecords: normalLeaderboard?.length || 0,
        totalDopamineLeaderboardRecords: dopamineLeaderboard?.length || 0
      },
      users: users.map(user => ({
        id: user.id,
        name: user.name,
        created_at: user.created_at
      })),
      userStats: Object.keys(userStats).map(userId => {
        const stats = userStats[userId];
        const user = users.find(u => u.id === userId);
        return {
          userId: userId,
          userName: user?.name || `用戶${userId.slice(0, 8)}`,
          normal: {
            count: stats.normal.length,
            bestScore: stats.normal.length > 0 ? Math.max(...stats.normal.map(r => r.score)) : null
          },
          dopamine: {
            count: stats.dopamine.length,
            bestScore: stats.dopamine.length > 0 ? Math.max(...stats.dopamine.map(r => r.score)) : null
          }
        };
      }),
      errors: {
        users: usersError,
        normalRecords: normalRecordsError,
        dopamineRecords: dopamineRecordsError,
        normalLeaderboard: normalLeaderboardError,
        dopamineLeaderboard: dopamineLeaderboardError
      }
    };

    console.log('📊 資料庫狀態報告:');
    console.log(JSON.stringify(report, null, 2));
    
    return report;

  } catch (error) {
    console.error('❌ 檢查資料庫時發生錯誤:', error);
    return { error: '檢查資料庫失敗', details: error.message };
  }
}

// 在瀏覽器控制台中調用
if (typeof window !== 'undefined') {
  window.checkDatabaseStatus = checkDatabaseStatus;
}
