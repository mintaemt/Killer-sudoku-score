import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, ListOrdered, User as UserIcon, Settings, Clock, Trophy, Target, Zap } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useUserStats } from "@/hooks/useUserStats";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { DopamineDifficulty } from "@/lib/types";
import { Leaderboard } from "@/components/Leaderboard";


interface UserStatsDialogProps {
    user: any;
    currentTheme: string;
    themes: { name: string; color: string }[];
    isVisitorMode: boolean;
    onShowLeaderboard: (mode?: 'normal' | 'dopamine') => void;
    // Stats props
    t: (key: string) => string;
}

export const UserStatsDialog = ({
    user,
    currentTheme,
    themes,
    t,
}: UserStatsDialogProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const { signOut } = useAuth();

    const [viewMode, setViewMode] = useState<'normal' | 'dopamine'>('normal');
    const { stats, loading } = useUserStats(user?.id, viewMode);



    const currentThemeColor = themes.find(theme => theme.name === currentTheme)?.color || "#3b82f6";
    const themeStyle = { '--theme-color': currentThemeColor } as React.CSSProperties;

    const handleLogout = async () => {
        await signOut();
        setIsOpen(false);
    };

    const difficulties: DopamineDifficulty[] = ['easy', 'medium', 'hard', 'expert', 'hell'];

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <div className="relative shrink-0 h-9 w-9 flex items-center justify-center cursor-pointer group">
                    {/* Reusing the UserButton style specifically */}
                    <Button
                        variant="outline"
                        size="sm"
                        className="transition-smooth group-hover:scale-105 group-active:scale-95 shadow-apple-sm group-hover:shadow-apple-md p-0 w-full h-full aspect-square shrink-0 border-[var(--theme-color)]"
                        style={themeStyle}
                    >
                        <Avatar className="h-full w-full rounded-md">
                            <AvatarImage
                                src={user.user_metadata?.avatar_url}
                                alt={user.user_metadata?.full_name || user.email}
                                className="object-cover rounded-md"
                            />
                            <AvatarFallback className="rounded-md bg-muted text-foreground font-bold">
                                {user.email?.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                    </Button>
                </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] md:max-w-[600px] h-[600px] md:h-[650px] max-h-[90vh] flex flex-col glass border-none shadow-2xl gap-0">
                <DialogHeader className="p-6 pb-2 shrink-0">
                    <div className="flex items-center justify-between">
                        <DialogTitle className="text-xl font-bold flex items-center gap-2">
                            <UserIcon className="h-5 w-5" />
                            {t('playerHub') || '玩家中心'}
                        </DialogTitle>

                        {/* Unified Mode Toggle */}
                        <div className="bg-muted/50 p-1 rounded-lg flex items-center gap-1">
                            <button
                                onClick={() => setViewMode('normal')}
                                className={cn(
                                    "px-3 py-1 rounded-md text-xs font-medium transition-all",
                                    viewMode === 'normal'
                                        ? `bg-[var(--theme-color)] ${currentTheme === 'lime' ? 'text-black' : 'text-white'} shadow-sm`
                                        : "text-muted-foreground hover:text-foreground hover:bg-transparent"
                                )}
                                style={viewMode === 'normal' ? themeStyle : undefined}
                            >
                                {t('normal') || '普通'}
                            </button>
                            <button
                                onClick={() => setViewMode('dopamine')}
                                className={cn(
                                    "px-3 py-1 rounded-md text-xs font-medium transition-all",
                                    viewMode === 'dopamine'
                                        ? `bg-[var(--theme-color)] ${currentTheme === 'lime' ? 'text-black' : 'text-white'} shadow-sm`
                                        : "text-muted-foreground hover:text-foreground hover:bg-transparent"
                                )}
                                style={viewMode === 'dopamine' ? themeStyle : undefined}
                            >
                                {t('dopamine') || '多巴胺'}
                            </button>
                        </div>
                    </div>
                </DialogHeader>

                <Tabs defaultValue="profile" className="flex-1 flex flex-col min-h-0 w-full">
                    <div className="px-6 pb-2 shrink-0">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="profile">{t('myStats') || '個人戰績'}</TabsTrigger>
                            <TabsTrigger value="leaderboard">{t('leaderboard') || '世界排名'}</TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="profile" className="flex-1 overflow-hidden px-6 pb-6 min-h-0 mt-0 flex flex-col gap-4">

                        {/* User Info & Overall Stats - Fixed at top */}
                        <div className="shrink-0 flex flex-col gap-4 py-2">
                            <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/20 border border-border/50">
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-12 w-12 rounded-lg border-2 border-[var(--theme-color)] shadow-sm" style={themeStyle}>
                                        <AvatarImage src={user.user_metadata?.avatar_url} />
                                        <AvatarFallback className="rounded-lg text-base font-bold">{user.email?.slice(0, 2).toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col">
                                        <h3 className="font-bold text-base leading-tight">{user.user_metadata?.full_name || 'Player'}</h3>
                                        <p className="text-xs text-muted-foreground">{user.email}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Overall Stats Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                <div className="bg-card p-3 rounded-lg border flex flex-col items-center justify-center min-h-[80px]">
                                    <span className="text-2xl font-bold">{stats?.totalGames || 0}</span>
                                    <span className="text-xs text-muted-foreground mt-1">{t('totalGames') || '總場次'}</span>
                                </div>
                                <div className="bg-card p-3 rounded-lg border flex flex-col items-center justify-center min-h-[80px]">
                                    <span className="text-2xl font-bold">{stats?.bestScore || 0}</span>
                                    <span className="text-xs text-muted-foreground mt-1">{t('bestScore') || '最高分'}</span>
                                </div>
                                <div className="bg-card p-3 rounded-lg border flex flex-col items-center justify-center min-h-[80px]">
                                    <span className="text-2xl font-bold">{stats?.bestTime ? `${stats.bestTime}s` : '--'}</span>
                                    <span className="text-xs text-muted-foreground mt-1">{t('bestTime') || '最佳時間'}</span>
                                </div>
                                <div className="bg-card p-3 rounded-lg border flex flex-col items-center justify-center min-h-[80px]">
                                    <span className="text-2xl font-bold">{stats?.totalMistakes || 0}</span>
                                    <span className="text-xs text-muted-foreground mt-1">{t('mistakes') || '失誤'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Difficulty Breakdown Table - Flexible height with internal scroll */}
                        <div className="flex-1 min-h-0 flex flex-col rounded-lg border bg-card overflow-hidden">
                            <div className="grid grid-cols-4 gap-2 p-3 bg-secondary/50 font-medium text-xs text-muted-foreground text-center shrink-0 border-b z-10">
                                <div className="text-left pl-2">{t('colDifficulty')}</div>
                                <div>{t('colGames')}</div>
                                <div>{t('colTime')}</div>
                                <div>{t('colScore')}</div>
                            </div>

                            <div className="overflow-y-auto flex-1 p-0">
                                {difficulties
                                    .filter(diff => viewMode === 'dopamine' || diff !== 'hell')
                                    .map((diff) => {
                                        const dStats = stats?.difficultyStats[diff];
                                        if (!dStats) return null;
                                        return (
                                            <div key={diff} className="grid grid-cols-4 gap-2 p-3 border-b last:border-0 text-sm text-center items-center hover:bg-accent/50 transition-colors">
                                                <div className="text-left pl-2 font-medium capitalize flex items-center gap-2">
                                                    <div className={cn("w-2 h-2 rounded-full shrink-0",
                                                        diff === 'easy' ? 'bg-green-500' :
                                                            diff === 'medium' ? 'bg-blue-500' :
                                                                diff === 'hard' ? 'bg-orange-500' :
                                                                    diff === 'expert' ? 'bg-red-500' : 'bg-purple-600'
                                                    )} />
                                                    {t(diff) || diff}
                                                </div>
                                                <div className="font-mono">{dStats.gamesPlayed}</div>
                                                <div className="font-mono">{dStats.bestTime > 0 ? `${dStats.bestTime}s` : '-'}</div>
                                                <div className="font-mono">{dStats.bestScore > 0 ? dStats.bestScore : '-'}</div>
                                            </div>
                                        )
                                    })}
                            </div>
                        </div>

                        {/* Logout Button - Fixed at bottom */}
                        <div className="shrink-0 mt-auto">
                            <Button variant="outline" className="w-full text-red-500 hover:text-red-600 hover:bg-red-50" onClick={handleLogout}>
                                <LogOut className="h-4 w-4 mr-2" />
                                {t('logout') || '登出'}
                            </Button>
                        </div>

                    </TabsContent>

                    <TabsContent value="leaderboard" className="flex-1 flex flex-col min-h-[300px] mt-0 overflow-hidden">
                        <Leaderboard
                            currentUserId={user?.user_metadata?.full_name || user?.email}
                            mode={viewMode}
                        />
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
};
