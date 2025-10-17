import { Button } from "@/components/ui/button";
import { RotateCcw, Palette, User, LogOut } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";
import { useUser } from "@/hooks/useUser";

interface GameHeaderProps {
  onNewGame: () => void;
  onThemeChange: (theme: string) => void;
  currentTheme: string;
}

const themes = [
  { name: "blue", label: "Blue", color: "#3b82f6" },
  { name: "orange", label: "Orange", color: "#ff7710" },
  { name: "green", label: "Green", color: "#22c55e" },
  { name: "purple", label: "Purple", color: "#a855f7" },
  { name: "pink", label: "Pink", color: "#ec4899" },
  { name: "teal", label: "Teal", color: "#14b8a6" },
];

export const GameHeader = ({ onNewGame, onThemeChange, currentTheme }: GameHeaderProps) => {
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [isUserOpen, setIsUserOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const { user, clearUser, isLoggedIn } = useUser();

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
    <div className="glass rounded-2xl px-3 md:px-6 py-3 md:py-4 shadow-apple-md relative z-20">
      <div className="flex items-center justify-between">
        {/* 左側：標題 */}
        <div className="flex items-center gap-2 md:gap-8">
          <div className="flex flex-col items-start">
            <h1 className="text-lg md:text-2xl font-bold tracking-tight leading-tight">數獨</h1>
            <h2 className="text-xs md:text-sm text-muted-foreground leading-tight">Killer Sudoku</h2>
          </div>
        </div>

        {/* 右側：主題切換、主題選擇器、用戶狀態和新遊戲按鈕 */}
        <div className="flex items-center gap-1 md:gap-2">
          <ThemeToggle />
          
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
              <div className="absolute top-full right-0 mt-1 dropdown-glass rounded-md shadow-lg z-[9999] p-2 min-w-[120px] dropdown-menu">
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

          {/* 用戶狀態 */}
          {isLoggedIn && (
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
                <div className="absolute top-full right-0 mt-1 dropdown-glass rounded-md shadow-lg z-[9999] p-3 min-w-[200px] dropdown-menu">
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-center">{user?.name}</div>
                    <div className="text-xs text-muted-foreground text-center">
                      用戶 ID: {user?.id?.slice(0, 8)}...
                    </div>
                    <div className="border-t pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          clearUser();
                          setIsUserOpen(false);
                        }}
                        className="w-full text-xs"
                      >
                        <LogOut className="h-3 w-3 mr-1" />
                        切換用戶
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
            title="新遊戲"
          >
            <RotateCcw className="h-3 w-3 md:h-4 md:w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
