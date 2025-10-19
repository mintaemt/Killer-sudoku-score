import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, User, UserX } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

interface UserNameInputProps {
  onSubmit: (name: string) => Promise<void>;
  onVisitorMode: () => void;
  loading?: boolean;
  error?: string | null;
}

export const UserNameInput = ({ onSubmit, onVisitorMode, loading = false, error }: UserNameInputProps) => {
  const [name, setName] = useState('');
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      await onSubmit(name.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <User className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">{t('welcomeToKillerSudoku')}</CardTitle>
          <CardDescription>
            {t('enterNameToStart')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                id="user-name-input"
                name="userName"
                type="text"
                placeholder={t('enterYourName')}
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
                maxLength={50}
                required
                className="text-center"
              />
            </div>
            
            {error && (
              <Alert variant="destructive">
                <AlertDescription>
                  {error}
                  <br />
                  <small className="text-xs mt-1 block">
                    {t('checkNetworkConnection')}
                  </small>
                </AlertDescription>
              </Alert>
            )}

            <div>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading || !name.trim()}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('processing')}
                  </>
                ) : (
                  <>
                    <User className="mr-2 h-4 w-4" />
                    {t('startGame')}
                  </>
                )}
              </Button>
            </div>
            
            <div>
              <Button 
                type="button"
                variant="outline" 
                className="w-full guest-mode-button" 
                disabled={loading}
                onClick={onVisitorMode}
              >
                <UserX className="mr-2 h-4 w-4" />
                {t('visitorMode')}
              </Button>
            </div>
            
            <div className="text-xs text-muted-foreground text-center">
              {t('visitorModeDescription')}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
