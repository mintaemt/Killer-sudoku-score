import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/useLanguage";

// 主題顏色映射
const getThemeColors = (theme: string) => {
  const themeColors: Record<string, { bg: string; hover: string; text: string }> = {
    blue: { bg: "bg-blue-500", hover: "hover:bg-blue-600", text: "text-white" },
    orange: { bg: "bg-orange-500", hover: "hover:bg-orange-600", text: "text-white" },
    green: { bg: "bg-green-500", hover: "hover:bg-green-600", text: "text-white" },
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
}

export const NumberPad = ({ 
  onNumberSelect, 
  onClear, 
  disabled, 
  showClearOnly = false, 
  showNumbersOnly = false,
  currentTheme = "blue"
}: NumberPadProps) => {
  const { t } = useLanguage();
  
  // 如果只顯示 clear 按鈕
  if (showClearOnly) {
    const themeColors = getThemeColors(currentTheme);
    return (
      <div className="glass rounded-2xl p-2 shadow-apple-lg">
        <Button
          size="lg"
          onClick={onClear}
          disabled={disabled}
          className={cn(
            "w-full h-12 transition-smooth font-bold text-lg",
            "shadow-apple-sm hover:shadow-apple-md",
            themeColors.bg,
            themeColors.hover,
            themeColors.text,
            "border-0"
          )}
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
    <div className="glass rounded-2xl p-4 md:p-6 shadow-apple-lg w-full">
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
          disabled={disabled}
          className={cn(
            "w-full h-12 transition-smooth font-bold text-lg",
            "shadow-apple-sm hover:shadow-apple-md",
            getThemeColors(currentTheme).bg,
            getThemeColors(currentTheme).hover,
            getThemeColors(currentTheme).text,
            "border-0"
          )}
        >
          {t('clear')}
        </Button>
      </div>
    </div>
  );
};
