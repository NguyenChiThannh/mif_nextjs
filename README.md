# Movie Insight Forum (MIF)

## Overview

Movie Insight Forum (MIF) is a comprehensive web application built with Next.js that serves as a platform for movie enthusiasts to discuss, analyze, and share their thoughts about films. The application features a modern UI, real-time interactions, and advanced analytics capabilities.

## Features

### Core Features
- 🎬 Movie information and reviews
- 👥 User groups and communities
- 📝 Article posting and sharing
- 💬 Real-time messaging within groups
- ⭐ Movie rating and saving system
- 🎭 Actor/Actress information and favorites
- 📊 Sentiment analysis and user engagement metrics
- 🌐 Multi-language support
- 🔔 Real-time notifications

### Admin Dashboard
- 📈 Sentiment analysis visualization
- 📊 User engagement metrics
- 📑 Content management
- 📤 Data export capabilities (CSV/Excel)
- 👥 User management

### Technical Features
- 🔐 Authentication and authorization
- 🌙 Dark/Light mode support
- 📱 Responsive design
- 🔄 Real-time updates using WebSocket
- 📊 Data visualization with Chart.js
- 📝 Rich text editing with QuillJS
- 📄 PDF and Excel report generation
- 🤖 Telegram bot integration for automated reporting

## Tech Stack

### Core Framework & Libraries
- **Next.js 14**: React framework with SSR and SSG support
- **React 18**: UI library
- **TypeScript**: Static type checking
- **Tailwind CSS**: Utility-first CSS framework
- **Shadcn UI**: Component library built on Radix UI
- **Redux Toolkit**: State management
- **React Query**: Server state management
- **React Hook Form**: Form handling
- **Zod**: Schema validation

### Data Management & API
- **Axios**: HTTP client
- **React Query**: Data fetching and caching
- **Redux Persist**: State persistence
- **SockJS**: WebSocket client
- **STOMP.js**: WebSocket protocol

### Rich Content & Editing
- **QuillJS**: Rich text editor
- **React Markdown**: Markdown rendering
- **HTML React Parser**: HTML parsing

### Data Visualization
- **Chart.js**: Charting library

### File Handling & Export
- **XLSX**: Excel file handling
- **ExcelJS**: Advanced Excel operations
- **PDFKit**: PDF generation

### AI & Bot Integration
- **Google Generative AI**: AI integration
- **Node Telegram Bot API**: Telegram bot integration

### Authentication & Security
- **React OAuth Google**: Google authentication

## Getting Started

### Prerequisites
- Node.js >= 16.x
- NPM >= 7.x or Yarn >= 1.x

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd mif_nextjs
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory with the following variables:
```env
NEXT_PUBLIC_APP_URL=your_app_url
NEXT_PUBLIC_TELEGRAM_BOT_TOKEN=your_telegram_bot_token
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:3000`

### Building for Production

```bash
npm run build
npm run start
# or
yarn build
yarn start
```

## Project Structure

```
src/
├── app/                 # Next.js app directory
├── components/         # Reusable UI components
├── hooks/             # Custom React hooks
├── lib/               # Utility libraries
├── redux/             # Redux store and slices
├── services/          # API services
├── utils/             # Helper functions
├── i18n/              # Internationalization
└── middleware/        # Custom middleware
```

## API Documentation

The frontend integrates with a backend API. For detailed API documentation, visit:
[API Documentation](https://documenter.getpostman.com/view/21875363/2sAXqp83yy#93b88b25-cf2c-444c-8f38-ed74c47524f1)

## Telegram Bot Integration

The application includes an automated reporting system that integrates with Telegram Bot API and Google Gemini API.

### Bot Commands
- `/report` - Shows available report types
- `/report pdf` - Generates and sends a PDF report
- `/report excel` - Generates and sends an Excel report

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue in the repository or contact the development team.
