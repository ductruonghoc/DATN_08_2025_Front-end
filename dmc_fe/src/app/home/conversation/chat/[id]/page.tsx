"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { User, Bot, Paperclip, Copy, Save, FileText, Trash2, Menu } from "lucide-react"
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
  deviceId: string
  messages: Message[]
}

export default function ChatPage({ params }: { params: { id: string } }) {
  const [inputValue, setInputValue] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [notesOpen, setNotesOpen] = useState(true)
  const [notesCollapsed, setNotesCollapsed] = useState(false)
  const [showSettingsMenu, setShowSettingsMenu] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [deleteNoteId, setDeleteNoteId] = useState<string | null>(null)
  const [notes, setNotes] = useState<Note[]>([
    {
      id: "note-1",
      title: "How to get the screen?",
      content:
        "To get the screen for your Lenovo Thinkpad T570, you'll need to order a replacement LCD panel. Make sure to get the correct resolution and type (touch or non-touch) that matches your model. You can find compatible screens on Lenovo's parts website or through authorized resellers.",
    },
    {
      id: "note-2",
      title: "What's the best lens for portraits?",
      content:
        "For portrait photography with the Canon EOS R5, I would recommend the RF 85mm f/1.2L USM. It's considered one of the best portrait lenses due to its ideal focal length and exceptional bokeh. The wide aperture creates beautiful background blur while keeping your subject tack sharp.",
    },
    {
      id: "note-3",
      title: "Battery replacement",
      content: "The battery can be replaced by removing the bottom panel and disconnecting the old battery.",
    },
    {
      id: "note-4",
      title: "Screen resolution settings",
      content: "To change screen resolution, go to Settings > Display > Screen Resolution.",
    },
    {
      id: "note-5",
      title: "Keyboard shortcuts",
      content: "Ctrl+Alt+Delete: Task Manager, Alt+Tab: Switch applications, Windows+L: Lock computer",
    },
    {
      id: "note-6",
      title: "Wi-Fi troubleshooting",
      content: "Try restarting the router, forgetting the network and reconnecting, or updating drivers.",
    },
    {
      id: "note-7",
      title: "Printer setup",
      content: "Connect the printer to the same network, add it in Settings > Devices > Printers & scanners.",
    },
    {
      id: "note-8",
      title: "Software updates",
      content: "Check for updates in Settings > Update & Security > Windows Update.",
    },
    {
      id: "note-9",
      title: "Backup procedures",
      content: "Use Windows Backup or third-party software to create regular backups of important files.",
    },
    {
      id: "note-10",
      title: "Storage management",
      content: "Clean up disk space using Disk Cleanup or by uninstalling unused applications.",
    },
    {
      id: "note-11",
      title: "Security recommendations",
      content: "Use strong passwords, enable two-factor authentication, and keep software updated.",
    },
    {
      id: "note-12",
      title: "Performance optimization",
      content: "Close unused applications, disable startup programs, and consider adding more RAM.",
    },
  ])
  const [deviceName, setDeviceName] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const settingsRef = useRef<HTMLDivElement>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const [showShareModal, setShowShareModal] = useState(false)
  const [shareNoteId, setShareNoteId] = useState<string | null>(null)
  const [shareLink, setShareLink] = useState("")

  // Mock conversations data with updated IDs and deviceId
  const mockConversations: Record<string, Conversation> = {
    "chat-1685432789000-device-1": {
      id: "chat-1685432789000-device-1",
      title: "Galaxy S25 Ultra",
      deviceId: "device-1",
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
          content: "Are there ways to fix this antenna?",
          sender: "user",
          timestamp: new Date(Date.now() - 60000 * 3),
        },
      ],
    },
    "chat-1685346389000-device-4": {
      id: "chat-1685346389000-device-4",
      title: "Aspire Vero 14 Laptop",
      deviceId: "device-4",
      messages: [
        {
          id: "user-1",
          content: "What's the best way to upgrade RAM?",
          sender: "user",
          timestamp: new Date(Date.now() - 60000 * 60 * 24 * 2),
        },
        {
          id: "ai-1",
          content:
            "For the Aspire Vero 14 Laptop (AV14-52P-55N4), you can upgrade the RAM by removing the bottom panel. This model supports up to 16GB of DDR4 RAM. Make sure to get compatible SO-DIMM DDR4 modules. Power off the laptop completely before installation and ground yourself to prevent static discharge.",
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

  // Check for conversations in sessionStorage
  useEffect(() => {
    // Check for conversations in sessionStorage
    const storedConversations = sessionStorage.getItem("conversations")
    if (storedConversations) {
      try {
        const parsedConversations = JSON.parse(storedConversations)
        // Find if current conversation ID exists in stored conversations
        const currentConversation = parsedConversations.find((conv: any) => conv.id === params.id)

        if (currentConversation && !mockConversations[params.id]) {
          // If this is a new conversation we created but not in our mock data
          // Initialize with empty messages or a welcome message
          const selectedDevice = sessionStorage.getItem("selectedDevice")
          if (selectedDevice) {
            const device = JSON.parse(selectedDevice)
            setDeviceName(device.name)

            // Add a welcome message
            const welcomeMessage: Message = {
              id: "welcome-" + Date.now(),
              content: `Welcome! How can I help you with your ${device.name}?`,
              sender: "ai",
              timestamp: new Date(),
            }
            setMessages([welcomeMessage])
          }
        }
      } catch (error) {
        console.error("Error parsing stored conversations:", error)
      }
    }
  }, [params.id])

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Check for system dark mode preference on initial load
  useEffect(() => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
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

  const handleSaveNote = (message: Message) => {
    // Create a new note from the message
    const newNote: Note = {
      id: `note-${Date.now()}`,
      title:
        message.sender === "user"
          ? message.content
          : messages.find((m) => m.sender === "user" && m.timestamp < message.timestamp)?.content || "Untitled",
      content: message.content,
    }

    setNotes((prev) => [...prev, newNote])
  }

  const handleCopyMessage = (content: string) => {
    navigator.clipboard
      .writeText(content)
      .then(() => {
        // Could add a toast notification here
        console.log("Text copied to clipboard")
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err)
      })
  }

  const handleDeleteNote = (id: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== id))
    setDeleteNoteId(null)
  }

  const toggleSettingsMenu = () => {
    setShowSettingsMenu(!showSettingsMenu)
    if (showUserMenu) setShowUserMenu(false)
  }

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu)
    if (showSettingsMenu) setShowSettingsMenu(false)
  }

  const toggleNotesPanel = () => {
    setNotesCollapsed(!notesCollapsed)
  }

  const handleShareNote = (noteId: string) => {
    const note = notes.find((n) => n.id === noteId)
    if (note) {
      setShareNoteId(noteId)
      setShareLink(`https://notelink1234.com/${noteId}`)
      setShowShareModal(true)
      setDeleteNoteId(null)
    }
  }

  const handleCopyShareLink = () => {
    navigator.clipboard
      .writeText(shareLink)
      .then(() => {
        console.log("Link copied to clipboard")
      })
      .catch((err) => {
        console.error("Failed to copy link: ", err)
      })
  }

  const handleCloseShareModal = () => {
    setShowShareModal(false)
    setShareNoteId(null)
    setShareLink("")
  }

  return (
    <div className="flex h-full overflow-auto p-4 gap-4 bg-[#E6D9D9]">
      {/* Main chat area with rigid layout */}
      <div className="flex-1 flex flex-col h-full relative bg-white overflow-hidden rounded-[10px] border border-gray-200 shadow-sm">
        {/* Chat header - fixed */}
        <div className="flex items-center justify-between p-4 border-b z-10 bg-white border-gray-200 text-[#2d336b] rounded-t-[10px]">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-medium">{deviceName || "New Conversation"}</h1>
          </div>
        </div>

        {/* Chat content - scrollable area - ensure this has overflow-y: auto */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-white">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`flex max-w-[80%] ${message.sender === "user" ? "flex-row-reverse" : "flex-row"}`}>
                <div
                  className={`flex items-center justify-center h-8 w-8 rounded-full flex-shrink-0 ${
                    message.sender === "user" ? "ml-3 bg-[#4045ef]" : `mr-3 bg-gray-200`
                  }`}
                >
                  {message.sender === "user" ? (
                    <User className="h-5 w-5 text-white" />
                  ) : (
                    <Bot className="h-5 w-5 text-[#4045ef]" />
                  )}
                </div>
                <div className="flex flex-col">
                  <div
                    className={`rounded-[10px] px-4 py-3 ${
                      message.sender === "user"
                        ? "bg-[#4045ef] text-white"
                        : "bg-white text-[#2e3139] border border-gray-200" // Added border for separation
                    }`}
                  >
                    <div className="text-sm whitespace-pre-line">{message.content}</div>
                    <div
                      className={`text-xs mt-1 ${message.sender === "user" ? "text-blue-100" : "text-[#2e3139]/70"}`}
                    >
                      {formatTime(message.timestamp)}
                    </div>
                  </div>

                  {/* Action buttons for AI messages */}
                  {message.sender === "ai" && (
                    <div className="flex mt-2 space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center gap-1 text-xs text-gray-500 hover:text-[#4045ef]"
                        onClick={() => handleSaveNote(message)}
                      >
                        <Save className="h-3.5 w-3.5" />
                        <span>Save as note</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center gap-1 text-xs text-gray-500 hover:text-[#4045ef]"
                        onClick={() => handleCopyMessage(message.content)}
                      >
                        <Copy className="h-3.5 w-3.5" />
                        <span>Copy</span>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="flex flex-row">
                <div className={`flex items-center justify-center h-8 w-8 rounded-full mr-3 bg-gray-200`}>
                  <Bot className="h-5 w-5 text-[#4045ef]" />
                </div>
                <div className={`rounded-[10px] px-4 py-3 bg-white border border-gray-200`}>
                  <div className="flex space-x-2">
                    <div
                      className={`w-2 h-2 rounded-full animate-bounce bg-gray-300`}
                      style={{ animationDelay: "0ms" }}
                    />
                    <div
                      className={`w-2 h-2 rounded-full animate-bounce bg-gray-300`}
                      style={{ animationDelay: "300ms" }}
                    />
                    <div
                      className={`w-2 h-2 rounded-full animate-bounce bg-gray-300`}
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
        <div className="border-t p-4 bg-white border-gray-200 rounded-b-[10px]">
          <div className="flex items-center border rounded-[10px] overflow-hidden pr-2 bg-white border-gray-300">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-[#2d336b] hover:text-[#4045ef]"
              aria-label="Attach file"
            >
              <Paperclip className="h-5 w-5" />
            </Button>
            <input
              ref={inputRef}
              type="text"
              placeholder="Ask me anything"
              className="flex-1 border-0 focus:outline-none px-2 py-2 bg-white text-[#2d336b] placeholder-gray-400"
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
                  : "bg-transparent text-[#2d336b]/50",
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
      {notesCollapsed ? (
        <div className="w-12 h-full bg-white border border-gray-200 rounded-[10px] shadow-sm flex flex-col items-center py-4 space-y-4">
          <button onClick={toggleNotesPanel} className="p-2 text-[#2e3139] hover:bg-gray-100 rounded-md">
            <Menu className="h-5 w-5" />
          </button>
          <button className="p-2 text-[#2e3139] hover:bg-gray-100 rounded-md">
            <FileText className="h-5 w-5" />
          </button>
        </div>
      ) : (
        <div
          className={cn(
            "h-full flex flex-col transition-all duration-300 ease-in-out",
            notesOpen ? "w-80" : "w-0 opacity-0 overflow-hidden",
            "bg-white border border-gray-200 rounded-[10px] shadow-sm",
          )}
        >
          {/* Notes header - fixed */}
          <div className="p-4 border-b flex items-center justify-between bg-white border-gray-200 rounded-t-[10px]">
            <h2 className="font-bold text-[#2e3139]">YOUR NOTES</h2>
            <button onClick={toggleNotesPanel} className="text-[#2e3139] hover:bg-gray-100 p-1 rounded-md">
              <Menu className="h-5 w-5" />
            </button>
          </div>

          {/* Notes content - scrollable - ensure this has overflow-y: auto */}
          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
            <div className="p-4 space-y-4">
              {notes.map((note) => (
                <div key={note.id} className={`border-b pb-4 border-gray-200`}>
                  <div className="flex items-start gap-3">
                    <div className={"text-[#2e3139] mt-1"}>•</div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <h3 className={`font-bold text-[#2e3139]`}>{note.title}</h3>
                        <button
                          onClick={() => setDeleteNoteId(deleteNoteId === note.id ? null : note.id)}
                          className="text-gray-500 hover:text-[#4045ef]"
                        >
                          <FileText className="h-4 w-4" />
                        </button>
                      </div>
                      <p className={`text-sm mt-1 text-[#2e3139]`}>{note.content}</p>

                      {/* Delete note confirmation */}
                      {deleteNoteId === note.id && (
                        <div className="mt-2 p-2 bg-white rounded-[10px] border border-gray-200 shadow-lg">
                          <button
                            onClick={() => handleShareNote(note.id)}
                            className="flex items-center gap-2 w-full text-left px-2 py-1 text-xs text-gray-700 hover:bg-gray-100 rounded"
                          >
                            <svg
                              className="h-3 w-3"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                            </svg>
                            Share with link
                          </button>
                          <button
                            onClick={() => handleDeleteNote(note.id)}
                            className="flex items-center gap-2 w-full text-left px-2 py-1 text-xs text-red-600 hover:bg-gray-100 rounded"
                          >
                            <Trash2 className="h-3 w-3" />
                            Delete this note
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notes footer - fixed */}
          <div className="p-4 border-t bg-white border-gray-200 rounded-b-[10px]">
            <Button
              onClick={() =>
                handleSaveNote(
                  messages[messages.length - 1] || {
                    id: "new",
                    content: "New note",
                    sender: "ai",
                    timestamp: new Date(),
                  },
                )
              }
              className="flex items-center gap-2 w-full justify-start px-3 py-2 rounded-[10px] bg-white border border-[#4045ef] hover:bg-[#f1f6ff]"
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
      )}
      {/* Share Note Modal */}
      {showShareModal && shareNoteId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-medium mb-4 text-[#2e3139]">
              "{notes.find((n) => n.id === shareNoteId)?.title}"
            </h2>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Share link:</label>
              <input
                type="text"
                value={shareLink}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm"
              />
            </div>

            <div className="flex justify-between">
              <button
                onClick={handleCopyShareLink}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
              >
                Copy
              </button>
              <button
                onClick={handleCloseShareModal}
                className="px-4 py-2 bg-[#2d336b] text-white rounded-md hover:bg-[#1e2347] transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
