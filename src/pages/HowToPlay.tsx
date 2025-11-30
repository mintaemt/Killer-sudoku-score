import React from "react";
import { BookOpen } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { ContentPageLayout } from "@/components/layout/ContentPageLayout";

const HowToPlay: React.FC = () => {
  const { t } = useLanguage();

  return (
    <ContentPageLayout
      title={t('howToPlay.title')}
      seoTitle={t('howToPlay.seoTitle')}
      seoDescription={t('howToPlay.seoDescription')}
      icon={<BookOpen className="w-6 h-6 text-primary" />}
    >
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-foreground/90">{t('howToPlay.rules.title')}</h2>
        <ul className="space-y-3 text-muted-foreground">
          {[1, 2, 3].map((i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
              <span>{t(`howToPlay.rules.li${i}`)}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-foreground/90">{t('howToPlay.tips.title')}</h2>
        <ul className="space-y-3 text-muted-foreground">
          {[1, 2, 3].map((i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
              <span>{t(`howToPlay.tips.li${i}`)}</span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4 text-foreground/90">{t('howToPlay.scoring.title')}</h2>
        <p className="text-muted-foreground leading-relaxed">
          {t('howToPlay.scoring.p1')}
        </p>
      </section>
    </ContentPageLayout>
  );
};

export default HowToPlay;
