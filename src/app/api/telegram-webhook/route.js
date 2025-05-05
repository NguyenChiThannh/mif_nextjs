import { NextResponse } from "next/server";
import TelegramBot from "node-telegram-bot-api";

// Initialize the Telegram bot with the token
// Make sure to set this in your environment variables
const TELEGRAM_BOT_TOKEN = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN;
console.log("TELEGRAM_WEBHOOK - Bot Token:", TELEGRAM_BOT_TOKEN ? "Token exists" : "Token missing");

// Export for serverless use
export async function POST(request) {
    try {
        console.log("TELEGRAM_WEBHOOK - Received webhook request");

        // Parse the incoming webhook data
        const data = await request.json();
        console.log("TELEGRAM_WEBHOOK - Webhook data:", JSON.stringify(data));

        // Check if this is a message with text
        if (!data.message || !data.message.text) {
            console.log("TELEGRAM_WEBHOOK - No message text found");
            return NextResponse.json({ status: "No message text found" });
        }

        const { message } = data;
        const chatId = message.chat.id;
        const text = message.text;
        console.log(`TELEGRAM_WEBHOOK - Message from chat ${chatId}: "${text}"`);

        const bot = new TelegramBot(TELEGRAM_BOT_TOKEN);

        // Handle report commands
        if (text === "/report" || text === "/report help") {
            console.log("TELEGRAM_WEBHOOK - Processing help command");
            // Send usage instructions
            await bot.sendMessage(
                chatId,
                "Sử dụng lệnh:\n" +
                "/report pdf - Tạo báo cáo dạng PDF\n" +
                "/report excel - Tạo báo cáo dạng Excel"
            );
            return NextResponse.json({ status: "Help message sent" });
        }
        else if (text === "/report pdf") {
            console.log("TELEGRAM_WEBHOOK - Processing PDF report command");
            const appUrl = process.env.NEXT_PUBLIC_APP_URL;
            console.log("TELEGRAM_WEBHOOK - App URL:", appUrl);

            // Call the PDF report API
            const reportResponse = await fetch(
                `${appUrl}/api/generate-report`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        chatId,
                    }),
                }
            );

            if (!reportResponse.ok) {
                console.log("TELEGRAM_WEBHOOK - PDF report generation failed:", reportResponse.status);
                // If the report generation fails, send an error message to the user
                await bot.sendMessage(
                    chatId,
                    "Sorry, there was an error generating your PDF report. Please try again later."
                );
            } else {
                console.log("TELEGRAM_WEBHOOK - PDF report request successful");
            }

            // Return a success response
            return NextResponse.json({ status: "Processing PDF report request" });
        }
        else if (text === "/report excel") {
            console.log("TELEGRAM_WEBHOOK - Processing Excel report command");
            const appUrl = process.env.NEXT_PUBLIC_APP_URL;
            console.log("TELEGRAM_WEBHOOK - App URL:", appUrl);

            // Call the Excel report API
            const reportResponse = await fetch(
                `${appUrl}/api/generate-excel-report`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        chatId,
                    }),
                }
            );

            if (!reportResponse.ok) {
                console.log("TELEGRAM_WEBHOOK - Excel report generation failed:", reportResponse.status);
                // If the report generation fails, send an error message to the user
                await bot.sendMessage(
                    chatId,
                    "Sorry, there was an error generating your Excel report. Please try again later."
                );
            } else {
                console.log("TELEGRAM_WEBHOOK - Excel report request successful");
            }

            // Return a success response
            return NextResponse.json({ status: "Processing Excel report request" });
        }

        // If it's not a command we handle, just acknowledge
        console.log("TELEGRAM_WEBHOOK - Command not recognized");
        return NextResponse.json({ status: "Message received but not handled" });
    } catch (error) {
        console.error("TELEGRAM_WEBHOOK - Error handling webhook:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

// For Telegram webhook verification
export async function GET() {
    console.log("TELEGRAM_WEBHOOK - GET request received for verification");
    return NextResponse.json({ status: "Telegram webhook is active" });
} 