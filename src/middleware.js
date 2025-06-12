import { NextResponse } from 'next/server';
import { routing } from './i18n/routing';
import createMiddleware from 'next-intl/middleware';

// Check if the user is authenticated based on cookies
function isAuthenticated(req) {
    try {
        const accessToken = req.cookies.get('access_token');
        return !!accessToken; // If access_token exists, the user is authenticated
    } catch (error) {
        console.error('Error checking authentication:', error);
        return false;
    }
}

// Retrieve the user's role from cookies
function getUserRole(req) {
    try {
        const role = req.cookies.get('role');
        return role?.value || null;
    } catch (error) {
        console.error('Error getting user role:', error);
        return null;
    }
}

export default function middleware(req) {
    let { pathname } = req.nextUrl;

    // Remove locale prefix (e.g., /vi/, /en/) if present
    const localePattern = /^\/([a-z]{2})(?:\/|$)/;
    const match = pathname.match(localePattern);
    if (match) {
        console.log('🌐 Detected locale:', match[1]);
        pathname = pathname.replace(localePattern, '/');
        console.log('🧼 Pathname after removing locale:', pathname);
    }

    const isAuth = isAuthenticated(req);
    console.log('🚀 ~ middleware ~ isAuth:', isAuth)
    const role = getUserRole(req);
    console.log('🚀 ~ middleware ~ role:', role)

    // Public paths accessible to unauthenticated users
    const publicPaths = [
        // '/',
        // '/home',
        // '/movies',
        // '/actors',
        '/sign-in',
        '/sign-up',
        '/admin/sign-in'
    ];

    // Redirect unauthenticated users trying to access non-public paths
    if (!isAuth && !publicPaths.some(path => pathname === path)) {
        console.log('🚫 Redirecting unauthenticated user to /sign-in');
        return NextResponse.redirect(new URL('/sign-in', req.url));
    }

    // List of roles allowed to access admin routes
    const adminRoles = ['ADMIN', 'CONTENT_CREATOR', 'SUPER_ADMIN'];

    // Prevent authenticated users (non-admin roles) from accessing admin routes
    if (isAuth && !adminRoles.includes(role) && pathname.startsWith('/admin')) {
        console.log('🚫 Redirecting non-admin user from /admin to /');
        return NextResponse.redirect(new URL('/', req.url));
    }

    // Prevent authenticated users from accessing the sign-in page
    if (pathname.startsWith('/sign-in') && isAuth) {
        console.log('➡️ Redirecting authenticated user from /sign-in to /home');
        return NextResponse.redirect(new URL('/home', req.url));
    }

    // Continue processing with internationalization middleware for remaining paths
    return createMiddleware(routing)(req);
}

// Middleware configuration for protected routes
export const config = {
    matcher: [
        '/((?!api|_next|_vercel|.*\\..*).*)', // Exclude paths like /api, /_next, /_vercel, and static files
        '/admin/:path*' // Routes starting with /admin/
    ]
};
