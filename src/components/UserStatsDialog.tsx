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
    const [statsMode, setStatsMode] = useState<'normal' | 'dopamine'>('normal');
    const [leaderboardMode, setLeaderboardMode] = useState<'normal' | 'dopamine'>('normal');
    const { stats, loading } = useUserStats(user?.id, statsMode);
    const [activeTab, setActiveTab] = useState("profile");


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
            <DialogContent className="sm:max-w-[425px] md:max-w-[600px] glass border-none shadow-2xl">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold flex items-center gap-2">
                        <UserIcon className="h-5 w-5" />
                        {t('playerHub') || '玩家中心'}
                    </DialogTitle>
                </DialogHeader>

                <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="profile">{t('myStats') || '個人戰績'}</TabsTrigger>
                        <TabsTrigger value="leaderboard">{t('leaderboard') || '排行榜'}</TabsTrigger>
                    </TabsList>

                    <TabsContent value="profile" className="max-h-[60vh] overflow-y-auto pr-1">
                        <div className="flex flex-col gap-4 py-4">
                            <div className="flex items-center gap-4 p-4 rounded-xl bg-secondary/20 border border-border/50">
                                <Avatar className="h-16 w-16 rounded-xl border-2 border-[var(--theme-color)] shadow-md" style={themeStyle}>
                                    <AvatarImage src={user.user_metadata?.avatar_url} />
                                    <AvatarFallback className="rounded-xl text-lg font-bold">{user.email?.slice(0, 2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                    <h3 className="font-bold text-lg">{user.user_metadata?.full_name || 'Player'}</h3>
                                    <p className="text-sm text-muted-foreground">{user.email}</p>
                                </div>
                            </div>

                            {/* Stats Mode Toggle */}
                            <div className="flex justify-center my-2">
                                <div className="bg-muted p-1 rounded-lg inline-flex">
                                    <button
                                        onClick={() => setStatsMode('normal')}
                                        className={cn(
                                            "px-4 py-1.5 rounded-md text-sm font-medium transition-all",
                                            statsMode === 'normal'
                                                ? "bg-white dark:bg-zinc-800 shadow-sm text-primary"
                                                : "text-muted-foreground hover:text-foreground"
                                        )}
                                    >
                                        {t('normal') || '普通'}
                                    </button>
                                    <button
                                        onClick={() => setStatsMode('dopamine')}
                                        className={cn(
                                            "px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-1",
                                            statsMode === 'dopamine'
                                                ? "bg-white dark:bg-zinc-800 shadow-sm text-purple-600"
                                                : "text-muted-foreground hover:text-foreground"
                                        )}
                                    >
                                        <Zap className="h-3 w-3" />
                                        {t('dopamine') || '多巴胺'}
                                    </button>
                                </div>
                            </div>

                            {/* Overall Stats Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                <div className="bg-card p-3 rounded-lg border flex flex-col items-center">
                                    <Target className="h-4 w-4 text-blue-500 mb-1" />
                                    <span className="text-2xl font-bold">{stats?.totalGames || 0}</span>
                                    <span className="text-xs text-muted-foreground">{t('totalGames') || '總場次'}</span>
                                </div>
                                <div className="bg-card p-3 rounded-lg border flex flex-col items-center">
                                    <Trophy className="h-4 w-4 text-yellow-500 mb-1" />
                                    <span className="text-2xl font-bold">{stats?.bestScore || 0}</span>
                                    <span className="text-xs text-muted-foreground">{t('bestScore') || '最高分'}</span>
                                </div>
                                <div className="bg-card p-3 rounded-lg border flex flex-col items-center">
                                    <Clock className="h-4 w-4 text-green-500 mb-1" />
                                    <span className="text-2xl font-bold">{stats?.bestTime ? `${stats.bestTime}s` : '--'}</span>
                                    <span className="text-xs text-muted-foreground">{t('bestTime') || '最佳時間'}</span>
                                </div>
                                <div className="bg-card p-3 rounded-lg border flex flex-col items-center">
                                    <div className="text-red-500 font-bold text-sm mb-1">ERR</div>
                                    <span className="text-2xl font-bold">{stats?.totalMistakes || 0}</span>
                                    <span className="text-xs text-muted-foreground">{t('mistakes') || '失誤'}</span>
                                </div>
                            </div>

                            {/* Difficulty Breakdown Table */}
                            <div className="rounded-lg border bg-card overflow-hidden">
                                <div className="grid grid-cols-4 gap-2 p-3 bg-secondary/50 font-medium text-xs text-muted-foreground text-center">
                                    <div className="text-left pl-2">難度</div>
                                    <div>場次</div>
                                    <div>時間</div>
                                    <div>分數</div>
                                </div>
                                {difficulties.map((diff) => {
                                    const dStats = stats?.difficultyStats[diff];
                                    if (!dStats) return null;
                                    return (
                                        <div key={diff} className="grid grid-cols-4 gap-2 p-3 border-t text-sm text-center items-center hover:bg-accent/50 transition-colors">
                                            <div className="text-left pl-2 font-medium capitalize flex items-center gap-2">
                                                <div className={cn("w-2 h-2 rounded-full",
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

                            <Button variant="outline" className="w-full text-red-500 hover:text-red-600 hover:bg-red-50 mt-2" onClick={handleLogout}>
                                <LogOut className="h-4 w-4 mr-2" />
                                {t('logout') || '登出'}
                            </Button>
                        </div>
                    </TabsContent>

                    <TabsContent value="leaderboard" className="min-h-[400px]">
                        {/* Leaderboard Mode Toggle */}
                        <div className="flex justify-center mb-4 mt-2">
                            <div className="bg-muted p-1 rounded-lg inline-flex">
                                <button
                                    onClick={() => setLeaderboardMode('normal')}
                                    className={cn(
                                        "px-4 py-1.5 rounded-md text-sm font-medium transition-all",
                                        leaderboardMode === 'normal'
                                            ? "bg-white dark:bg-zinc-800 shadow-sm text-primary"
                                            : "text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    {t('normal') || '普通'}
                                </button>
                                <button
                                    onClick={() => setLeaderboardMode('dopamine')}
                                    className={cn(
                                        "px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-1",
                                        leaderboardMode === 'dopamine'
                                            ? "bg-white dark:bg-zinc-800 shadow-sm text-purple-600"
                                            : "text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    <Zap className="h-3 w-3" />
                                    {t('dopamine') || '多巴胺'}
                                </button>
                            </div>
                        </div>

                        <div className="h-[400px] overflow-hidden">
                            <Leaderboard
                                currentUserId={user?.user_metadata?.full_name || user?.email}
                                mode={leaderboardMode}
                            />
                        </div>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
};
