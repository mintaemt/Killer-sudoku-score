import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";
import { useEffect } from "react";

const About: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    document.title = t('about.seoTitle');
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) metaDescription.setAttribute('content', t('about.seoDescription'));
  }, [t]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">{t('about.title')}</h1>
          <Button variant="outline" size="sm" onClick={() => navigate("/")}>{t('about.backToGame')}</Button>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{t('about.whatWeDo.title')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 leading-relaxed text-muted-foreground">
            <p>{t('about.whatWeDo.p1')}</p>
            <p>{t('about.whatWeDo.p2')}</p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{t('about.whyUs.title')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 leading-relaxed text-muted-foreground">
            <ul className="list-disc pl-6 space-y-2">
              <li>{t('about.whyUs.li1')}</li>
              <li>{t('about.whyUs.li2')}</li>
              <li>{t('about.whyUs.li3')}</li>
              <li>{t('about.whyUs.li4')}</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{t('about.contact.title')}</CardTitle>
          </CardHeader>
          <CardContent className="leading-relaxed text-muted-foreground">
            {t('about.contact.p1')}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default About;


