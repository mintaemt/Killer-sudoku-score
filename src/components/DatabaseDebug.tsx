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

      // 檢查 normal_records 表
      const { data: normalRecords, error: normalRecordsError } = await supabase
        .from('normal_records')
        .select('*')
        .order('completed_at', { ascending: false });

      // 檢查 dopamine_records 表
      const { data: dopamineRecords, error: dopamineRecordsError } = await supabase
        .from('dopamine_records')
        .select('*')
        .order('completed_at', { ascending: false });

      // 檢查 normal_leaderboard 視圖
      const { data: normalLeaderboard, error: normalLeaderboardError } = await supabase
        .from('normal_leaderboard')
        .select('*')
        .limit(10);

      // 檢查 dopamine_leaderboard 視圖
      const { data: dopamineLeaderboard, error: dopamineLeaderboardError } = await supabase
        .from('dopamine_leaderboard')
        .select('*')
        .limit(10);

      // 按用戶分組統計
      let userStats = {};
      if (normalRecords && normalRecords.length > 0) {
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

      if (dopamineRecords && dopamineRecords.length > 0) {
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

      const debugData = {
        users: {
          data: users,
          error: usersError,
          count: users?.length || 0
        },
        normalRecords: {
          data: normalRecords,
          error: normalRecordsError,
          count: normalRecords?.length || 0
        },
        dopamineRecords: {
          data: dopamineRecords,
          error: dopamineRecordsError,
          count: dopamineRecords?.length || 0
        },
        normalLeaderboard: {
          data: normalLeaderboard,
          error: normalLeaderboardError,
          count: normalLeaderboard?.length || 0
        },
        dopamineLeaderboard: {
          data: dopamineLeaderboard,
          error: dopamineLeaderboardError,
          count: dopamineLeaderboard?.length || 0
        },
        userStats: userStats
      };

      // 輸出到控制台供我查看
      console.log('🔍 資料庫調試結果:', debugData);
      
      // 生成簡潔的報告
      const report = {
        summary: {
          totalUsers: users?.length || 0,
          totalNormalRecords: normalRecords?.length || 0,
          totalDopamineRecords: dopamineRecords?.length || 0,
          totalNormalLeaderboardRecords: normalLeaderboard?.length || 0,
          totalDopamineLeaderboardRecords: dopamineLeaderboard?.length || 0
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
            <div className="grid grid-cols-5 gap-4 mb-4">
              <div className="bg-blue-50 p-3 rounded">
                <h4 className="font-bold text-blue-800">用戶總數</h4>
                <p className="text-2xl font-bold text-blue-600">{debugInfo.users?.count || 0}</p>
              </div>
              <div className="bg-green-50 p-3 rounded">
                <h4 className="font-bold text-green-800">普通模式記錄</h4>
                <p className="text-2xl font-bold text-green-600">{debugInfo.normalRecords?.count || 0}</p>
              </div>
              <div className="bg-purple-50 p-3 rounded">
                <h4 className="font-bold text-purple-800">多巴胺模式記錄</h4>
                <p className="text-2xl font-bold text-purple-600">{debugInfo.dopamineRecords?.count || 0}</p>
              </div>
              <div className="bg-orange-50 p-3 rounded">
                <h4 className="font-bold text-orange-800">普通排行榜</h4>
                <p className="text-2xl font-bold text-orange-600">{debugInfo.normalLeaderboard?.count || 0}</p>
              </div>
              <div className="bg-pink-50 p-3 rounded">
                <h4 className="font-bold text-pink-800">多巴胺排行榜</h4>
                <p className="text-2xl font-bold text-pink-600">{debugInfo.dopamineLeaderboard?.count || 0}</p>
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
                      <div className="grid grid-cols-2 gap-2 text-sm">
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
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* 詳細數據 */}
            <div>
              <h3 className="font-bold">normal_records 表</h3>
              <p>錯誤: {debugInfo.normalRecords?.error?.message || '無'}</p>
              <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto max-h-40">
                {JSON.stringify(debugInfo.normalRecords?.data, null, 2)}
              </pre>
            </div>
            
            <div>
              <h3 className="font-bold">dopamine_records 表</h3>
              <p>錯誤: {debugInfo.dopamineRecords?.error?.message || '無'}</p>
              <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto max-h-40">
                {JSON.stringify(debugInfo.dopamineRecords?.data, null, 2)}
              </pre>
            </div>
            
            <div>
              <h3 className="font-bold">normal_leaderboard 視圖</h3>
              <p>錯誤: {debugInfo.normalLeaderboard?.error?.message || '無'}</p>
              <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto max-h-40">
                {JSON.stringify(debugInfo.normalLeaderboard?.data, null, 2)}
              </pre>
            </div>
            
            <div>
              <h3 className="font-bold">dopamine_leaderboard 視圖</h3>
              <p>錯誤: {debugInfo.dopamineLeaderboard?.error?.message || '無'}</p>
              <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto max-h-40">
                {JSON.stringify(debugInfo.dopamineLeaderboard?.data, null, 2)}
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
