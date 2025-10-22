import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";

// 主題顏色映射
const getThemeColors = (theme: string) => {
  const themeColors: Record<string, { bg: string; hover: string; text: string; icon: string }> = {
    blue: { bg: "bg-blue-500", hover: "hover:bg-blue-600", text: "text-white", icon: "text-blue-500" },
    orange: { bg: "bg-orange-500", hover: "hover:bg-orange-600", text: "text-white", icon: "text-orange-500" },
    green: { bg: "bg-green-500", hover: "hover:bg-green-600", text: "text-white", icon: "text-green-500" },
    purple: { bg: "bg-purple-500", hover: "hover:bg-purple-600", text: "text-white", icon: "text-purple-500" },
    pink: { bg: "bg-pink-500", hover: "hover:bg-pink-600", text: "text-white", icon: "text-pink-500" },
    teal: { bg: "bg-teal-500", hover: "hover:bg-teal-600", text: "text-white", icon: "text-teal-500" },
  };
  return themeColors[theme] || themeColors.blue;
};

interface HintAdModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWatchAd: () => void;
  currentTheme?: string;
}

export const HintAdModal: React.FC<HintAdModalProps> = ({
  isOpen,
  onClose,
  onWatchAd,
  currentTheme = "blue",
}) => {
  const themeColors = getThemeColors(currentTheme);
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[90vw] md:w-[500px] !max-w-none max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Play className={cn("h-5 w-5", themeColors.icon)} />
            觀看廣告獲得提示
          </DialogTitle>
          <DialogDescription>
            免費提示次數已用完，觀看廣告獲得額外提示
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-card border">
            <h3 className="font-medium mb-2 flex items-center gap-2">
              <Play className={cn("h-4 w-4 flex-shrink-0", themeColors.icon)} />
              提示功能說明
            </h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• 每次遊戲有 3 次免費提示</li>
              <li>• 提示會自動填入選中格子的正確答案</li>
              <li>• 觀看廣告可獲得額外提示次數</li>
            </ul>
          </div>
          
          <div className="flex gap-3">
            <Button
              onClick={onWatchAd}
              className={cn(
                "flex-1",
                themeColors.bg,
                themeColors.hover,
                themeColors.text
              )}
            >
              觀看廣告獲得提示
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              取消
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
