import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, User } from 'lucide-react';

interface UserNameInputProps {
  onSubmit: (name: string) => Promise<void>;
  loading?: boolean;
  error?: string | null;
}

export const UserNameInput = ({ onSubmit, loading = false, error }: UserNameInputProps) => {
  const [name, setName] = useState('');

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
          <CardTitle className="text-2xl">歡迎來到 Killer Sudoku</CardTitle>
          <CardDescription>
            請輸入您的姓名以開始遊戲並參與排行榜
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">姓名</Label>
              <Input
                id="name"
                type="text"
                placeholder="請輸入您的姓名"
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
                    請檢查網路連接或稍後再試。如果問題持續，請聯繫管理員。
                  </small>
                </AlertDescription>
              </Alert>
            )}

            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading || !name.trim()}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  處理中...
                </>
              ) : (
                '開始遊戲'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
