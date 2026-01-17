import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, RefreshCw, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLeaderboard } from '@/hooks/useLeaderboard';
import { useLanguage } from '@/hooks/useLanguage';
import { Difficulty } from '@/lib/types';
import { formatTime, formatScore } from '@/lib/scoreCalculator';
import { cn } from '@/lib/utils';

interface LeaderboardProps {
  currentUserId?: string;
  onClose?: () => void;
  mode?: 'normal' | 'dopamine';
}

const ITEMS_PER_PAGE = 5;

const getDifficultyLabel = (difficulty: Difficulty, t: (key: string) => string): string => {
  return t(difficulty);
};

export const Leaderboard = ({ currentUserId, onClose, mode = 'normal' }: LeaderboardProps) => {
  // Default to 'easy' since 'all' is removed
  const [activeTab, setActiveTab] = useState<string>("easy");
  const [currentPage, setCurrentPage] = useState(1);
  const selectedDifficulty = activeTab as Difficulty;
  const { leaderboard, loading, error, refetch } = useLeaderboard(selectedDifficulty, mode);
  const { t } = useLanguage();

  const availableDifficulties = mode === 'normal'
    ? ['easy', 'medium', 'hard', 'expert'] as Difficulty[]
    : ['easy', 'medium', 'hard', 'expert', 'hell'] as Difficulty[];

  const handleRefresh = () => {
    refetch();
    setCurrentPage(1); // Reset to first page on refresh
  };

  const handleTabChange = (val: string) => {
    setActiveTab(val);
    setCurrentPage(1);
  }

  // Pagination Logic
  const totalPages = Math.ceil(leaderboard.length / ITEMS_PER_PAGE);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return leaderboard.slice(start, start + ITEMS_PER_PAGE);
  }, [leaderboard, currentPage]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8 h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">{t('loadingStats')}...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="m-4">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full h-full flex flex-col">
        <div className="px-6 py-2 flex items-center justify-between shrink-0 mb-2 gap-4">
          <TabsList className={`grid w-full h-9 p-1 bg-muted/50 ${mode === 'normal' ? 'grid-cols-4' : 'grid-cols-5'}`}>
            {availableDifficulties.map((difficulty) => (
              <TabsTrigger key={difficulty} value={difficulty} className="text-xs">
                {getDifficultyLabel(difficulty, t)}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="flex items-center gap-1 shrink-0">
            <Button variant="outline" size="icon" onClick={handleRefresh} className="h-9 w-9 shadow-sm">
              <RefreshCw className="h-4 w-4" />
            </Button>
            {onClose && (
              <Button variant="ghost" size="icon" onClick={onClose} className="h-9 w-9 text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <TabsContent value={activeTab} className="flex-1 min-h-0 mt-0 px-6 overflow-hidden flex flex-col">
          {leaderboard.length === 0 ? (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              {t('noData')}
            </div>
          ) : (
            <>
              {/* Table Container - Scrollable */}
              <div className="flex-1 overflow-auto border rounded-md bg-card">
                <Table>
                  <TableHeader className="sticky top-0 bg-secondary/50 backdrop-blur-sm z-10">
                    <TableRow>
                      <TableHead className="w-[80px] text-center">#</TableHead>
                      <TableHead>{t('player') || '玩家'}</TableHead>
                      <TableHead className="text-right">{t('score') || '分數'}</TableHead>
                      <TableHead className="text-right">{t('time') || '時間'}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedData.map((entry, index) => {
                      const isCurrentUser = currentUserId === entry.name;
                      const globalRank = (currentPage - 1) * ITEMS_PER_PAGE + index + 1;

                      // Rank Styling
                      let rankColor = "text-muted-foreground";
                      if (globalRank === 1) rankColor = "text-yellow-500 font-bold text-lg";
                      if (globalRank === 2) rankColor = "text-gray-400 font-bold text-lg";
                      if (globalRank === 3) rankColor = "text-amber-700 font-bold text-lg";

                      return (
                        <TableRow key={`${entry.name}-${entry.difficulty}-${index}`} className={isCurrentUser ? "bg-primary/5 hover:bg-primary/10" : ""}>
                          <TableCell className={cn("text-center font-mono", rankColor)}>
                            {globalRank}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className={cn("font-medium", isCurrentUser && "text-primary")}>
                                {entry.name}
                              </span>
                              {isCurrentUser && <Badge variant="secondary" className="text-[10px] px-1 py-0 h-5">YOU</Badge>}
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-mono font-medium">
                            {formatScore(entry.best_score)}
                          </TableCell>
                          <TableCell className="text-right font-mono text-muted-foreground">
                            {formatTime(entry.best_time)}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination Controls */}
              <div className="flex items-center justify-between py-4 shrink-0 border-t mt-2">
                <div className="text-xs text-muted-foreground">
                  {t('total')}: {leaderboard.length}
                </div>
                {totalPages > 1 && (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="h-8 w-8 p-0"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-xs font-mono w-12 text-center">
                      {currentPage} / {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="h-8 w-8 p-0"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
