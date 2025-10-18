import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

export type Language = 'en' | 'zh' | 'ko' | 'ja';

interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
}

const languages: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
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

export const LanguageToggle = () => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const [isOpen, setIsOpen] = useState(false);

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
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "h-8 w-8 p-0 transition-smooth hover:scale-105 active:scale-95",
            "shadow-apple-sm hover:shadow-apple-md"
          )}
          title={`語言: ${currentLangData.nativeName}`}
        >
          <span className="text-lg">{currentLangData.flag}</span>
        </Button>
      </DropdownMenuTrigger>
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
            <span className="text-lg">{language.flag}</span>
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
