import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const DatabaseDebug = () => {
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const checkDatabase = async () => {
    setLoading(true);
    try {
      // 檢查用戶
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('id, name, created_at')
        .order('created_at', { ascending: false });

      // 檢查game_records表結構
      const { data: gameRecords, error: gameRecordsError } = await supabase
        .from('game_records')
        .select('*')
        .order('completed_at', { ascending: false });

      // 檢查leaderboard視圖
      const { data: leaderboard, error: leaderboardError } = await supabase
        .from('leaderboard')
        .select('*')
        .limit(10);

      // 按用戶分組統計
      let userStats = {};
      if (gameRecords && gameRecords.length > 0) {
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
      }

      const debugData = {
        users: {
          data: users,
          error: usersError,
          count: users?.length || 0
        },
        gameRecords: {
          data: gameRecords,
          error: gameRecordsError,
          hasModeColumn: gameRecords && gameRecords.length > 0 && gameRecords[0].hasOwnProperty('mode'),
          count: gameRecords?.length || 0
        },
        leaderboard: {
          data: leaderboard,
          error: leaderboardError,
          hasModeColumn: leaderboard && leaderboard.length > 0 && leaderboard[0].hasOwnProperty('mode'),
          count: leaderboard?.length || 0
        },
        userStats: userStats
      };

      // 輸出到控制台供我查看
      console.log('🔍 資料庫調試結果:', debugData);
      
      // 生成簡潔的報告
      const report = {
        summary: {
          totalUsers: users?.length || 0,
          totalGameRecords: gameRecords?.length || 0,
          totalLeaderboardRecords: leaderboard?.length || 0,
          hasModeColumn: gameRecords && gameRecords.length > 0 && gameRecords[0].hasOwnProperty('mode')
        },
        userStats: Object.keys(userStats).map(userId => {
          const stats = userStats[userId];
          const user = users?.find(u => u.id === userId);
          return {
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
        })
      };
      
      console.log('📊 簡潔報告:', report);
      console.log('📋 請將上述報告複製給我，特別是「簡潔報告」部分');

      setDebugInfo(debugData);
    } catch (error) {
      console.error('Database check error:', error);
      setDebugInfo({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>資料庫調試</CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={checkDatabase} disabled={loading}>
          {loading ? '檢查中...' : '檢查資料庫狀態'}
        </Button>
        
        {debugInfo && (
          <div className="mt-4 space-y-4">
            {/* 統計概覽 */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="bg-blue-50 p-3 rounded">
                <h4 className="font-bold text-blue-800">用戶總數</h4>
                <p className="text-2xl font-bold text-blue-600">{debugInfo.users?.count || 0}</p>
              </div>
              <div className="bg-green-50 p-3 rounded">
                <h4 className="font-bold text-green-800">遊戲記錄總數</h4>
                <p className="text-2xl font-bold text-green-600">{debugInfo.gameRecords?.count || 0}</p>
              </div>
              <div className="bg-purple-50 p-3 rounded">
                <h4 className="font-bold text-purple-800">排行榜記錄數</h4>
                <p className="text-2xl font-bold text-purple-600">{debugInfo.leaderboard?.count || 0}</p>
              </div>
            </div>

            {/* 用戶統計 */}
            {debugInfo.userStats && Object.keys(debugInfo.userStats).length > 0 && (
              <div>
                <h3 className="font-bold text-lg mb-2">👥 用戶分數統計</h3>
                {Object.keys(debugInfo.userStats).map(userId => {
                  const stats = debugInfo.userStats[userId];
                  const user = debugInfo.users?.data?.find(u => u.id === userId);
                  const userName = user?.name || `用戶${userId.slice(0, 8)}`;
                  
                  return (
                    <div key={userId} className="bg-gray-50 p-3 rounded mb-2">
                      <h4 className="font-semibold">{userName}</h4>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div>
                          <span className="text-blue-600">普通模式:</span>
                          <br />
                          記錄數: {stats.normal.length}
                          <br />
                          最高分: {stats.normal.length > 0 ? Math.max(...stats.normal.map(r => r.score)) : '無'}
                        </div>
                        <div>
                          <span className="text-purple-600">多巴胺模式:</span>
                          <br />
                          記錄數: {stats.dopamine.length}
                          <br />
                          最高分: {stats.dopamine.length > 0 ? Math.max(...stats.dopamine.map(r => r.score)) : '無'}
                        </div>
                        <div>
                          <span className="text-gray-600">未知模式:</span>
                          <br />
                          記錄數: {stats.unknown.length}
                          <br />
                          最高分: {stats.unknown.length > 0 ? Math.max(...stats.unknown.map(r => r.score)) : '無'}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* 詳細數據 */}
            <div>
              <h3 className="font-bold">game_records 表</h3>
              <p>有mode欄位: {debugInfo.gameRecords?.hasModeColumn ? '是' : '否'}</p>
              <p>錯誤: {debugInfo.gameRecords?.error?.message || '無'}</p>
              <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto max-h-40">
                {JSON.stringify(debugInfo.gameRecords?.data, null, 2)}
              </pre>
            </div>
            
            <div>
              <h3 className="font-bold">leaderboard 視圖</h3>
              <p>有mode欄位: {debugInfo.leaderboard?.hasModeColumn ? '是' : '否'}</p>
              <p>錯誤: {debugInfo.leaderboard?.error?.message || '無'}</p>
              <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto max-h-40">
                {JSON.stringify(debugInfo.leaderboard?.data, null, 2)}
              </pre>
            </div>
            
            <div>
              <h3 className="font-bold">users 表</h3>
              <p>錯誤: {debugInfo.users?.error?.message || '無'}</p>
              <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto max-h-40">
                {JSON.stringify(debugInfo.users?.data, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
