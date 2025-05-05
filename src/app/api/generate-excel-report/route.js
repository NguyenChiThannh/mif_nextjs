import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import TelegramBot from "node-telegram-bot-api";
import ExcelJS from "exceljs";
import fs from "fs";
import path from "path";
import os from "os";

// Initialize the Google Generative AI client
const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
console.log("EXCEL_REPORT - Gemini API Key:", GEMINI_API_KEY ? "Key exists" : "Key missing");
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Initialize the Telegram bot with the token
const TELEGRAM_BOT_TOKEN = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN;
console.log("EXCEL_REPORT - Telegram Bot Token:", TELEGRAM_BOT_TOKEN ? "Token exists" : "Token missing");
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
        console.log("EXCEL_REPORT - Preparing Gemini prompt");
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
        console.log("EXCEL_REPORT - Calling Gemini API");
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent(fullPrompt);
        console.log("EXCEL_REPORT - Received response from Gemini");
        const response = await result.response;
        const text = response.text();
        console.log("EXCEL_REPORT - Report text generated");

        return text;
    } catch (error) {
        console.error("EXCEL_REPORT - Error generating report with Gemini:", error);
        throw new Error("Failed to generate report with Gemini");
    }
}

// Create an Excel file from the generated report and raw data
async function createExcelReport(reportText, data) {
    return new Promise((resolve, reject) => {
        try {
            console.log("EXCEL_REPORT - Starting Excel creation");

            // Create a temporary file path
            const tempDir = os.tmpdir();
            const filePath = path.join(tempDir, `report-${Date.now()}.xlsx`);
            console.log("EXCEL_REPORT - Excel will be saved to:", filePath);

            // Create a new Excel workbook
            const workbook = new ExcelJS.Workbook();

            console.log("EXCEL_REPORT - Creating summary worksheet");
            // Add report summary worksheet
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

            console.log("EXCEL_REPORT - Creating data worksheet");
            // Add data worksheet
            const dataSheet = workbook.addWorksheet("Dữ Liệu Chi Tiết");

            // Add headers
            const months = ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
                "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"];

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

            console.log("EXCEL_REPORT - Creating chart worksheet");
            // Create a chart worksheet
            const chartSheet = workbook.addWorksheet("Biểu Đồ");

            // Add title for chart sheet
            chartSheet.mergeCells("A1:G1");
            chartSheet.getCell("A1").value = "BIỂU ĐỒ TỔNG KẾT NĂM 2025";
            chartSheet.getCell("A1").font = { size: 16, bold: true };
            chartSheet.getCell("A1").alignment = { horizontal: "center" };

            // Add data for the chart
            chartSheet.getCell("A3").value = "Danh mục";
            chartSheet.getCell("B3").value = "Tổng số";

            categories.forEach((category, index) => {
                chartSheet.getCell(`A${index + 4}`).value = categoryNames[category];

                // Calculate total
                const total = Object.values(data[category]).reduce((sum, count) => sum + count, 0);
                chartSheet.getCell(`B${index + 4}`).value = total;
            });

            console.log("EXCEL_REPORT - Saving Excel workbook");
            // Save the workbook
            workbook.xlsx.writeFile(filePath)
                .then(() => {
                    console.log("EXCEL_REPORT - Excel file write completed");
                    resolve(filePath);
                })
                .catch(error => {
                    console.error("EXCEL_REPORT - Error writing Excel file:", error);
                    reject(error);
                });
        } catch (error) {
            console.error("EXCEL_REPORT - Error creating Excel report:", error);
            reject(error);
        }
    });
}

// API route handler for generating Excel report
export async function POST(request) {
    try {
        console.log("EXCEL_REPORT - Received API request");

        // Get the chat ID from the request body
        const body = await request.json();
        const { chatId } = body;
        console.log("EXCEL_REPORT - Request with chatId:", chatId);

        if (!chatId) {
            console.log("EXCEL_REPORT - Missing chatId in request");
            return NextResponse.json(
                { error: "Chat ID is required" },
                { status: 400 }
            );
        }

        // Send an initial message to the user
        console.log("EXCEL_REPORT - Sending initial message to user");
        try {
            await bot.sendMessage(
                chatId,
                "⌛ Đang tạo báo cáo Excel... Vui lòng đợi trong giây lát."
            );
            console.log("EXCEL_REPORT - Initial message sent successfully");
        } catch (telegramError) {
            console.error("EXCEL_REPORT - Error sending initial message:", telegramError);
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
            console.error("EXCEL_REPORT - Gemini report generation failed:", geminiError);
            await bot.sendMessage(
                chatId,
                "❌ Có lỗi khi tạo nội dung báo cáo. Vui lòng thử lại sau."
            );
            return NextResponse.json(
                { error: "Failed to generate report content" },
                { status: 500 }
            );
        }

        // Create an Excel file with the report and data
        let excelFilePath;
        try {
            excelFilePath = await createExcelReport(reportText, data);
        } catch (excelError) {
            console.error("EXCEL_REPORT - Excel creation failed:", excelError);
            await bot.sendMessage(
                chatId,
                "❌ Có lỗi khi tạo file Excel. Vui lòng thử lại sau."
            );
            return NextResponse.json(
                { error: "Failed to create Excel file" },
                { status: 500 }
            );
        }

        // Send the Excel document to the user via Telegram
        try {
            console.log("EXCEL_REPORT - Sending Excel file to user");
            await bot.sendDocument(chatId, excelFilePath, {
                caption: "📊 Báo cáo Excel tổng kết năm 2025 của bạn đã sẵn sàng!"
            });
            console.log("EXCEL_REPORT - Excel file sent successfully");
        } catch (sendError) {
            console.error("EXCEL_REPORT - Error sending document:", sendError);
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
                fs.unlinkSync(excelFilePath);
                console.log("EXCEL_REPORT - Temporary file deleted");
            } catch (unlinkError) {
                console.error("EXCEL_REPORT - Error deleting temporary file:", unlinkError);
            }
        }

        return NextResponse.json({
            status: "success",
            message: "Excel report generated and sent successfully"
        });
    } catch (error) {
        console.error("EXCEL_REPORT - Unhandled error in route handler:", error);
        return NextResponse.json(
            { error: "Failed to generate Excel report" },
            { status: 500 }
        );
    }
} 