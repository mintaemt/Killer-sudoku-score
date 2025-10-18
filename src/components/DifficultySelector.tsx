import { Button } from "@/components/ui/button";
import { Difficulty } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ChevronDown, Clock, AlertTriangle, Play, Pause, Zap } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useUser } from "@/hooks/useUser";
import { DopamineInfoModal } from "./DopamineInfoModal";

interface DifficultySelectorProps {
  difficulty: Difficulty;
  onDifficultyChange: (difficulty: Difficulty) => void;
  mistakes: number;
  time: number;
  isPaused: boolean;
  onTogglePause: () => void;
  onDopamineMode?: () => void;
}

const difficulties: { value: Difficulty; label: string }[] = [
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
  { value: "expert", label: "Expert" },
];

export const DifficultySelector = ({
  difficulty,
  onDifficultyChange,
  mistakes,
  time,
  isPaused,
  onTogglePause,
  onDopamineMode,
}: DifficultySelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showDopamineInfo, setShowDopamineInfo] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, isVisitorMode } = useUser();

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentDifficulty = difficulties.find(d => d.value === difficulty);

  return (
    <div className="glass rounded-2xl px-4 md:px-6 py-4 shadow-apple-md relative z-10">
      <div className="flex items-center justify-between gap-4">
        {/* 難度選擇器 */}
        <div className="relative" ref={dropdownRef}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsOpen(!isOpen)}
            className="transition-smooth font-medium text-xs md:text-sm min-w-[80px] justify-between"
          >
            {currentDifficulty?.label}
            <ChevronDown className={cn("h-3 w-3 transition-transform", isOpen && "rotate-180")} />
          </Button>
          
          {isOpen && (
            <div className="absolute top-full left-0 mt-1 glassmorphism rounded-md shadow-lg z-[9999] min-w-[120px] dropdown-menu">
              {difficulties.map((diff) => (
                <button
                  key={diff.value}
                  onClick={() => {
                    onDifficultyChange(diff.value);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "w-full px-3 py-2 text-left text-xs md:text-sm transition-smooth hover:bg-muted/50 first:rounded-t-md last:rounded-b-md bg-background/80 backdrop-blur-sm",
                    difficulty === diff.value && "bg-primary text-primary-foreground"
                  )}
                >
                  {diff.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 多巴胺模式按鈕 - 只對登入用戶可見 */}
        {user && !isVisitorMode && onDopamineMode && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDopamineInfo(true)}
            className="transition-smooth hover:scale-105 active:scale-95 shadow-apple-sm hover:shadow-apple-md border-purple-500/30 hover:border-purple-500/50 text-purple-600 hover:text-purple-700 relative overflow-hidden"
            style={{
              background: `
                radial-gradient(circle farthest-corner at top left, rgba(255, 0, 150, 0.8) 0%, rgba(255, 0, 150, 0) 50%),
                radial-gradient(circle farthest-side at top right, rgba(0, 255, 255, 0.6) 0%, rgba(0, 255, 255, 0) 30%),
                radial-gradient(circle farthest-corner at bottom right, rgba(255, 255, 0, 0.7) 0%, rgba(255, 255, 0, 0) 40%),
                radial-gradient(circle farthest-corner at bottom left, rgba(255, 0, 255, 0.5) 0%, rgba(255, 0, 255, 0) 35%),
                radial-gradient(ellipse at center, rgba(0, 150, 255, 0.3) 0%, rgba(0, 150, 255, 0) 60%),
                linear-gradient(135deg, rgba(255, 0, 150, 0.1) 0%, rgba(0, 255, 255, 0.1) 100%)
              `
            }}
            title="多巴胺模式 - 挑戰極限！"
          >
            <Zap className="h-3 w-3 md:h-4 md:w-4 text-white drop-shadow-lg" />
          </Button>
        )}

        {/* 時間顯示 */}
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-bold bg-muted/50 px-2 py-1 rounded-md">
            {formatTime(time)}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={onTogglePause}
            className="h-6 w-6 md:h-7 md:w-7 p-0 transition-smooth hover:scale-105 hover:bg-muted/50 border-border/50"
          >
            {isPaused ? <Play className="h-3 w-3 md:h-4 md:w-4" /> : <Pause className="h-3 w-3 md:h-4 md:w-4" />}
          </Button>
        </div>

        {/* 錯誤顯示 */}
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          <span className={cn(
            "text-sm font-bold transition-smooth px-2 py-1 rounded-md",
            mistakes > 0 ? "text-destructive bg-destructive/10" : "text-foreground bg-muted/50"
          )}>
            {mistakes}/3
          </span>
        </div>
      </div>
      
      {/* 多巴胺模式資訊模態框 */}
      <DopamineInfoModal
        isOpen={showDopamineInfo}
        onClose={() => setShowDopamineInfo(false)}
        onStartChallenge={() => {
          setShowDopamineInfo(false);
          onDopamineMode?.();
        }}
      />
    </div>
  );
};
