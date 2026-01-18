import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Clock, RotateCcw, X, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { createPortal } from "react-dom";
import { useLanguage } from "@/hooks/useLanguage";

interface DopamineWinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRestart: () => void;
  onReturnToMain: () => void;
  score: number;
  timeLeft: number;
  difficulty: string;
  comboCount: number;
  mistakes: number;
  topScores: Array<{
    score: number;
    time: number;
    difficulty: string;
  }>;
  isNewRecord?: boolean;
}

export const DopamineWinModal = ({
  isOpen,
  onClose,
  onRestart,
  onReturnToMain,
  score,
  timeLeft,
  difficulty,
  comboCount,
  mistakes,
  topScores,
  isNewRecord = false
}: DopamineWinModalProps) => {
  const { t } = useLanguage();

  if (!isOpen) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'easy': return 'bg-green-500/20 text-green-600 border-green-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-600 border-yellow-500/30';
      case 'hard': return 'bg-orange-500/20 text-orange-600 border-orange-500/30';
      case 'expert': return 'bg-red-500/20 text-red-600 border-red-500/30';
      case 'hell': return 'bg-purple-500/20 text-purple-600 border-purple-500/30';
      default: return 'bg-gray-500/20 text-gray-600 border-gray-500/30';
    }
  };

  const getDifficultyLabel = (diff: string) => {
    return t(diff as any);
  };

  return createPortal(
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-2 sm:p-4 z-[9999]">
      <div className="w-full max-w-[400px] max-h-[95vh] sm:max-h-[90vh] overflow-auto">
        <Card className="glass rounded-2xl shadow-apple-lg m-2 sm:m-0">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div>
                  <CardTitle className="flex items-center gap-2 flex-wrap">
                    <span className="whitespace-nowrap">{t('dopamineMode')}</span>
                    <Badge
                      variant="secondary"
                      className="text-white relative overflow-hidden flowing-button flex-shrink-0"
                    >
                      <Zap className="h-3 w-3 mr-1" />
                      WELL DONE
                    </Badge>
                  </CardTitle>
                  <CardDescription className="mt-2">{t('congratulations')}</CardDescription>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose} className="mt-1 dopamine-close-btn">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          {/* 大型 WELL DONE 標題 */}
          <div className="text-center py-8">
            <div
              className="text-6xl md:text-8xl font-black flowing-text-well-done"
              style={{
                fontFamily: 'Huninn, sans-serif'
              }}
            >
              WELL DONE
            </div>
          </div>

          <CardContent className="space-y-6">
            {/* 本次遊戲統計 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 rounded-lg bg-card border">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Trophy className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-medium">{t('score')}</span>
                </div>
                <div className="text-lg font-bold text-primary">{score.toLocaleString()}</div>
              </div>

              <div className="text-center p-3 rounded-lg bg-card border">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">{t('remainingTime')}</span>
                </div>
                <div className="text-lg font-bold text-primary">{formatTime(timeLeft)}</div>
              </div>

              <div className="text-center p-3 rounded-lg bg-card border">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Zap className="h-4 w-4 text-purple-500" />
                  <span className="text-sm font-medium">{t('maxCombo')}</span>
                </div>
                <div className="text-lg font-bold text-primary">{comboCount}x</div>
              </div>

              <div className="text-center p-3 rounded-lg bg-card border">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Badge variant="outline" className={cn("text-xs", getDifficultyColor(difficulty))}>
                    {getDifficultyLabel(difficulty)}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground mt-1">{t('difficulty')}</div>
              </div>
            </div>

            {/* 多巴胺模式成就牆 */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                <h3 className="text-lg font-semibold">{t('dopamineAchievementWall')}</h3>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 rounded-lg bg-card border">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold bg-yellow-500 text-white">
                      1
                    </div>
                    <div>
                      <div className="font-medium text-muted-foreground">
                        {topScores.length > 0 ?
                          `${topScores[0].score.toLocaleString()} ${t('points')}` :
                          t('noTopScoreData')}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {getDifficultyLabel(difficulty)} {t('difficultyLevel')}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 操作按鈕 */}
            <div className="flex gap-3 pt-4">
              <Button
                onClick={onRestart}
                className="flex-1 h-12 text-lg font-bold sci-fi-button-glory"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                {t('againChallenge')}
              </Button>
              <Button variant="outline" onClick={onReturnToMain} className="flex-1 h-12">
                {t('returnToMainMenu')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>,
    document.body
  );
};
