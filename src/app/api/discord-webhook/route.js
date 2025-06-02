import { NextResponse } from "next/server";

// Thay bằng Discord Webhook URL của bạn trong biến môi trường
const DISCORD_WEBHOOK_URL = process.env.NEXT_PUBLIC_DISCORD_WEBHOOK_URL;

console.log('DISCORD_WEBHOOK_URL', DISCORD_WEBHOOK_URL)
export async function GET() {
    return NextResponse.json({ status: "Discord webhook endpoint is active" });
}

export async function POST(request) {
    try {
        const body = await request.json();
        const { content, username, avatar_url } = body;

        if (!content) {
            return NextResponse.json({ error: "Missing content" }, { status: 400 });
        }

        const payload = {
            content,
        };
        if (username) payload.username = username;
        if (avatar_url) payload.avatar_url = avatar_url;

        const discordRes = await fetch(DISCORD_WEBHOOK_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (!discordRes.ok) {
            const errorText = await discordRes.text();
            return NextResponse.json({ error: errorText }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
} 