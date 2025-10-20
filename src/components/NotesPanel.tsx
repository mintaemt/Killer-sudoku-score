import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { X, Save, Trash2 } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

interface NotesPanelProps {
  isOpen: boolean;
  onClose: () => void;
  initialNotes?: string;
  onSaveNotes?: (notes: string) => void;
}

export const NotesPanel = ({ isOpen, onClose, initialNotes = '', onSaveNotes }: NotesPanelProps) => {
  const [notes, setNotes] = useState(initialNotes);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { t } = useLanguage();

  useEffect(() => {
    if (isOpen && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    setNotes(initialNotes);
    setHasUnsavedChanges(false);
  }, [initialNotes]);

  const handleNotesChange = (value: string) => {
    setNotes(value);
    setHasUnsavedChanges(value !== initialNotes);
  };

  const handleSave = () => {
    onSaveNotes?.(notes);
    setHasUnsavedChanges(false);
  };

  const handleClear = () => {
    setNotes('');
    setHasUnsavedChanges(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 's' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSave();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass rounded-2xl p-6 w-full max-w-2xl max-h-[80vh] flex flex-col shadow-apple-lg">
        {/* 標題列 */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            📝 {t('notes')}
          </h2>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleClear}
              className="h-8 w-8 p-0"
              title={t('clearNotes')}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* 說明文字 */}
        <div className="text-sm text-muted-foreground mb-4 p-3 bg-muted/30 rounded-lg">
          <p className="mb-1">💡 <strong>使用提示：</strong></p>
          <ul className="text-xs space-y-1 ml-4">
            <li>• 記錄解題思路、候選數字或推理過程</li>
            <li>• 使用 <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Ctrl+S</kbd> 快速儲存</li>
            <li>• 按 <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Esc</kbd> 關閉面板</li>
            <li>• 註解會自動儲存到本地，不會影響分數</li>
          </ul>
        </div>

        {/* 文字區域 */}
        <div className="flex-1 mb-4">
          <Textarea
            ref={textareaRef}
            value={notes}
            onChange={(e) => handleNotesChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="在此輸入您的解題筆記..."
            className="w-full h-full min-h-[200px] resize-none text-sm"
          />
        </div>

        {/* 底部按鈕 */}
        <div className="flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            {hasUnsavedChanges && (
              <span className="text-amber-600">● 有未儲存的變更</span>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="px-4"
            >
              {t('cancel')}
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              className={cn(
                "px-4 transition-smooth",
                hasUnsavedChanges 
                  ? "bg-primary hover:bg-primary/90" 
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              )}
              disabled={!hasUnsavedChanges}
            >
              <Save className="h-4 w-4 mr-2" />
              {t('save')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
