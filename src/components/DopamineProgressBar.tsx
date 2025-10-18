import { cn } from "@/lib/utils";

interface DopamineProgressBarProps {
  timeLeft: number;
  remainingCells: number;
  comboCount: number;
  isVisible: boolean;
}

export const DopamineProgressBar = ({
  timeLeft,
  remainingCells,
  comboCount,
  isVisible
}: DopamineProgressBarProps) => {
  if (!isVisible) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = ((81 - remainingCells) / 81) * 100;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 glassmorphism shadow-lg border-b border-white/10">
      {/* 主要資訊欄 */}
      <div className="flex items-center justify-center px-4 py-2 text-white">
        <div className="flex items-center gap-6">
          {comboCount > 0 && (
            <div className="flex items-center gap-1 bg-yellow-400 text-black px-2 py-1 rounded-full text-xs font-bold">
              <span>🔥</span>
              <span>{comboCount}x COMBO</span>
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <span className="text-sm opacity-80">剩餘格子:</span>
            <span className="font-bold">{remainingCells}</span>
          </div>
          
          <div className="text-lg font-mono font-bold">
            {formatTime(timeLeft)}
          </div>
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
