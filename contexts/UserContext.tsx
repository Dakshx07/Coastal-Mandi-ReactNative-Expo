import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/services/supabase';
import { Logger } from '@/services/logger';
import { Session } from '@supabase/supabase-js';

interface UserData {
    id: string;
    name: string;
    email: string;
    isLoggedIn: boolean;
}

interface UserContextType {
    user: UserData;
    isLoading: boolean;
    isGuest: boolean;
    login: (email: string, password: string) => Promise<{ error?: any }>;
    signup: (email: string, password: string, name: string) => Promise<{ error?: any }>;
    logout: () => Promise<void>;
    updateUser: (data: Partial<UserData>) => Promise<void>;
}

const defaultUser: UserData = {
    id: '',
    name: '',
    email: '',
    isLoggedIn: false,
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<UserData>(defaultUser);
    const [isLoading, setIsLoading] = useState(true);

    const updateUserState = (session: Session) => {
        setUser({
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
            isLoggedIn: true,
        });
    };

    useEffect(() => {
        let mounted = true;

        const initializeAuth = async () => {
            try {
                // 1. Check initial session
                const { data: { session }, error } = await supabase.auth.getSession();
                if (error) {
                    Logger.error('Error getting session:', error.message);
                }

                if (mounted) {
                    if (session) {
                        Logger.log('Session restored for:', session.user.email);
                        updateUserState(session);
                    } else {
                        Logger.log('No active session on load');
                        setUser(defaultUser);
                    }
                }
            } catch (e) {
                Logger.error('Auth initialization error:', e);
            } finally {
                if (mounted) setIsLoading(false);
            }
        };

        initializeAuth();

        // 2. Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            Logger.log('Auth event:', _event);
            if (session) {
                updateUserState(session);
            } else {
                setUser(defaultUser);
            }
            setIsLoading(false);
        });

        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, []);

    const login = async (email: string, password: string) => {
        setIsLoading(true);
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        setIsLoading(false);
        return { error };
    };

    const signup = async (email: string, password: string, name: string) => {
        setIsLoading(true);
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: name,
                },
            },
        });
        setIsLoading(false);
        return { error };
    };

    const logout = async () => {
        setIsLoading(true);
        const { error } = await supabase.auth.signOut();
        if (error) Logger.error('Logout error:', error);
        setUser(defaultUser);
        setIsLoading(false);
    };

    const updateUser = async (data: Partial<UserData>) => {
        if (data.name) {
            const { error } = await supabase.auth.updateUser({
                data: { full_name: data.name }
            });
            if (!error) {
                setUser(prev => ({ ...prev, ...data }));
            }
        }
    };

    return (
        <UserContext.Provider value={{
            user,
            isLoading,
            isGuest: !user.isLoggedIn,
            login,
            signup,
            logout,
            updateUser
        }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within UserProvider');
    }
    return context;
}
