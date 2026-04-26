'use server';

import { supabaseAdmin } from '@/lib/supabase-admin';
import { cookies } from 'next/headers';

// Middleware validation function for actions
async function requireAdmin() {
    const cookieStore = await cookies();
    const adminSession = cookieStore.get('admin_session');
    
    if (!adminSession || adminSession.value !== 'true') {
        throw new Error('No autorizado');
    }
}

export async function getAdminOrders() {
    await requireAdmin();

    if (!supabaseAdmin) {
        throw new Error("Supabase Admin client not initialized");
    }

    const { data, error } = await supabaseAdmin
        .from("orders")
        .select("*, profiles(full_name, phone)")
        .order("created_at", { ascending: false })
        .limit(100);

    if (error) {
        console.error("Error fetching admin orders:", error);
        throw error;
    }

    return data;
}

export async function updateOrderStatus(orderId: string, status: string) {
    await requireAdmin();

    if (!supabaseAdmin) {
        throw new Error("No supabase client");
    }

    const { error } = await supabaseAdmin
        .from("orders")
        .update({ status })
        .eq("id", orderId);

    if (error) throw error;
    
    return { success: true };
}
