export interface Category {
    id: string;
    name: string;
    order_index?: number;
}

export interface ProductVariant {
    name: string;
    options: string[];
    required?: boolean;
}

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    image: string;
    available?: boolean;
    isPopular?: boolean;
    isSpicy?: boolean;
    baseIngredients?: string[];
    variants?: ProductVariant[];
    created_at?: string;
    /** -1 = sin límite, 0 = desactivado, 1-N = máximo N extras */
    extrasLimit?: number;
    /** Ingredientes extra gratuitos incluidos en el precio (ej: 4 para la promo 4 ingredientes) */
    freeExtras?: number;
    /** Cantidad de cajas que ocupa este producto (promos pueden ocupar 2 o 3) */
    boxesRequired?: number;
}

export interface StoreSettings {
    id?: string;
    delivery_fee: number;
    box_fee: number;
    updated_at?: string;
}

export interface CartItem extends Product {
    quantity: number;
    totalPrice?: number;
    selectedIngredients?: Record<string, unknown>[];
    selectedVariants?: Record<string, string>;
}

export interface Order {
    id: string;
    date: string;
    items: CartItem[];
    total: number;
    totalBs?: number;
    method: string;
    status?: "pending" | "preparing" | "delivering" | "delivered" | "cancelled";
}

export interface Review {
    id: string;
    product_id: string;
    user_id: string;
    user_name: string;
    rating: number; // 1-5
    comment: string;
    created_at: string;
}
