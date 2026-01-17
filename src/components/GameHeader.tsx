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

interface UserButtonProps {
  user: any;
  isVisitorMode: boolean;
  onShowLeaderboard: (mode?: 'normal' | 'dopamine') => void;
  viewMode: 'normal' | 'dopamine';
  setViewMode: (mode: 'normal' | 'dopamine') => void;
  t: (key: string) => string;
  stats: any;
  statsLoading: boolean;
  currentDifficultyIndex: number;
  setCurrentDifficultyIndex: React.Dispatch<React.SetStateAction<number>>;
  currentTheme: string;
  themes: { name: string; color: string }[];
}

const UserButton = ({
  user,
  isVisitorMode,
  onShowLeaderboard,
  viewMode,
  setViewMode,
  t,
  stats,
  statsLoading,
  currentDifficultyIndex,
  setCurrentDifficultyIndex,
  currentTheme,
  themes
}: UserButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { signInWithGoogle, signOut } = useAuth();

  // 取得當前主題色
  const currentThemeColor = themes.find(theme => theme.name === currentTheme)?.color || "#3b82f6";

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

  const handleLogin = async () => {
    await signInWithGoogle();
  };

  const handleLogout = async () => {
    await signOut();
    setIsOpen(false);
  };

  // 1. 未登入 (或訪客) -> 顯示 LogIn Icon (與其他按鈕一致樣式)
  const isAnonymous = !user || user.is_anonymous;

  if (isAnonymous) {
    return (
      <CustomTooltip content={t('login')} variant="glass">
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogin}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="transition-smooth hover:scale-105 active:scale-95 shadow-apple-sm hover:shadow-apple-md"
          style={{
            borderColor: currentThemeColor,
            // Removed specific backgroundColor logic to let shadcn's variant="outline" handle the default background (white/dark)
            // Only overriding text color on hover if needed, but for now let's keep it simple to match other buttons.
            // If we want color on hover, we can do:
            color: isHovered ? currentThemeColor : undefined
          }}
        >
          <LogIn className="h-3 w-3 md:h-4 md:w-4" style={{ color: isHovered ? undefined : currentThemeColor }} />
        </Button>
      </CustomTooltip>
    );
  }

  // 2. 已登入 (Google) -> 顯示 Avatar
  // Shadow Fix: 移除 overflow-hidden，將 rounded-md 套用到 inner Component
  return (
    <div className="relative" ref={dropdownRef}>
      <CustomTooltip content={user.user_metadata?.full_name || user.email} variant="glass">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          // 關鍵修正：移除 overflow-hidden 以顯示完整陰影
          // 圖片裁切交給 Avatar 元件處理
          className="transition-smooth hover:scale-105 active:scale-95 shadow-apple-sm hover:shadow-apple-md p-0 w-9 aspect-square"
          style={{ borderColor: currentThemeColor }}
        >
          <Avatar className="h-full w-full rounded-md">
            <AvatarImage
              src={user.user_metadata?.avatar_url}
              alt={user.user_metadata?.full_name || user.email}
              className="object-cover rounded-md"
            />
            <AvatarFallback className="rounded-md">{user.email?.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
        </Button>
      </CustomTooltip>

      {isOpen && (
        <div className="absolute top-full right-0 mt-1 bg-background/95 backdrop-blur-sm border rounded-md shadow-lg z-[9999] p-3 min-w-[200px] dropdown-menu">
          {/* Dropdown Content */}
          <div className="space-y-3">
            <div className="text-center border-b pb-2">
              <div className="text-sm font-bold truncate">{user.user_metadata?.full_name}</div>
              <div className="text-xs text-muted-foreground truncate">{user.email}</div>
            </div>
            <div className="space-y-1">
              <div className="text-xs font-medium text-muted-foreground px-1 mb-1">{t('viewLeaderboard')}</div>
              <Button variant="ghost" size="sm" onClick={() => { onShowLeaderboard('normal'); setIsOpen(false); }} className="w-full text-xs justify-start h-8">
                <ListOrdered className="h-3 w-3 mr-2 text-blue-500" />
                {t('normal')}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => { onShowLeaderboard('dopamine'); setIsOpen(false); }} className="w-full text-xs justify-start h-8">
                <Zap className="h-3 w-3 mr-2 text-yellow-500" />
                {t('dopamine')}
              </Button>
            </div>
            <div className="border-t pt-2">
              <Button variant="ghost" size="sm" onClick={handleLogout} className="w-full text-xs justify-start text-red-500 hover:text-red-600 hover:bg-red-50">
                <LogOut className="h-3 w-3 mr-2" />
                {t('logout')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

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

  const { user, isLoggedIn, isVisitorMode } = useUser();
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

          {/* 新遊戲按鈕 */}
          <CustomTooltip content={t('newGame')} variant="glass">
            <Button
              variant="outline"
              size="sm"
              onClick={onNewGame}
              className="transition-smooth hover:scale-105 active:scale-95 shadow-apple-sm hover:shadow-apple-md"
            >
              <RotateCcw className="h-3 w-3 md:h-4 md:w-4" />
            </Button>
          </CustomTooltip>

          <ThemeToggle />
          <LanguageToggle />

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

          {/* 用戶狀態按鈕 - 最右側 */}
          <UserButton
            user={user}
            isVisitorMode={isVisitorMode}
            onShowLeaderboard={onShowLeaderboard}
            viewMode={viewMode}
            setViewMode={setViewMode}
            t={t}
            stats={stats}
            statsLoading={statsLoading}
            currentDifficultyIndex={currentDifficultyIndex}
            setCurrentDifficultyIndex={setCurrentDifficultyIndex}
            currentTheme={currentTheme}
            themes={themes}
          />
        </div>
      </div>
    </div>
  );
};
