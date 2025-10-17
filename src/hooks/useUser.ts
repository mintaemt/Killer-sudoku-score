import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@/lib/types';

const USER_STORAGE_KEY = 'killer-sudoku-user';

export const useUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  // 創建或更新用戶
  const createOrUpdateUser = async (name: string): Promise<User | null> => {
    try {
      setLoading(true);
      setError(null);

      console.log('開始創建/更新用戶:', name);

      // 檢查是否已存在相同名稱的用戶
      const { data: existingUsers, error: searchError } = await supabase
        .from('users')
        .select('*')
        .eq('name', name)
        .limit(1);

      if (searchError) {
        console.error('搜尋用戶時發生錯誤:', searchError);
        throw searchError;
      }

      console.log('搜尋結果:', existingUsers);

      let userData: User;

      if (existingUsers && existingUsers.length > 0) {
        console.log('找到現有用戶，更新最後登入時間');
        // 更新現有用戶的最後登入時間
        const { data: updatedUser, error: updateError } = await supabase
          .from('users')
          .update({ last_login: new Date().toISOString() })
          .eq('id', existingUsers[0].id)
          .select()
          .single();

        if (updateError) {
          console.error('更新用戶時發生錯誤:', updateError);
          throw updateError;
        }

        userData = updatedUser;
        console.log('用戶更新成功:', userData);
      } else {
        console.log('創建新用戶');
        // 創建新用戶
        const { data: newUser, error: insertError } = await supabase
          .from('users')
          .insert({
            name,
            created_at: new Date().toISOString(),
            last_login: new Date().toISOString()
          })
          .select()
          .single();

        if (insertError) {
          console.error('創建用戶時發生錯誤:', insertError);
          throw insertError;
        }

        userData = newUser;
        console.log('新用戶創建成功:', userData);
      }

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
    console.log('用戶資料已清除');
  };

  // 檢查用戶是否已登入
  const isLoggedIn = !!user;

  return {
    user,
    loading,
    error,
    createOrUpdateUser,
    clearUser,
    isLoggedIn
  };
};
