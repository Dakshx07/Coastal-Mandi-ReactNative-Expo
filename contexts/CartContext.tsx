import React, { createContext, useContext, useState, ReactNode } from 'react';
import * as Haptics from 'expo-haptics';

export interface CartItem {
    id: string;
    name: string;
    scientificName: string;
    price: number;
    trend: 'up' | 'down';
    trendPercentage: number;
    imageUrl: string;
    harbour: string;
    addedAt: Date;
}

interface CartContextType {
    items: CartItem[];
    addItem: (item: Omit<CartItem, 'addedAt'>) => void;
    removeItem: (id: string) => void;
    clearCart: () => void;
    isInCart: (id: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);

    const addItem = (item: Omit<CartItem, 'addedAt'>) => {
        if (!items.find(i => i.id === item.id)) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            setItems(prev => [...prev, { ...item, addedAt: new Date() }]);
        }
    };

    const removeItem = (id: string) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setItems(prev => prev.filter(item => item.id !== id));
    };

    const clearCart = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setItems([]);
    };

    const isInCart = (id: string) => {
        return items.some(item => item.id === id);
    };

    return (
        <CartContext.Provider value={{ items, addItem, removeItem, clearCart, isInCart }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within CartProvider');
    }
    return context;
}
