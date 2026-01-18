import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
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

  const getDifficultyLabel = (diff: string) => {
    return t(diff as any);
  };

  return createPortal(
    <div className="fixed inset-0 flex items-center justify-center p-2 sm:p-4 z-[9999]">
      {/* 黑色半透明遮罩 (確保文字可讀性) */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-[-1]" />

      <div className="relative w-full max-w-[400px] max-h-[95vh] sm:max-h-[90vh] overflow-auto z-10">
        <Card className="dopamine-card-diamond">
          <CardHeader className="pb-2">
            <div className="flex items-start justify-end">
              <Button variant="ghost" size="sm" onClick={onClose} className="dopamine-close-btn">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          {/* 大型 WELL DONE 標題 (Sharp Font) */}
          <div className="text-center py-6">
            <div className="text-6xl md:text-7xl font-black tracking-tighter italic text-white drop-shadow-[0_0_15px_rgba(0,243,255,0.5)] bg-clip-text text-transparent bg-gradient-to-b from-white to-cyan-200"
              style={{ fontFamily: 'ui-sans-serif, system-ui, sans-serif' }}>
              WELL DONE
            </div>
            <CardDescription className="text-cyan-200/50 uppercase tracking-widest text-xs mt-2"
              style={{ fontFamily: 'ui-sans-serif, system-ui, sans-serif' }}>
              {t('congratulations')}
            </CardDescription>
          </div>

          <CardContent className="space-y-6">
            {/* 本次遊戲統計 - Minimalist Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="dopamine-stat-box">
                <span className="dopamine-stat-label">{t('score')}</span>
                <span className="dopamine-stat-value">{score.toLocaleString()}</span>
              </div>

              <div className="dopamine-stat-box">
                <span className="dopamine-stat-label">{t('remainingTime')}</span>
                <span className="dopamine-stat-value">{formatTime(timeLeft)}</span>
              </div>

              <div className="dopamine-stat-box">
                <span className="dopamine-stat-label">{t('maxCombo')}</span>
                <span className="dopamine-stat-value">{comboCount}x</span>
              </div>

              <div className="dopamine-stat-box">
                <span className="dopamine-stat-label">{t('difficulty')}</span>
                <span className="dopamine-stat-value text-sm pt-1">{getDifficultyLabel(difficulty)}</span>
              </div>
            </div>

            {/* 多巴胺模式成就牆 - Minimalist List */}
            <div className="space-y-3 pt-2">
              <h3 className="text-sm font-semibold text-center uppercase tracking-widest text-cyan-200/70 border-b border-white/10 pb-2">
                {t('dopamineAchievementWall')}
              </h3>

              <div className="space-y-2">
                <div className="flex items-center justify-between px-4 py-2 rounded bg-white/5 border border-white/10">
                  <span className="text-sm font-medium text-white/80">BEST</span>
                  <div className="text-right">
                    <div className="font-bold text-white">
                      {topScores.length > 0 ? topScores[0].score.toLocaleString() : '-'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 操作按鈕 */}
            <div className="pt-2">
              <Button
                onClick={onRestart}
                className="w-full h-14 text-xl font-bold sci-fi-button-glory tracking-widest uppercase italic"
                style={{ fontFamily: 'ui-sans-serif, system-ui, sans-serif' }}
              >
                {t('againChallenge')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>,
    document.body
  );
};
