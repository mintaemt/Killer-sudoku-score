import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Clock, Target, Star, RotateCcw, BarChart3 } from 'lucide-react';
import { formatTime, formatScore } from '@/lib/scoreCalculator';
import { Difficulty } from '@/lib/types';

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

const difficultyLabels: Record<Difficulty, string> = {
  easy: '簡單',
  medium: '中等',
  hard: '困難',
  expert: '專家'
};

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
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <Trophy className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-green-600">恭喜完成！</CardTitle>
          <CardDescription>
            您成功完成了 {difficultyLabels[difficulty]} 難度的遊戲
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 成績統計 */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg">
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-yellow-500" />
                <span className="font-medium">總分數</span>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">
                  {formatScore(score)}
                </div>
                {isNewRecord && (
                  <Badge variant="secondary" className="text-xs">
                    新紀錄！
                  </Badge>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">完成時間</span>
                </div>
                <span className="font-semibold">{formatTime(completionTime)}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Target className="h-4 w-4 text-red-500" />
                  <span className="text-sm">錯誤次數</span>
                </div>
                <span className="font-semibold">{mistakes}</span>
              </div>
            </div>

            {rank && (
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-center space-x-2">
                  <Trophy className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm font-medium">目前排名</span>
                </div>
                <span className="text-lg font-bold text-yellow-600">#{rank}</span>
              </div>
            )}
          </div>

          {/* 按鈕區域 */}
          <div className="space-y-3">
            <Button 
              onClick={onNewGame} 
              className="w-full"
              size="lg"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              再玩一次
            </Button>
            
            <Button 
              onClick={onShowLeaderboard} 
              variant="outline" 
              className="w-full"
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              查看排行榜
            </Button>
            
            <Button 
              onClick={onClose} 
              variant="ghost" 
              className="w-full"
            >
              關閉
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
