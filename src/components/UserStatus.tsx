import { useUser } from '@/hooks/useUser';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, LogOut } from 'lucide-react';

export const UserStatus = () => {
  const { user, clearUser, isLoggedIn } = useUser();

  if (!isLoggedIn) {
    return null;
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-lg">
          <User className="h-5 w-5" />
          <span>用戶狀態</span>
        </CardTitle>
        <CardDescription>
          您的遊戲資料已儲存在本地
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">姓名</span>
          <Badge variant="secondary">{user?.name}</Badge>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">用戶 ID</span>
          <span className="text-xs font-mono text-muted-foreground">
            {user?.id?.slice(0, 8)}...
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">加入時間</span>
          <span className="text-xs text-muted-foreground">
            {user?.created_at ? new Date(user.created_at).toLocaleDateString() : '未知'}
          </span>
        </div>

        <Button 
          variant="outline" 
          size="sm" 
          onClick={clearUser}
          className="w-full"
        >
          <LogOut className="mr-2 h-4 w-4" />
          切換用戶
        </Button>
      </CardContent>
    </Card>
  );
};
