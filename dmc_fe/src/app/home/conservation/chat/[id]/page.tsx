"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { User, Bot, Paperclip, Sun, Settings } from "lucide-react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
}

interface Note {
  id: string
  title: string
  content: string
}

interface Conversation {
  id: string
  title: string
  messages: Message[]
}

export default function ChatPage({ params }: { params: { id: string } }) {
  const [inputValue, setInputValue] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [notesOpen, setNotesOpen] = useState(true)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [showSettingsMenu, setShowSettingsMenu] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [notes, setNotes] = useState<Note[]>([
    {
      id: "note-1",
      title: "Lorem ipsum dolor sit amet",
      content:
        "Consectetur adipiscing elit. Phasellus feugiat mauris a lectus venenatis elementum. Pellentesque sit amet elit tellus. Fusce fermentum arcu felis, quis",
    },
    {
      id: "note-2",
      title: "Lorem ipsum dolor sit amet",
      content:
        "Consectetur adipiscing elit. Phasellus feugiat mauris a lectus venenatis elementum. Pellentesque sit amet elit tellus. Fusce fermentum arcu felis, quis",
    },
  ])
  const [deviceName, setDeviceName] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const settingsRef = useRef<HTMLDivElement>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Mock conversations data
  const mockConversations: Record<string, Conversation> = {
    "conv-1": {
      id: "conv-1",
      title: "Lenovo Thinkpad T570",
      messages: [
        {
          id: "user-1",
          content: "How to get the screen?",
          sender: "user",
          timestamp: new Date(Date.now() - 60000 * 5),
        },
        {
          id: "ai-1",
          content: `Artificial Intelligence (AI) offers numerous advantages and has the potential to revolutionize various aspects of our lives. Here are some key advantages of AI:

1. Automation: AI can automate repetitive and mundane tasks, saving time and effort for humans. It can handle large volumes of data, perform complex calculations, and execute tasks with precision and consistency. This automation leads to increased productivity and efficiency in various industries.

2. Decision-making: AI systems can analyze vast amounts of data, identify patterns, and make informed decisions based on that analysis. This ability is particularly useful in complex scenarios where humans may struggle to process large datasets or where quick and accurate decisions are crucial.

3. Improved accuracy: AI algorithms can achieve high levels of accuracy and precision in tasks such as image recognition, natural language processing, and data analysis. They can eliminate human errors caused by fatigue, distractions, or bias, leading to more reliable and consistent results.`,
          sender: "ai",
          timestamp: new Date(Date.now() - 60000 * 4),
        },
        {
          id: "user-2",
          content: "Are there a ways to fix this antenna",
          sender: "user",
          timestamp: new Date(Date.now() - 60000 * 3),
        },
      ],
    },
    "conv-2": {
      id: "conv-2",
      title: "Cannon Camera EOS R5",
      messages: [
        {
          id: "user-1",
          content: "What's the best lens for portraits?",
          sender: "user",
          timestamp: new Date(Date.now() - 60000 * 60 * 24 * 2),
        },
        {
          id: "ai-1",
          content:
            "For portrait photography with the Canon EOS R5, I would recommend the RF 85mm f/1.2L USM. It's considered one of the best portrait lenses due to its ideal focal length and exceptional bokeh. The wide aperture creates beautiful background blur while keeping your subject tack sharp.",
          sender: "ai",
          timestamp: new Date(Date.now() - 60000 * 60 * 24 * 2 + 60000 * 5),
        },
      ],
    },
  }

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setShowSettingsMenu(false)
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Load conversation based on ID
  useEffect(() => {
    const conversationId = params.id
    const conversation = mockConversations[conversationId]

    if (conversation) {
      setDeviceName(conversation.title)
      setMessages(conversation.messages)
    } else {
      // If conversation not found, check for initialMessage
      const initialMessage = sessionStorage.getItem("initialMessage")

      if (initialMessage) {
        const userMessage: Message = {
          id: "initial",
          content: initialMessage,
          sender: "user",
          timestamp: new Date(),
        }

        setMessages([userMessage])
        setIsLoading(true)

        // Simulate AI response
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
        // If no conversation and no initialMessage, redirect to conservation page
        router.push("/home/conservation")
      }
    }

    // Focus input
    inputRef.current?.focus()
  }, [params.id, router])

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Check for system dark mode preference on initial load
  useEffect(() => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    setIsDarkMode(prefersDark)

    if (prefersDark) {
      document.documentElement.classList.add("dark")
    }
  }, [])

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

  const handleSaveNote = () => {
    // Implement save note functionality
    console.log("Saving note...")
  }

  const toggleDarkMode = () => {
    const newMode = !isDarkMode
    setIsDarkMode(newMode)

    // Apply dark mode to the entire document
    if (newMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  const toggleSettingsMenu = () => {
    setShowSettingsMenu(!showSettingsMenu)
    if (showUserMenu) setShowUserMenu(false)
  }

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu)
    if (showSettingsMenu) setShowSettingsMenu(false)
  }

  return (
    <div className="flex h-full">
      {/* Main chat area with rigid layout */}
      <div className="flex-1 flex flex-col h-full relative bg-white dark:bg-gray-900">
        {/* Chat header - fixed */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 border-b z-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-[#2d336b] dark:text-white">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-medium">{deviceName || "New Conversation"}</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-[#2d336b] hover:text-[#4045ef] dark:text-white dark:hover:text-gray-300"
              aria-label={isDarkMode ? "Light mode" : "Dark mode"}
              onClick={toggleDarkMode}
            >
              <Sun className="h-5 w-5" />
            </Button>

            <div className="relative" ref={settingsRef}>
              <Button
                variant="ghost"
                size="icon"
                className="text-[#2d336b] hover:text-[#4045ef] dark:text-white dark:hover:text-gray-300"
                aria-label="Settings"
                onClick={toggleSettingsMenu}
              >
                <Settings className="h-5 w-5" />
              </Button>

              {showSettingsMenu && (
                <div
                  className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg z-50 ${
                    isDarkMode ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"
                  }`}
                >
                  <div className="py-1">
                    <button
                      className={`block px-4 py-2 text-sm w-full text-left ${
                        isDarkMode ? "text-white hover:bg-gray-700" : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      Account Settings
                    </button>
                    <button
                      className={`block px-4 py-2 text-sm w-full text-left ${
                        isDarkMode ? "text-white hover:bg-gray-700" : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      Preferences
                    </button>
                    <button
                      className={`block px-4 py-2 text-sm w-full text-left ${
                        isDarkMode ? "text-white hover:bg-gray-700" : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      Privacy
                    </button>
                    <button
                      className={`block px-4 py-2 text-sm w-full text-left ${
                        isDarkMode ? "text-white hover:bg-gray-700" : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      Help & Support
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Chat content - scrollable area */}
        <div className="absolute top-[65px] bottom-[65px] left-0 right-0 overflow-y-auto p-4 space-y-6 bg-white dark:bg-gray-900">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`flex max-w-[80%] ${message.sender === "user" ? "flex-row-reverse" : "flex-row"}`}>
                <div
                  className={`flex items-center justify-center h-8 w-8 rounded-full flex-shrink-0 ${
                    message.sender === "user"
                      ? "ml-3 bg-[#4045ef]"
                      : `mr-3 ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`
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
                    message.sender === "user"
                      ? "bg-[#4045ef] text-white"
                      : isDarkMode
                        ? "bg-gray-800 text-white"
                        : "bg-gray-100 text-[#2d336b]"
                  }`}
                >
                  <div className="text-sm whitespace-pre-line">{message.content}</div>
                  <div
                    className={`text-xs mt-1 ${
                      message.sender === "user" ? "text-blue-100" : isDarkMode ? "text-gray-400" : "text-[#2d336b]/70"
                    }`}
                  >
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="flex flex-row">
                <div
                  className={`flex items-center justify-center h-8 w-8 rounded-full mr-3 ${
                    isDarkMode ? "bg-gray-700" : "bg-gray-200"
                  }`}
                >
                  <Bot className="h-5 w-5 text-[#4045ef]" />
                </div>
                <div className={`rounded-2xl px-4 py-3 ${isDarkMode ? "bg-gray-800" : "bg-gray-100"}`}>
                  <div className="flex space-x-2">
                    <div
                      className={`w-2 h-2 rounded-full animate-bounce ${isDarkMode ? "bg-gray-500" : "bg-gray-300"}`}
                      style={{ animationDelay: "0ms" }}
                    />
                    <div
                      className={`w-2 h-2 rounded-full animate-bounce ${isDarkMode ? "bg-gray-500" : "bg-gray-300"}`}
                      style={{ animationDelay: "300ms" }}
                    />
                    <div
                      className={`w-2 h-2 rounded-full animate-bounce ${isDarkMode ? "bg-gray-500" : "bg-gray-300"}`}
                      style={{ animationDelay: "600ms" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input area - fixed at bottom */}
        <div className="absolute bottom-0 left-0 right-0 border-t p-4 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <div className="flex items-center border rounded-full overflow-hidden pr-2 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-[#2d336b] hover:text-[#4045ef] dark:text-gray-300 dark:hover:text-white"
              aria-label="Attach file"
            >
              <Paperclip className="h-5 w-5" />
            </Button>
            <input
              ref={inputRef}
              type="text"
              placeholder="Ask me anything"
              className="flex-1 border-0 focus:outline-none px-2 py-2 bg-white dark:bg-gray-700 text-[#2d336b] dark:text-white dark:placeholder-gray-400"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <Button
              type="button"
              size="icon"
              className={cn(
                "rounded-full h-8 w-8 flex items-center justify-center",
                inputValue.trim() && !isLoading
                  ? "bg-[#4045ef] text-white hover:bg-[#3035df]"
                  : "bg-transparent text-[#2d336b]/50 dark:text-gray-500",
              )}
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              aria-label="Send message"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 5v14l11-7-11-7z" fill="currentColor" />
              </svg>
            </Button>
          </div>
        </div>
      </div>

      {/* Notes panel - right sidebar */}
      <div
        className={cn(
          "h-full border-l flex flex-col transition-all duration-300 ease-in-out",
          notesOpen ? "w-80" : "w-0 opacity-0 overflow-hidden",
          "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700",
        )}
      >
        {/* Notes header */}
        <div className="p-4 border-b flex items-center justify-between bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <h2 className="font-bold text-[#2d336b] dark:text-white">YOUR NOTES</h2>
        </div>

        {/* Notes content - scrollable */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-4">
            {notes.map((note) => (
              <div key={note.id} className={`border-b pb-4 ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
                <div className="flex items-start gap-3">
                  <div className={isDarkMode ? "text-white mt-1" : "text-[#2d336b] mt-1"}>•</div>
                  <div>
                    <h3 className={`font-medium ${isDarkMode ? "text-white" : "text-[#2d336b]"}`}>{note.title}</h3>
                    <p className={`text-sm mt-1 ${isDarkMode ? "text-gray-300" : "text-[#2d336b]"}`}>{note.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notes footer */}
        <div className="p-4 border-t bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <Button
            onClick={handleSaveNote}
            className="flex items-center gap-2 w-full justify-start px-3 py-2 rounded-md bg-white dark:bg-gray-700 text-[#4045ef] hover:bg-[#f1f6ff] dark:hover:bg-gray-600 border border-[#4045ef] dark:border-gray-600"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-[#4045ef]"
            >
              <path d="M12 5v14" />
              <path d="M5 12h14" />
            </svg>
            <span className="text-[#4045ef]">Save as note</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
