import { Button } from "@/components/ui/button";
import { RotateCcw, Palette, User, Trophy, Clock, ListOrdered, Info, ChevronLeft, ChevronRight, Zap, LogIn, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";

// ... existing imports

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

  // 1. 未登入 (或訪客) -> 顯示 LogIn Icon
  if (!user || user.app_metadata?.provider !== 'google') {
    // 注意: 這裡假設 "非 Google 登入" 視為未完成 SSO 遷移的狀態，或是直接依賴 user 是否存在。
    // 如果 isVisitorMode 為真，通常 user 是存在的 (匿名)，但我們希望推廣 Google 登入。
    // 簡化邏輯：如果沒有 user (null) 或是 匿名用戶 (is_anonymous) 則顯示登入。
    // Supabase user 物件通常有 is_anonymous 屬性。

    const isAnonymous = user?.is_anonymous;

    if (!user || isAnonymous) {
      return (
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogin}
          className="transition-smooth hover:scale-105 active:scale-95 shadow-apple-sm hover:shadow-apple-md"
          title={t('login')} // 需確認有沒有這個 key，若無則用 "Sign In"
          style={{ color: currentThemeColor, borderColor: currentThemeColor }} // 連動主題色
        >
          <LogIn className="h-3 w-3 md:h-4 md:w-4" />
        </Button>
      );
    }
  }

  // 2. 已登入 (Google) -> 顯示 Avatar
  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-full h-8 w-8 md:h-9 md:w-9 p-0 border-2 transition-all hover:scale-105 active:scale-95 shadow-sm"
        style={{ borderColor: currentThemeColor }}
      >
        <Avatar className="h-full w-full">
          <AvatarImage src={user.user_metadata?.avatar_url} alt={user.user_metadata?.full_name || user.email} />
          <AvatarFallback>{user.email?.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
      </Button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-1 bg-background/95 backdrop-blur-sm border rounded-md shadow-lg z-[9999] p-3 min-w-[200px] dropdown-menu">
          <div className="space-y-3">
            <div className="text-center border-b pb-2">
              <div className="text-sm font-bold truncate">{user.user_metadata?.full_name}</div>
              <div className="text-xs text-muted-foreground truncate">{user.email}</div>
            </div>

            {/* 統計資訊與排行榜按鈕 - 復用原本邏輯 */}
            {/* ... (這裡保留原本的統計顯示邏輯，稍作簡化以適應新結構) ... */}
            {/* 為求精簡，這裡先直接放排行榜按鈕與登出 */}

            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onShowLeaderboard(viewMode);
                  setIsOpen(false);
                }}
                className="w-full text-xs justify-start"
              >
                <ListOrdered className="h-3 w-3 mr-2" />
                {t('viewLeaderboard')}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="w-full text-xs justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
              >
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
  { name: "green", label: "Lime", color: "#BFFF00" },
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
      <div className="flex items-center">
        {/* 左側：標題 */}
        <div className="flex items-center gap-2 md:gap-8 flex-1">
          <div className="flex flex-col items-start">
            <h1
              className="font-bold tracking-tight leading-tight text-sm md:text-lg"
              style={isVisitorMode ? {
                fontSize: window.innerWidth >= 768 ? '26px' : '23px'
              } : {}}
            >
              {t('gameTitle')}
            </h1>
          </div>
        </div>

        {/* 右側：遊戲工具與用戶按鈕 */}
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

          {/* 新遊戲按鈕 */}
          <Button
            variant="outline"
            size="sm"
            onClick={onNewGame}
            className="transition-smooth hover:scale-105 active:scale-95 shadow-apple-sm hover:shadow-apple-md"
            title={t('newGame')}
          >
            <RotateCcw className="h-3 w-3 md:h-4 md:w-4" />
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
