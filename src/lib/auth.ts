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

        // 1. Sign up user
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
        });

        if (authError) throw authError;
        if (!authData.user) throw new Error("No se pudo crear el usuario");

        // 2. Insert into profiles table
        const { error: profileError } = await supabase
            .from('profiles')
            .insert({
                id: authData.user.id,
                full_name: metadata.full_name,
                phone: metadata.phone,
                address: metadata.address,
                updated_at: new Date().toISOString(),
            });

        if (profileError) {
            // Optional: Delete user if profile creation fails? Or just warn?
            console.error("Error creating profile:", profileError);
            toast.error("Usuario creado pero hubo error al guardar perfil.");
        }

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
