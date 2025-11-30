import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/useLanguage";
import { useState, useRef } from "react";

// 主題顏色映射
const getThemeColors = (theme: string) => {
  const themeColors: Record<string, { bg: string; hover: string; text: string }> = {
    blue: { bg: "bg-blue-500", hover: "hover:bg-blue-600", text: "text-white" },
    orange: { bg: "bg-orange-500", hover: "hover:bg-orange-600", text: "text-white" },
    green: { bg: "bg-lime-400", hover: "hover:bg-lime-500", text: "text-black" },
    purple: { bg: "bg-purple-500", hover: "hover:bg-purple-600", text: "text-white" },
    pink: { bg: "bg-pink-500", hover: "hover:bg-pink-600", text: "text-white" },
    teal: { bg: "bg-teal-500", hover: "hover:bg-teal-600", text: "text-white" },
  };
  return themeColors[theme] || themeColors.blue;
};

interface NumberPadProps {
  onNumberSelect: (num: number) => void;
  onClear: () => void;
  disabled?: boolean;
  showClearOnly?: boolean;
  showNumbersOnly?: boolean;
  currentTheme?: string;
  onTestComplete?: () => void;
}

export const NumberPad = ({
  onNumberSelect,
  onClear,
  disabled,
  showClearOnly = false,
  showNumbersOnly = false,
  currentTheme = "blue",
  onTestComplete
}: NumberPadProps) => {
  const { t } = useLanguage();
  const [isLongPressing, setIsLongPressing] = useState(false);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const longPressThreshold = 3000; // 3秒長按

  // 長按處理函數
  const handleLongPressStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (onTestComplete) {
      console.log('🔥 長按開始');
      e.preventDefault(); // 防止默認行為
      e.stopPropagation(); // 阻止事件冒泡
      setIsLongPressing(true);
      longPressTimer.current = setTimeout(() => {
        console.log('⚡ 長按完成，觸發一鍵獲勝');
        onTestComplete();
        setIsLongPressing(false);
      }, longPressThreshold);
    }
  };

  const handleLongPressEnd = (e: React.MouseEvent | React.TouchEvent) => {
    console.log('🛑 長按結束');
    e.preventDefault();
    e.stopPropagation();
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
    setIsLongPressing(false);
  };

  // 防止觸控選擇
  const handleTouchStart = (e: React.TouchEvent) => {
    if (onTestComplete) {
      e.preventDefault();
      handleLongPressStart(e);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (onTestComplete) {
      e.preventDefault();
      handleLongPressEnd(e);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (onTestComplete) {
      e.preventDefault();
      handleLongPressStart(e);
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (onTestComplete) {
      e.preventDefault();
      handleLongPressEnd(e);
    }
  };

  const handleMouseLeave = (e: React.MouseEvent) => {
    if (onTestComplete) {
      e.preventDefault();
      handleLongPressEnd(e);
    }
  };

  // 清理定時器
  const cleanup = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  // 如果只顯示 clear 按鈕
  if (showClearOnly) {
    const themeColors = getThemeColors(currentTheme);
    return (
      <div className="glass rounded-2xl p-3 shadow-apple-lg">
        <Button
          size="lg"
          onClick={onClear}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          disabled={disabled}
          className={cn(
            "w-full h-12 transition-smooth font-bold text-lg",
            "shadow-apple-sm hover:shadow-apple-md",
            themeColors.bg,
            themeColors.hover,
            themeColors.text,
            "border-0",
            "select-none" // 防止文字選擇
          )}
          style={{ userSelect: 'none', WebkitUserSelect: 'none' }} // 額外的防止選擇樣式
        >
          {t('clear')}
        </Button>
      </div>
    );
  }

  // 如果只顯示數字按鈕
  if (showNumbersOnly) {
    return (
      <div className="glass rounded-2xl p-3 shadow-apple-lg w-full h-full flex flex-col">
        <div className="grid grid-cols-3 gap-2 flex-1">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <Button
              key={num}
              variant="outline"
              onClick={() => onNumberSelect(num)}
              disabled={disabled}
              className={cn(
                "h-full w-full text-2xl font-bold transition-smooth",
                "border-2 hover:border-primary hover:bg-primary/10",
                "hover:scale-105 active:scale-95",
                "disabled:opacity-40 disabled:cursor-not-allowed",
                "shadow-apple-sm hover:shadow-apple-md",
                "bg-background/80 backdrop-blur-sm",
                "text-foreground hover:text-foreground", // 確保文字在 hover 時保持前景色
                "p-0 min-h-0" // 移除預設的 padding 和最小高度
              )}
            >
              {num}
            </Button>
          ))}
        </div>
      </div>
    );
  }

  // 預設顯示模式（移動裝置）
  return (
    <div className="glass rounded-2xl p-3 md:p-3 shadow-apple-lg w-full">
      <div className="space-y-3">
        {/* Numbers 1-9 in a single row on mobile */}
        <div className="grid grid-cols-9 gap-1 md:gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <Button
              key={num}
              variant="outline"
              size="sm"
              onClick={() => onNumberSelect(num)}
              disabled={disabled}
              className={cn(
                "aspect-square text-lg md:text-2xl font-semibold transition-smooth p-0",
                "border hover:border-primary hover:bg-primary/10",
                "hover:scale-105 active:scale-95",
                "disabled:opacity-40 disabled:cursor-not-allowed",
                "shadow-apple-sm hover:shadow-apple-md",
                "text-foreground hover:text-foreground" // 確保文字在 hover 時保持前景色
              )}
            >
              {num}
            </Button>
          ))}
        </div>

        {/* Clear button below */}
        <Button
          size="lg"
          onClick={onClear}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          disabled={disabled}
          className={cn(
            "w-full h-12 transition-smooth font-bold text-lg",
            "shadow-apple-sm hover:shadow-apple-md",
            getThemeColors(currentTheme).bg,
            getThemeColors(currentTheme).hover,
            getThemeColors(currentTheme).text,
            "border-0",
            "select-none" // 防止文字選擇
          )}
          style={{ userSelect: 'none', WebkitUserSelect: 'none' }} // 額外的防止選擇樣式
        >
          {t('clear')}
        </Button>
      </div>
    </div>
  );
};
