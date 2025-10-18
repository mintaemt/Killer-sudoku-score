import { cn } from "@/lib/utils";

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
  if (!isVisible) return null;

  const progressPercentage = ((81 - remainingCells) / 81) * 100;
  const timeProgressPercentage = (timeLeft / timeLimit) * 100;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/20 shadow-lg border-b border-white/10">
      {/* 主要資訊欄 */}
      <div className="flex items-center justify-center px-4 py-2 text-white">
        <div className="flex items-center justify-center w-full max-w-4xl gap-4">
          {/* 左邊：剩餘格數 - 靠近分數 */}
          <div className="flex items-center gap-2 bg-muted/50 text-muted-foreground border border-border/50 px-3 py-1 rounded-lg">
            <span className="text-sm opacity-90">剩餘:</span>
            <span className="font-bold">{remainingCells}</span>
          </div>
          
          {/* 中間：分數 - 較大，更不透明 */}
          <div className="flex items-center gap-2 bg-primary/60 text-primary border border-primary/50 px-4 py-2 rounded-lg">
            <span className="text-sm opacity-90">分數:</span>
            <span className="font-bold text-xl">{currentScore.toLocaleString()}</span>
          </div>
          
          {/* 右邊：COMBO數 */}
          {comboCount > 0 ? (
            <div className="flex items-center gap-1 bg-accent/20 text-accent border border-accent/30 px-3 py-1 rounded-lg">
              <span>🔥</span>
              <span className="font-bold">{comboCount}x COMBO</span>
            </div>
          ) : (
            <div className="w-[120px]"></div> // 佔位空間，保持佈局平衡
          )}
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
