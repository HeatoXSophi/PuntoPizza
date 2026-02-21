
import { NextResponse } from "next/server";

// This seed route is deprecated.
// All data seeding is now handled via SQL scripts in /supabase/*.sql
// and through the Admin panel's product management.

export async function GET() {
    return NextResponse.json({
        success: false,
        message: "This seed endpoint is deprecated. Use the SQL scripts in /supabase/ or the Admin panel instead.",
    }, { status: 410 });
}
