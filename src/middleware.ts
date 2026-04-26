import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');
    const isLoginRoute = request.nextUrl.pathname === '/admin/login';

    if (isAdminRoute && !isLoginRoute) {
        const adminSession = request.cookies.get('admin_session');

        if (!adminSession || adminSession.value !== 'true') {
            const loginUrl = new URL('/admin/login', request.url);
            return NextResponse.redirect(loginUrl);
        }
    }

    // Redirect to admin dashboard if already logged in and visiting login page
    if (isLoginRoute) {
        const adminSession = request.cookies.get('admin_session');
        if (adminSession && adminSession.value === 'true') {
            const adminUrl = new URL('/admin', request.url);
            return NextResponse.redirect(adminUrl);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*'],
};
