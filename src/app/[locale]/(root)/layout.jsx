import ChatBotBubble from "@/components/chat-bot-bubble";
import Header from "@/components/header";

export default function RootLayout({
    children,
}) {
    return (

        <main>
            <Header />
            <main className="xl:px-40 lg:px-2 md:px-2 px-1 pt-24">
                {children}
            </main>
            <ChatBotBubble />
        </main>
    );
}