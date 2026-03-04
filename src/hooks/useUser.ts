/**
 * 使用者管理 Hook
 * 完全依賴 Google 登入 (AuthContext)，沒有登入即為訪客
 */

import { useState, useEffect } from 'react';
import { User } from '@/lib/types';
import { useAuth } from '@/contexts/AuthContext';

interface UseUserReturn {
  user: User | null;
  loading: boolean;
  error: string | null;
  isVisitorMode: boolean;
  createOrUpdateUser: (name: string) => Promise<User | null>; // 僅為維持介面相容而保留，不再實際創見自訂使用者
  clearUser: () => void;
  enterVisitorMode: () => void;
  isLoggedIn: boolean;
}

export const useUser = (): UseUserReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [isVisitorMode, setIsVisitorMode] = useState(true);

  // Use AuthContext to get Supabase session
  const { user: authUser, loading: authLoading } = useAuth();

  useEffect(() => {
    if (authUser) {
      const appUser: User = {
        id: authUser.id,
        name: authUser.user_metadata?.full_name || authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'Player',
        created_at: authUser.created_at,
        last_login: authUser.last_sign_in_at || new Date().toISOString()
      };
      setUser(appUser);
      setIsVisitorMode(false);
    } else {
      setUser(null);
      setIsVisitorMode(true);
    }
  }, [authUser]);

  // 相容於舊有介面的棄用函數
  const createOrUpdateUser = async (name: string): Promise<User | null> => { return null; };

  const clearUser = () => {
    setUser(null);
    setIsVisitorMode(true);
  };

  const enterVisitorMode = () => {
    setUser(null);
    setIsVisitorMode(true);
  };

  const isLoggedIn = !!user;

  return {
    user,
    loading: authLoading, // 直接使用 auth loading
    error: null,
    isVisitorMode,
    createOrUpdateUser,
    clearUser,
    enterVisitorMode,
    isLoggedIn
  };
};
