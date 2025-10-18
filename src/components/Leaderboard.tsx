import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Trophy, Medal, Award, Crown, RefreshCw, X } from 'lucide-react';
import { useLeaderboard } from '@/hooks/useLeaderboard';
import { Difficulty, LeaderboardEntry } from '@/lib/types';
import { formatTime, formatScore } from '@/lib/scoreCalculator';

interface LeaderboardProps {
  currentUserId?: string;
  onClose?: () => void;
}

const difficultyLabels: Record<Difficulty, string> = {
  easy: '簡單',
  medium: '中等',
  hard: '困難',
  expert: '專家',
  hell: '地獄'
};

const difficultyColors: Record<Difficulty, string> = {
  easy: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  hard: 'bg-orange-100 text-orange-800',
  expert: 'bg-red-100 text-red-800',
  hell: 'bg-purple-100 text-purple-800'
};

const getRankIcon = (rank: number) => {
  if (rank === 1) return <Crown className="h-5 w-5 text-yellow-500" />;
  if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />;
  if (rank === 3) return <Award className="h-5 w-5 text-amber-600" />;
  return <Trophy className="h-4 w-4 text-muted-foreground" />;
};

const LeaderboardEntryItem = ({ entry, isCurrentUser }: { entry: LeaderboardEntry; isCurrentUser?: boolean }) => (
  <div className={`flex items-center justify-between p-3 rounded-lg border ${
    isCurrentUser ? 'bg-primary/5 border-primary' : 'bg-card'
  }`}>
    <div className="flex items-center space-x-3">
      <div className="flex items-center space-x-2">
        {getRankIcon(entry.rank)}
        <span className="font-semibold text-lg">#{entry.rank}</span>
      </div>
      <div>
        <div className="flex items-center space-x-2">
          <span className="font-medium">{entry.name}</span>
          {isCurrentUser && (
            <Badge variant="secondary" className="text-xs">
              您
            </Badge>
          )}
        </div>
        <div className="text-sm text-muted-foreground">
          {entry.games_played} 場遊戲
        </div>
      </div>
    </div>
    <div className="text-right">
      <div className="font-bold text-lg">{formatScore(entry.best_score)}</div>
      <div className="text-sm text-muted-foreground">
        {formatTime(entry.best_time)}
      </div>
    </div>
  </div>
);

export const Leaderboard = ({ currentUserId, onClose }: LeaderboardProps) => {
  const [activeTab, setActiveTab] = useState<string>("all");
  const selectedDifficulty = activeTab === "all" ? undefined : activeTab as Difficulty;
  const { leaderboard, loading, error, refetch } = useLeaderboard(selectedDifficulty);

  const handleRefresh = () => {
    refetch();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">載入排行榜中...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <Trophy className="h-6 w-6" />
              <span>排行榜</span>
            </CardTitle>
            <CardDescription>
              查看各難度的最佳成績
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4" />
            </Button>
            {onClose && (
              <Button variant="outline" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="all">
              全部
            </TabsTrigger>
            {Object.entries(difficultyLabels).map(([key, label]) => (
              <TabsTrigger key={key} value={key}>
                {label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {leaderboard.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                暫無排行榜資料
              </div>
            ) : (
              <div className="space-y-2">
                {leaderboard.map((entry, index) => (
                  <LeaderboardEntryItem
                    key={`${entry.name}-${entry.difficulty}-${index}`}
                    entry={entry}
                    isCurrentUser={currentUserId === entry.name}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
