import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Clock, Target, Star, RotateCcw, BarChart3, X } from 'lucide-react';
import { formatTime, formatScore } from '@/lib/scoreCalculator';
import { Difficulty } from '@/lib/types';
import { useLanguage } from '@/hooks/useLanguage';

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
  isNewRecord = false
}: GameCompleteModalProps) => {
  const { t } = useLanguage();
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md relative">
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="absolute top-2 right-2 h-8 w-8 p-0 hover:bg-muted/50"
        >
          <X className="h-4 w-4" />
        </Button>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Trophy className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl text-primary">{t('congratulationsComplete')}</CardTitle>
          <CardDescription>
            {t('successfullyCompletedGame')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 成績統計 */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {/* 左上：目前排名 */}
              {rank && (
                <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg border border-primary/20">
                  <div className="flex items-center space-x-2">
                    <Trophy className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">{t('currentRank')}</span>
                  </div>
                  <span className="text-lg font-bold text-primary">#{rank}</span>
                </div>
              )}

              {/* 右上：總分數 */}
              <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg border border-primary/20">
                <div className="flex items-center space-x-2">
                  <Star className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">{t('totalScore')}</span>
                </div>
                <div className="text-right flex flex-col items-end">
                  <div className="text-lg font-bold text-primary">
                    {formatScore(score)}
                  </div>
                  {isNewRecord && (
                    <Badge variant="secondary" className="text-xs mt-1">
                      {t('newRecord')}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* 左下：完成時間 */}
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <span className="text-sm">{t('completionTime')}</span>
                </div>
                <span className="font-semibold">{formatTime(completionTime)}</span>
              </div>

              {/* 右下：錯誤次數 */}
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Target className="h-4 w-4 text-primary" />
                  <span className="text-sm">{t('errorCount')}</span>
                </div>
                <span className="font-semibold">{mistakes}</span>
              </div>
            </div>
          </div>

          {/* 按鈕區域 */}
          <div className="space-y-3">
            <Button 
              onClick={onNewGame} 
              className="w-full"
              size="lg"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              {t('playAgain')}
            </Button>
            
            <Button 
              onClick={onShowLeaderboard} 
              variant="outline" 
              className="w-full hover:bg-muted/50 hover:text-foreground"
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              {t('viewLeaderboardButton')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};