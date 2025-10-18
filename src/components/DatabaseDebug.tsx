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
      // 檢查game_records表結構
      const { data: gameRecords, error: gameRecordsError } = await supabase
        .from('game_records')
        .select('*')
        .limit(5);

      // 檢查leaderboard視圖
      const { data: leaderboard, error: leaderboardError } = await supabase
        .from('leaderboard')
        .select('*')
        .limit(5);

      // 檢查用戶
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('*')
        .limit(5);

      setDebugInfo({
        gameRecords: {
          data: gameRecords,
          error: gameRecordsError,
          hasModeColumn: gameRecords && gameRecords.length > 0 && gameRecords[0].hasOwnProperty('mode')
        },
        leaderboard: {
          data: leaderboard,
          error: leaderboardError,
          hasModeColumn: leaderboard && leaderboard.length > 0 && leaderboard[0].hasOwnProperty('mode')
        },
        users: {
          data: users,
          error: usersError
        }
      });
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
