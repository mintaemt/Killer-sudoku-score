import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { ContentPageLayout } from '@/components/layout/ContentPageLayout';

export const CookiePolicy: React.FC = () => {
  const { t } = useLanguage();

  return (
    <ContentPageLayout
      title={t('legal.cookiePolicy.title')}
      lastUpdated={t('legal.cookiePolicy.lastUpdated')}
      seoTitle={t('legal.cookiePolicy.title')}
      seoDescription={t('legal.cookiePolicy.introduction')}
    >
      <div className="space-y-8">
        <section>
          <p className="text-lg leading-relaxed text-muted-foreground">
            {t('legal.cookiePolicy.introduction')}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-primary">
            {t('legal.cookiePolicy.whatAreCookies')}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {t('legal.cookiePolicy.whatAreCookiesContent')}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-primary">
            {t('legal.cookiePolicy.howWeUseCookies')}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {t('legal.cookiePolicy.howWeUseCookiesContent')}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-primary">
            {t('legal.cookiePolicy.typesOfCookies')}
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-foreground mb-1">{t('legal.cookiePolicy.essentialCookies')}</h3>
              <p className="text-muted-foreground leading-relaxed">{t('legal.cookiePolicy.essentialCookiesContent')}</p>
            </div>
            <div>
              <h3 className="font-medium text-foreground mb-1">{t('legal.cookiePolicy.preferenceCookies')}</h3>
              <p className="text-muted-foreground leading-relaxed">{t('legal.cookiePolicy.preferenceCookiesContent')}</p>
            </div>
            <div>
              <h3 className="font-medium text-foreground mb-1">{t('legal.cookiePolicy.analyticsCookies')}</h3>
              <p className="text-muted-foreground leading-relaxed">{t('legal.cookiePolicy.analyticsCookiesContent')}</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-primary">
            {t('legal.cookiePolicy.managingCookies')}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {t('legal.cookiePolicy.managingCookiesContent')}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-primary">
            {t('legal.cookiePolicy.thirdPartyCookies')}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {t('legal.cookiePolicy.thirdPartyCookiesContent')}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-primary">
            {t('legal.cookiePolicy.updates')}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {t('legal.cookiePolicy.updatesContent')}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-primary">
            {t('legal.cookiePolicy.contact')}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {t('legal.cookiePolicy.contactContent')}
          </p>
        </section>
      </div>
    </ContentPageLayout>
  );
};
