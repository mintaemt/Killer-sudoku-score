import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Trophy, Medal, Award, Crown, RefreshCw, X } from 'lucide-react';
import { useLeaderboard } from '@/hooks/useLeaderboard';
import { useLanguage } from '@/hooks/useLanguage';
import { Difficulty, LeaderboardEntry } from '@/lib/types';
import { formatTime, formatScore } from '@/lib/scoreCalculator';

interface LeaderboardProps {
  currentUserId?: string;
  onClose?: () => void;
  mode?: 'normal' | 'dopamine';
}

const getDifficultyLabel = (difficulty: Difficulty, t: (key: string) => string): string => {
  return t(difficulty);
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

const LeaderboardEntryItem = ({ entry, isCurrentUser, t }: { entry: LeaderboardEntry; isCurrentUser?: boolean; t: (key: string) => string }) => (
  <div className={`flex items-center justify-between p-2.5 rounded-lg border ${
    isCurrentUser ? 'bg-primary/5 border-primary' : 'bg-card'
  }`}>
    <div className="flex items-center space-x-2.5">
      <div className="flex items-center space-x-1.5">
        {getRankIcon(entry.rank)}
        <span className="font-semibold text-base">#{entry.rank}</span>
      </div>
      <div>
        <div className="flex items-center space-x-1.5">
          <span className="font-medium text-sm">{entry.name}</span>
          {isCurrentUser && (
            <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
              您
            </Badge>
          )}
        </div>
        <div className="text-xs text-muted-foreground">
          {entry.games_played} {t('gamesPlayed')}
        </div>
      </div>
    </div>
    <div className="text-right">
      <div className="font-bold text-base">{formatScore(entry.best_score)}</div>
      <div className="text-xs text-muted-foreground">
        {formatTime(entry.best_time)}
      </div>
    </div>
  </div>
);

export const Leaderboard = ({ currentUserId, onClose, mode = 'normal' }: LeaderboardProps) => {
  const [activeTab, setActiveTab] = useState<string>("all");
  const selectedDifficulty = activeTab === "all" ? undefined : activeTab as Difficulty;
  const { leaderboard, loading, error, refetch } = useLeaderboard(selectedDifficulty, mode);
  const { t } = useLanguage();

  // 根據模式決定顯示的難度
  const availableDifficulties = mode === 'normal' 
    ? ['easy', 'medium', 'hard', 'expert'] as Difficulty[]
    : ['easy', 'medium', 'hard', 'expert', 'hell'] as Difficulty[];

  const handleRefresh = () => {
    refetch();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">{t('loadingStats')}...</span>
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
    <div className="w-full">
      <div className="px-4 py-3 border-b">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold flex items-center space-x-2">
              <Trophy className="h-5 w-5" />
              <span>{mode === 'dopamine' ? t('highestScoreDisplay') : t('leaderboard')}</span>
            </h3>
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
      </div>
      <div className="px-4 py-3">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-center">
            <TabsList className={`inline-flex w-auto ${mode === 'normal' ? 'grid-cols-5' : 'grid-cols-6'}`}>
            <TabsTrigger value="all" className="px-3 py-1.5 text-xs">
              {t('all')}
            </TabsTrigger>
            {availableDifficulties.map((difficulty) => (
              <TabsTrigger key={difficulty} value={difficulty} className="px-3 py-1.5 text-xs">
                {getDifficultyLabel(difficulty, t)}
              </TabsTrigger>
            ))}
          </TabsList>
          </div>

          <TabsContent value={activeTab} className="mt-4">
            {leaderboard.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {t('noData')}
              </div>
            ) : (
              <div className="space-y-2">
                {leaderboard.map((entry, index) => (
                  <LeaderboardEntryItem
                    key={`${entry.name}-${entry.difficulty}-${index}`}
                    entry={entry}
                    isCurrentUser={currentUserId === entry.name}
                    t={t}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
