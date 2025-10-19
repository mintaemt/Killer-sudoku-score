import { Button } from "@/components/ui/button";
import { RotateCcw, Palette, User, Trophy, Clock, ListOrdered, Info, ChevronLeft, ChevronRight, Zap } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageToggle } from "@/components/LanguageToggle";
import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";
import { useUser } from "@/hooks/useUser";
import { useUserStats } from "@/hooks/useUserStats";
import { useLanguage } from "@/hooks/useLanguage";

interface GameHeaderProps {
  onNewGame: () => void;
  onThemeChange: (theme: string) => void;
  currentTheme: string;
  onShowLeaderboard: (mode?: 'normal' | 'dopamine') => void;
  onShowRules: () => void;
}

const themes = [
  { name: "blue", label: "Blue", color: "#3b82f6" },
  { name: "orange", label: "Orange", color: "#ff7710" },
  { name: "green", label: "Green", color: "#22c55e" },
  { name: "purple", label: "Purple", color: "#a855f7" },
  { name: "pink", label: "Pink", color: "#ec4899" },
  { name: "teal", label: "Teal", color: "#14b8a6" },
];

export const GameHeader = ({ onNewGame, onThemeChange, currentTheme, onShowLeaderboard, onShowRules }: GameHeaderProps) => {
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [isUserOpen, setIsUserOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'normal' | 'dopamine'>('normal');
  const [currentDifficultyIndex, setCurrentDifficultyIndex] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const { user, isLoggedIn, isVisitorMode } = useUser();
  const { stats, loading: statsLoading } = useUserStats(user?.id || null, viewMode);
  const { t } = useLanguage();

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsThemeOpen(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setIsUserOpen(false);
      }
    };

    if (isThemeOpen || isUserOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isThemeOpen, isUserOpen]);

  return (
    <div className="glass rounded-2xl px-3 md:px-4 py-2 md:py-3 shadow-apple-md relative z-20 w-full max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        {/* 左側：標題 */}
        <div className="flex items-center gap-2 md:gap-8 flex-1 min-w-0">
          <div className="flex flex-col items-start">
            <h1 className="text-sm md:text-lg font-bold tracking-tight leading-tight truncate">{t('gameTitle')}</h1>
          </div>
        </div>

        {/* 右側：遊戲規則、主題切換、主題選擇器、用戶狀態和新遊戲按鈕 */}
        <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
          {/* 遊戲規則按鈕 */}
          <Button
            variant="outline"
            size="sm"
            onClick={onShowRules}
            className="transition-smooth hover:scale-105 active:scale-95 shadow-apple-sm hover:shadow-apple-md flex-shrink-0"
            title={t('gameRules')}
          >
            <Info className="h-3 w-3 md:h-4 md:w-4" />
          </Button>

          <ThemeToggle />
          <LanguageToggle />
          
          {/* 主題選擇器 */}
          <div className="relative" ref={dropdownRef}>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsThemeOpen(!isThemeOpen)}
              className="transition-smooth hover:scale-105 active:scale-95 shadow-apple-sm hover:shadow-apple-md"
            >
              <Palette className="h-3 w-3 md:h-4 md:w-4" />
            </Button>
            
            {isThemeOpen && (
              <div className="absolute top-full right-0 mt-1 bg-background/95 backdrop-blur-sm border rounded-md shadow-lg z-[9999] p-2 min-w-[120px] dropdown-menu">
                <div className="grid grid-cols-3 gap-1">
                  {themes.map((theme) => (
                    <button
                      key={theme.name}
                      onClick={() => {
                        onThemeChange(theme.name);
                        setIsThemeOpen(false);
                      }}
                      className={cn(
                        "w-8 h-8 rounded-full transition-smooth hover:scale-110 border-2",
                        currentTheme === theme.name ? "border-foreground" : "border-transparent"
                      )}
                      style={{ backgroundColor: theme.color }}
                      title={theme.label}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 用戶狀態 - 訪客模式下隱藏 */}
          {user && !isVisitorMode && (
            <div className="relative" ref={userDropdownRef}>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsUserOpen(!isUserOpen)}
                className="transition-smooth hover:scale-105 active:scale-95 shadow-apple-sm hover:shadow-apple-md"
                title={user?.name}
              >
                <User className="h-3 w-3 md:h-4 md:w-4" />
              </Button>
              
              {isUserOpen && (
                <div className="absolute top-full right-0 mt-1 bg-background/95 backdrop-blur-sm border rounded-md shadow-lg z-[9999] p-3 min-w-[200px] dropdown-menu">
                  <div className="space-y-3">
                    <div className="text-center">
                      <div className="text-sm font-medium">{user?.name}</div>
                      <div className="text-xs text-muted-foreground">
                        ID: {user?.id?.slice(0, 8)}...
                      </div>
                    </div>
                    
                    {stats && (
                      <div className="space-y-2">
                        <div className="border-t pt-2">
                          <div className="flex items-center justify-between mb-2">
                            <div className="text-xs font-medium text-muted-foreground">{t('viewStats')}</div>
                            <div className="flex gap-1">
                              <Button
                                variant={viewMode === 'normal' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setViewMode('normal')}
                                className="h-6 px-2 text-xs"
                              >
                                {t('normal')}
                              </Button>
                              <Button
                                variant={viewMode === 'dopamine' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setViewMode('dopamine')}
                                className="h-6 px-2 text-xs"
                              >
                                {t('dopamine')}
                              </Button>
                            </div>
                          </div>
                          
                          {viewMode === 'normal' ? (
                            // 普通模式統計
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div className="flex items-center space-x-1">
                                <Trophy className="h-3 w-3 text-yellow-500" />
                                <span>{t('bestScore')}</span>
                              </div>
                              <div className="text-right font-medium">
                                {stats?.bestScore?.toLocaleString() || '0'}
                              </div>
                              <div className="flex items-center space-x-1">
                                <Clock className="h-3 w-3 text-blue-500" />
                                <span>{t('bestTime')}</span>
                              </div>
                              <div className="text-right font-medium">
                                {stats?.bestTime ? `${Math.floor(stats.bestTime / 60)}:${(stats.bestTime % 60).toString().padStart(2, '0')}` : '0:00'}
                              </div>
                              <div className="flex items-center space-x-1">
                                <User className="h-3 w-3 text-green-500" />
                                <span>{t('totalGames')}</span>
                              </div>
                              <div className="text-right font-medium">
                                {stats?.totalGames || 0}
                              </div>
                            </div>
                          ) : (
                            // 多巴胺模式統計 - 單張卡片滑動模式
                            <div className="space-y-3">
                              {/* 當前難度卡片 */}
                              <div className="border rounded p-3 text-xs">
                                {(() => {
                                  const difficulties = ['easy', 'medium', 'hard', 'expert', 'hell'] as const;
                                  const currentDifficulty = difficulties[currentDifficultyIndex];
                                  const diffStats = stats?.difficultyStats?.[currentDifficulty];
                                  
                                  const difficultyLabels = {
                                    easy: t('easy'),
                                    medium: t('medium'), 
                                    hard: t('hard'),
                                    expert: t('expert'),
                                    hell: t('hell')
                                  };
                                  
                                  return (
                                    <>
                                      <div className="font-medium text-sm mb-2 text-center">{difficultyLabels[currentDifficulty]}</div>
                                      <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                          <div className="flex items-center space-x-2">
                                            <Trophy className="h-3 w-3 text-yellow-500" />
                                            <span className="text-xs">最佳分數</span>
                                          </div>
                                          <span className="text-sm font-bold">
                                            {(diffStats?.bestScore || 0).toLocaleString()}
                                          </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                          <div className="flex items-center space-x-2">
                                            <User className="h-3 w-3 text-green-500" />
                                            <span className="text-xs">遊戲場數</span>
                                          </div>
                                          <span className="text-sm font-bold">
                                            {diffStats?.gamesPlayed || 0}
                                          </span>
                                        </div>
                                      </div>
                                    </>
                                  );
                                })()}
                              </div>
                              
                              {/* 滑動控制 */}
                              <div className="flex items-center justify-between">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setCurrentDifficultyIndex(prev => prev > 0 ? prev - 1 : 4)}
                                  className="h-6 w-6 p-0"
                                >
                                  <ChevronLeft className="h-3 w-3" />
                                </Button>
                                
                                {/* 點點指示器 */}
                                <div className="flex space-x-1">
                                  {[0, 1, 2, 3, 4].map(index => (
                                    <button
                                      key={index}
                                      onClick={() => setCurrentDifficultyIndex(index)}
                                      className={cn(
                                        "w-2 h-2 rounded-full transition-colors",
                                        index === currentDifficultyIndex 
                                          ? "bg-primary" 
                                          : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                                      )}
                                    />
                                  ))}
                                </div>
                                
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setCurrentDifficultyIndex(prev => prev < 4 ? prev + 1 : 0)}
                                  className="h-6 w-6 p-0"
                                >
                                  <ChevronRight className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {statsLoading && (
                      <div className="text-center text-xs text-muted-foreground p-4">
                        {t('loadingStats')}
                      </div>
                    )}
                    
                    <div className="border-t pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          onShowLeaderboard(viewMode);
                          setIsUserOpen(false);
                        }}
                        className="w-full text-xs"
                      >
                        <ListOrdered className="h-3 w-3 mr-1" />
                        {viewMode === 'normal' ? t('viewLeaderboard') : t('viewHighestScore')}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 新遊戲按鈕 - 縮小版本 */}
          <Button
            variant="outline"
            size="sm"
            onClick={onNewGame}
            className="transition-smooth hover:scale-105 active:scale-95 shadow-apple-sm hover:shadow-apple-md"
            title={t('newGame')}
          >
            <RotateCcw className="h-3 w-3 md:h-4 md:w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
