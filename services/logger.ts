/**
 * Safe Logger service to prevent console logs in production.
 */
export const Logger = {
    log: (...args: any[]) => {
        if (__DEV__) {
            console.log(...args);
        }
    },
    warn: (...args: any[]) => {
        if (__DEV__) {
            console.warn(...args);
        }
    },
    error: (...args: any[]) => {
        // Errors should probably still be logged (e.g. Sentry) even in prod, 
        // but for now we safeguard against crashes or noisy output.
        console.error(...args);
    }
};
