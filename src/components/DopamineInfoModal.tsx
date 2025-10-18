import React from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, Crown, Star, AlertTriangle, Trophy, X, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface DopamineInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartChallenge: () => void;
}

const difficultyInfo = [
  { name: "Easy", probability: "54.2%", color: "bg-gray-500/20 text-gray-600 border-gray-500/30", description: "基礎成就感" },
  { name: "Medium", probability: "40%", color: "bg-blue-500/20 text-blue-600 border-blue-500/30", description: "適度挑戰" },
  { name: "Hard", probability: "5.5%", color: "bg-purple-500/20 text-purple-600 border-purple-500/30", description: "高成就感" },
  { name: "Expert", probability: "0.2%", color: "bg-orange-500/20 text-orange-600 border-orange-500/30", description: "頂級挑戰" },
  { name: "Hell", probability: "0.1% + 保底", color: "bg-red-500/20 text-red-600 border-red-500/30", description: "最高成就感" }
];

export const DopamineInfoModal = ({ isOpen, onClose, onStartChallenge }: DopamineInfoModalProps) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-2 sm:p-4 z-[9999]">
      <div className="w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-auto">
        <Card className="glass rounded-2xl shadow-apple-lg m-2 sm:m-0">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <span>多巴胺模式</span>
                    <Badge 
                      variant="secondary" 
                      className="text-white relative overflow-hidden"
                      style={{
                        background: `
                          radial-gradient(circle at 20% 20%, rgba(249, 115, 22, 0.8) 0%, rgba(249, 115, 22, 0) 40%),
                          radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.8) 0%, rgba(59, 130, 246, 0) 40%),
                          radial-gradient(circle at 20% 80%, rgba(236, 72, 153, 0.8) 0%, rgba(236, 72, 153, 0) 40%),
                          radial-gradient(circle at 80% 80%, rgba(168, 85, 247, 0.8) 0%, rgba(168, 85, 247, 0) 40%),
                          radial-gradient(ellipse at center, rgba(59, 130, 246, 0.2) 0%, rgba(59, 130, 246, 0) 60%)
                        `
                      }}
                    >
                      <Users className="h-3 w-3 mr-1" />
                      用戶限定
                    </Badge>
                  </CardTitle>
                  <CardDescription className="mt-2">超越普通模式的遊樂性與成就感</CardDescription>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* 模式介紹 */}
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border">
                <h3 className="font-semibold mb-2 flex items-center gap-2 text-sm">
                  <Star className="h-4 w-4 text-purple-500" />
                  模式特色
                </h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• 隨機難度挑戰，每次都是全新體驗</li>
                  <li>• 特殊計分系統，連擊與速度獎勵</li>
                </ul>
              </div>

              <div className="p-4 rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border">
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

            {/* 難度機率表 */}
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2 text-sm">
                <Crown className="h-4 w-4 text-yellow-500" />
                難度稀有度與機率
              </h3>
              <div className="space-y-2">
                {difficultyInfo.map((difficulty, index) => (
                  <div key={difficulty.name} className={cn(
                    "flex items-center justify-between p-3 rounded-lg border",
                    difficulty.color
                  )}>
                    <div className="flex items-center gap-3">
                      <div>
                        <div className="font-bold">{difficulty.name}</div>
                        <div className="text-xs text-muted-foreground">{difficulty.description}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-sm">{difficulty.probability}</div>
                      {difficulty.name === "Hell" && (
                        <div className="text-xs text-muted-foreground">每20次保底</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 開始挑戰按鈕 */}
            <div className="pt-4">
              <Button 
                onClick={onStartChallenge}
                className="w-full h-12 text-lg font-bold text-white shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden"
                style={{
                  background: `
                    radial-gradient(circle at 20% 20%, rgba(249, 115, 22, 0.8) 0%, rgba(249, 115, 22, 0) 40%),
                    radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.8) 0%, rgba(59, 130, 246, 0) 40%),
                    radial-gradient(circle at 20% 80%, rgba(236, 72, 153, 0.8) 0%, rgba(236, 72, 153, 0) 40%),
                    radial-gradient(circle at 80% 80%, rgba(168, 85, 247, 0.8) 0%, rgba(168, 85, 247, 0) 40%),
                    radial-gradient(ellipse at center, rgba(59, 130, 246, 0.2) 0%, rgba(59, 130, 246, 0) 60%)
                  `
                }}
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
