import { NextResponse } from "next/server";
import TelegramBot from "node-telegram-bot-api";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import os from "os";
import path from "path";
import PDFDocument from "pdfkit";
import ExcelJS from "exceljs";

// Constants
const TELEGRAM_BOT_TOKEN = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN;
const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const LOG_PREFIX = {
    TELEGRAM: "TELEGRAM_WEBHOOK",
    PDF: "PDF_REPORT",
    EXCEL: "EXCEL_REPORT",
    GEMINI: "GEMINI"
};

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
        const bot = new TelegramBot(TELEGRAM_BOT_TOKEN);

        // Handle different commands
        if (text === "/start") {
            return await handleStartCommand(bot, chatId);
        } else if (text === "/report") {
            return await handlePdfReportCommand(bot, chatId);
        } else if (text === "/report excel") {
            return await handleExcelReportCommand(bot, chatId);
        } else {
            return await handleGeminiResponse(bot, chatId, text);
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
async function handleStartCommand(bot, chatId) {
    await bot.sendMessage(
        chatId,
        "Chào bạn. Chúc bạn một ngày tốt lành!. Tôi có thể giúp gì cho bạn?"
    );
    return NextResponse.json({ status: "Start message sent" });
}

async function handlePdfReportCommand(bot, chatId) {
    await bot.sendMessage(
        chatId,
        "⌛ Đang tạo báo cáo PDF... Vui lòng đợi trong giây lát."
    );

    const data = getSampleData();

    // Generate report content
    let reportText;
    try {
        reportText = await generateReportWithGemini(data);
    } catch (error) {
        return await handleReportError(bot, chatId, "PDF", "content", error);
    }

    // Create PDF file
    let filePath;
    try {
        filePath = await createPDF(reportText);
    } catch (error) {
        return await handleReportError(bot, chatId, "PDF", "file", error);
    }

    // Send document to user
    try {
        return await sendDocumentToUser(bot, chatId, filePath, "PDF");
    } catch (error) {
        return await handleReportError(bot, chatId, "PDF", "sending", error);
    }
}

async function handleExcelReportCommand(bot, chatId) {
    await bot.sendMessage(
        chatId,
        "⌛ Đang tạo báo cáo Excel... Vui lòng đợi trong giây lát."
    );

    const data = getSampleData();

    // Generate report content
    let reportText;
    try {
        reportText = await generateReportWithGemini(data);
    } catch (error) {
        return await handleReportError(bot, chatId, "Excel", "content", error);
    }

    // Create Excel file
    let filePath;
    try {
        filePath = await createExcelReport(reportText, data);
    } catch (error) {
        return await handleReportError(bot, chatId, "Excel", "file", error);
    }

    // Send document to user
    try {
        return await sendDocumentToUser(bot, chatId, filePath, "Excel");
    } catch (error) {
        return await handleReportError(bot, chatId, "Excel", "sending", error);
    }
}

async function handleGeminiResponse(bot, chatId, text) {
    await bot.sendMessage(
        chatId,
        "⌛ Đang xử lý câu hỏi của bạn... Vui lòng đợi trong giây lát."
    );

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent(text);
        const response = await result.response;
        const responseText = response.text();

        await bot.sendMessage(chatId, responseText);
        console.log(`${LOG_PREFIX.GEMINI} - Response sent to user successfully`);
        return NextResponse.json({ status: "Processed with Gemini" });
    } catch (error) {
        console.error(`${LOG_PREFIX.GEMINI} - Error generating response:`, error);
        await bot.sendMessage(
            chatId,
            "❌ Có lỗi khi xử lý câu hỏi của bạn. Vui lòng thử lại sau."
        );
        return NextResponse.json(
            { error: "Failed to generate Gemini response" },
            { status: 500 }
        );
    }
}

// Helper functions
async function handleReportError(bot, chatId, reportType, errorType, error) {
    const logPrefix = reportType === "PDF" ? LOG_PREFIX.PDF : LOG_PREFIX.EXCEL;
    const errorMessages = {
        content: "❌ Có lỗi khi tạo nội dung báo cáo. Vui lòng thử lại sau.",
        file: `❌ Có lỗi khi tạo file ${reportType}. Vui lòng thử lại sau.`,
        sending: "❌ Có lỗi khi gửi file báo cáo. Vui lòng thử lại sau."
    };

    console.error(`${logPrefix} - ${errorType} error:`, error);
    await bot.sendMessage(chatId, errorMessages[errorType]);

    return NextResponse.json(
        { error: `Failed to ${errorType === "sending" ? "send" : "generate"} ${reportType} ${errorType}` },
        { status: 500 }
    );
}

async function sendDocumentToUser(bot, chatId, filePath, reportType) {
    const logPrefix = reportType === "PDF" ? LOG_PREFIX.PDF : LOG_PREFIX.EXCEL;

    try {
        console.log(`${logPrefix} - Sending ${reportType} file to user`);
        await bot.sendDocument(chatId, filePath, {
            caption: `📊 Báo cáo ${reportType} tổng kết năm 2025 của bạn đã sẵn sàng!`
        });
        console.log(`${logPrefix} - ${reportType} file sent successfully`);
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

// Data and report generation functions
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

async function generateReportWithGemini(data) {
    try {
        console.log(`${LOG_PREFIX.PDF} - Preparing Gemini prompt`);
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

        console.log(`${LOG_PREFIX.PDF} - Calling Gemini API`);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent(fullPrompt);
        console.log(`${LOG_PREFIX.PDF} - Received response from Gemini`);
        const response = await result.response;
        const text = response.text();
        console.log(`${LOG_PREFIX.PDF} - Report text generated`);

        return text;
    } catch (error) {
        console.error(`${LOG_PREFIX.PDF} - Error generating report with Gemini:`, error);
        throw new Error("Failed to generate report with Gemini");
    }
}

async function createPDF(reportText) {
    return new Promise((resolve, reject) => {
        try {
            console.log(`${LOG_PREFIX.PDF} - Starting PDF creation`);

            // Create a temporary file path
            const tempDir = os.tmpdir();
            const filePath = path.join(tempDir, `report-${Date.now()}.pdf`);
            console.log(`${LOG_PREFIX.PDF} - PDF will be saved to:`, filePath);

            // Create and setup PDF document
            const doc = new PDFDocument({ margin: 50 });
            const writeStream = fs.createWriteStream(filePath);
            doc.pipe(writeStream);

            // Add content
            addPdfContent(doc, reportText);

            // Finalize the PDF
            doc.end();
            console.log(`${LOG_PREFIX.PDF} - PDF creation completed, waiting for file to be written`);

            writeStream.on("finish", () => {
                console.log(`${LOG_PREFIX.PDF} - PDF file write completed`);
                resolve(filePath);
            });

            writeStream.on("error", (error) => {
                console.error(`${LOG_PREFIX.PDF} - Error writing PDF file:`, error);
                reject(error);
            });
        } catch (error) {
            console.error(`${LOG_PREFIX.PDF} - Error creating PDF:`, error);
            reject(error);
        }
    });
}

function addPdfContent(doc, reportText) {
    // Add title
    doc.fontSize(25).text("Báo Cáo Tổng Kết Năm 2025", {
        align: "center"
    });

    // Add date
    doc.fontSize(12).text(`Ngày tạo: ${new Date().toLocaleDateString("vi-VN")}`, {
        align: "center"
    });

    doc.moveDown(2);

    // Add report content
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
}

async function createExcelReport(reportText, data) {
    return new Promise((resolve, reject) => {
        try {
            console.log(`${LOG_PREFIX.EXCEL} - Starting Excel creation`);

            // Create a temporary file path
            const tempDir = os.tmpdir();
            const filePath = path.join(tempDir, `report-${Date.now()}.xlsx`);
            console.log(`${LOG_PREFIX.EXCEL} - Excel will be saved to:`, filePath);

            // Create a new Excel workbook
            const workbook = new ExcelJS.Workbook();

            // Add worksheets
            createSummaryWorksheet(workbook, reportText);
            createDataWorksheet(workbook, data);
            createChartWorksheet(workbook, data);

            console.log(`${LOG_PREFIX.EXCEL} - Saving Excel workbook`);
            // Save the workbook
            workbook.xlsx.writeFile(filePath)
                .then(() => {
                    console.log(`${LOG_PREFIX.EXCEL} - Excel file write completed`);
                    resolve(filePath);
                })
                .catch(error => {
                    console.error(`${LOG_PREFIX.EXCEL} - Error writing Excel file:`, error);
                    reject(error);
                });
        } catch (error) {
            console.error(`${LOG_PREFIX.EXCEL} - Error creating Excel report:`, error);
            reject(error);
        }
    });
}

function createSummaryWorksheet(workbook, reportText) {
    console.log(`${LOG_PREFIX.EXCEL} - Creating summary worksheet`);
    const summarySheet = workbook.addWorksheet("Báo Cáo Tổng Kết");

    // Add title
    summarySheet.mergeCells("A1:H1");
    summarySheet.getCell("A1").value = "BÁO CÁO TỔNG KẾT NĂM 2025";
    summarySheet.getCell("A1").font = { size: 16, bold: true };
    summarySheet.getCell("A1").alignment = { horizontal: "center" };

    // Add date
    summarySheet.mergeCells("A2:H2");
    summarySheet.getCell("A2").value = `Ngày tạo: ${new Date().toLocaleDateString("vi-VN")}`;
    summarySheet.getCell("A2").alignment = { horizontal: "center" };

    // Add report content
    summarySheet.getCell("A4").value = reportText;
    summarySheet.getCell("A4").alignment = { wrapText: true };

    // Auto fit the content
    summarySheet.getColumn("A").width = 100;
}

function createDataWorksheet(workbook, data) {
    console.log(`${LOG_PREFIX.EXCEL} - Creating data worksheet`);
    const dataSheet = workbook.addWorksheet("Dữ Liệu Chi Tiết");
    const months = ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
        "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"];

    // Add headers
    dataSheet.getCell("A1").value = "Danh mục";
    months.forEach((month, index) => {
        dataSheet.getCell(`${String.fromCharCode(66 + index)}1`).value = month;
    });

    // Style headers
    for (let i = 0; i <= 12; i++) {
        const cell = dataSheet.getCell(`${String.fromCharCode(65 + i)}1`);
        cell.font = { bold: true };
        cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFD3D3D3" } // Light gray
        };
    }

    // Add data
    const categories = ["users", "posts", "groups", "movies", "ratings", "actors"];
    const categoryNames = {
        users: "Người dùng",
        posts: "Bài viết",
        groups: "Nhóm",
        movies: "Phim",
        ratings: "Đánh giá",
        actors: "Diễn viên"
    };

    categories.forEach((category, rowIndex) => {
        // Add category name
        dataSheet.getCell(`A${rowIndex + 2}`).value = categoryNames[category];

        // Add monthly data
        months.forEach((month, colIndex) => {
            dataSheet.getCell(`${String.fromCharCode(66 + colIndex)}${rowIndex + 2}`).value = data[category][month];
        });
    });

    // Auto fit columns
    dataSheet.columns.forEach(column => {
        column.width = 15;
    });
}

function createChartWorksheet(workbook, data) {
    console.log(`${LOG_PREFIX.EXCEL} - Creating chart worksheet`);
    const chartSheet = workbook.addWorksheet("Biểu Đồ");

    // Add title
    chartSheet.mergeCells("A1:G1");
    chartSheet.getCell("A1").value = "BIỂU ĐỒ TỔNG KẾT NĂM 2025";
    chartSheet.getCell("A1").font = { size: 16, bold: true };
    chartSheet.getCell("A1").alignment = { horizontal: "center" };

    // Add data for the chart
    chartSheet.getCell("A3").value = "Danh mục";
    chartSheet.getCell("B3").value = "Tổng số";

    const categories = ["users", "posts", "groups", "movies", "ratings", "actors"];
    const categoryNames = {
        users: "Người dùng",
        posts: "Bài viết",
        groups: "Nhóm",
        movies: "Phim",
        ratings: "Đánh giá",
        actors: "Diễn viên"
    };

    categories.forEach((category, index) => {
        chartSheet.getCell(`A${index + 4}`).value = categoryNames[category];

        // Calculate total
        const total = Object.values(data[category]).reduce((sum, count) => sum + count, 0);
        chartSheet.getCell(`B${index + 4}`).value = total;
    });
}