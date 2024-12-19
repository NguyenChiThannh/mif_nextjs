import { NextResponse } from 'next/server'

export async function POST(req) {
    try {
        const body = await req.json()

        const access_token = body?.accesstoken
        console.log('🚀 ~ POST ~ access_token:', access_token)

        if (access_token) {
            const response = NextResponse.json({ message: 'Token set successfully' })

            response.cookies.set('access_token', access_token, {
                httpOnly: true,
                secure: true,
                path: '/',
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