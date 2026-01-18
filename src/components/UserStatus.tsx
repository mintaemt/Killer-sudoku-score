import { useUser } from '@/hooks/useUser';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, LogOut } from 'lucide-react';

export const UserStatus = () => {
  const { user, clearUser, isLoggedIn } = useUser();
  const { t } = useLanguage();

  if (!isLoggedIn) {
    return null;
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-lg">
          <User className="h-5 w-5" />
          <span>{t('userStatusTitle')}</span>
        </CardTitle>
        <CardDescription>
          {t('userStatusDesc')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">{t('nameLabel')}</span>
          <Badge variant="secondary">{user?.name}</Badge>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">{t('userIdLabel')}</span>
          <span className="text-xs font-mono text-muted-foreground">
            {user?.id?.slice(0, 8)}...
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">{t('joinDateLabel')}</span>
          <span className="text-xs text-muted-foreground">
            {user?.created_at ? new Date(user.created_at).toLocaleDateString() : t('unknownDate')}
          </span>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={clearUser}
          className="w-full"
        >
          <LogOut className="mr-2 h-4 w-4" />
          {t('switchUser')}
        </Button>
      </CardContent>
    </Card>
  );
};
