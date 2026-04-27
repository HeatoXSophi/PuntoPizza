'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function loginAdmin(password: string) {
    // 1. Usa la variable de entorno si existe, sino usa el fallback temporal
    const adminPassword = process.env.ADMIN_PASSWORD || 'Heatox.227';
    
    if (password === adminPassword) {
        const cookieStore = await cookies();
        cookieStore.set('admin_session', 'true', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: '/',
        });
        
        return { success: true };
    }
    
    return { success: false, error: 'Contraseña incorrecta' };
}

export async function logoutAdmin() {
    const cookieStore = await cookies();
    cookieStore.delete('admin_session');
    redirect('/admin/login');
}
