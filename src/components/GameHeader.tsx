import { Button } from "@/components/ui/button";
import { RotateCcw, Palette, User, Trophy, Clock, ListOrdered, Info, ChevronLeft, ChevronRight, Zap, LogIn, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageToggle } from "@/components/LanguageToggle";
import { cn } from "@/lib/utils";
import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { useUser } from "@/hooks/useUser";
import { useUserStats } from "@/hooks/useUserStats";
import { useLanguage } from "@/hooks/useLanguage";
import { CustomTooltip } from "@/components/CustomTooltip";

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
  { name: "green", label: "Lime", color: "#BFFF00" },
  { name: "purple", label: "Purple", color: "#a855f7" },
  { name: "pink", label: "Pink", color: "#ec4899" },
  { name: "teal", label: "Teal", color: "#14b8a6" },
];

import { UserStatsDialog } from "@/components/UserStatsDialog";

export const GameHeader = ({ onNewGame, onThemeChange, currentTheme, onShowLeaderboard, onShowRules }: GameHeaderProps) => {
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [isUserOpen, setIsUserOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'normal' | 'dopamine'>('normal');
  const [currentDifficultyIndex, setCurrentDifficultyIndex] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);
  // Title Refs
  const titleContainerRef = useRef<HTMLDivElement>(null);
  const titleTextRef = useRef<HTMLHeadingElement>(null);

  const { user: localUser, isLoggedIn, isVisitorMode } = useUser();
  const { user: authUser, signInWithGoogle } = useAuth();

  // Prioritize Auth user (Google Login) over local user
  const user = authUser || localUser;

  const { stats, loading: statsLoading } = useUserStats(user?.id || null, viewMode);
  const { t, language } = useLanguage(); // Added language to dependency

  // Title Auto-Scaling Logic (Scale-to-Fit)
  // Re-runs on window resize, title text change (language), or mounting.
  useLayoutEffect(() => {
    const adjustFontSize = () => {
      const container = titleContainerRef.current;
      const text = titleTextRef.current;
      if (!container || !text) return;

      // Start with a large font and scale down
      let size = 28; // Max size
      text.style.fontSize = `${size}px`;

      // Force layout update to check width
      // We want to maximize size such that textWidth <= containerWidth
      // Binary search or iterative approach?
      // Iterative is safer for simple text.

      // Check if text overflows
      // We subtract a small buffer (e.g. 4px) to be safe
      const availableWidth = container.clientWidth - 4;

      // Simple loop to shrink
      while (text.scrollWidth > availableWidth && size > 12) {
        size -= 1;
        text.style.fontSize = `${size}px`;
      }

      // Optimization: If text is WAAAY smaller than container, we don't scale UP beyond max size (28px).
      // But if we start at 28px, we only need to shrink.
      // What if the container grows? We need to checking from Max size effectively.
      // So setting current to max (28) at start of function is correct.
    };

    adjustFontSize(); // Initial call

    const resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(adjustFontSize);
    });

    if (titleContainerRef.current) {
      resizeObserver.observe(titleContainerRef.current);
    }

    window.addEventListener('resize', adjustFontSize);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', adjustFontSize);
    };
  }, [t, language]); // Dependency on language/text change

  // Handle click outside
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

  const titleText = t('gameTitle');

  return (
    <div className="glass rounded-2xl px-3 md:px-4 py-2 md:py-3 shadow-apple-md relative z-20 w-full max-w-7xl mx-auto">
      <div className="flex items-center">
        {/* 左側：標題 */}
        {/* Title Auto-scaling using JS ResizeObserver */}
        {/* Flex-1 ensures it takes available space */}
        <div
          ref={titleContainerRef}
          className="flex flex-col items-start justify-center min-w-0 flex-1 relative z-0 h-10 mr-2 overflow-hidden"
        >
          <h1
            ref={titleTextRef}
            className="font-bold tracking-tight leading-tight whitespace-nowrap text-left origin-left"
            style={{ fontSize: '28px' }} // Initial max size
          >
            {titleText}
          </h1>
        </div>

        {/* 右側：遊戲工具與用戶按鈕 */}
        {/* z-30 ensures buttons are clickable and above title if overlap happens */}
        <div className="flex items-center gap-1 md:gap-2 flex-shrink-0 relative z-30 bg-transparent">
          {/* 遊戲規則按鈕 */}
          <CustomTooltip content={t('gameRules')} variant="glass">
            <Button
              variant="outline"
              size="sm"
              onClick={onShowRules}
              className="transition-smooth hover:scale-105 active:scale-95 shadow-apple-sm hover:shadow-apple-md flex-shrink-0"
            >
              <Info className="h-3 w-3 md:h-4 md:w-4" />
            </Button>
          </CustomTooltip>



          <LanguageToggle />
          <ThemeToggle />

          {/* 主題選擇器 */}
          <div className="relative" ref={dropdownRef}>
            <CustomTooltip content={t('theme')} variant="glass">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsThemeOpen(!isThemeOpen)}
                className="transition-smooth hover:scale-105 active:scale-95 shadow-apple-sm hover:shadow-apple-md"
              >
                <Palette className="h-3 w-3 md:h-4 md:w-4" />
              </Button>
            </CustomTooltip>

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

          {/* 新遊戲按鈕 - 移至用戶按鈕左側 */}
          {/* 用戶狀態按鈕 - 最右側 */}
          {(!user || (user as any).is_anonymous) ? (
            <CustomTooltip content={t('login')} variant="glass">
              <Button
                variant="outline"
                size="sm"
                onClick={() => signInWithGoogle()}
                className="transition-smooth shadow-apple-sm hover:shadow-apple-md border-[var(--theme-color)] text-[var(--theme-color)] hover:bg-[var(--theme-color)] hover:text-white"
                style={{ '--theme-color': themes.find(t => t.name === currentTheme)?.color || "#3b82f6" } as React.CSSProperties}
              >
                <LogIn className="h-3 w-3 md:h-4 md:w-4" />
              </Button>
            </CustomTooltip>
          ) : (
            <UserStatsDialog
              user={user}
              currentTheme={currentTheme}
              themes={themes}
              t={t}
              isVisitorMode={isVisitorMode}
              onShowLeaderboard={onShowLeaderboard}
            />
          )}
        </div>
      </div>
    </div>
  );
};
