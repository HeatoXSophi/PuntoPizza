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
