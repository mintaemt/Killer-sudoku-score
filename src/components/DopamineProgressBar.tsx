import { cn } from "@/lib/utils";

interface DopamineProgressBarProps {
  remainingCells: number;
  comboCount: number;
  currentScore: number;
  isVisible: boolean;
}

export const DopamineProgressBar = ({
  remainingCells,
  comboCount,
  currentScore,
  isVisible
}: DopamineProgressBarProps) => {
  if (!isVisible) return null;

  const progressPercentage = ((81 - remainingCells) / 81) * 100;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/20 shadow-lg border-b border-white/10">
      {/* 主要資訊欄 */}
      <div className="flex items-center justify-center px-4 py-2 text-white">
        <div className="flex items-center gap-6">
          {/* 1. 現在分數 - 最重要 */}
          <div className="flex items-center gap-2 bg-primary/20 text-primary border border-primary/30 px-3 py-1 rounded-lg">
            <span className="text-sm opacity-90">分數:</span>
            <span className="font-bold text-lg">{currentScore.toLocaleString()}</span>
          </div>
          
          {/* 2. 剩餘格數 */}
          <div className="flex items-center gap-2 bg-muted/50 text-muted-foreground border border-border/50 px-3 py-1 rounded-lg">
            <span className="text-sm opacity-90">剩餘:</span>
            <span className="font-bold">{remainingCells}</span>
          </div>
          
          {/* 3. COMBO數 */}
          {comboCount > 0 && (
            <div className="flex items-center gap-1 bg-accent/20 text-accent border border-accent/30 px-3 py-1 rounded-lg">
              <span>🔥</span>
              <span className="font-bold">{comboCount}x COMBO</span>
            </div>
          )}
        </div>
      </div>
      
      {/* 進度條 */}
      <div className="h-1 bg-white/20">
        <div 
          className={cn(
            "h-full transition-all duration-300 ease-out",
            progressPercentage < 30 ? "bg-gradient-to-r from-red-400 to-red-600" :
            progressPercentage < 60 ? "bg-gradient-to-r from-yellow-400 to-orange-500" :
            "bg-gradient-to-r from-green-400 to-green-600"
          )}
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
    </div>
  );
};
