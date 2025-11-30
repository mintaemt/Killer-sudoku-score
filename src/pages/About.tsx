import React from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { ContentPageLayout } from "@/components/layout/ContentPageLayout";

const About: React.FC = () => {
  const { t } = useLanguage();

  return (
    <ContentPageLayout
      title={t('about.title')}
      seoTitle={t('about.seoTitle')}
      seoDescription={t('about.seoDescription')}
    >
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-foreground/90">{t('about.whatWeDo.title')}</h2>
        <div className="space-y-4 text-muted-foreground leading-relaxed">
          <p>{t('about.whatWeDo.p1')}</p>
          <p>{t('about.whatWeDo.p2')}</p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-foreground/90">{t('about.whyUs.title')}</h2>
        <ul className="space-y-3 text-muted-foreground">
          {[1, 2, 3, 4].map((i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
              <span>{t(`about.whyUs.li${i}`)}</span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4 text-foreground/90">{t('about.contact.title')}</h2>
        <p className="text-muted-foreground leading-relaxed">
          {t('about.contact.p1')}
        </p>
      </section>
    </ContentPageLayout>
  );
};

export default About;
