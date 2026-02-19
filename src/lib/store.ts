import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { CartItem, Order } from "@/types";

interface CartState {
    items: CartItem[];
    addItem: (item: Omit<CartItem, "quantity">) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, delta: number) => void;
    clearCart: () => void;
    total: number;

    // Delivery State
    deliveryType: "pickup" | "delivery";
    address: string;
    phoneNumber: string;
    userName: string;
    email: string;
    location: { lat: number; lng: number; link: string } | null;
    language: "es" | "en";

    // Order History
    orders: Order[];
    addOrder: (order: Order) => void;

    setDeliveryType: (type: "pickup" | "delivery") => void;
    setAddress: (address: string) => void;
    setPhoneNumber: (phone: string) => void;
    setUserName: (name: string) => void;
    setEmail: (email: string) => void;
    setLocation: (location: { lat: number; lng: number; link: string } | null) => void;
    setLanguage: (lang: "es" | "en") => void;

    // UI State
    isCartOpen: boolean;
    toggleCart: () => void;
    setCartOpen: (isOpen: boolean) => void;
    // Auth State
    user: any | null; // Use proper User type from supabase if possible
    setUser: (user: any) => void;
}

export const useCartStore = create<CartState>()(
    persist(
        (set) => ({
            items: [],
            total: 0,

            // Delivery State Defaults
            deliveryType: "pickup",
            address: "",
            phoneNumber: "",
            userName: "",
            email: "",
            location: null,
            language: "es",

            // Auth State
            user: null,
            setUser: (user) => set({ user }),

            // Order History Defaults
            orders: [],
            addOrder: (order) => set((state) => ({ orders: [order, ...state.orders] })),

            setDeliveryType: (type) => set({ deliveryType: type }),
            setAddress: (address) => set({ address }),
            setPhoneNumber: (phoneNumber) => set({ phoneNumber }),
            setUserName: (userName) => set({ userName }),
            setEmail: (email) => set({ email }),
            setLocation: (location) => set({ location }),
            setLanguage: (language) => set({ language }),

            addItem: (product) => {
                set((state) => {
                    const existing = state.items.find((i) => i.id === product.id);
                    let newItems;
                    if (existing) {
                        newItems = state.items.map((i) =>
                            i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
                        );
                    } else {
                        newItems = [...state.items, { ...product, quantity: 1 }];
                    }
                    return {
                        items: newItems,
                        total: newItems.reduce((acc, i) => acc + (i.totalPrice || i.price) * i.quantity, 0),
                    };
                });
            },
            removeItem: (id) => {
                set((state) => {
                    const newItems = state.items.filter((i) => i.id !== id);
                    return {
                        items: newItems,
                        total: newItems.reduce((acc, i) => acc + (i.totalPrice || i.price) * i.quantity, 0),
                    };
                });
            },
            updateQuantity: (id, delta) => {
                set((state) => {
                    const newItems = state.items
                        .map((i) => {
                            if (i.id === id) {
                                return { ...i, quantity: Math.max(0, i.quantity + delta) };
                            }
                            return i;
                        })
                        .filter((i) => i.quantity > 0);
                    return {
                        items: newItems,
                        total: newItems.reduce((acc, i) => acc + (i.totalPrice || i.price) * i.quantity, 0),
                    };
                });
            },
            clearCart: () => set({ items: [], total: 0 }),

            // UI State
            isCartOpen: false,
            toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
            setCartOpen: (isOpen: boolean) => set({ isCartOpen: isOpen }),
        }),
        {
            name: "cart-storage",
            storage: createJSONStorage(() => {
                // Check if we are in a browser environment
                if (typeof window !== "undefined") {
                    return localStorage;
                }
                // Return a dummy storage for SSR to avoid errors
                return {
                    getItem: () => null,
                    setItem: () => { },
                    removeItem: () => { },
                };
            }),
            skipHydration: true,
            // Only persist critical data, NOT UI state like isCartOpen
            partialize: (state) => ({
                items: state.items,
                total: state.total,
                orders: state.orders,
                deliveryType: state.deliveryType,
                address: state.address,
                phoneNumber: state.phoneNumber,
                userName: state.userName,
                email: state.email,
                location: state.location,
                language: state.language,
                user: state.user
            }),
        }
    )
);
