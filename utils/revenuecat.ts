import Purchases, { PurchasesPackage, PurchasesOffering } from 'react-native-purchases';
import { Platform, Alert } from 'react-native';
import Constants from 'expo-constants';

const API_KEYS = {
    ios: 'appl_ooxzpzwxHOQNkUCjODAkqnLDbjJ',
    android: 'goog_YOUR_REVENUECAT_PUBLIC_API_KEY_HERE', // TODO: Get from RevenueCat Dashboard
};

export const ENTITLEMENT_ID = 'premium';

export class RevenueCatService {
    static async init() {
        // Safety check for Expo Go
        if (Constants.executionEnvironment === 'storeClient') {
            console.log('[RevenueCat] Running in Expo Go - Native Payments Disabled. Using Mock Mode.');
            this.mockPro = true; // Auto-enable pro features for testing UI in Expo Go
            return;
        }

        try {
            if (Platform.OS === 'ios') {
                await Purchases.configure({ apiKey: API_KEYS.ios });
            } else if (Platform.OS === 'android') {
                await Purchases.configure({ apiKey: API_KEYS.android });
            }
            if (__DEV__) {
                await Purchases.setLogLevel(Purchases.LOG_LEVEL.DEBUG);
            }
            console.log('RevenueCat Initialized');
        } catch (e) {
            console.warn('RevenueCat Init Failed:', e);
            // Don't alert in dev, just log
        }
    }

    static async getOfferings(): Promise<PurchasesOffering | null> {
        try {
            const offerings = await Purchases.getOfferings();
            if (offerings.current !== null) {
                return offerings.current;
            } else {
                console.log("No current offering configured in RevenueCat dashboard");
            }
        } catch (e) {
            console.error('Error fetching offerings', e);
            // Don't alert here automatically, let the UI decide, but log it clearly
        }
        return null;
    }

    static async purchasePackage(pkg: any) {
        try {
            const { customerInfo } = await Purchases.purchasePackage(pkg);
            return { success: true, customerInfo };
        } catch (e: any) {
            if (!e.userCancelled) {
                console.error('Purchase error', e);
                return { success: false, error: e.message };
            } else {
                return { success: false, userCancelled: true };
            }
        }
    }

    static async restorePurchases() {
        try {
            const customerInfo = await Purchases.restorePurchases();
            return { success: true, customerInfo };
        } catch (e: any) {
            console.error("Restoring purchases failed", e);
            return { success: false, error: e.message };
        }
    }

    static async getCustomerInfo() {
        try {
            const customerInfo = await Purchases.getCustomerInfo();
            return customerInfo;
        } catch (e) {
            console.error('Error fetching customer info', e);
        }
    }

    static mockPro = false;

    static setMockPro(value: boolean) {
        this.mockPro = value;
    }

    static async isPro(): Promise<boolean> {
        if (this.mockPro) return true; // Mock override for demo

        try {
            const customerInfo = await this.getCustomerInfo();
            return customerInfo?.entitlements.active[ENTITLEMENT_ID] !== undefined;
        } catch (e) {
            console.error("Failed to check pro status", e);
            return false;
        }
    }
}
