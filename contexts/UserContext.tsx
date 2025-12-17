import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/services/supabase';
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

    useEffect(() => {
        // 1. Check active session on load
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                updateUserState(session);
            }
            setIsLoading(false);
        });

        // 2. Listen for auth changes (login, logout, refresh)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session) {
                updateUserState(session);
            } else {
                setUser(defaultUser);
            }
            setIsLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const updateUserState = (session: Session) => {
        setUser({
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
            isLoggedIn: true,
        });
    };

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
        await supabase.auth.signOut();
        setUser(defaultUser);
        setIsLoading(false);
    };

    const updateUser = async (data: Partial<UserData>) => {
        // For simple metadata updates
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
        <UserContext.Provider value={{ user, isLoading, login, signup, logout, updateUser }}>
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
