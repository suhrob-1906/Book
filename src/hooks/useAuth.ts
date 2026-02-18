import { useState, useEffect } from 'react'
import { supabase, type Profile } from '@/lib/supabase'
import type { User, Session } from '@supabase/supabase-js'

export function useAuth() {
    const [user, setUser] = useState<User | null>(null)
    const [profile, setProfile] = useState<Profile | null>(null)
    const [session, setSession] = useState<Session | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
            setUser(session?.user ?? null)
            if (session?.user) {
                fetchProfile(session.user)
            } else {
                setLoading(false)
            }
        })

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
            setUser(session?.user ?? null)
            if (session?.user) {
                fetchProfile(session.user)
            } else {
                setProfile(null)
                setLoading(false)
            }
        })

        return () => subscription.unsubscribe()
    }, [])

    const createProfile = async (user: User) => {
        try {
            const username = user.email?.split('@')[0] || `user_${user.id.slice(0, 8)}`
            const { data, error } = await supabase
                .from('profiles')
                .upsert(
                    {
                        user_id: user.id,
                        username: `${username}_${Math.random().toString(36).substring(2, 7)}`,
                        full_name: user.user_metadata?.full_name || 'New User',
                        avatar_url: user.user_metadata?.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + user.id,
                        interests: [],
                    },
                    { onConflict: 'user_id', ignoreDuplicates: true }
                )
                .select()
                .single()

            if (error) {
                // If ignoreDuplicates is true and row exists, it doesn't return data but no error.
                // However, if we want to ensure we have the profile, we should fetch it if data is null.
                if (!data) {
                    const { data: existingProfile } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('user_id', user.id)
                        .single()
                    setProfile(existingProfile)
                    return
                }
                throw error
            }
            setProfile(data)
        } catch (error) {
            console.error('Error creating profile:', error)
        }
    }

    const fetchProfile = async (user: User) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('user_id', user.id)
                .single()

            if (error) {
                if (error.code === 'PGRST116') {
                    // Profile doesn't exist, create it
                    await createProfile(user)
                    return
                }
                throw error
            }
            setProfile(data)
        } catch (error: any) {
            console.error('Error fetching profile:', error.message || error)
            if (error.details) console.error('Details:', error.details)
            if (error.hint) console.error('Hint:', error.hint)
        } finally {
            setLoading(false)
        }
    }

    const signUp = async (email: string, password: string, username?: string) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    username,
                },
            },
        })
        return { data, error }
    }

    const signIn = async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })
        return { data, error }
    }

    const signOut = async () => {
        const { error } = await supabase.auth.signOut()
        return { error }
    }

    return {
        user,
        profile,
        session,
        loading,
        signUp,
        signIn,
        signOut,
    }
}
