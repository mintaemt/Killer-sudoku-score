import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/hooks/useLanguage";
import { 
  Zap, 
  Users, 
  Trophy, 
  Clock, 
  Target, 
  Star,
  Crown
} from "lucide-react";

interface FeatureHintModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBecomeUser: () => void;
}

export const FeatureHintModal = ({ isOpen, onClose, onBecomeUser }: FeatureHintModalProps) => {
  const { t } = useLanguage();

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[650px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Star className="h-6 w-6 text-yellow-500" />
            註冊用戶，解鎖更多功能！
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* 註冊用戶專屬功能 */}
          <div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 多巴胺模式 */}
              <Card className="border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2 text-purple-700 dark:text-purple-300">
                    <Zap className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    多巴胺挑戰模式
                    <Badge variant="secondary" className="bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300">
                      獨家功能
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-x-2 gap-y-2">
                    <div className="flex items-start gap-1">
                      <span className="text-xs text-muted-foreground dark:text-muted-foreground">•</span>
                      <p className="text-xs text-muted-foreground dark:text-muted-foreground">
                        限時挑戰
                      </p>
                    </div>
                    <div className="flex items-start gap-1">
                      <span className="text-xs text-muted-foreground dark:text-muted-foreground">•</span>
                      <p className="text-xs text-muted-foreground dark:text-muted-foreground">
                        連擊系統
                      </p>
                    </div>
                    <div className="flex items-start gap-1">
                      <span className="text-xs text-muted-foreground dark:text-muted-foreground">•</span>
                      <p className="text-xs text-muted-foreground dark:text-muted-foreground">
                        5 種難度
                      </p>
                    </div>
                    <div className="flex items-start gap-1">
                      <span className="text-xs text-muted-foreground dark:text-muted-foreground">•</span>
                      <p className="text-xs text-muted-foreground dark:text-muted-foreground">
                        專屬計分
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 排行榜競爭 */}
              <Card className="border-yellow-200 dark:border-yellow-800 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/30 dark:to-orange-950/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2 text-yellow-700 dark:text-yellow-300">
                    <Trophy className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                    全球排行榜競爭
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-x-2 gap-y-2">
                    <div className="flex items-start gap-1">
                      <span className="text-xs text-muted-foreground dark:text-muted-foreground">•</span>
                      <p className="text-xs text-muted-foreground dark:text-muted-foreground">
                        全球競爭
                      </p>
                    </div>
                    <div className="flex items-start gap-1">
                      <span className="text-xs text-muted-foreground dark:text-muted-foreground">•</span>
                      <p className="text-xs text-muted-foreground dark:text-muted-foreground">
                        分類排行
                      </p>
                    </div>
                    <div className="flex items-start gap-1">
                      <span className="text-xs text-muted-foreground dark:text-muted-foreground">•</span>
                      <p className="text-xs text-muted-foreground dark:text-muted-foreground">
                        成績追蹤
                      </p>
                    </div>
                    <div className="flex items-start gap-1">
                      <span className="text-xs text-muted-foreground dark:text-muted-foreground">•</span>
                      <p className="text-xs text-muted-foreground dark:text-muted-foreground">
                        記錄保存
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* 註冊要求 */}
          <Card className="border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2 text-green-700 dark:text-green-300">
                <Users className="h-5 w-5 text-green-600 dark:text-green-400" />
                如何成為註冊用戶？
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-x-2 gap-y-3">
                <div className="flex items-start gap-2">
                  <div className="flex-shrink-0 w-5 h-5 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-green-600 dark:text-green-400">1</span>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-foreground dark:text-foreground">輸入用戶名稱</p>
                    <p className="text-xs text-muted-foreground dark:text-muted-foreground">
                      選擇獨特名稱
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <div className="flex-shrink-0 w-5 h-5 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-green-600 dark:text-green-400">2</span>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-foreground dark:text-foreground">立即開始遊戲</p>
                    <p className="text-xs text-muted-foreground dark:text-muted-foreground">
                      無需驗證流程
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2 col-span-2">
                  <div className="flex-shrink-0 w-5 h-5 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-green-600 dark:text-green-400">3</span>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-foreground dark:text-foreground">數據自動同步</p>
                    <p className="text-xs text-muted-foreground dark:text-muted-foreground">
                      遊戲記錄自動保存到雲端
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 行動按鈕 */}
          <div>
            <Button 
              onClick={onBecomeUser}
              className="w-full h-12 text-lg font-bold text-white shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden flowing-button"
            >
              <Crown className="mr-2 h-5 w-5" />
              立即成為註冊用戶
            </Button>
            <Button variant="outline" onClick={onClose} className="w-full mt-3">
              繼續訪客模式
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
