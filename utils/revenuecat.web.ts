// Mock implementation for Web to prevent crashes
// Since RevenueCat SDK does not support Web, we mock everything.

export const ENTITLEMENT_ID = 'premium'; // Must match native version

export class RevenueCatService {
    static mockPro = false;

    static async init() {
        console.log("RevenueCat Web Mock Initialized");
    }

    static async getCustomerInfo() {
        return {
            entitlements: {
                active: this.mockPro ? { [ENTITLEMENT_ID]: { isActive: true } } : {}
            }
        };
    }

    static async isPro(): Promise<boolean> {
        return this.mockPro;
    }

    static setMockPro(value: boolean) {
        this.mockPro = value;
        console.log("Mock Pro set to:", value);
    }
}

// Mock Purchases default export with dummy methods
const Purchases = {
    configure: () => { },
    getCustomerInfo: async () => ({ entitlements: { active: {} } }),
    addCustomerInfoUpdateListener: (callback: any) => { },
    removeCustomerInfoUpdateListener: (callback: any) => { },
    restorePurchases: async () => ({ entitlements: { active: {} } }),
    getOfferings: async () => ({ current: null }),
    purchasePackage: async () => ({ customerInfo: { entitlements: { active: {} } } }),
};

export default Purchases;
