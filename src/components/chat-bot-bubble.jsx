'use client'

import { useState } from "react"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ChatBotBubble() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: "ai", text: "Xin chào! Tôi có thể giúp gì cho bạn?" }
  ])
  const [input, setInput] = useState("")

  const handleSend = () => {
    if (!input.trim()) return
    setMessages([...messages, { role: "user", text: input }])
    setInput("")

    setTimeout(() => {
      setMessages(prev => [...prev, { role: "ai", text: "Cảm ơn bạn! Tôi sẽ xử lý ngay." }])
    }, 800)
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(true)}
          className="rounded-full shadow-lg overflow-hidden border border-border"
        >
          <Image
            src="/logo.png"
            alt="AI Avatar"
            width={56}
            height={56}
            className="object-cover"
          />
        </Button>
      )}

      {isOpen && (
        <div className="w-80 h-[400px] bg-background text-foreground rounded-lg shadow-xl flex flex-col border border-border">
          {/* Header */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-border">
            <span className="font-semibold text-sm">Trợ lý AI</span>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Chat history */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 text-sm">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={cn(
                  "px-3 py-2 rounded-lg max-w-[80%]",
                  msg.role === "ai"
                    ? "bg-muted text-left"
                    : "bg-primary text-primary-foreground ml-auto text-right"
                )}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-2 border-t border-border flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSend()}
              placeholder="Nhập tin nhắn..."
              className="flex-1 text-sm px-3 py-2 rounded-md bg-muted text-foreground outline-none border border-border"
            />
            <Button onClick={handleSend} size="sm">
              Gửi
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}