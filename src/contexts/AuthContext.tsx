
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
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
            setUser(session?.user ?? null)
            setLoading(false)
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
