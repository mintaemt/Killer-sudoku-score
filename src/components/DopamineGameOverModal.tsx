import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Clock, RotateCcw, X, Zap, Skull } from "lucide-react";
import { cn } from "@/lib/utils";

interface DopamineGameOverModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRestart: () => void;
  score: number;
  timeLeft: number;
  difficulty: string;
  comboCount: number;
  mistakes: number;
  topScores: Array<{
    score: number;
    time: number;
    difficulty: string;
  }>;
}

export const DopamineGameOverModal = ({
  isOpen,
  onClose,
  onRestart,
  score,
  timeLeft,
  difficulty,
  comboCount,
  mistakes,
  topScores
}: DopamineGameOverModalProps) => {
  if (!isOpen) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'easy': return 'bg-green-500/20 text-green-600 border-green-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-600 border-yellow-500/30';
      case 'hard': return 'bg-orange-500/20 text-orange-600 border-orange-500/30';
      case 'expert': return 'bg-red-500/20 text-red-600 border-red-500/30';
      case 'hell': return 'bg-purple-500/20 text-purple-600 border-purple-500/30';
      default: return 'bg-gray-500/20 text-gray-600 border-gray-500/30';
    }
  };

  const getDifficultyLabel = (diff: string) => {
    switch (diff) {
      case 'easy': return '簡單';
      case 'medium': return '中等';
      case 'hard': return '困難';
      case 'expert': return '專家';
      case 'hell': return '地獄';
      default: return diff;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-auto">
        <Card className="glass rounded-2xl shadow-apple-lg m-2 sm:m-0">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500">
                  <Skull className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <span>多巴胺模式</span>
                  </CardTitle>
                  <CardDescription>挑戰失敗，但你的努力值得讚賞！</CardDescription>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          
          {/* 大型 GAME OVER 標題 */}
          <div className="text-center py-8">
            <div 
              className="text-6xl md:text-8xl font-black text-transparent bg-clip-text animate-pulse"
              style={{
                background: `
                  radial-gradient(circle farthest-corner at top left, rgba(255, 0, 0, 1) 0%, rgba(255, 0, 0, 0) 50%),
                  radial-gradient(circle farthest-side at top right, rgba(255, 255, 0, 1) 0%, rgba(255, 255, 0, 0) 30%),
                  radial-gradient(circle farthest-corner at bottom right, rgba(255, 0, 255, 1) 0%, rgba(255, 0, 255, 0) 40%),
                  radial-gradient(circle farthest-corner at bottom left, rgba(0, 255, 255, 1) 0%, rgba(0, 255, 255, 0) 35%),
                  linear-gradient(135deg, rgba(255, 0, 0, 0.8) 0%, rgba(255, 255, 0, 0.8) 50%, rgba(255, 0, 255, 0.8) 100%)
                `
              }}
            >
              GAME OVER
            </div>
            <div className="text-lg text-muted-foreground mt-2 font-semibold">
              挑戰失敗！
            </div>
          </div>
          
          <CardContent className="space-y-6">
            {/* 本次遊戲統計 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 rounded-lg bg-card border">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Trophy className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-medium">分數</span>
                </div>
                <div className="text-lg font-bold text-primary">{score.toLocaleString()}</div>
              </div>
              
              <div className="text-center p-3 rounded-lg bg-card border">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">剩餘時間</span>
                </div>
                <div className="text-lg font-bold text-primary">{formatTime(timeLeft)}</div>
              </div>
              
              <div className="text-center p-3 rounded-lg bg-card border">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Zap className="h-4 w-4 text-purple-500" />
                  <span className="text-sm font-medium">最高連擊</span>
                </div>
                <div className="text-lg font-bold text-primary">{comboCount}x</div>
              </div>
              
              <div className="text-center p-3 rounded-lg bg-card border">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Badge variant="outline" className={cn("text-xs", getDifficultyColor(difficulty))}>
                    {getDifficultyLabel(difficulty)}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground mt-1">難度</div>
              </div>
            </div>

            {/* 排行榜 */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                <h3 className="text-lg font-semibold">多巴胺模式排行榜</h3>
              </div>
              
              <div className="space-y-2">
                {topScores.length > 0 ? (
                  topScores.map((entry, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-card border">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                          index === 0 ? "bg-yellow-500 text-white" :
                          index === 1 ? "bg-gray-400 text-white" :
                          index === 2 ? "bg-orange-500 text-white" :
                          "bg-muted text-muted-foreground"
                        )}>
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-medium">{entry.score.toLocaleString()} 分</div>
                          <div className="text-sm text-muted-foreground">
                            {formatTime(entry.time)} - {getDifficultyLabel(entry.difficulty)}
                          </div>
                        </div>
                      </div>
                      <Badge variant="outline" className={cn("text-xs", getDifficultyColor(entry.difficulty))}>
                        {getDifficultyLabel(entry.difficulty)}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Trophy className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>還沒有記錄</p>
                    <p className="text-sm">成為第一個挑戰者！</p>
                  </div>
                )}
              </div>
            </div>

            {/* 操作按鈕 */}
            <div className="flex gap-3 pt-4">
              <Button
                onClick={onRestart}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                再次挑戰
              </Button>
              <Button variant="outline" onClick={onClose} className="flex-1">
                返回主選單
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
