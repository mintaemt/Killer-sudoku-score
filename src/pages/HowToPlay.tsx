import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";
import { useEffect } from "react";

const HowToPlay: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    document.title = t('howToPlay.seoTitle');
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) metaDescription.setAttribute('content', t('howToPlay.seoDescription'));
  }, [t]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">{t('howToPlay.title')}</h1>
          <Button variant="outline" size="sm" onClick={() => navigate("/")}>{t('howToPlay.backToGame')}</Button>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{t('howToPlay.rules.title')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 leading-relaxed text-muted-foreground">
            <ul className="list-disc pl-6 space-y-2">
              <li>{t('howToPlay.rules.li1')}</li>
              <li>{t('howToPlay.rules.li2')}</li>
              <li>{t('howToPlay.rules.li3')}</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{t('howToPlay.tips.title')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 leading-relaxed text-muted-foreground">
            <ul className="list-disc pl-6 space-y-2">
              <li>{t('howToPlay.tips.li1')}</li>
              <li>{t('howToPlay.tips.li2')}</li>
              <li>{t('howToPlay.tips.li3')}</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{t('howToPlay.scoring.title')}</CardTitle>
          </CardHeader>
          <CardContent className="leading-relaxed text-muted-foreground">
            {t('howToPlay.scoring.p1')}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HowToPlay;


