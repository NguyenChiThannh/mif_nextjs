import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

export async function GET(req) {
    try {
        const role = req.cookies.get('role')
        return NextResponse.json({ role })
    } catch (error) {
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        )
    }
}

export async function POST(req) {
    try {
        const body = await req.json()

        const access_token = body?.accesstoken

        if (access_token) {
            const decodedToken = jwt.decode(access_token);

            const role = decodedToken?.role || null;

            const response = NextResponse.json({ message: 'Token set successfully' })

            response.cookies.set('access_token', access_token, {
                httpOnly: true,
                path: '/',
                sameSite: 'Strict',
            })

            response.cookies.set('role', role, {
                httpOnly: true,
                path: '/',
                sameSite: 'Strict',
            })

            return response
        } else {
            return NextResponse.json(
                { message: 'Access token missing' },
                { status: 400 }
            )
        }
    } catch (error) {
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        )
    }
}

export async function DELETE(req) {
    try {
        const response = NextResponse.json({ message: 'Logged out successfully' });

        response.cookies.delete('access_token', {
            path: '/',
            sameSite: 'Strict',
        });

        response.cookies.delete('role', {
            path: '/',
            sameSite: 'Strict',
        });

        return response;
    } catch (error) {
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}
