import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserData {
    name: string;
    email: string;
    isLoggedIn: boolean;
}

interface UserContextType {
    user: UserData;
    isLoading: boolean;
    login: (name: string, email: string) => Promise<void>;
    logout: () => Promise<void>;
    updateUser: (data: Partial<UserData>) => Promise<void>;
}

const defaultUser: UserData = {
    name: '',
    email: '',
    isLoggedIn: false,
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<UserData>(defaultUser);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Load user from storage on boot
        const loadUser = async () => {
            try {
                const storedUser = await AsyncStorage.getItem('user_session');
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                }
            } catch (e) {
                console.error('Failed to load user', e);
            } finally {
                setIsLoading(false);
            }
        };
        loadUser();
    }, []);

    const login = async (name: string, email: string) => {
        const newUser = {
            name: name || 'Coastal User',
            email: email || 'user@coastal.app',
            isLoggedIn: true,
        };
        setUser(newUser);
        try {
            await AsyncStorage.setItem('user_session', JSON.stringify(newUser));
        } catch (e) {
            console.error('Failed to save user', e);
        }
    };

    const logout = async () => {
        try {
            await AsyncStorage.removeItem('user_session');
        } catch (e) {
            console.error('Failed to clear storage during logout', e);
        } finally {
            // Always reset state even if storage removal fails
            setUser(defaultUser);
        }
    };

    const updateUser = async (data: Partial<UserData>) => {
        const updatedUser = { ...user, ...data };
        setUser(updatedUser);
        try {
            await AsyncStorage.setItem('user_session', JSON.stringify(updatedUser));
        } catch (e) {
            console.error('Failed to update user', e);
        }
    };

    return (
        <UserContext.Provider value={{ user, isLoading, login, logout, updateUser }}>
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
