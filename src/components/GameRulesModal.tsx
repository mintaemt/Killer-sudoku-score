import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Info, X, Trophy, Clock, Target, Lightbulb, Calculator, BookOpen, Zap, Brain, Award } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';

interface GameRulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GameRulesModal = ({ isOpen, onClose }: GameRulesModalProps) => {
  const [activeTab, setActiveTab] = useState<string>("rules");
  const { t } = useLanguage();
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="w-full max-w-[1000px] max-h-[95vh] sm:max-h-[90vh] overflow-auto">
        <Card className="glass rounded-2xl shadow-apple-lg m-2 sm:m-0">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <Info className="h-6 w-6 text-primary" />
                  <span>{t('gameRules')} & {t('scoringSystem')}</span>
                </CardTitle>
              </div>
              <Button variant="outline" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="rules">{t('rules')}</TabsTrigger>
                <TabsTrigger value="tips">{t('tips')}</TabsTrigger>
                <TabsTrigger value="scoring">{t('scoring')}</TabsTrigger>
              </TabsList>

              <TabsContent value="rules" className="mt-6">
                <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-card border">
                      <Badge variant="outline" className="mt-0.5 flex-shrink-0">1</Badge>
                      <div className="min-w-0">
                        <strong className="text-foreground">{t('basicRules')}:</strong>
                        <span className="text-muted-foreground"> {t('basicRulesDescription')}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-card border">
                      <Badge variant="outline" className="mt-0.5 flex-shrink-0">2</Badge>
                      <div className="min-w-0">
                        <strong className="text-foreground">{t('killerSudokuFeatures')}:</strong>
                        <span className="text-muted-foreground"> {t('killerSudokuFeaturesDescription')}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-card border">
                      <Badge variant="outline" className="mt-0.5 flex-shrink-0">3</Badge>
                      <div className="min-w-0">
                        <strong className="text-foreground">{t('solvingStrategy')}:</strong>
                        <span className="text-muted-foreground"> {t('solvingStrategyDescription')}</span>
                      </div>
                    </div>
                  </div>
              </TabsContent>

              <TabsContent value="tips" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-card border">
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <Target className="h-4 w-4 text-blue-500 flex-shrink-0" />
                        <span className="break-words">{t('uniqueCandidate')}</span>
                      </h4>
                      <p className="text-sm text-muted-foreground break-words">
                        {t('uniqueCandidateDescription')}
                      </p>
                    </div>
                    
                    <div className="p-4 rounded-lg bg-card border">
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <Brain className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span className="break-words">{t('hiddenSingle')}</span>
                      </h4>
                      <p className="text-sm text-muted-foreground break-words">
                        {t('hiddenSingleDescription')}
                      </p>
                    </div>
                    
                    <div className="p-4 rounded-lg bg-card border">
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-purple-500 flex-shrink-0" />
                        <span className="break-words">{t('killerSudokuTips')}</span>
                      </h4>
                      <p className="text-sm text-muted-foreground break-words">
                        {t('killerSudokuTipsDescription')}
                      </p>
                    </div>
                    
                    <div className="p-4 rounded-lg bg-card border">
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <Zap className="h-4 w-4 text-orange-500 flex-shrink-0" />
                        <span className="break-words">{t('speedImprovement')}</span>
                      </h4>
                      <p className="text-sm text-muted-foreground break-words">
                        {t('speedImprovementDescription')}
                      </p>
                    </div>
                  </div>
              </TabsContent>

              <TabsContent value="scoring" className="mt-6">
                <div className="space-y-4">
                  {/* 排行榜說明 */}
                  <div className="p-3 rounded-lg bg-card border">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                      <div className="break-words">• {t('leaderboardDescription')}</div>
                      <div className="break-words">• {t('rankingCriteria')}</div>
                      <div className="break-words">• {t('autoUpdate')}</div>
                      <div className="break-words">• {t('transparentScoring')}</div>
                    </div>
                  </div>

                  {/* 計分規則 - 優化為更緊湊的佈局 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* 基礎分數 */}
                    <div className="p-3 rounded-lg bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-950/20 dark:to-green-950/20 border">
                      <h4 className="font-semibold mb-2 flex items-center gap-2 text-sm">
                        <Trophy className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                        <span className="break-words">{t('basicScore')}</span>
                      </h4>
                      <div className="grid grid-cols-2 gap-1 text-xs">
                        <div className="text-center p-1.5 rounded bg-background/50">
                          <div className="font-medium break-words">{t('easy')}</div>
                          <div className="text-muted-foreground">100{t('points')}</div>
                        </div>
                        <div className="text-center p-1.5 rounded bg-background/50">
                          <div className="font-medium break-words">{t('medium')}</div>
                          <div className="text-muted-foreground">200{t('points')}</div>
                        </div>
                        <div className="text-center p-1.5 rounded bg-background/50">
                          <div className="font-medium break-words">{t('hard')}</div>
                          <div className="text-muted-foreground">300{t('points')}</div>
                        </div>
                        <div className="text-center p-1.5 rounded bg-background/50">
                          <div className="font-medium break-words">{t('expert')}</div>
                          <div className="text-muted-foreground">500{t('points')}</div>
                        </div>
                      </div>
                    </div>

                    {/* 時間獎勵 */}
                    <div className="p-3 rounded-lg bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 border">
                      <h4 className="font-semibold mb-2 flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-blue-500 flex-shrink-0" />
                        <span className="break-words">{t('timeBonus')}</span>
                      </h4>
                      <div className="space-y-1.5 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Badge variant="secondary" className="text-xs px-1 py-0.5 flex-shrink-0">{t('earlyBonus')}</Badge>
                          <span className="break-words">{t('earlyBonusDescription')}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Badge variant="secondary" className="text-xs px-1 py-0.5 flex-shrink-0">{t('overtimePenalty')}</Badge>
                          <span className="break-words">{t('overtimePenaltyDescription')}</span>
                        </div>
                        <div className="mt-2">
                          <div className="text-xs font-medium text-muted-foreground mb-1 break-words">{t('idealTime')}:</div>
                          <div className="grid grid-cols-2 gap-1 text-xs">
                            <div className="text-center p-1.5 rounded bg-background/50">
                              <div className="break-words">{t('easy')}: 6{t('minutes')}</div>
                            </div>
                            <div className="text-center p-1.5 rounded bg-background/50">
                              <div className="break-words">{t('medium')}: 12{t('minutes')}</div>
                            </div>
                            <div className="text-center p-1.5 rounded bg-background/50">
                              <div className="break-words">{t('hard')}: 18{t('minutes')}</div>
                            </div>
                            <div className="text-center p-1.5 rounded bg-background/50">
                              <div className="break-words">{t('expert')}: 24{t('minutes')}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 錯誤懲罰 */}
                    <div className="p-3 rounded-lg bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 border">
                      <h4 className="font-semibold mb-2 flex items-center gap-2 text-sm">
                        <Target className="h-4 w-4 text-red-500 flex-shrink-0" />
                        <span className="break-words">{t('mistakePenalty')}</span>
                        <Badge variant="destructive" className="text-xs px-1 py-0.5 flex-shrink-0">{t('mistake')}</Badge>
                        <span className="text-xs text-muted-foreground break-words">{t('mistakePenaltyDescription')}</span>
                      </h4>
                      <div className="space-y-1.5 text-xs text-muted-foreground">
                        <div className="mt-2">
                          <div className="text-xs font-medium text-muted-foreground mb-1 break-words">{t('minimumScore')}:</div>
                          <div className="grid grid-cols-2 gap-1 text-xs">
                            <div className="text-center p-1.5 rounded bg-background/50">
                              <div className="break-words">{t('easy')}: 20{t('points')}</div>
                            </div>
                            <div className="text-center p-1.5 rounded bg-background/50">
                              <div className="break-words">{t('medium')}: 40{t('points')}</div>
                            </div>
                            <div className="text-center p-1.5 rounded bg-background/50">
                              <div className="break-words">{t('hard')}: 60{t('points')}</div>
                            </div>
                            <div className="text-center p-1.5 rounded bg-background/50">
                              <div className="break-words">{t('expert')}: 100{t('points')}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 分數計算公式 */}
                    <div className="p-3 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border">
                      <h4 className="font-semibold mb-2 flex items-center gap-2 text-sm">
                        <Calculator className="h-4 w-4 text-purple-500 flex-shrink-0" />
                        <span className="break-words">{t('calculationFormula')}</span>
                      </h4>
                      <div className="text-xs text-muted-foreground space-y-1">
                        <div className="font-mono bg-background/50 p-1.5 rounded text-xs break-words">
                          {t('finalScoreFormula')}
                        </div>
                        <div className="text-xs text-muted-foreground break-words">
                          <strong>{t('example')}:</strong> {t('scoringExample')}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
