# MIF Nextjs

## 1. Introduction

This is a web application built with [Next.js](https://nextjs.org/), a React framework that supports server-side rendering and static site generation.

**Movie Insight Forum (MIF)**  is a forum for film enthusiasts. The application allowing users to join groups, post articles, engage with film content, and message within groups. It provides detailed information about movies and actors, along with features for rating and saving films, as well as favoriting artists.

### 1.1. Technology used:

- **Next.js**: Supports server-side rendering (SSR) and static site generation (SSG).
- **React Hook Form**: Efficient form handling with React.
- **Tailwind CSS**: A utility-first CSS framework for styling.
- **Axios**: For making HTTP requests with custom instances.
- **React Query**: Server-side state management, caching, and API interactions.
- **Zod**: Schema validation for forms and data.
- **QuillJS**: Rich text editor for managing formatted content.
- **Redux**: A predictable state container for managing application-level state.
- **Shadcn UI**: A component library for building modern UI with Next.js and Tailwind CSS.

## 2. Installation

### 2.1. System Requirements

- Node.js >= 16.x
- NPM >= 7.x or Yarn >= 1.x

### 2.2. Steps to Install

**2.2.1. Install dependencies:** 

    Using npm:

    ```bash
    npm install
    ```

    Or using Yarn:

    ```bash
    yarn install
    ```
**2.2.2. Run the application:**

    To run the app in development mode:

    ```bash
    npm run dev
    ```

    Or using Yarn:

    ```bash
    yarn dev
    ```

    The application will be available at `http://localhost:3000`.

**2.2.3. Build for production:**

    If you want to build the application for production:

    ```bash
    npm run build
    npm run start
    ```

    Or using Yarn:

    ```bash
    yarn build
    yarn start
    ```

## Usage

- Visit `http://localhost:3000/home` to access the application.

## API Reference
The frontend utilizes data from the backend API, which can be found in the API documentation [Here](https://documenter.getpostman.com/view/21875363/2sAXqp83yy#93b88b25-cf2c-444c-8f38-ed74c47524f1)

## Telegram Bot Reporting Feature

The application includes an automated reporting system that integrates with Telegram Bot API and Google Gemini API to generate and deliver reports directly to users via Telegram.

### Setup Instructions

1. **Create a Telegram Bot**:
   - Use [@BotFather](https://t.me/botfather) on Telegram to create a new bot and obtain the bot token.

2. **Get Google Gemini API Key**:
   - Visit [Google AI Studio](https://ai.google.dev/) to create a Gemini API key.

3. **Environment Variables**:
   - Create a `.env.local` file in the root directory with the following variables:
     ```
     # Application URL (important for webhook callback)
     NEXT_PUBLIC_APP_URL=https://your-domain.com

     # Telegram Bot Configuration
     NEXT_PUBLIC_TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here

     # Google Gemini API Key
     NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
     ```

4. **Set up Telegram Webhook**:
   - Once your application is deployed, register your webhook with Telegram by visiting:
     ```
     https://api.telegram.org/bot{NEXT_PUBLIC_TELEGRAM_BOT_TOKEN}/setWebhook?url={NEXT_PUBLIC_APP_URL}/api/telegram-webhook
     ```

### Using the Bot

Users can interact with the bot through the following commands:

- `/report` - Shows help on available report types
- `/report pdf` - Generates and sends a PDF report
- `/report excel` - Generates and sends an Excel report with data analysis

The report includes analysis of user activity, posts, groups, movies, ratings, and actors based on available data.
