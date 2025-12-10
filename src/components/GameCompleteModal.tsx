import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Clock, Target, Star, RotateCcw, BarChart3, X } from 'lucide-react';
import { formatTime, formatScore } from '@/lib/scoreCalculator';
import { Difficulty } from '@/lib/types';
import { useLanguage } from '@/hooks/useLanguage';
import { Leaderboard } from './Leaderboard';

interface GameCompleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNewGame: () => void;
  onShowLeaderboard: () => void;
  score: number;
  completionTime: number;
  mistakes: number;
  difficulty: Difficulty;
  rank?: number;
  isNewRecord?: boolean;
  currentUserId?: string;
}

const difficultyColors: Record<Difficulty, string> = {
  easy: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  hard: 'bg-orange-100 text-orange-800',
  expert: 'bg-red-100 text-red-800'
};

export const GameCompleteModal = ({
  isOpen,
  onClose,
  onNewGame,
  onShowLeaderboard,
  score,
  completionTime,
  mistakes,
  difficulty,
  rank,
  isNewRecord = false,
  currentUserId
}: GameCompleteModalProps) => {
  const { t } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-[400px] max-h-[90vh] overflow-auto">
        <Card className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute top-2 right-2 h-8 w-8 p-0 hover:bg-muted/50 z-10"
          >
            <X className="h-4 w-4" />
          </Button>

          {/* 上半部分：遊戲完成資訊 */}
          <CardHeader className="text-center pb-4">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 shadow-md">
              <Trophy className="h-8 w-8 text-primary drop-shadow-md" />
            </div>
            <CardTitle className="text-2xl text-primary drop-shadow-md">{t('congratulationsComplete')}</CardTitle>
            <CardDescription>
              {t('successfullyCompletedGame')}
            </CardDescription>
          </CardHeader>

          <CardContent className="px-4 pb-0">
            {/* 成績統計 - 單排並列 */}
            <div className="flex gap-3 mb-4">
              {/* 時間 */}
              <div className="flex-1 flex flex-col items-center p-3 bg-muted/50 rounded-lg shadow-md border border-border/50">
                <Clock className="h-4 w-4 text-primary mb-1.5 drop-shadow-sm" />
                <span className="text-xs text-muted-foreground mb-1">{t('completionTime')}</span>
                <span className="text-base font-semibold">{formatTime(completionTime)}</span>
              </div>

              {/* 分數 */}
              <div className="flex-1 flex flex-col items-center p-3 bg-primary/10 rounded-lg border border-primary/30 shadow-md">
                <Star className="h-4 w-4 text-primary mb-1.5 drop-shadow-sm" />
                <span className="text-xs text-muted-foreground mb-1">{t('totalScore')}</span>
                <div className="text-center">
                  <div className="text-xl font-bold text-primary drop-shadow-md">
                    {formatScore(score)}
                  </div>
                  {isNewRecord && (
                    <Badge variant="secondary" className="text-xs mt-1">
                      {t('newRecord')}
                    </Badge>
                  )}
                </div>
              </div>

              {/* 錯誤次數 */}
              <div className="flex-1 flex flex-col items-center p-3 bg-muted/50 rounded-lg shadow-md border border-border/50">
                <Target className="h-4 w-4 text-primary mb-1.5 drop-shadow-sm" />
                <span className="text-xs text-muted-foreground mb-1">{t('errorCount')}</span>
                <div className="text-center">
                  <span className="text-base font-semibold">{mistakes}</span>
                </div>
              </div>
            </div>

            {/* 目前排名 - 如果有排名 */}
            {rank && (
              <div className="flex items-center justify-center p-2.5 bg-primary/5 rounded-lg border border-primary/20 mb-4 shadow-md">
                <Trophy className="h-4 w-4 text-primary mr-2 drop-shadow-sm" />
                <span className="text-sm font-medium">{t('currentRank')}</span>
                <span className="text-lg font-bold text-primary ml-2">#{rank}</span>
              </div>
            )}

            {/* 按鈕區域 */}
            <div className="flex justify-center mb-4">
              <Button
                onClick={onNewGame}
                size="lg"
                className="px-6 py-2.5 text-sm font-medium h-11"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                {t('playAgain')}
              </Button>
            </div>
          </CardContent>

          {/* 下半部分：排行榜 - 直接貼到獲勝資訊卡底部 */}
          <div className="border-t-0">
            <Leaderboard
              currentUserId={currentUserId}
              mode="normal"
            />
          </div>
        </Card>
      </div>
    </div>
  );
};