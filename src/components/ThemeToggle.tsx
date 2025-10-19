import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";

export const ThemeToggle = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const toggleTheme = () => {
    // 如果當前是 system 模式，根據實際解析的主題來切換
    if (theme === "system") {
      setTheme(resolvedTheme === "dark" ? "light" : "dark");
    } else {
      // 在 light 和 dark 之間切換
      setTheme(theme === "dark" ? "light" : "dark");
    }
  };

  // 顯示圖示基於實際解析的主題（resolvedTheme）
  const getIcon = () => {
    return resolvedTheme === "dark" ? (
      <Moon className="h-3 w-3 md:h-4 md:w-4" />
    ) : (
      <Sun className="h-3 w-3 md:h-4 md:w-4" />
    );
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleTheme}
      className="h-8 w-8 p-0 transition-smooth hover:scale-105 active:scale-95 shadow-apple-sm hover:shadow-apple-md flex-shrink-0"
      title={`${t('currentTheme')}: ${resolvedTheme}. ${t('clickToToggle')}`}
    >
      {getIcon()}
    </Button>
  );
};
