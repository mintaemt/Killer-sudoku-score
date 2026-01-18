import { cn } from "@/lib/utils";
import { useLanguage } from '@/hooks/useLanguage';

interface DopamineProgressBarProps {
  remainingCells: number;
  comboCount: number;
  currentScore: number;
  timeLeft: number;
  timeLimit: number;
  isVisible: boolean;
}

export const DopamineProgressBar = ({
  remainingCells,
  comboCount,
  currentScore,
  timeLeft,
  timeLimit,
  isVisible
}: DopamineProgressBarProps) => {
  const { t } = useLanguage();

  if (!isVisible) return null;

  const progressPercentage = ((81 - remainingCells) / 81) * 100;
  const timeProgressPercentage = (timeLeft / timeLimit) * 100;

  return (
    <div className="fixed top-0 left-0 right-0 z-40 backdrop-blur-md bg-black/20 shadow-lg border-b border-white/10">
      {/* 主要資訊欄 - 響應式佈局 */}
      <div className="px-2 py-1 text-white">
        {/* Unified Layout: Compact Grid for all screens */}
        <div className="grid grid-cols-3 gap-2 px-1 py-1 w-full max-w-lg mx-auto relative z-20">
          {/* Left: Remaining */}
          <div className="flex flex-col items-center justify-center bg-white/10 rounded px-1 py-1 border border-white/10 md:py-2">
            <span className="text-[10px] md:text-xs opacity-70 leading-none mb-0.5">{t('remaining')}</span>
            <span className="text-sm md:text-base font-bold leading-none">{remainingCells}</span>
          </div>

          {/* Center: Score (Highlighted) */}
          <div className="flex flex-col items-center justify-center bg-white/20 rounded px-2 py-1 border border-white/30 shadow-sm backdrop-blur-sm md:py-2">
            <span className="text-[10px] md:text-xs opacity-90 leading-none mb-0.5">{t('score')}</span>
            <span className="text-lg md:text-xl font-bold leading-none text-yellow-300 drop-shadow-md">{currentScore.toLocaleString()}</span>
          </div>

          {/* Right: Combo (Always Visible) */}
          <div className={cn(
            "flex flex-col items-center justify-center rounded px-1 py-1 border transition-all duration-300 md:py-2",
            comboCount > 0
              ? "bg-orange-500/20 border-orange-500/30 text-orange-100 shadow-[0_0_10px_rgba(249,115,22,0.3)]"
              : "bg-white/5 border-white/5 text-white/40"
          )}>
            <span className="text-[10px] md:text-xs opacity-70 leading-none mb-0.5">COMBO</span>
            <span className={cn(
              "text-sm md:text-base font-bold leading-none",
              comboCount > 0 ? "text-orange-300 scale-110" : ""
            )}>
              {comboCount > 0 ? `×${comboCount}` : '0'}
            </span>
          </div>
        </div>
      </div>

      {/* 時間倒數進度條 - 火藥引線效果 */}
      <div className="h-2 bg-muted/30">
        <div
          className={cn(
            "h-full transition-all duration-1000 ease-out",
            "bg-gradient-to-r from-primary via-accent to-primary",
            "shadow-lg"
          )}
          style={{
            width: `${timeProgressPercentage}%`,
            background: `
              linear-gradient(90deg, 
                hsl(var(--primary)) 0%, 
                hsl(var(--accent)) 50%, 
                hsl(var(--primary)) 100%
              )
            `
          }}
        />
      </div>
    </div>
  );
};
