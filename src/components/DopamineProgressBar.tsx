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
    <div 
      className="fixed top-0 left-0 right-0 z-50 shadow-lg"
      style={{
        background: `
          radial-gradient(circle farthest-corner at top left, rgba(255, 0, 150, 0.9) 0%, rgba(255, 0, 150, 0) 50%),
          radial-gradient(circle farthest-side at top right, rgba(0, 255, 255, 0.7) 0%, rgba(0, 255, 255, 0) 30%),
          radial-gradient(circle farthest-corner at bottom right, rgba(255, 255, 0, 0.8) 0%, rgba(255, 255, 0, 0) 40%),
          radial-gradient(circle farthest-corner at bottom left, rgba(255, 0, 255, 0.6) 0%, rgba(255, 0, 255, 0) 35%),
          radial-gradient(ellipse at center, rgba(0, 150, 255, 0.4) 0%, rgba(0, 150, 255, 0) 60%),
          linear-gradient(135deg, rgba(255, 0, 150, 0.2) 0%, rgba(0, 255, 255, 0.2) 100%)
        `
      }}
    >
      {/* 主要資訊欄 */}
      <div className="flex items-center justify-between px-4 py-2 text-white">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">⚡</span>
            <span className="font-bold text-sm">TURBO MODE</span>
          </div>
          {comboCount > 0 && (
            <div className="flex items-center gap-1 bg-yellow-400 text-black px-2 py-1 rounded-full text-xs font-bold">
              <span>🔥</span>
              <span>{comboCount}x COMBO</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-sm">
            <span className="opacity-80">剩餘格子:</span>
            <span className="font-bold ml-1">{remainingCells}</span>
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
