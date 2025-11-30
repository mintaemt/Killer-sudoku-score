import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { ContentPageLayout } from '@/components/layout/ContentPageLayout';

export const TermsOfService: React.FC = () => {
  const { t } = useLanguage();

  return (
    <ContentPageLayout
      title={t('legal.termsOfService.title')}
      lastUpdated={t('legal.termsOfService.lastUpdated')}
      seoTitle={t('legal.termsOfService.title')}
      seoDescription={t('legal.termsOfService.serviceDescriptionContent')}
    >
      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-3 text-foreground">
            {t('legal.termsOfService.acceptance')}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {t('legal.termsOfService.acceptanceContent')}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-foreground">
            {t('legal.termsOfService.serviceDescription')}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {t('legal.termsOfService.serviceDescriptionContent')}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-foreground">
            {t('legal.termsOfService.userConduct')}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {t('legal.termsOfService.userConductContent')}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-foreground">
            {t('legal.termsOfService.intellectualProperty')}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {t('legal.termsOfService.intellectualPropertyContent')}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-foreground">
            {t('legal.termsOfService.privacy')}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {t('legal.termsOfService.privacyContent')}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-foreground">
            {t('legal.termsOfService.serviceAvailability')}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {t('legal.termsOfService.serviceAvailabilityContent')}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-foreground">
            {t('legal.termsOfService.disclaimer')}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {t('legal.termsOfService.disclaimerContent')}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-foreground">
            {t('legal.termsOfService.limitationOfLiability')}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {t('legal.termsOfService.limitationOfLiabilityContent')}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-foreground">
            {t('legal.termsOfService.termination')}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {t('legal.termsOfService.terminationContent')}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-foreground">
            {t('legal.termsOfService.changes')}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {t('legal.termsOfService.changesContent')}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-foreground">
            {t('legal.termsOfService.governingLaw')}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {t('legal.termsOfService.governingLawContent')}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-foreground">
            {t('legal.termsOfService.contact')}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {t('legal.termsOfService.contactContent')}
          </p>
        </section>
      </div>
    </ContentPageLayout>
  );
};
