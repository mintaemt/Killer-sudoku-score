import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Globe, Languages } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';

export type Language = 'en' | 'zh' | 'ko' | 'ja';

interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
  shortCode: string;
}

const languages: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', shortCode: 'EN' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', shortCode: 'TC' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', shortCode: 'KR' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', shortCode: 'JP' },
];

// 根據IP檢測默認語言
const detectDefaultLanguage = (): Language => {
  // 這裡可以集成IP檢測服務，暫時使用瀏覽器語言
  const browserLang = navigator.language.toLowerCase();

  if (browserLang.startsWith('zh')) return 'zh';
  if (browserLang.startsWith('ko')) return 'ko';
  if (browserLang.startsWith('ja')) return 'ja';

  return 'en';
};

import { CustomTooltip } from "@/components/CustomTooltip";

export const LanguageToggle = () => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();

  // 初始化語言
  useEffect(() => {
    const savedLanguage = localStorage.getItem('killer-sudoku-language') as Language;
    if (savedLanguage && languages.some(lang => lang.code === savedLanguage)) {
      setCurrentLanguage(savedLanguage);
    } else {
      const defaultLang = detectDefaultLanguage();
      setCurrentLanguage(defaultLang);
      localStorage.setItem('killer-sudoku-language', defaultLang);
    }
  }, []);

  const handleLanguageChange = (language: Language) => {
    setCurrentLanguage(language);
    localStorage.setItem('killer-sudoku-language', language);
    setIsOpen(false);

    // 這裡可以觸發語言變更事件
    window.dispatchEvent(new CustomEvent('languageChange', { detail: { language } }));
  };

  const currentLangData = languages.find(lang => lang.code === currentLanguage) || languages[0];

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <CustomTooltip content={t('language')} variant="glass">
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "transition-smooth hover:scale-105 active:scale-95",
              "shadow-apple-sm hover:shadow-apple-md flex-shrink-0",
              isOpen && "bg-accent text-accent-foreground border-primary/30 shadow-apple-md"
            )}
          >
            <Globe className="h-3 w-3 md:h-4 md:w-4" />
          </Button>
        </DropdownMenuTrigger>
      </CustomTooltip>
      <DropdownMenuContent align="end" className="w-48">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className={cn(
              "flex items-center gap-3 cursor-pointer",
              currentLanguage === language.code && "bg-primary/10 text-primary"
            )}
          >
            <Languages className="h-4 w-4" />
            <div className="flex flex-col">
              <span className="font-medium">{language.nativeName}</span>
              <span className="text-xs text-muted-foreground">{language.name}</span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
