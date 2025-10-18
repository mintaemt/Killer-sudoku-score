// 資料庫狀態檢查API
import { createClient } from '@supabase/supabase-js';

// 您需要提供這些值
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_KEY';

const supabase = createClient(supabaseUrl, supabaseKey);

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

    // 2. 檢查遊戲記錄
    const { data: gameRecords, error: recordsError } = await supabase
      .from('game_records')
      .select('*')
      .order('completed_at', { ascending: false });

    if (recordsError) {
      console.error('❌ 獲取遊戲記錄失敗:', recordsError);
      return { error: '獲取遊戲記錄失敗', details: recordsError };
    }

    // 3. 檢查排行榜
    const { data: leaderboard, error: leaderboardError } = await supabase
      .from('leaderboard')
      .select('*')
      .limit(10);

    // 4. 分析數據
    const hasModeColumn = gameRecords.length > 0 && gameRecords[0].hasOwnProperty('mode');
    
    // 按用戶分組統計
    const userStats = {};
    gameRecords.forEach(record => {
      const userId = record.user_id;
      if (!userStats[userId]) {
        userStats[userId] = {
          normal: [],
          dopamine: [],
          unknown: []
        };
      }
      
      const mode = record.mode || 'unknown';
      userStats[userId][mode].push(record);
    });

    // 5. 生成報告
    const report = {
      summary: {
        totalUsers: users.length,
        totalGameRecords: gameRecords.length,
        totalLeaderboardRecords: leaderboard?.length || 0,
        hasModeColumn: hasModeColumn
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
          },
          unknown: {
            count: stats.unknown.length,
            bestScore: stats.unknown.length > 0 ? Math.max(...stats.unknown.map(r => r.score)) : null
          }
        };
      }),
      errors: {
        users: usersError,
        gameRecords: recordsError,
        leaderboard: leaderboardError
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
