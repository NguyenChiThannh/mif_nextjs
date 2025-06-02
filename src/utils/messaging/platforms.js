import { Client } from "@stomp/stompjs";
import TelegramBot from "node-telegram-bot-api";

// Platform-specific client initialization
export const initializeTelegramBot = (token) => {
    return new TelegramBot(token);
};

export const initializeDiscordBot = (token) => {
    const client = new Client({});
    return client;
};

// Platform-specific message sending
export const sendTelegramMessage = async (bot, chatId, message) => {
    return await bot.sendMessage(chatId, message);
};

export const sendDiscordMessage = async (channel, message) => {
    return await channel.send(message);
};

// Platform-specific file sending
export const sendTelegramDocument = async (bot, chatId, filePath, caption) => {
    return await bot.sendDocument(chatId, filePath, { caption });
};

export const sendDiscordDocument = async (channel, filePath, caption) => {
    return await channel.send({
        content: caption,
        files: [filePath]
    });
};

// Platform-specific error handling
export const handleTelegramError = async (bot, chatId, error) => {
    console.error('Telegram Error:', error);
    await bot.sendMessage(
        chatId,
        "❌ Có lỗi xảy ra. Vui lòng thử lại sau."
    );
};

export const handleDiscordError = async (channel, error) => {
    console.error('Discord Error:', error);
    await channel.send("❌ Có lỗi xảy ra. Vui lòng thử lại sau.");
}; 