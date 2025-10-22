import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

interface HintAdModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWatchAd: () => void;
}

export const HintAdModal: React.FC<HintAdModalProps> = ({
  isOpen,
  onClose,
  onWatchAd,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[90vw] md:w-[500px] !max-w-none max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Play className="h-5 w-5 text-blue-500" />
            觀看廣告獲得提示
          </DialogTitle>
          <DialogDescription>
            免費提示次數已用完，觀看廣告獲得額外提示
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-card border">
            <h3 className="font-medium mb-2 flex items-center gap-2">
              <Play className="h-4 w-4 text-blue-500 flex-shrink-0" />
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
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
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
