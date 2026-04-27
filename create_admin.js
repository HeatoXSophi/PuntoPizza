const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envPath = path.resolve(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');

const supabaseUrl = envContent.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)?.[1]?.trim();
const supabaseServiceKey = envContent.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/)?.[1]?.trim();

if (!supabaseUrl || !supabaseServiceKey) {
    console.error("Faltan variables de entorno");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

async function createAdminUser() {
    const { data, error } = await supabase.auth.admin.createUser({
        email: 'admin@puntopizza.com',
        password: 'Heatox.227',
        email_confirm: true
    });

    if (error) {
        if (error.message.includes('already registered')) {
            console.log("El usuario ya existe, actualizando contraseña...");
            const { data: users } = await supabase.auth.admin.listUsers();
            const user = users.users.find(u => u.email === 'admin@puntopizza.com');
            if (user) {
                await supabase.auth.admin.updateUserById(user.id, { password: 'Heatox.227' });
                console.log("Contraseña actualizada con éxito.");
            }
        } else {
            console.error("Error al crear usuario:", error);
        }
    } else {
        console.log("Usuario administrador creado con éxito:", data.user.id);
    }
}

createAdminUser();
