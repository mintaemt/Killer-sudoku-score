/**
 * 使用者管理 Hook
 * 處理使用者身份驗證、本地儲存與訪客模式
 */

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@/lib/types';
import { useLanguage } from './useLanguage';
import { useAuth } from '@/contexts/AuthContext';

/** 本地儲存的使用者資料鍵名 */
const USER_STORAGE_KEY = 'killer-sudoku-user';

/**
 * Hook 返回值介面
 */
interface UseUserReturn {
  user: User | null;                                      // 當前使用者資料
  loading: boolean;                                       // 載入狀態
  error: string | null;                                   // 錯誤訊息
  isVisitorMode: boolean;                                 // 是否為訪客模式
  createOrUpdateUser: (name: string) => Promise<User | null>;  // 建立或更新使用者
  clearUser: () => void;                                  // 清除使用者資料
  enterVisitorMode: () => void;                           // 進入訪客模式
  isLoggedIn: boolean;                                    // 是否已登入（包含訪客模式）
}

/**
 * 使用者管理 Hook
 * @returns 使用者狀態與操作函數
 */
export const useUser = (): UseUserReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useLanguage();
  const [isVisitorMode, setIsVisitorMode] = useState(false);

  // Use AuthContext to get Supabase session
  const { user: authUser, loading: authLoading } = useAuth();

  // Combine AuthContext state with local logic
  useEffect(() => {
    const syncUser = () => {
      // If we have a Supabase user (via Google Login, etc.)
      if (authUser) {
        const appUser: User = {
          id: authUser.id,
          // Use metadata name, or email, or part of email, or fallback
          name: authUser.user_metadata?.full_name || authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'Player',
          created_at: authUser.created_at,
          last_login: authUser.last_sign_in_at || new Date().toISOString()
        };
        setUser(appUser);
        setIsVisitorMode(false);
        setLoading(false);
        return;
      }

      // If no Supabase user, check local storage (Legacy/Visitor flow)
      if (!authLoading) {
        try {
          const storedUser = localStorage.getItem(USER_STORAGE_KEY);
          if (storedUser) {
            const userData = JSON.parse(storedUser);
            if (userData && userData.id && userData.name) {
              setUser(userData);
              setIsVisitorMode(false);
            } else {
              localStorage.removeItem(USER_STORAGE_KEY);
              setIsVisitorMode(true);
            }
          } else {
            setIsVisitorMode(true);
          }
        } catch (err) {
          console.error('Error loading user from storage:', err);
          setError('載入用戶資料失敗');
          localStorage.removeItem(USER_STORAGE_KEY);
          setIsVisitorMode(true);
        } finally {
          setLoading(false);
        }
      }
    };

    syncUser();
  }, [authUser, authLoading]);

  // 創建新用戶（禁止重複用戶名稱）- Maintains legacy functionality for non-Google users if needed
  const createOrUpdateUser = async (name: string): Promise<User | null> => {
    try {
      setLoading(true);
      setError(null);

      console.log('開始創建新用戶:', name);

      // 檢查是否已存在相同名稱的用戶（不區分大小寫）
      const { data: existingUsers, error: searchError } = await supabase
        .from('users')
        .select('*')
        .ilike('name', name)
        .limit(1);

      if (searchError) {
        console.error('搜尋用戶時發生錯誤:', searchError);
        throw searchError;
      }

      // 如果找到重複的用戶名稱，拋出錯誤
      if (existingUsers && existingUsers.length > 0) {
        throw new Error(t('usernameAlreadyExists'));
      }

      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert({
          name: name.trim(),
          created_at: new Date().toISOString(),
          last_login: new Date().toISOString()
        })
        .select()
        .single();

      if (insertError) {
        if (insertError.code === '23505') {
          throw new Error(t('usernameAlreadyExists'));
        }
        throw insertError;
      }

      const userData = newUser;
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
      setUser(userData);

      return userData;
    } catch (err) {
      console.error('Error creating/updating user:', err);
      const errorMessage = err instanceof Error ? err.message : '創建用戶失敗';
      setError(`創建用戶失敗: ${errorMessage}`);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // 清除用戶資料
  const clearUser = () => {
    localStorage.removeItem(USER_STORAGE_KEY);
    setUser(null);
    setIsVisitorMode(false); // Wait, if cleared, should probably be visitor? 
    // Original code set isVisitorMode(false) then console.log('cleared'). 
    // But then isLoggedIn calculation would fail safely.
  };

  // 進入訪客模式
  const enterVisitorMode = () => {
    setUser(null);
    setIsVisitorMode(true);
    localStorage.removeItem(USER_STORAGE_KEY);
  };

  // 檢查用戶是否已登入（包括訪客模式）
  // Note: semantics of this variable in original code were (!!user || isVisitorMode)
  // which means "Has a valid session state (Registered OR Visitor)".
  const isLoggedIn = !!user || isVisitorMode;

  return {
    user,
    loading,
    error,
    isVisitorMode,
    createOrUpdateUser,
    clearUser,
    enterVisitorMode,
    isLoggedIn
  };
};
