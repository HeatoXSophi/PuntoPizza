
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { categories, products } from "@/lib/data";

export async function GET() {
    try {
        // 1. Validate Env Vars
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
        const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

        if (!supabaseUrl || !serviceKey) {
            return NextResponse.json({
                success: false,
                error: "Missing ENV variables",
                debug: {
                    hasUrl: !!supabaseUrl,
                    hasKey: !!serviceKey
                }
            }, { status: 500 });
        }

        // 2. Perform Raw Fetch Connectivity Check (HEAD request)
        // This validates if the URL is reachable and the server can make external requests
        try {
            const rawResponse = await fetch(`${supabaseUrl}/rest/v1/`, {
                method: "HEAD",
                headers: {
                    "apikey": serviceKey,
                    "Authorization": `Bearer ${serviceKey}`,
                    "Content-Type": "application/json"
                },
                // Add a timeout if fetching doesn't support signal
                signal: AbortSignal.timeout(5000)
            });

            if (!rawResponse.ok) {
                const text = await rawResponse.text();
                return NextResponse.json({
                    success: false,
                    error: `Raw Network Check Failed: ${rawResponse.statusText} (${rawResponse.status})`,
                    body: text.substring(0, 200), // Limit output
                    debug: { url: supabaseUrl }
                }, { status: 502 });
            }
        } catch (netError: unknown) {
            const error = netError as Error;
            return NextResponse.json({
                success: false,
                error: `Network Error (Fetch Failed): ${error.message}`,
                stack: error.stack,
                debug: { url: supabaseUrl }
            }, { status: 503 });
        }


        // 3. Initialize Supabase client
        const supabase = createClient(supabaseUrl, serviceKey, {
            auth: {
                persistSession: false,
                autoRefreshToken: false,
                detectSessionInUrl: false,
            },
        });

        // 4. Insert Categories
        const { error: catError } = await supabase
            .from("categories")
            .upsert(categories.map(c => ({
                id: c.id,
                name: c.name,
                image_url: null,
                sort_order: 0
            })), { onConflict: "id" });

        if (catError) {
            throw new Error(`Category Insert Failed: ${catError.message} (${catError.code || 'NoCode'})`);
        }

        // 5. Insert Products
        const { data: existingProducts } = await supabase.from("products").select("name");
        const existingNames = new Set(existingProducts?.map(p => p.name) || []);

        const productsToInsert = products
            .filter(p => !existingNames.has(p.name))
            .map(p => ({
                name: p.name,
                description: p.description,
                price: p.price,
                category_id: p.category,
                image_url: p.image,
                available: true
            }));

        if (productsToInsert.length > 0) {
            const { error: prodError } = await supabase
                .from("products")
                .insert(productsToInsert);

            if (prodError) throw new Error(`Product Insert Failed: ${prodError.message}`);
        }

        return NextResponse.json({
            success: true,
            message: `Successfully Seeded! Categories: ${categories.length}, New Products: ${productsToInsert.length}`,
            debug: {
                url: supabaseUrl,
                keyTail: serviceKey.slice(-5)
            }
        });

    } catch (err: unknown) {
        const error = err as Error;
        return NextResponse.json({
            success: false,
            error: error.message || "Unknown Error",
            stack: error.stack,
            full_error: JSON.stringify(error)
        }, { status: 500 });
    }
}
