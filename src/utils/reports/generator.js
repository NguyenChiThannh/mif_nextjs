import { GoogleGenerativeAI } from "@google/generative-ai";
import PDFDocument from "pdfkit";
import ExcelJS from "exceljs";
import fs from "fs";
import path from "path";
import os from "os";
import { adminStatisticsApi } from "@/services/adminStatisticsApi";

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

export async function getRealStatisticsData() {
    try {
        const currentYear = new Date().getFullYear();

        // Fetch data from APIs
        const userStats = await adminStatisticsApi.query.useGetUserStatisticsByYear(currentYear);
        const postStats = await adminStatisticsApi.query.useGetPostStatisticsByYear(currentYear);
        const ratingStats = await adminStatisticsApi.query.useGetRatingStatisticsByYear(currentYear);

        // Format data to match the expected structure
        const formatMonthlyData = (data) => {
            const months = ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
                "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"];
            const formattedData = {};

            months.forEach((month, index) => {
                formattedData[month] = data[index + 1] || 0;
            });

            return formattedData;
        };

        return {
            users: formatMonthlyData(userStats),
            posts: formatMonthlyData(postStats),
            ratings: formatMonthlyData(ratingStats)
        };
    } catch (error) {
        console.error("Error fetching statistics data:", error);
        throw new Error("Failed to fetch statistics data");
    }
}

// Generate report content using Gemini
export const generateReportWithGemini = async (data) => {
    try {
        const currentYear = new Date().getFullYear();
        const prompt = `
Dưới đây là dữ liệu thống kê hoạt động trong năm ${currentYear}, bao gồm số lượng người dùng, bài viết và đánh giá theo từng tháng.

Hãy phân tích và viết một báo cáo tổng kết năm ${currentYear}, bao gồm:
1. Tổng quan về hoạt động
2. Phân tích xu hướng theo tháng
3. Điểm nổi bật và thành tựu
4. Đề xuất cải thiện

Dữ liệu:
${JSON.stringify(data, null, 2)}
`;

        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Error generating report with Gemini:", error);
        throw error;
    }
};

// Create PDF report
export const createPDF = async (reportText) => {
    const tempDir = os.tmpdir();
    const filePath = path.join(tempDir, `report-${Date.now()}.pdf`);

    return new Promise((resolve, reject) => {
        const doc = new PDFDocument();
        const stream = fs.createWriteStream(filePath);

        doc.pipe(stream);
        addPdfContent(doc, reportText);
        doc.end();

        stream.on('finish', () => resolve(filePath));
        stream.on('error', reject);
    });
};

// Add content to PDF
const addPdfContent = (doc, reportText) => {
    const currentYear = new Date().getFullYear();
    doc.fontSize(20).text(`Báo cáo tổng kết năm ${currentYear}`, { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(reportText);
};

// Create Excel report
export const createExcelReport = async (reportText, data) => {
    const tempDir = os.tmpdir();
    const filePath = path.join(tempDir, `report-${Date.now()}.xlsx`);

    const workbook = new ExcelJS.Workbook();

    // Create worksheets
    createSummaryWorksheet(workbook, reportText);
    createDataWorksheet(workbook, data);
    createChartWorksheet(workbook, data);

    await workbook.xlsx.writeFile(filePath);
    return filePath;
};

// Create summary worksheet
const createSummaryWorksheet = (workbook, reportText) => {
    const currentYear = new Date().getFullYear();
    const worksheet = workbook.addWorksheet('Tổng quan');
    worksheet.columns = [
        { header: `Báo cáo tổng kết năm ${currentYear}`, key: 'content', width: 100 }
    ];

    const paragraphs = reportText.split('\n\n');
    paragraphs.forEach(paragraph => {
        worksheet.addRow({ content: paragraph });
    });
};

// Create data worksheet
const createDataWorksheet = (workbook, data) => {
    const worksheet = workbook.addWorksheet('Dữ liệu chi tiết');

    // Add headers
    const headers = ['Tháng', 'Người dùng', 'Bài viết', 'Đánh giá'];
    worksheet.addRow(headers);

    // Add data rows
    const months = Object.keys(data.users);
    months.forEach(month => {
        worksheet.addRow([
            month,
            data.users[month],
            data.posts[month],
            data.ratings[month]
        ]);
    });
};

// Create chart worksheet
const createChartWorksheet = (workbook, data) => {
    const currentYear = new Date().getFullYear();
    const worksheet = workbook.addWorksheet('Biểu đồ');

    // Add title
    worksheet.mergeCells("A1:D1");
    worksheet.getCell("A1").value = `BIỂU ĐỒ TỔNG KẾT NĂM ${currentYear}`;
    worksheet.getCell("A1").font = { size: 16, bold: true };
    worksheet.getCell("A1").alignment = { horizontal: "center" };

    // Add data for the chart
    worksheet.getCell("A3").value = "Danh mục";
    worksheet.getCell("B3").value = "Tổng số";

    const categories = ["users", "posts", "ratings"];
    const categoryNames = {
        users: "Người dùng",
        posts: "Bài viết",
        ratings: "Đánh giá"
    };

    categories.forEach((category, index) => {
        worksheet.getCell(`A${index + 4}`).value = categoryNames[category];

        // Calculate total
        const total = Object.values(data[category]).reduce((sum, count) => sum + count, 0);
        worksheet.getCell(`B${index + 4}`).value = total;
    });
}; 