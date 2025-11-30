import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { FileText, CheckCircle, Gamepad2, Shield, Scale, AlertTriangle, Clock, Gavel, RefreshCw, Mail } from 'lucide-react';
import { ContentPageLayout } from '@/components/layout/ContentPageLayout';

export const TermsOfService: React.FC = () => {
  const { t } = useLanguage();

  return (
    <ContentPageLayout
      title={t('legal.termsOfService.title')}
      lastUpdated={t('legal.termsOfService.lastUpdated')}
      seoTitle={t('legal.termsOfService.title')}
      seoDescription={t('legal.termsOfService.serviceDescriptionContent')}
      icon={<FileText className="h-6 w-6 text-primary" />}
    >
      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-3 flex items-center gap-2 text-foreground/90">
            <CheckCircle className="h-5 w-5 text-green-500" />
            {t('legal.termsOfService.acceptance')}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {t('legal.termsOfService.acceptanceContent')}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 flex items-center gap-2 text-foreground/90">
            <Gamepad2 className="h-5 w-5 text-blue-500" />
            {t('legal.termsOfService.serviceDescription')}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {t('legal.termsOfService.serviceDescriptionContent')}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 flex items-center gap-2 text-foreground/90">
            <Shield className="h-5 w-5 text-purple-500" />
            {t('legal.termsOfService.userConduct')}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {t('legal.termsOfService.userConductContent')}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 flex items-center gap-2 text-foreground/90">
            <Scale className="h-5 w-5 text-orange-500" />
            {t('legal.termsOfService.intellectualProperty')}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {t('legal.termsOfService.intellectualPropertyContent')}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 flex items-center gap-2 text-foreground/90">
            <Shield className="h-5 w-5 text-indigo-500" />
            {t('legal.termsOfService.privacy')}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {t('legal.termsOfService.privacyContent')}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 flex items-center gap-2 text-foreground/90">
            <Clock className="h-5 w-5 text-cyan-500" />
            {t('legal.termsOfService.serviceAvailability')}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {t('legal.termsOfService.serviceAvailabilityContent')}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 flex items-center gap-2 text-foreground/90">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            {t('legal.termsOfService.liability')}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {t('legal.termsOfService.liabilityContent')}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 flex items-center gap-2 text-foreground/90">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            {t('legal.termsOfService.termination')}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {t('legal.termsOfService.terminationContent')}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 flex items-center gap-2 text-foreground/90">
            <Gavel className="h-5 w-5 text-gray-500" />
            {t('legal.termsOfService.governingLaw')}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {t('legal.termsOfService.governingLawContent')}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 flex items-center gap-2 text-foreground/90">
            <RefreshCw className="h-5 w-5 text-teal-500" />
            {t('legal.termsOfService.changes')}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {t('legal.termsOfService.changesContent')}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 flex items-center gap-2 text-foreground/90">
            <Mail className="h-5 w-5 text-pink-500" />
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
