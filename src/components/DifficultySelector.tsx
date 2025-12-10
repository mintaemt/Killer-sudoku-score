import { Button } from "@/components/ui/button";
import { Difficulty, DopamineDifficulty } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ChevronDown, Clock, AlertTriangle, Play, Pause, Zap, Pencil, Lightbulb } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useUser } from "@/hooks/useUser";
import { DopamineInfoModal } from "./DopamineInfoModal";
import { FeatureHintModal } from "./FeatureHintModal";
import { useLanguage } from "@/hooks/useLanguage";

interface DifficultySelectorProps {
  difficulty: Difficulty;
  onDifficultyChange: (difficulty: Difficulty) => void;
  mistakes: number;
  time: number;
  isPaused: boolean;
  onTogglePause: () => void;
  onDopamineMode?: (difficulty: DopamineDifficulty) => void;
  onToggleNotes?: () => void;
  showNotes?: boolean;
  onBecomeUser?: () => void;
  onHint?: () => void;
  hintCount?: number; // 新增提示次數
  selectedCell?: { row: number; col: number } | null; // 新增選中格子狀態
  currentTheme?: string; // 新增主題狀態
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
  onToggleNotes,
  showNotes = false,
  onBecomeUser,
  onHint,
  hintCount = 0,
  selectedCell = null,
  currentTheme = "blue",
}: DifficultySelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showDopamineInfo, setShowDopamineInfo] = useState(false);
  const [showFeatureHint, setShowFeatureHint] = useState(false);
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
    <div className="glass rounded-2xl px-3 md:px-4 py-3 shadow-apple-md relative z-10 w-full max-w-7xl mx-auto">
      <div className="flex items-center gap-1 md:gap-2 w-full">
        {/* 1. 難度選擇器 */}
        <div className="relative flex-[1_10_0%] min-w-[55px]" ref={dropdownRef}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsOpen(!isOpen)}
            className="transition-smooth font-medium text-xs md:text-sm w-full justify-between px-2 md:px-3"
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
                    "w-full px-3 py-2 text-left text-xs md:text-sm transition-smooth first:rounded-t-md last:rounded-b-md hover:bg-primary hover:text-primary-foreground",
                    difficulty === diff.value ? "bg-primary/20 text-primary font-bold" : "text-foreground"
                  )}
                >
                  {t(diff.translationKey as any)}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Control Buttons Group - Helper, Note, Dopamine */}
        {/* Ungrouped for better justify-between distribution */}
        {/* 2. 提示按鈕 */}
        {onHint && (
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              onClick={onHint}
              className={cn(
                "transition-smooth hover:scale-105 active:scale-95 shadow-apple-sm hover:shadow-apple-md w-9 h-9 p-0 shrink-0",
                hintCount > 0 && selectedCell
                  ? "bg-primary text-primary-foreground hover:text-primary-foreground border-primary/30 shadow-apple-md"
                  : hintCount > 0
                    ? "border-border/50 hover:bg-muted/50 text-foreground hover:text-foreground"
                    : "border-border/30 hover:bg-muted/30 text-muted-foreground hover:text-muted-foreground"
              )}
              title={hintCount > 0 ? t('hint') : t('hintCountUsedUp')}
            >
              <Lightbulb className="h-4 w-4" />
            </Button>

            {/* 提示次數 Badge */}
            {hintCount > 0 && (
              <div className="absolute -top-1 -right-1 bg-gradient-to-br from-gray-700 to-gray-800 text-white text-[8px] md:text-[10px] font-bold px-1 py-0.5 rounded-full min-w-[16px] h-4 flex items-center justify-center z-10 shadow-lg border border-gray-600/30">
                <div className="drop-shadow-sm">{hintCount}</div>
              </div>
            )}
          </div>
        )}

        {/* 3. 註解按鈕 */}
        {onToggleNotes && (
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              onClick={onToggleNotes}
              className={cn(
                "transition-smooth hover:scale-105 active:scale-95 shadow-apple-sm hover:shadow-apple-md w-9 h-9 p-0 shrink-0",
                showNotes
                  ? "bg-primary text-primary-foreground hover:text-primary-foreground border-primary/30 shadow-apple-md"
                  : "border-border/50 hover:bg-muted/50 text-foreground hover:text-foreground"
              )}
              title={showNotes ? t('notesModeOff') : t('notesModeOn')}
            >
              <Pencil className="h-4 w-4" />
            </Button>

            {/* ON/OFF Badge */}
            {showNotes && (
              <div className="absolute -top-1 -right-1 bg-gradient-to-br from-gray-700 to-gray-800 text-white text-[8px] md:text-[10px] font-bold px-1 py-0.5 rounded-full min-w-[16px] h-4 flex items-center justify-center z-10 shadow-lg border border-gray-600/30">
                <div className="drop-shadow-sm">ON</div>
              </div>
            )}
          </div>
        )}

        {/* 4. 多巴胺模式按鈕 */}
        {onDopamineMode && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (user && !isVisitorMode) {
                setShowDopamineInfo(true);
              } else {
                setShowFeatureHint(true);
              }
            }}
            className="transition-smooth hover:scale-105 active:scale-95 shadow-apple-sm hover:shadow-apple-md w-9 h-9 p-0 shrink-0 btn-dopamine-animated"
            title={user && !isVisitorMode ? `${t('dopamineMode')} - ${t('challengeYourLimits')}!` : t('dopamineModeVisitorOnly')}
          >
            <Zap className="h-4 w-4 drop-shadow-md" />
          </Button>
        )}
        {/* End of Control Buttons */}

        {/* Right Group: Timer and Mistakes */}
        <div className="flex-[1_10_0%] flex items-center justify-end gap-2 md:gap-4">
          <div className="relative">
            <div className="flex items-center gap-2">
              <Clock className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
              <span
                className="text-xs md:text-sm font-bold bg-muted/50 px-2 md:px-3 py-1 rounded-md min-w-[50px] md:min-w-[60px] text-center cursor-pointer transition-smooth hover:bg-muted/70"
                onClick={onTogglePause}
                title={isPaused ? t('clickToResume') : t('clickToPause')}
              >
                {formatTime(time)}
              </span>
            </div>

            {/* Play/Pause Badge */}
            <div className="absolute -top-2 -right-2 bg-gradient-to-br from-gray-700 to-gray-800 border border-gray-600/30 rounded-full w-4 h-4 flex items-center justify-center z-10 shadow-lg">
              <div className="flex items-center justify-center w-full h-full">
                {isPaused ? <Play className="h-2.5 w-2.5 text-white fill-white drop-shadow-sm" /> : <Pause className="h-2.5 w-2.5 text-white fill-white drop-shadow-sm" />}
              </div>
            </div>
          </div>

          {/* 6. 錯誤顯示元件 */}
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
            <span className={cn(
              "text-xs md:text-sm font-bold transition-smooth px-2 md:px-3 py-1 rounded-md min-w-[40px] md:min-w-[50px] text-center",
              mistakes > 0 ? "text-destructive bg-destructive/10" : "text-foreground bg-muted/50"
            )}>
              {mistakes}/3
            </span>
          </div>
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
        onShowFeatureHint={() => setShowFeatureHint(true)}
      />

      {/* 功能提示模態框 */}
      <FeatureHintModal
        isOpen={showFeatureHint}
        onClose={() => setShowFeatureHint(false)}
        onBecomeUser={() => {
          setShowFeatureHint(false);
          onBecomeUser?.();
        }}
      />
    </div>
  );
};
