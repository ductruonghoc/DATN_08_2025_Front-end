"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { User, Bot, Send, Paperclip, Trash } from "lucide-react"
import { useRouter } from "next/navigation"

interface Message {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
}

export default function ChatPage() {
  const [inputValue, setInputValue] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Initialize with the message from sessionStorage
  useEffect(() => {
    const initialMessage = sessionStorage.getItem("initialMessage")

    if (initialMessage) {
      const userMessage: Message = {
        id: "initial",
        content: initialMessage,
        sender: "user",
        timestamp: new Date(),
      }

      setMessages([userMessage])

      // Simulate AI response
      setIsLoading(true)
      setTimeout(() => {
        const aiResponses = [
          "I can help you analyze that PDF. Would you like me to extract specific information from it?",
          "Based on your PDF, I can see several key points that might be relevant to your query.",
          "Your document contains information about device specifications. Is there anything specific you'd like to know?",
          "I've processed your PDF. It appears to be a technical manual. What information are you looking for?",
          "I can see this is a report with multiple sections. Which part would you like me to focus on?",
        ]

        const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)]

        const aiMessage: Message = {
          id: Date.now().toString(),
          content: randomResponse,
          sender: "ai",
          timestamp: new Date(),
        }

        setMessages((prev) => [...prev, aiMessage])
        setIsLoading(false)
      }, 1500)
    } else {
      // If no initial message, redirect back to the conservation page
      router.push("/home/conservation")
    }

    // Focus input
    inputRef.current?.focus()
  }, [router])

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    // Simulate AI response after a delay
    setTimeout(() => {
      const aiResponses = [
        "I can help you analyze that PDF. Would you like me to extract specific information from it?",
        "Based on your PDF, I can see several key points that might be relevant to your query.",
        "Your document contains information about device specifications. Is there anything specific you'd like to know?",
        "I've processed your PDF. It appears to be a technical manual. What information are you looking for?",
        "I can see this is a report with multiple sections. Which part would you like me to focus on?",
      ]

      const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)]

      const aiMessage: Message = {
        id: Date.now().toString(),
        content: randomResponse,
        sender: "ai",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiMessage])
      setIsLoading(false)
    }, 1500)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && inputValue.trim()) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const handleClearConversation = () => {
    sessionStorage.removeItem("initialMessage")
    router.push("/home/conservation")
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Chat header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h1 className="text-lg font-semibold text-[#2e3139]">PDF Assistant</h1>
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-500 hover:text-red-500"
          aria-label="Clear conversation"
          onClick={handleClearConversation}
        >
          <Trash className="h-5 w-5" />
        </Button>
      </div>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`flex max-w-[80%] ${message.sender === "user" ? "flex-row-reverse" : "flex-row"}`}>
              <div
                className={`flex items-center justify-center h-8 w-8 rounded-full flex-shrink-0 ${
                  message.sender === "user" ? "ml-3 bg-[#4045ef]" : "mr-3 bg-gray-200"
                }`}
              >
                {message.sender === "user" ? (
                  <User className="h-5 w-5 text-white" />
                ) : (
                  <Bot className="h-5 w-5 text-[#4045ef]" />
                )}
              </div>
              <div
                className={`rounded-2xl px-4 py-3 ${
                  message.sender === "user" ? "bg-[#4045ef] text-white" : "bg-gray-100 text-[#2e3139]"
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <div className={`text-xs mt-1 ${message.sender === "user" ? "text-blue-100" : "text-gray-500"}`}>
                  {formatTime(message.timestamp)}
                </div>
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="flex flex-row">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-200 mr-3">
                <Bot className="h-5 w-5 text-[#4045ef]" />
              </div>
              <div className="bg-gray-100 rounded-2xl px-4 py-3">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div
                    className="w-2 h-2 rounded-full bg-gray-300 animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  />
                  <div
                    className="w-2 h-2 rounded-full bg-gray-300 animate-bounce"
                    style={{ animationDelay: "600ms" }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="border-t p-4">
        <div className="flex items-center bg-white border rounded-full overflow-hidden pr-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="text-gray-500 hover:text-[#4045ef]"
            aria-label="Attach file"
          >
            <Paperclip className="h-5 w-5" />
          </Button>
          <input
            ref={inputRef}
            type="text"
            placeholder="Type your message..."
            className="flex-1 border-0 focus:outline-none px-2 py-2"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Button
            type="button"
            size="icon"
            className="bg-[#4045ef] text-white hover:bg-[#2d336b] rounded-full h-8 w-8"
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            aria-label="Send message"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          PDF Assistant can help you analyze and extract information from your documents.
        </p>
      </div>
    </div>
  )
}
