import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
    initializeTelegramBot,
    sendTelegramMessage,
    sendTelegramDocument,
    handleTelegramError
} from '@/utils/messaging/platforms';
import {
    generateReportWithGemini,
    createPDF,
    createExcelReport
} from '@/utils/reports/generator';
import fs from "fs";

// Constants
const TELEGRAM_BOT_TOKEN = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN;
const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const LOG_PREFIX = {
    TELEGRAM: "TELEGRAM_WEBHOOK",
    PDF: "PDF_REPORT",
    EXCEL: "EXCEL_REPORT",
    GEMINI: "GEMINI"
};

// Initialize Telegram bot
const bot = initializeTelegramBot(TELEGRAM_BOT_TOKEN);

// For Telegram webhook verification
export async function GET() {
    console.log(`${LOG_PREFIX.TELEGRAM} - GET request received for verification`);
    return NextResponse.json({ status: "Telegram webhook is active" });
}

// Main webhook handler
export async function POST(request) {
    try {
        console.log(`${LOG_PREFIX.TELEGRAM} - Received webhook request`);

        // Parse the incoming webhook data
        const data = await request.json();

        // Check if this is a message with text
        if (!data.message || !data.message.text) {
            return NextResponse.json({ status: "No message text found" });
        }

        const { message } = data;
        const chatId = message.chat.id;
        const text = message.text;

        // Handle different commands
        if (text === "/start") {
            return await handleStartCommand(chatId);
        } else if (text === "/report") {
            return await handlePdfReportCommand(chatId);
        } else if (text === "/report excel") {
            return await handleExcelReportCommand(chatId);
        } else {
            return await handleGeminiResponse(chatId, text);
        }
    } catch (error) {
        console.error(`${LOG_PREFIX.TELEGRAM} - Error handling webhook:`, error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

// Command handlers
async function handleStartCommand(chatId) {
    await sendTelegramMessage(
        bot,
        chatId,
        "Chào bạn. Chúc bạn một ngày tốt lành!. Tôi có thể giúp gì cho bạn?"
    );
    return NextResponse.json({ status: "Start message sent" });
}

async function handlePdfReportCommand(chatId) {
    await sendTelegramMessage(
        bot,
        chatId,
        "⌛ Đang tạo báo cáo PDF... Vui lòng đợi trong giây lát."
    );

    let data;
    try {
        data = await getRealStatisticsData();
    } catch (error) {
        return await handleReportError(chatId, "PDF", "data", error);
    }

    // Generate report content
    let reportText;
    try {
        reportText = await generateReportWithGemini(data);
    } catch (error) {
        return await handleReportError(chatId, "PDF", "content", error);
    }

    // Create PDF file
    let filePath;
    try {
        filePath = await createPDF(reportText);
    } catch (error) {
        return await handleReportError(chatId, "PDF", "file", error);
    }

    // Send document to user
    try {
        return await sendDocumentToUser(chatId, filePath, "PDF");
    } catch (error) {
        return await handleReportError(chatId, "PDF", "sending", error);
    }
}

async function handleExcelReportCommand(chatId) {
    await sendTelegramMessage(
        bot,
        chatId,
        "⌛ Đang tạo báo cáo Excel... Vui lòng đợi trong giây lát."
    );

    let data;
    try {
        data = await getRealStatisticsData();
    } catch (error) {
        return await handleReportError(chatId, "Excel", "data", error);
    }

    // Generate report content
    let reportText;
    try {
        reportText = await generateReportWithGemini(data);
    } catch (error) {
        return await handleReportError(chatId, "Excel", "content", error);
    }

    // Create Excel file
    let filePath;
    try {
        filePath = await createExcelReport(reportText, data);
    } catch (error) {
        return await handleReportError(chatId, "Excel", "file", error);
    }

    // Send document to user
    try {
        return await sendDocumentToUser(chatId, filePath, "Excel");
    } catch (error) {
        return await handleReportError(chatId, "Excel", "sending", error);
    }
}

async function handleGeminiResponse(chatId, text) {
    await sendTelegramMessage(
        bot,
        chatId,
        "⌛ Đang xử lý câu hỏi của bạn... Vui lòng đợi trong giây lát."
    );

    try {
        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent(text);
        const response = await result.response;
        const responseText = response.text();

        await sendTelegramMessage(bot, chatId, responseText);
        return NextResponse.json({ status: "Processed with Gemini" });
    } catch (error) {
        console.error(`${LOG_PREFIX.GEMINI} - Error generating response:`, error);
        await handleTelegramError(bot, chatId, error);
        return NextResponse.json(
            { error: "Failed to generate Gemini response" },
            { status: 500 }
        );
    }
}

// Helper functions
async function handleReportError(chatId, reportType, errorType, error) {
    const logPrefix = reportType === "PDF" ? LOG_PREFIX.PDF : LOG_PREFIX.EXCEL;
    const errorMessages = {
        data: "❌ Có lỗi khi lấy dữ liệu thống kê. Vui lòng thử lại sau.",
        content: "❌ Có lỗi khi tạo nội dung báo cáo. Vui lòng thử lại sau.",
        file: `❌ Có lỗi khi tạo file ${reportType}. Vui lòng thử lại sau.`,
        sending: "❌ Có lỗi khi gửi file báo cáo. Vui lòng thử lại sau."
    };

    console.error(`${logPrefix} - ${errorType} error:`, error);
    await sendTelegramMessage(bot, chatId, errorMessages[errorType]);

    return NextResponse.json(
        { error: `Failed to ${errorType === "sending" ? "send" : "generate"} ${reportType} ${errorType}` },
        { status: 500 }
    );
}

async function sendDocumentToUser(chatId, filePath, reportType) {
    const logPrefix = reportType === "PDF" ? LOG_PREFIX.PDF : LOG_PREFIX.EXCEL;

    try {
        console.log(`${logPrefix} - Sending ${reportType} file to user`);
        await sendTelegramDocument(
            bot,
            chatId,
            filePath,
            `📊 Báo cáo ${reportType} tổng kết năm ${new Date().getFullYear()} của bạn đã sẵn sàng!`
        );
        return NextResponse.json({ status: `Processing ${reportType} report request` });
    } catch (error) {
        throw error;
    } finally {
        // Clean up the temporary file
        try {
            fs.unlinkSync(filePath);
            console.log(`${logPrefix} - Temporary file deleted`);
        } catch (unlinkError) {
            console.error(`${logPrefix} - Error deleting temporary file:`, unlinkError);
        }
    }
}