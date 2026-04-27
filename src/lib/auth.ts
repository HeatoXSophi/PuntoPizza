import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export const auth = {
    async login(email: string, password: string) {
        if (!supabase) throw new Error("Supabase not configured");
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) throw error;
        return data;
    },

    async register(email: string, password: string, metadata: { full_name: string; phone: string; address: string }) {
        if (!supabase) throw new Error("Supabase not configured");

        // 1. Sign up user with metadata
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: metadata.full_name,
                    phone: metadata.phone,
                    address: metadata.address
                }
            }
        });

        if (authError) throw authError;
        if (!authData.user) throw new Error("No se pudo crear el usuario");

        // Note: Profile is now created automatically by DB trigger 010_auto_profile_trigger.sql
        return authData;
    },

    async logout() {
        if (!supabase) return;
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    },

    async getProfile(userId: string) {
        if (!supabase) return null;
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) console.error("Error fetching profile", error);
        return data;
    }
};
