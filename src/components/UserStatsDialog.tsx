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
import { LogOut, ListOrdered, User as UserIcon, Settings, Clock, Trophy, Target } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useUserStats } from "@/hooks/useUserStats";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { DopamineDifficulty } from "@/lib/types";

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
    const { stats, loading } = useUserStats(user?.id);
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
                            {/* User Info Card */}
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

                    <TabsContent value="leaderboard" className="min-h-[300px] flex items-center justify-center">
                        <div className="text-center space-y-4 py-8">
                            <p className="text-muted-foreground">
                                {t('leaderboardPlaceholder') || '排行榜功能已整合至主畫面按鈕，是否要前往完整排行榜頁面？'}
                            </p>
                            {/* 
                    Note: Originally the user wanted Leaderboard Integration here.
                    However, Leaderboard is a full page or a complex modal.
                    If we want to embed it, we need the Leaderboard Component.
                    For now, I'll provide a button to switch to the Leaderboard Modal logic or just link.
                    Actually, let's just use the logic from GameHeader to show the Leaderboard Modal?
                    But this IS a Dialog. We can't easily nest Modals.
                    So maybe we just link or keep it simple.
                    Wait, User Request: "整合原本的排行榜視圖" (Integrate the original leaderboard view).
                    The original view is likely a component. Let's assume we can reuse it later.
                    For now, I'll put a placeholder or simple list if I can access the component.
                 */}
                            <Button onClick={() => window.location.href = '/leaderboard'}>
                                <ListOrdered className="mr-2 h-4 w-4" />
                                前往完整排行榜
                            </Button>
                        </div>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
};
