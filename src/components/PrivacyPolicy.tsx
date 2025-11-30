import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { Shield, Database, Cookie, UserCheck, AlertCircle, Mail } from 'lucide-react';
import { ContentPageLayout } from '@/components/layout/ContentPageLayout';

export const PrivacyPolicy: React.FC = () => {
  const { t } = useLanguage();

  return (
    <ContentPageLayout
      title={t('legal.privacyPolicy.title')}
      lastUpdated={t('legal.privacyPolicy.lastUpdated')}
      seoTitle={t('legal.privacyPolicy.title')}
      seoDescription={t('legal.privacyPolicy.introduction')}
      icon={<Shield className="h-6 w-6 text-primary" />}
    >
      <div className="space-y-8">
        <section>
          <p className="text-lg leading-relaxed text-muted-foreground">
            {t('legal.privacyPolicy.introduction')}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 flex items-center gap-2 text-foreground/90">
            <Database className="h-5 w-5 text-blue-500" />
            {t('legal.privacyPolicy.informationCollection')}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {t('legal.privacyPolicy.informationCollectionContent')}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 flex items-center gap-2 text-foreground/90">
            <UserCheck className="h-5 w-5 text-green-500" />
            {t('legal.privacyPolicy.informationUse')}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {t('legal.privacyPolicy.informationUseContent')}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 flex items-center gap-2 text-foreground/90">
            <Shield className="h-5 w-5 text-purple-500" />
            {t('legal.privacyPolicy.dataStorage')}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {t('legal.privacyPolicy.dataStorageContent')}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 flex items-center gap-2 text-foreground/90">
            <Cookie className="h-5 w-5 text-orange-500" />
            {t('legal.privacyPolicy.cookies')}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {t('legal.privacyPolicy.cookiesContent')}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 flex items-center gap-2 text-foreground/90">
            <UserCheck className="h-5 w-5 text-indigo-500" />
            {t('legal.privacyPolicy.userRights')}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {t('legal.privacyPolicy.userRightsContent')}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 flex items-center gap-2 text-foreground/90">
            <AlertCircle className="h-5 w-5 text-yellow-500" />
            {t('legal.privacyPolicy.changes')}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {t('legal.privacyPolicy.changesContent')}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 flex items-center gap-2 text-foreground/90">
            <Mail className="h-5 w-5 text-red-500" />
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
