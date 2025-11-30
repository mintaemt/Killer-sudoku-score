import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { ContentPageLayout } from '@/components/layout/ContentPageLayout';

export const PrivacyPolicy: React.FC = () => {
  const { t } = useLanguage();

  return (
    <ContentPageLayout
      title={t('legal.privacyPolicy.title')}
      lastUpdated={t('legal.privacyPolicy.lastUpdated')}
      seoTitle={t('legal.privacyPolicy.title')}
      seoDescription={t('legal.privacyPolicy.introduction')}
    >
      <div className="space-y-8">
        <section>
          <p className="text-lg leading-relaxed text-muted-foreground">
            {t('legal.privacyPolicy.introduction')}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-foreground">
            {t('legal.privacyPolicy.informationCollection')}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {t('legal.privacyPolicy.informationCollectionContent')}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-foreground">
            {t('legal.privacyPolicy.informationUse')}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {t('legal.privacyPolicy.informationUseContent')}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-foreground">
            {t('legal.privacyPolicy.dataStorage')}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {t('legal.privacyPolicy.dataStorageContent')}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-foreground">
            {t('legal.privacyPolicy.cookies')}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {t('legal.privacyPolicy.cookiesContent')}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-foreground">
            {t('legal.privacyPolicy.userRights')}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {t('legal.privacyPolicy.userRightsContent')}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-foreground">
            {t('legal.privacyPolicy.changes')}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {t('legal.privacyPolicy.changesContent')}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-foreground">
            {t('legal.privacyPolicy.contact')}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {t('legal.privacyPolicy.contactContent')}
          </p>
        </section>
      </div>
    </ContentPageLayout>
  );
};
