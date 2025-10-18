import { Button } from "@/components/ui/button";
import { Difficulty, DopamineDifficulty } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ChevronDown, Clock, AlertTriangle, Play, Pause, Zap } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useUser } from "@/hooks/useUser";
import { DopamineInfoModal } from "./DopamineInfoModal";
import { useLanguage } from "@/hooks/useLanguage";

interface DifficultySelectorProps {
  difficulty: Difficulty;
  onDifficultyChange: (difficulty: Difficulty) => void;
  mistakes: number;
  time: number;
  isPaused: boolean;
  onTogglePause: () => void;
  onDopamineMode?: (difficulty: DopamineDifficulty) => void;
}

const difficulties: { value: Difficulty; label: string; translationKey: string }[] = [
  { value: "easy", label: "Easy", translationKey: "easy" },
  { value: "medium", label: "Medium", translationKey: "medium" },
  { value: "hard", label: "Hard", translationKey: "hard" },
  { value: "expert", label: "Expert", translationKey: "expert" },
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
  const { t } = useLanguage();

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
            className="transition-smooth font-medium text-xs md:text-sm w-[90px] justify-between"
          >
            {currentDifficulty ? t(currentDifficulty.translationKey as any) : difficulty}
            <ChevronDown className={cn("h-3 w-3 transition-transform", isOpen && "rotate-180")} />
          </Button>
          
          {isOpen && (
            <div className="absolute top-full left-0 mt-1 bg-background/95 backdrop-blur-sm border rounded-md shadow-lg z-[9999] min-w-[120px] dropdown-menu">
              {difficulties.map((diff) => (
                <button
                  key={diff.value}
                  onClick={() => {
                    onDifficultyChange(diff.value);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "w-full px-3 py-2 text-left text-xs md:text-sm transition-smooth hover:bg-accent hover:text-accent-foreground first:rounded-t-md last:rounded-b-md",
                    difficulty === diff.value && "bg-primary text-primary-foreground"
                  )}
                >
                  {t(diff.translationKey as any)}
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
                radial-gradient(circle farthest-corner at 15% 25%, rgba(249, 115, 22, 0.95) 0%, rgba(249, 115, 22, 0) 50%),
                radial-gradient(circle farthest-side at 85% 25%, rgba(59, 130, 246, 0.75) 0%, rgba(59, 130, 246, 0) 45%),
                radial-gradient(circle farthest-corner at 85% 75%, rgba(168, 85, 247, 0.85) 0%, rgba(168, 85, 247, 0) 55%),
                radial-gradient(circle farthest-corner at 15% 75%, rgba(236, 72, 153, 0.65) 0%, rgba(236, 72, 153, 0) 50%),
                radial-gradient(ellipse at center, rgba(59, 130, 246, 0.4) 0%, rgba(59, 130, 246, 0) 70%),
                linear-gradient(135deg, rgba(249, 115, 22, 0.15) 0%, rgba(59, 130, 246, 0.15) 100%)
              `
            }}
            title={`${t('dopamineMode')} - 挑戰極限！`}
          >
            <Zap className="h-3 w-3 md:h-4 md:w-4 text-white" style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5), 1px 1px 2px rgba(0,0,0,0.6)" }} />
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
        onStartChallenge={(difficulty) => {
          setShowDopamineInfo(false);
          onDopamineMode?.(difficulty);
        }}
      />
    </div>
  );
};
