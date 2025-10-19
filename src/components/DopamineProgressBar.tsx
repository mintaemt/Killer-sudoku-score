import { cn } from "@/lib/utils";
import { useLanguage } from '@/hooks/useLanguage';

interface DopamineProgressBarProps {
  remainingCells: number;
  comboCount: number;
  currentScore: number;
  timeLeft: number;
  timeLimit: number;
  isVisible: boolean;
  onTestWin?: () => void;
}

export const DopamineProgressBar = ({
  remainingCells,
  comboCount,
  currentScore,
  timeLeft,
  timeLimit,
  isVisible,
  onTestWin
}: DopamineProgressBarProps) => {
  const { t } = useLanguage();
  
  if (!isVisible) return null;

  const progressPercentage = ((81 - remainingCells) / 81) * 100;
  const timeProgressPercentage = (timeLeft / timeLimit) * 100;

  return (
    <div className="fixed top-0 left-0 right-0 z-40 backdrop-blur-md bg-black/20 shadow-lg border-b border-white/10">
      {/* 主要資訊欄 - 響應式佈局 */}
      <div className="px-2 sm:px-4 py-2 text-white">
        {/* 桌面版佈局 */}
        <div className="hidden sm:flex items-center justify-center w-full max-w-7xl mx-auto gap-4">
          {/* 左邊：剩餘格數 */}
          <div className="flex items-center gap-2 bg-white/10 text-white border border-white/20 px-3 py-1 rounded-lg">
            <span className="text-sm opacity-90">{t('remaining')}:</span>
            <span className="font-bold">{remainingCells}</span>
          </div>
          
          {/* 中間：分數 */}
          <div className="flex items-center gap-2 bg-white/20 text-white border border-white/30 px-4 py-2 rounded-lg">
            <span className="text-sm opacity-90">{t('score')}:</span>
            <span className="font-bold text-xl">{currentScore.toLocaleString()}</span>
          </div>
          
          {/* 右邊：COMBO數和測試按鈕 */}
          <div className="flex items-center gap-2">
            {comboCount > 0 ? (
              <div className="flex items-center gap-1 bg-white/10 text-white border border-white/20 px-3 py-1 rounded-lg">
                <span>🔥</span>
                <span className="font-bold">{comboCount}x {t('combo')}</span>
              </div>
            ) : (
              <div className="w-[120px]"></div>
            )}
            
            {/* 測試按鈕 */}
            {onTestWin && (
              <button
                onClick={onTestWin}
                className="bg-red-500/80 hover:bg-red-500 text-white px-3 py-1 rounded-lg text-xs font-bold transition-all duration-200 hover:scale-105 active:scale-95"
                title="測試WIN資訊卡"
              >
                TEST WIN
              </button>
            )}
          </div>
        </div>

        {/* 行動裝置版佈局 */}
        <div className="sm:hidden space-y-2">
          {/* 第一行：分數（主要） */}
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-2 bg-white/20 text-white border border-white/30 px-4 py-2 rounded-lg">
              <span className="text-sm opacity-90">{t('score')}:</span>
              <span className="font-bold text-lg">{currentScore.toLocaleString()}</span>
            </div>
          </div>
          
          {/* 第二行：剩餘格數和COMBO數 */}
          <div className="flex items-center justify-between gap-2">
            {/* 剩餘格數 */}
            <div className="flex items-center gap-2 bg-white/10 text-white border border-white/20 px-3 py-1 rounded-lg">
              <span className="text-xs opacity-90">{t('remaining')}:</span>
              <span className="font-bold text-sm">{remainingCells}</span>
            </div>
            
            {/* COMBO數 */}
            {comboCount > 0 && (
              <div className="flex items-center gap-1 bg-white/10 text-white border border-white/20 px-3 py-1 rounded-lg">
                <span>🔥</span>
                <span className="font-bold text-sm">{comboCount}x</span>
              </div>
            )}
            
            {/* 測試按鈕 */}
            {onTestWin && (
              <button
                onClick={onTestWin}
                className="bg-red-500/80 hover:bg-red-500 text-white px-2 py-1 rounded text-xs font-bold transition-all duration-200 hover:scale-105 active:scale-95"
                title="測試WIN資訊卡"
              >
                TEST
              </button>
            )}
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
