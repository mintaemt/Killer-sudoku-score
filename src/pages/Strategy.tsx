import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";
import { useEffect } from "react";

const Strategy: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    document.title = t('strategy.seoTitle');
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) metaDescription.setAttribute('content', t('strategy.seoDescription'));
  }, [t]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">{t('strategy.title')}</h1>
          <Button variant="outline" size="sm" onClick={() => navigate("/")}>{t('strategy.backToGame')}</Button>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{t('strategy.common.title')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 leading-relaxed text-muted-foreground">
            <ul className="list-disc pl-6 space-y-2">
              <li>{t('strategy.common.li1')}</li>
              <li>{t('strategy.common.li2')}</li>
              <li>{t('strategy.common.li3')}</li>
              <li>{t('strategy.common.li4')}</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{t('strategy.advanced.title')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 leading-relaxed text-muted-foreground">
            <ul className="list-disc pl-6 space-y-2">
              <li>{t('strategy.advanced.li1')}</li>
              <li>{t('strategy.advanced.li2')}</li>
              <li>{t('strategy.advanced.li3')}</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{t('strategy.mistakes.title')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 leading-relaxed text-muted-foreground">
            <ul className="list-disc pl-6 space-y-2">
              <li>{t('strategy.mistakes.li1')}</li>
              <li>{t('strategy.mistakes.li2')}</li>
              <li>{t('strategy.mistakes.li3')}</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Strategy;


