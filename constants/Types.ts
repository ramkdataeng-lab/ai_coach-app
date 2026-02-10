
// Types for RevenueCat integration
export type Entitlement = 'pro_access';

export interface UserSubscription {
    isPro: boolean;
    entitlements: string[];
}

// Ensure global scope is augmented if needed
declare global {
    namespace ReactNativePurchases {
        interface CustomerInfo {
            entitlements: {
                active: Record<string, any>;
            }
        }
    }
}
