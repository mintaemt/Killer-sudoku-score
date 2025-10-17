import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NumberPadProps {
  onNumberSelect: (num: number) => void;
  onClear: () => void;
  disabled?: boolean;
  showClearOnly?: boolean;
  showNumbersOnly?: boolean;
}

export const NumberPad = ({ 
  onNumberSelect, 
  onClear, 
  disabled, 
  showClearOnly = false, 
  showNumbersOnly = false 
}: NumberPadProps) => {
  // 如果只顯示 clear 按鈕
  if (showClearOnly) {
    return (
      <div className="glass rounded-2xl p-2 shadow-apple-lg">
        <Button
          variant="destructive"
          size="lg"
          onClick={onClear}
          disabled={disabled}
          className={cn(
            "w-full transition-smooth font-semibold",
            "hover:scale-105 active:scale-95",
            "shadow-apple-sm hover:shadow-apple-md"
          )}
        >
          Clear
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
                "shadow-apple-sm hover:shadow-apple-md"
              )}
            >
              {num}
            </Button>
          ))}
        </div>
        
        {/* Clear button below */}
        <Button
          variant="destructive"
          size="lg"
          onClick={onClear}
          disabled={disabled}
          className={cn(
            "w-full transition-smooth font-semibold",
            "hover:scale-105 active:scale-95",
            "shadow-apple-sm hover:shadow-apple-md"
          )}
        >
          Clear
        </Button>
      </div>
    </div>
  );
};
