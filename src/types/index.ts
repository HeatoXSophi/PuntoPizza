export interface Category {
    id: string;
    name: string;
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
}

export interface CartItem extends Product {
    quantity: number;
    totalPrice?: number;
    selectedIngredients?: Record<string, unknown>[];
}

export interface Order {
    id: string;
    date: string;
    items: CartItem[];
    total: number;
    totalBs?: number;
    method: string;
}
