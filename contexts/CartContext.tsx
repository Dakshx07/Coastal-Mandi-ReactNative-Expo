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
    addItem: (item: Omit<CartItem, 'addedAt' | 'id'> & { id?: string }) => boolean;
    removeItem: (name: string) => void;
    clearCart: () => void;
    isInCart: (name: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);

    // Check by name to prevent duplicates (same fish species)
    const addItem = (item: Omit<CartItem, 'addedAt' | 'id'> & { id?: string }): boolean => {
        // Check if fish with same name already exists
        if (items.find(i => i.name === item.name)) {
            // Already in cart, provide feedback but don't add
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            return false;
        }

        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setItems(prev => [
            ...prev,
            {
                ...item,
                id: item.name.toLowerCase().replace(/\s+/g, '-'), // Use name as ID
                addedAt: new Date(),
            },
        ]);
        return true;
    };

    const removeItem = (name: string) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setItems(prev => prev.filter(item => item.name !== name));
    };

    const clearCart = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setItems([]);
    };

    // Check by name instead of ID
    const isInCart = (name: string) => {
        return items.some(item => item.name === name);
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
