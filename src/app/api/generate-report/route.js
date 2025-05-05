import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import TelegramBot from "node-telegram-bot-api";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import os from "os";

// Initialize the Google Generative AI client
const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
console.log("PDF_REPORT - Gemini API Key:", GEMINI_API_KEY ? "Key exists" : "Key missing");
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Initialize the Telegram bot with the token
const TELEGRAM_BOT_TOKEN = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN;
console.log("PDF_REPORT - Telegram Bot Token:", TELEGRAM_BOT_TOKEN ? "Token exists" : "Token missing");
const bot = new TelegramBot(TELEGRAM_BOT_TOKEN);

// Helper function to get sample data (replace with your DB queries in production)
function getSampleData() {
    return {
        users: {
            "Tháng 1": 42, "Tháng 2": 50, "Tháng 3": 47, "Tháng 4": 60,
            "Tháng 5": 58, "Tháng 6": 65, "Tháng 7": 63, "Tháng 8": 70,
            "Tháng 9": 68, "Tháng 10": 75, "Tháng 11": 80, "Tháng 12": 78
        },
        posts: {
            "Tháng 1": 30, "Tháng 2": 28, "Tháng 3": 35, "Tháng 4": 33,
            "Tháng 5": 40, "Tháng 6": 38, "Tháng 7": 45, "Tháng 8": 42,
            "Tháng 9": 50, "Tháng 10": 48, "Tháng 11": 55, "Tháng 12": 52
        },
        groups: {
            "Tháng 1": 10, "Tháng 2": 12, "Tháng 3": 9, "Tháng 4": 14,
            "Tháng 5": 13, "Tháng 6": 16, "Tháng 7": 15, "Tháng 8": 17,
            "Tháng 9": 20, "Tháng 10": 18, "Tháng 11": 21, "Tháng 12": 19
        },
        movies: {
            "Tháng 1": 25, "Tháng 2": 30, "Tháng 3": 28, "Tháng 4": 35,
            "Tháng 5": 33, "Tháng 6": 40, "Tháng 7": 38, "Tháng 8": 45,
            "Tháng 9": 43, "Tháng 10": 50, "Tháng 11": 48, "Tháng 12": 55
        },
        ratings: {
            "Tháng 1": 15, "Tháng 2": 17, "Tháng 3": 14, "Tháng 4": 18,
            "Tháng 5": 20, "Tháng 6": 19, "Tháng 7": 22, "Tháng 8": 21,
            "Tháng 9": 25, "Tháng 10": 24, "Tháng 11": 26, "Tháng 12": 27
        },
        actors: {
            "Tháng 1": 22, "Tháng 2": 25, "Tháng 3": 23, "Tháng 4": 28,
            "Tháng 5": 26, "Tháng 6": 30, "Tháng 7": 29, "Tháng 8": 33,
            "Tháng 9": 32, "Tháng 10": 35, "Tháng 11": 37, "Tháng 12": 36
        }
    };
}

// Generate a report using Gemini AI
async function generateReportWithGemini(data) {
    try {
        console.log("PDF_REPORT - Preparing Gemini prompt");
        // Prepare the prompt for Gemini
        const prompt = `
Dưới đây là dữ liệu thống kê hoạt động trong năm 2025, bao gồm số lượng người dùng, bài viết, nhóm, phim, đánh giá và diễn viên theo từng tháng.

Hãy phân tích và viết một báo cáo tổng kết năm 2025, bao gồm:

1. Tăng trưởng tổng thể so với năm trước (có thể ước lượng nếu không có dữ liệu năm trước).
2. Các tháng nổi bật.
3. Nhận định xu hướng chung.
4. Gợi ý cải tiến.

Dữ liệu:
`;

        const fullPrompt = prompt + JSON.stringify(data, null, 2);

        // Call the Gemini API
        console.log("PDF_REPORT - Calling Gemini API");
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent(fullPrompt);
        console.log("PDF_REPORT - Received response from Gemini");
        const response = await result.response;
        const text = response.text();
        console.log("PDF_REPORT - Report text generated");

        return text;
    } catch (error) {
        console.error("PDF_REPORT - Error generating report with Gemini:", error);
        throw new Error("Failed to generate report with Gemini");
    }
}

// Create a PDF from the generated report
async function createPDF(reportText) {
    return new Promise((resolve, reject) => {
        try {
            console.log("PDF_REPORT - Starting PDF creation");

            // Create a temporary file path
            const tempDir = os.tmpdir();
            const filePath = path.join(tempDir, `report-${Date.now()}.pdf`);
            console.log("PDF_REPORT - PDF will be saved to:", filePath);

            // Create a new PDF document
            const doc = new PDFDocument({ margin: 50 });
            const writeStream = fs.createWriteStream(filePath);

            // Pipe the PDF output to the file
            doc.pipe(writeStream);

            // Add title
            doc.fontSize(25).text("Báo Cáo Tổng Kết Năm 2025", {
                align: "center"
            });

            // Add date
            doc.fontSize(12).text(`Ngày tạo: ${new Date().toLocaleDateString("vi-VN")}`, {
                align: "center"
            });

            doc.moveDown(2);

            // Add report content with appropriate formatting
            doc.fontSize(12).text(reportText, {
                align: "left",
                paragraphGap: 10,
                lineGap: 5
            });

            doc.moveDown();

            // Add footer
            doc.fontSize(10).text("© 2025 - Báo cáo được tạo tự động bởi hệ thống", {
                align: "center"
            });

            // Finalize the PDF
            doc.end();
            console.log("PDF_REPORT - PDF creation completed, waiting for file to be written");

            // Wait for the file to be fully written
            writeStream.on("finish", () => {
                console.log("PDF_REPORT - PDF file write completed");
                resolve(filePath);
            });

            writeStream.on("error", (error) => {
                console.error("PDF_REPORT - Error writing PDF file:", error);
                reject(error);
            });
        } catch (error) {
            console.error("PDF_REPORT - Error creating PDF:", error);
            reject(error);
        }
    });
}

// API route handler for generating report
export async function POST(request) {
    try {
        console.log("PDF_REPORT - Received API request");

        // Get the chat ID from the request body
        const body = await request.json();
        const { chatId } = body;
        console.log("PDF_REPORT - Request with chatId:", chatId);

        if (!chatId) {
            console.log("PDF_REPORT - Missing chatId in request");
            return NextResponse.json(
                { error: "Chat ID is required" },
                { status: 400 }
            );
        }

        // Send an initial message to the user
        console.log("PDF_REPORT - Sending initial message to user");
        try {
            await bot.sendMessage(
                chatId,
                "⌛ Đang tạo báo cáo... Vui lòng đợi trong giây lát."
            );
            console.log("PDF_REPORT - Initial message sent successfully");
        } catch (telegramError) {
            console.error("PDF_REPORT - Error sending initial message:", telegramError);
            return NextResponse.json(
                { error: "Failed to send message via Telegram API" },
                { status: 500 }
            );
        }

        // Get data for the report (from DB or sample data)
        const data = getSampleData();

        // Generate the report using Gemini
        let reportText;
        try {
            reportText = await generateReportWithGemini(data);
        } catch (geminiError) {
            console.error("PDF_REPORT - Gemini report generation failed:", geminiError);
            await bot.sendMessage(
                chatId,
                "❌ Có lỗi khi tạo nội dung báo cáo. Vui lòng thử lại sau."
            );
            return NextResponse.json(
                { error: "Failed to generate report content" },
                { status: 500 }
            );
        }

        // Create a PDF file with the report
        let pdfFilePath;
        try {
            pdfFilePath = await createPDF(reportText);
        } catch (pdfError) {
            console.error("PDF_REPORT - PDF creation failed:", pdfError);
            await bot.sendMessage(
                chatId,
                "❌ Có lỗi khi tạo file PDF. Vui lòng thử lại sau."
            );
            return NextResponse.json(
                { error: "Failed to create PDF file" },
                { status: 500 }
            );
        }

        // Send the PDF document to the user via Telegram
        try {
            console.log("PDF_REPORT - Sending PDF file to user");
            await bot.sendDocument(chatId, pdfFilePath, {
                caption: "📊 Báo cáo tổng kết năm 2025 của bạn đã sẵn sàng!"
            });
            console.log("PDF_REPORT - PDF file sent successfully");
        } catch (sendError) {
            console.error("PDF_REPORT - Error sending document:", sendError);
            await bot.sendMessage(
                chatId,
                "❌ Có lỗi khi gửi file báo cáo. Vui lòng thử lại sau."
            );
            return NextResponse.json(
                { error: "Failed to send document via Telegram API" },
                { status: 500 }
            );
        } finally {
            // Delete the temporary file
            try {
                fs.unlinkSync(pdfFilePath);
                console.log("PDF_REPORT - Temporary file deleted");
            } catch (unlinkError) {
                console.error("PDF_REPORT - Error deleting temporary file:", unlinkError);
            }
        }

        return NextResponse.json({
            status: "success",
            message: "Report generated and sent successfully"
        });
    } catch (error) {
        console.error("PDF_REPORT - Unhandled error in route handler:", error);
        return NextResponse.json(
            { error: "Failed to generate report" },
            { status: 500 }
        );
    }
} 