import { NextResponse } from 'next/server';
import { routing } from './i18n/routing';
import createMiddleware from 'next-intl/middleware';

// Hàm kiểm tra nếu người dùng đã đăng nhập dựa trên cookie
function isAuthenticated(req) {
    try {
        const accessToken = req.cookies.get('access_token');
        return !!accessToken; // Nếu có access_token, người dùng đã đăng nhập
    } catch (error) {
        console.error('Error checking authentication:', error);
        return false;
    }
}

// Hàm lấy vai trò người dùng từ cookie
function getUserRole(req) {
    try {
        const role = req.cookies.get('role');
        return role || null;
    } catch (error) {
        console.error('Error getting user role:', error);
        return null;
    }
}

export default function middleware(req) {
    const { pathname } = req.nextUrl;
    const isAuth = isAuthenticated(req);
    const role = getUserRole(req)?.value;
    console.log('🚀 ~ middleware ~ role:', role)

    // Chuyển hướng đến trang đăng nhập nếu người dùng chưa đăng nhập
    if (!isAuth && ((!pathname.includes('/sign-in') && !pathname.includes('/admin/sign-in')) && !pathname.includes('/home'))) {
        console.log('Here')
        return NextResponse.redirect(new URL('/sign-in', req.url));
    }

    if (!isAuth && pathname.includes('/admin/dashboard')) {
        return NextResponse.redirect(new URL('/admin/sign-in', req.url));
    }

    // Phân quyền cho admin: Chuyển hướng nếu không phải admin và cố truy cập trang admin
    if (pathname.includes('/admin/dashboard') && role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/', req.url));
    }

    // Ngăn người dùng đã đăng nhập truy cập lại trang đăng nhập
    if (pathname.includes('/sign-in') && isAuth) {
        return NextResponse.redirect(new URL('/', req.url));
    }

    // Tiếp tục xử lý với middleware quốc tế hóa
    return createMiddleware(routing)(req);
}

// Cấu hình matcher áp dụng middleware cho các route cần bảo vệ
export const config = {
    matcher: [
        '/((?!api|_next|_vercel|.*\\..*).*)', // Loại trừ các đường dẫn như /api, /_next, /_vercel và các tệp tĩnh
        '/admin/:path*' // Các đường dẫn bắt đầu với /admin/
    ]
};
