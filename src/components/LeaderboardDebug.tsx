import { useLeaderboardDebug } from '@/hooks/useLeaderboardDebug';

export const LeaderboardDebug = () => {
  const { debugInfo, loading } = useLeaderboardDebug();

  if (loading) {
    return <div>載入調試信息中...</div>;
  }

  if (!debugInfo) {
    return <div>無法載入調試信息</div>;
  }

  return (
    <div className="p-4 space-y-4">
      <h3 className="text-lg font-bold">排行榜調試信息</h3>
      
      <div>
        <h4 className="font-semibold">遊戲記錄 (game_records):</h4>
        <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
          {JSON.stringify(debugInfo.gameRecords, null, 2)}
        </pre>
      </div>

      <div>
        <h4 className="font-semibold">用戶 (users):</h4>
        <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
          {JSON.stringify(debugInfo.users, null, 2)}
        </pre>
      </div>

      <div>
        <h4 className="font-semibold">排行榜視圖 (leaderboard):</h4>
        <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
          {JSON.stringify(debugInfo.leaderboard, null, 2)}
        </pre>
      </div>

      <div>
        <h4 className="font-semibold">簡單模式排行榜:</h4>
        <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
          {JSON.stringify(debugInfo.easyLeaderboard, null, 2)}
        </pre>
      </div>
    </div>
  );
};
