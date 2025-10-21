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
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Crown className="h-6 w-6 text-yellow-500" />
            成為註冊用戶，解鎖更多功能！
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* 當前狀態 */}
          <Card className="border-orange-200 bg-orange-50/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5" />
                目前狀態：訪客模式
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                您目前以訪客身份遊玩，可以享受基本的殺手數獨遊戲體驗。
              </p>
            </CardContent>
          </Card>

          {/* 註冊用戶專屬功能 */}
          <div>
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              註冊用戶專屬功能
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 多巴胺模式 */}
              <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Zap className="h-5 w-5 text-purple-600" />
                    多巴胺挑戰模式
                    <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                      獨家功能
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    • 限時挑戰，測試你的極限
                  </p>
                  <p className="text-sm text-muted-foreground">
                    • 連擊系統，連續正確獲得獎勵
                  </p>
                  <p className="text-sm text-muted-foreground">
                    • 5 種難度等級，包含地獄模式
                  </p>
                  <p className="text-sm text-muted-foreground">
                    • 專屬計分系統和排行榜
                  </p>
                </CardContent>
              </Card>

              {/* 排行榜競爭 */}
              <Card className="border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-yellow-600" />
                    全球排行榜競爭
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    • 與全球玩家競爭排名
                  </p>
                  <p className="text-sm text-muted-foreground">
                    • 按難度和模式分類排行
                  </p>
                  <p className="text-sm text-muted-foreground">
                    • 個人最佳成績追蹤
                  </p>
                  <p className="text-sm text-muted-foreground">
                    • 遊戲記錄永久保存
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* 註冊要求 */}
          <Card className="border-green-200 bg-green-50/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5 text-green-600" />
                如何成為註冊用戶？
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-green-600">1</span>
                </div>
                <div>
                  <p className="font-medium">輸入唯一用戶名稱</p>
                  <p className="text-sm text-muted-foreground">
                    選擇一個獨特的用戶名稱，將成為你在排行榜上的身份
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-green-600">2</span>
                </div>
                <div>
                  <p className="font-medium">立即開始遊戲</p>
                  <p className="text-sm text-muted-foreground">
                    無需郵箱驗證，無需複雜註冊流程，立即享受完整功能
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-green-600">3</span>
                </div>
                <div>
                  <p className="font-medium">數據自動同步</p>
                  <p className="text-sm text-muted-foreground">
                    遊戲記錄和統計數據會自動保存到雲端，隨時隨地存取
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 行動按鈕 */}
          <div className="flex gap-3 pt-4">
            <Button onClick={onBecomeUser} className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              <Crown className="h-4 w-4 mr-2" />
              立即成為註冊用戶
            </Button>
            <Button variant="outline" onClick={onClose} className="px-6">
              繼續訪客模式
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
