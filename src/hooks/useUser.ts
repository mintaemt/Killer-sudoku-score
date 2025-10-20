import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@/lib/types';
import { useLanguage } from './useLanguage';

const USER_STORAGE_KEY = 'killer-sudoku-user';

export const useUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useLanguage();
  const [isVisitorMode, setIsVisitorMode] = useState(false);

  // 從 localStorage 載入用戶資料
  useEffect(() => {
    const loadUserFromStorage = () => {
      try {
        const storedUser = localStorage.getItem(USER_STORAGE_KEY);
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          // 驗證用戶資料格式
          if (userData && userData.id && userData.name) {
            setUser(userData);
            console.log('用戶資料已從本地儲存載入:', userData.name);
          } else {
            // 如果資料格式不正確，清除它
            localStorage.removeItem(USER_STORAGE_KEY);
            console.log('清除無效的用戶資料');
          }
        }
      } catch (err) {
        console.error('Error loading user from storage:', err);
        setError('載入用戶資料失敗');
        // 清除可能損壞的資料
        localStorage.removeItem(USER_STORAGE_KEY);
      } finally {
        setLoading(false);
      }
    };

    loadUserFromStorage();
  }, []);

  // 創建新用戶（禁止重複用戶名稱）
  const createOrUpdateUser = async (name: string): Promise<User | null> => {
    try {
      setLoading(true);
      setError(null);

      console.log('開始創建新用戶:', name);

      // 檢查是否已存在相同名稱的用戶（不區分大小寫）
      const { data: existingUsers, error: searchError } = await supabase
        .from('users')
        .select('*')
        .ilike('name', name)  // 使用 ilike 進行不區分大小寫的比較
        .limit(1);

      if (searchError) {
        console.error('搜尋用戶時發生錯誤:', searchError);
        throw searchError;
      }

      console.log('搜尋結果:', existingUsers);

      // 如果找到重複的用戶名稱，拋出錯誤
      if (existingUsers && existingUsers.length > 0) {
        console.log('用戶名稱已存在:', existingUsers[0].name);
        throw new Error(t('usernameAlreadyExists'));
      }

      console.log('用戶名稱可用，創建新用戶');
      // 創建新用戶
      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert({
          name: name.trim(),  // 去除前後空格
          created_at: new Date().toISOString(),
          last_login: new Date().toISOString()
        })
        .select()
        .single();

      if (insertError) {
        console.error('創建用戶時發生錯誤:', insertError);
        // 檢查是否是唯一約束違反錯誤
        if (insertError.code === '23505') {
          throw new Error(t('usernameAlreadyExists'));
        }
        throw insertError;
      }

      const userData = newUser;
      console.log('新用戶創建成功:', userData);

      // 儲存到 localStorage
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
      setUser(userData);
      console.log('用戶資料已儲存到本地:', userData.name);

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
    setIsVisitorMode(false);
    console.log('用戶資料已清除');
  };

  // 進入訪客模式
  const enterVisitorMode = () => {
    setUser(null);
    setIsVisitorMode(true);
    localStorage.removeItem(USER_STORAGE_KEY);
    console.log('進入訪客模式');
  };

  // 檢查用戶是否已登入（包括訪客模式）
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
