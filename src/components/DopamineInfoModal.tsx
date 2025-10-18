import React, { useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, Crown, Star, AlertTriangle, Trophy, X, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { DopamineDifficulty } from "@/lib/types";

interface DopamineInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartChallenge: (difficulty: DopamineDifficulty) => void;
}

const difficultyOptions: { value: DopamineDifficulty; label: string; description: string; color: string; ringColor: string; radioColor: string }[] = [
  { value: "easy", label: "Easy", description: "基礎成就感", color: "bg-gray-500/20 text-gray-600 border-gray-500/30", ringColor: "ring-gray-500", radioColor: "accent-gray-500" },
  { value: "medium", label: "Medium", description: "適度挑戰", color: "bg-blue-500/20 text-blue-600 border-blue-500/30", ringColor: "ring-blue-500", radioColor: "accent-blue-500" },
  { value: "hard", label: "Hard", description: "高成就感", color: "bg-purple-500/20 text-purple-600 border-purple-500/30", ringColor: "ring-purple-500", radioColor: "accent-purple-500" },
  { value: "expert", label: "Expert", description: "頂級挑戰", color: "bg-orange-500/20 text-orange-600 border-orange-500/30", ringColor: "ring-orange-500", radioColor: "accent-orange-600" },
  { value: "hell", label: "Hell", description: "最高成就感", color: "bg-red-500/20 text-red-600 border-red-500/30", ringColor: "ring-red-500", radioColor: "accent-red-500" }
];

export const DopamineInfoModal = ({ isOpen, onClose, onStartChallenge }: DopamineInfoModalProps) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<DopamineDifficulty>("medium");
  
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-2 sm:p-4 z-[9999]">
      <div className="w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-auto">
        <Card className="glass rounded-2xl shadow-apple-lg m-2 sm:m-0">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <span>多巴胺模式</span>
                    <Badge 
                      variant="secondary" 
                      className="text-white relative overflow-hidden flowing-button"
                    >
                      <Users className="h-3 w-3 mr-1" />
                      用戶限定
                    </Badge>
                  </CardTitle>
                  <CardDescription className="mt-2">超越普通模式的遊樂性與成就感</CardDescription>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={onClose} className="mt-1">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* 模式介紹 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border">
                <h3 className="font-semibold mb-2 flex items-center gap-2 text-sm">
                  <Star className="h-4 w-4 text-purple-500" />
                  模式特色
                </h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• 選擇難度挑戰，專注於特定難度</li>
                  <li>• 特殊計分系統，連擊與速度獎勵</li>
                </ul>
              </div>

              <div className="p-3 rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border">
                <h3 className="font-semibold mb-2 flex items-center gap-2 text-sm">
                  <AlertTriangle className="h-4 w-4 text-blue-500" />
                  遊戲規則
                </h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• 時間限制內完成數獨挑戰</li>
                  <li>• 錯誤次數影響最終分數</li>
                  <li>• 連續正確填寫可獲得連擊獎勵</li>
                  <li>• 完成速度越快，分數加成越高</li>
                </ul>
              </div>
            </div>

            {/* 難度選擇 */}
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2 text-sm">
                <Crown className="h-4 w-4 text-yellow-500" />
                選擇挑戰難度
              </h3>
              <div className="grid grid-cols-5 gap-2">
                {difficultyOptions.map((difficulty) => (
                  <div 
                    key={difficulty.value} 
                    className={cn(
                      "flex flex-col items-center justify-center p-2 rounded-lg border cursor-pointer transition-all duration-200 text-center",
                      difficulty.color,
                      selectedDifficulty === difficulty.value && `ring-2 ${difficulty.ringColor} ring-offset-2`
                    )}
                    onClick={() => setSelectedDifficulty(difficulty.value)}
                  >
                    <input
                      type="radio"
                      name="difficulty"
                      value={difficulty.value}
                      checked={selectedDifficulty === difficulty.value}
                      onChange={() => setSelectedDifficulty(difficulty.value)}
                      className={cn(
                        "w-3 h-3 mb-1",
                        difficulty.radioColor
                      )}
                    />
                    <div className="text-xs font-bold">{difficulty.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 開始挑戰按鈕 */}
            <div className="pt-4">
              <Button 
                onClick={() => onStartChallenge(selectedDifficulty)}
                className="w-full h-12 text-lg font-bold text-white shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden flowing-button"
              >
                <Trophy className="mr-2 h-5 w-5" />
                開始挑戰
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>,
    document.body
  );
};
