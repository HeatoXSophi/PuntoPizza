import { supabase } from "./supabase";
import { CartItem } from "@/types";

export interface CreateOrderDTO {
    user_id: string;
    items: CartItem[];
    total: number;
    delivery_type: "pickup" | "delivery";
    address?: string;
    phone?: string;
    payment_method: string;
    status?: "pending" | "confirmed" | "delivered" | "cancelled";
}

export const orders = {
    /**
     * Save a new order to Supabase
     */
    async create(orderData: CreateOrderDTO) {
        if (!supabase) throw new Error("Supabase client not initialized");

        const { data, error } = await supabase
            .from("orders")
            .insert({
                user_id: orderData.user_id,
                items: orderData.items,
                total: orderData.total,
                delivery_type: orderData.delivery_type,
                address: orderData.address,
                phone: orderData.phone,
                payment_method: orderData.payment_method,
                status: orderData.status || "pending"
            })
            .select()
            .single();

        if (error) {
            console.error("Error creating order:", error);
            throw error;
        }

        return data;
    },

    /**
     * Get orders for the current user
     */
    async getMyOrders() {
        if (!supabase) return [];

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return [];

        const { data, error } = await supabase
            .from("orders")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Error fetching orders:", error);
            return [];
        }

        return data;
    },

    /**
     * ADMIN: Get all orders
     */
    async getAllOrders() {
        if (!supabase) return [];

        const { data, error } = await supabase
            .from("orders")
            .select("*, profiles(full_name, phone)") // Join with profiles if needed, though we store phone/address in order too
            .order("created_at", { ascending: false })
            .limit(50); // Pagination in V2

        if (error) {
            console.error("Error fetching all orders:", error);
            throw error;
        }

        return data;
    },

    /**
     * ADMIN: Update order status
     */
    async updateStatus(orderId: string, status: string) {
        if (!supabase) throw new Error("No supabase client");

        const { error } = await supabase
            .from("orders")
            .update({ status })
            .eq("id", orderId);

        if (error) throw error;
    }
};
