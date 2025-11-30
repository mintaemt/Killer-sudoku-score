import React from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { ContentPageLayout } from "@/components/layout/ContentPageLayout";

const Strategy: React.FC = () => {
  const { t } = useLanguage();

  return (
    <ContentPageLayout
      title={t('strategy.title')}
      seoTitle={t('strategy.seoTitle')}
      seoDescription={t('strategy.seoDescription')}
    >
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-foreground/90">{t('strategy.common.title')}</h2>
        <ul className="space-y-3 text-muted-foreground">
          {[1, 2, 3, 4].map((i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
              <span>{t(`strategy.common.li${i}`)}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-foreground/90">{t('strategy.advanced.title')}</h2>
        <ul className="space-y-3 text-muted-foreground">
          {[1, 2, 3].map((i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
              <span>{t(`strategy.advanced.li${i}`)}</span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4 text-foreground/90">{t('strategy.mistakes.title')}</h2>
        <ul className="space-y-3 text-muted-foreground">
          {[1, 2, 3].map((i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
              <span>{t(`strategy.mistakes.li${i}`)}</span>
            </li>
          ))}
        </ul>
      </section>
    </ContentPageLayout>
  );
};

export default Strategy;
