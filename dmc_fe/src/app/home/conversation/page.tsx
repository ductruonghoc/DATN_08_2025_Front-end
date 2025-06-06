"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Plus, Globe, Lightbulb, MoreHorizontal, Mic } from "lucide-react"
import { useRouter } from "next/navigation"

export default function conversationPage() {
  const [inputValue, setInputValue] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  // Focus input on load
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Update the handleSendMessage function to redirect to the dynamic route
  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    // Store the message in sessionStorage to retrieve it on the chat page
    sessionStorage.setItem("initialMessage", inputValue)

    // Navigate to the chat page with a new conversation ID
    router.push(`/home/conversation/chat/new-conversation`)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-full p-4 overflow-auto">
      <h1 className="text-3xl font-semibold text-[#2e3139] mb-8">What can I help with?</h1>

      <div className="w-full max-w-2xl">
        <div className="relative rounded-[10px] shadow-md bg-white border border-gray-200">
          <input
            ref={inputRef}
            type="text"
            placeholder="Ask anything..."
            className="w-full py-4 px-12 border-0 rounded-[10px] text-base focus:outline-none bg-white text-[#2e3139] placeholder-gray-400"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />

          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            <button className="p-1 text-gray-400 hover:text-gray-600">
              <Plus className="h-5 w-5" />
            </button>
          </div>

          <div className="absolute left-14 top-1/2 -translate-y-1/2 flex items-center gap-4">
            {/* <button className="flex items-center gap-1 text-gray-400 hover:text-gray-600">
              <Globe className="h-4 w-4" />
              <span className="text-sm">Search</span>
            </button> */}

            {/* <button className="flex items-center gap-1 text-gray-400 hover:text-gray-600">
              <Lightbulb className="h-4 w-4" />
              <span className="text-sm">Reason</span>
            </button> */}

            {/* <button className="text-gray-400 hover:text-gray-600">
              <MoreHorizontal className="h-4 w-4" />
            </button> */}
          </div>

          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <button className="p-1 text-gray-400 hover:text-gray-600">
              <Mic className="h-5 w-5" />
            </button>

            <button
              className="p-1.5 bg-[#4045ef] text-white rounded-full flex items-center justify-center hover:bg-[#2d336b] transition-colors"
              onClick={handleSendMessage}
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 5v14l11-7-11-7z" fill="currentColor" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
