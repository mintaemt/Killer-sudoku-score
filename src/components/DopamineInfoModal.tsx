import React, { useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, Star, AlertTriangle, X, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { DopamineDifficulty } from "@/lib/types";
import { useLanguage } from "@/hooks/useLanguage";
import { useUser } from "@/hooks/useUser";

interface DopamineInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartChallenge: (difficulty: DopamineDifficulty) => void;
  onShowFeatureHint?: () => void;
}

const difficultyOptions: { value: DopamineDifficulty; label: string; translationKey: string }[] = [
  { value: "easy", label: "Easy", translationKey: "easy" },
  { value: "medium", label: "Medium", translationKey: "medium" },
  { value: "hard", label: "Hard", translationKey: "hard" },
  { value: "expert", label: "Expert", translationKey: "expert" },
  { value: "hell", label: "Hell", translationKey: "hell" }
];

export const DopamineInfoModal = ({ isOpen, onClose, onStartChallenge, onShowFeatureHint }: DopamineInfoModalProps) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<DopamineDifficulty>("medium");
  const { t } = useLanguage();
  const { user, isVisitorMode } = useUser();

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-2 sm:p-4 z-[9999]">
      <div className="w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-auto">
        <Card className="glass rounded-2xl shadow-apple-lg m-2 sm:m-0">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div>
                  <CardTitle className="flex items-center gap-2 flex-wrap">
                    <span className="whitespace-nowrap">{t('dopamineMode')}</span>
                    <Badge
                      variant="secondary"
                      className="text-white relative overflow-hidden flowing-button flex-shrink-0"
                    >
                      <Users className="h-3 w-3 mr-1" />
                      {t('userLimited')}
                    </Badge>
                  </CardTitle>
                  <CardDescription className="mt-2">{t('beyondNormalMode')}</CardDescription>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose} className="mt-1 dopamine-close-btn">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* 模式介紹 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 dopamine-card">
                <h3 className="mb-2 flex items-center gap-2 text-sm dopamine-gradient-text">
                  <Star className="h-4 w-4 text-purple-400" />
                  {t('modeFeatures')}
                </h3>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• {t('chooseDifficultyChallenge')}</li>
                  <li>• {t('specialScoringSystem')}</li>
                </ul>
              </div>

              <div className="p-4 dopamine-card">
                <h3 className="mb-2 flex items-center gap-2 text-sm dopamine-gradient-text">
                  <AlertTriangle className="h-4 w-4 text-blue-400" />
                  {t('gameRules')}
                </h3>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• {t('timeLimitChallenge')}</li>
                  <li>• {t('errorCountAffectsScore')}</li>
                  <li>• {t('consecutiveCorrectReward')}</li>
                  <li>• {t('speedCompletionBonus')}</li>
                </ul>
              </div>
            </div>

            {/* 難度選擇 */}
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2 text-sm">
                {t('selectChallengeDifficulty')}
              </h3>
              <div className="grid grid-cols-5 gap-2">
                {difficultyOptions.map((difficulty) => (
                  <div
                    key={difficulty.value}
                    className={cn(
                      "flex flex-col items-center justify-center p-2 cursor-pointer difficulty-card min-h-[70px]",
                      selectedDifficulty === difficulty.value && "selected"
                    )}
                    onClick={() => setSelectedDifficulty(difficulty.value)}
                  >
                    <input
                      type="radio"
                      id={`difficulty-${difficulty.value}`}
                      name="difficulty"
                      value={difficulty.value}
                      checked={selectedDifficulty === difficulty.value}
                      onChange={() => setSelectedDifficulty(difficulty.value)}
                      autoComplete="off"
                      className="w-3 h-3 mb-1 accent-white/80 opacity-60"
                    />
                    <div className="text-xs font-bold">{t(difficulty.translationKey as any)}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 開始挑戰按鈕 */}
            <div className="pt-4">
              <Button
                onClick={() => {
                  if (user && !isVisitorMode) {
                    // 註冊用戶：開始挑戰
                    onStartChallenge(selectedDifficulty);
                  } else {
                    // 訪客：顯示註冊提示
                    onClose();
                    onShowFeatureHint?.();
                  }
                }}
                className="w-full h-12 text-lg font-bold sci-fi-button"
              >
                {user && !isVisitorMode ? t('startChallenge') : t('pleaseRegister')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>,
    document.body
  );
};
