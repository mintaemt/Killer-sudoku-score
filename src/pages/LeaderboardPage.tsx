import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Leaderboard } from '@/components/Leaderboard';
import { ArrowLeft, Trophy } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useUser } from '@/hooks/useUser';
import { useLanguage } from '@/hooks/useLanguage';

const LeaderboardPage = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [searchParams] = useSearchParams();
  const { t } = useLanguage();
  const mode = searchParams.get('mode') || 'normal'; // 默認為普通模式

  const isDopamineMode = mode === 'dopamine';

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto">
        {/* 頁面標題 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/')}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>{t('backToGame')}</span>
            </Button>
            <div className="flex items-center space-x-2">
              <Trophy className="h-6 w-6 text-yellow-500" />
              <h1 className="text-2xl font-bold">
                {isDopamineMode ? t('highestScoreTitle') : t('leaderboardPageTitle')}
              </h1>
            </div>
          </div>
          {user && (
            <div className="text-sm text-muted-foreground">
              {t('welcomeUser')}{user.name}
            </div>
          )}
        </div>

        {/* 排行榜內容 */}
        <Leaderboard currentUserId={user?.name} mode={isDopamineMode ? 'dopamine' : 'normal'} />
      </div>
    </div>
  );
};

export default LeaderboardPage;