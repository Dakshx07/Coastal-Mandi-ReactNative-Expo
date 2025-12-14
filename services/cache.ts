import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_PREFIX = 'coastal_cache_';
const CACHE_EXPIRY_HOURS = 24;

interface CacheEntry<T> {
    data: T;
    timestamp: number;
    expiresAt: number;
}

export const setCache = async <T>(key: string, data: T): Promise<void> => {
    const entry: CacheEntry<T> = {
        data,
        timestamp: Date.now(),
        expiresAt: Date.now() + CACHE_EXPIRY_HOURS * 60 * 60 * 1000,
    };

    try {
        await AsyncStorage.setItem(
            CACHE_PREFIX + key,
            JSON.stringify(entry)
        );
    } catch (error) {
        console.error('Cache write error:', error);
    }
};

export const getCache = async <T>(key: string): Promise<T | null> => {
    try {
        const raw = await AsyncStorage.getItem(CACHE_PREFIX + key);
        if (!raw) return null;

        const entry: CacheEntry<T> = JSON.parse(raw);

        // Check if expired
        if (Date.now() > entry.expiresAt) {
            await AsyncStorage.removeItem(CACHE_PREFIX + key);
            return null;
        }

        return entry.data;
    } catch (error) {
        console.error('Cache read error:', error);
        return null;
    }
};

export const clearCache = async (key?: string): Promise<void> => {
    try {
        if (key) {
            await AsyncStorage.removeItem(CACHE_PREFIX + key);
        } else {
            const keys = await AsyncStorage.getAllKeys();
            const cacheKeys = keys.filter(k => k.startsWith(CACHE_PREFIX));
            await AsyncStorage.multiRemove(cacheKeys);
        }
    } catch (error) {
        console.error('Cache clear error:', error);
    }
};

// Cache keys
export const CACHE_KEYS = {
    RATES: 'rates',
    HARBOURS: 'harbours',
    SPECIES: 'species',
    LAST_ANALYSIS: 'last_analysis',
};
