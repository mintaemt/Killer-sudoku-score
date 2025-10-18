import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Info, X, Trophy, Clock, Target, Lightbulb, Calculator, BookOpen, Zap, Brain, Award } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GameRulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GameRulesModal = ({ isOpen, onClose }: GameRulesModalProps) => {
  const [activeTab, setActiveTab] = useState<string>("rules");
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-auto">
        <Card className="glass rounded-2xl shadow-apple-lg m-2 sm:m-0">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <Info className="h-6 w-6 text-primary" />
                  <span>遊戲規則與計分說明</span>
                </CardTitle>
              </div>
              <Button variant="outline" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="rules">遊戲規則</TabsTrigger>
                <TabsTrigger value="tips">解題技巧</TabsTrigger>
                <TabsTrigger value="scoring">計分規則</TabsTrigger>
              </TabsList>

              <TabsContent value="rules" className="mt-6">
                <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-card border">
                      <Badge variant="outline" className="mt-0.5">1</Badge>
                      <div>
                        <strong className="text-foreground">基本規則：</strong>
                        <span className="text-muted-foreground"> 在9×9的格子中填入數字1-9，每行、每列、每個3×3宮格都不能重複。</span>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-card border">
                      <Badge variant="outline" className="mt-0.5">2</Badge>
                      <div>
                        <strong className="text-foreground">殺手數獨特色：</strong>
                        <span className="text-muted-foreground"> 虛線框內的數字必須相加等於左上角的數字，且框內數字不能重複。</span>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-card border">
                      <Badge variant="outline" className="mt-0.5">3</Badge>
                      <div>
                        <strong className="text-foreground">解題策略：</strong>
                        <span className="text-muted-foreground"> 先從只有一個可能數字的格子開始，逐步推理其他格子的數字。</span>
                      </div>
                    </div>
                  </div>
              </TabsContent>

              <TabsContent value="tips" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-card border">
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <Target className="h-4 w-4 text-blue-500" />
                        唯一候選數
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        在行、列或宮格中，如果某個數字只有一個可能位置，那就是答案。
                      </p>
                    </div>
                    
                    <div className="p-4 rounded-lg bg-card border">
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <Brain className="h-4 w-4 text-green-500" />
                        隱藏單數
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        在某個格子中，如果只有一個數字可以填入，那就是答案。
                      </p>
                    </div>
                    
                    <div className="p-4 rounded-lg bg-card border">
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-purple-500" />
                        殺手數獨技巧
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        利用虛線框的總和限制，排除不可能的數字組合。
                      </p>
                    </div>
                    
                    <div className="p-4 rounded-lg bg-card border">
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <Zap className="h-4 w-4 text-orange-500" />
                        速度提升
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        熟練後可以同時考慮多個限制條件，提高解題速度。
                      </p>
                    </div>
                  </div>
              </TabsContent>

              <TabsContent value="scoring" className="mt-6">
                <div className="space-y-4">
                  {/* 排行榜說明 */}
                  <div className="p-3 rounded-lg bg-card border">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                      <div>• 排行榜按難度分類，顯示各難度的最佳成績</div>
                      <div>• 排名依據：分數 → 最佳時間 → 遊戲次數</div>
                      <div>• 每次完成遊戲都會自動更新排行榜</div>
                      <div>• 分數計算過程會完整記錄，確保公平透明</div>
                    </div>
                  </div>

                  {/* 計分規則 - 優化為更緊湊的佈局 */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-3">
                    {/* 基礎分數 */}
                    <div className="p-3 rounded-lg bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-950/20 dark:to-green-950/20 border">
                      <h4 className="font-semibold mb-2 flex items-center gap-2 text-sm">
                        <Trophy className="h-4 w-4 text-yellow-500" />
                        基礎分數
                      </h4>
                      <div className="grid grid-cols-2 gap-1 text-xs">
                        <div className="text-center p-1.5 rounded bg-background/50">
                          <div className="font-medium">簡單</div>
                          <div className="text-muted-foreground">100分</div>
                        </div>
                        <div className="text-center p-1.5 rounded bg-background/50">
                          <div className="font-medium">中等</div>
                          <div className="text-muted-foreground">200分</div>
                        </div>
                        <div className="text-center p-1.5 rounded bg-background/50">
                          <div className="font-medium">困難</div>
                          <div className="text-muted-foreground">300分</div>
                        </div>
                        <div className="text-center p-1.5 rounded bg-background/50">
                          <div className="font-medium">專家</div>
                          <div className="text-muted-foreground">500分</div>
                        </div>
                      </div>
                    </div>

                    {/* 時間獎勵 */}
                    <div className="p-3 rounded-lg bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 border">
                      <h4 className="font-semibold mb-2 flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-blue-500" />
                        時間獎勵
                      </h4>
                      <div className="space-y-1.5 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Badge variant="secondary" className="text-xs px-1 py-0.5">提前</Badge>
                          <span>每提前1秒+0.5分（最多500分）</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Badge variant="secondary" className="text-xs px-1 py-0.5">超時</Badge>
                          <span>每超時1秒-0.1分（最少0分）</span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          <strong>理想時間：</strong>簡6分、中12分、難18分、專24分
                        </div>
                      </div>
                    </div>

                    {/* 錯誤懲罰 */}
                    <div className="p-3 rounded-lg bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 border">
                      <h4 className="font-semibold mb-2 flex items-center gap-2 text-sm">
                        <Target className="h-4 w-4 text-red-500" />
                        錯誤懲罰
                      </h4>
                      <div className="text-xs text-muted-foreground space-y-1">
                        <div className="flex items-center gap-1.5">
                          <Badge variant="destructive" className="text-xs px-1 py-0.5">錯誤</Badge>
                          <span>每個錯誤扣除20分</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          <strong>最低分數：</strong>基礎分數的20%
                        </div>
                        <div className="text-xs text-muted-foreground">
                          （簡20分、中40分、難60分、專100分）
                        </div>
                      </div>
                    </div>

                    {/* 分數計算公式 */}
                    <div className="p-3 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border">
                      <h4 className="font-semibold mb-2 flex items-center gap-2 text-sm">
                        <Calculator className="h-4 w-4 text-purple-500" />
                        計算公式
                      </h4>
                      <div className="text-xs text-muted-foreground space-y-1">
                        <div className="font-mono bg-background/50 p-1.5 rounded text-xs">
                          最終分數 = max(基礎分數 × 0.2, 基礎分數 + 時間獎勵 - 錯誤懲罰)
                        </div>
                        <div className="text-xs text-muted-foreground">
                          <strong>範例：</strong>簡單模式，2分鐘完成，1次錯誤 = 100 + 240 - 20 = 320分
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
