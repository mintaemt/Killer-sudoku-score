
import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Session, User } from '@supabase/supabase-js'
import { AuthError } from '@supabase/supabase-js'

interface AuthContextType {
    user: User | null
    session: Session | null
    loading: boolean
    signInWithGoogle: () => Promise<{ error: AuthError | null }>
    signOut: () => Promise<{ error: AuthError | null }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null)
    const [session, setSession] = useState<Session | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // 檢查當前有沒有 session
        const checkUser = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession()
                setSession(session)
                setUser(session?.user ?? null)
            } catch (error) {
                console.error('Error checking user session:', error)
            } finally {
                setLoading(false)
            }
        }

        checkUser()

        // 監聽 Auth 狀態改變 (登入、登出、Token 更新)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            setSession(session)
            setUser(session?.user ?? null)
            setLoading(false)

            // Migration Logic: If we just signed in and have a local legacy user
            if (_event === 'SIGNED_IN' && session?.user) {
                const localUserStr = localStorage.getItem('killer-sudoku-user');
                if (localUserStr) {
                    try {
                        const localUser = JSON.parse(localUserStr);
                        if (localUser && localUser.id) {
                            console.log('Migrating legacy user data:', localUser.id, 'to', session.user.id);

                            // Migrate Normal Records
                            const { error: normalError } = await supabase
                                .from('normal_records')
                                .update({ user_id: session.user.id })
                                .eq('user_id', localUser.id);

                            if (normalError) console.error('Error migrating normal records:', normalError);

                            // Migrate Dopamine Records
                            const { error: dopamineError } = await supabase
                                .from('dopamine_records')
                                .update({ user_id: session.user.id })
                                .eq('user_id', localUser.id);

                            if (dopamineError) console.error('Error migrating dopamine records:', dopamineError);

                            // Clear local legacy user after migration attempt
                            localStorage.removeItem('killer-sudoku-user');
                            console.log('Migration complete. Legacy local user cleared.');
                        }
                    } catch (e) {
                        console.error('Migration failed:', e);
                    }
                }
            }
        })

        return () => {
            subscription.unsubscribe()
        }
    }, [])

    const signInWithGoogle = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin
            }
        })
        return { error }
    }

    const signOut = async () => {
        const { error } = await supabase.auth.signOut()
        return { error }
    }

    return (
        <AuthContext.Provider value={{ user, session, loading, signInWithGoogle, signOut }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
