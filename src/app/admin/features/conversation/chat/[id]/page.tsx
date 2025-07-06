"use client"

import React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { User, Bot, Paperclip, Copy, Save, FileText, Trash2, Menu } from "lucide-react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { toast, ToastContainer } from "react-toastify"
import ReactMarkdown from "react-markdown"
import Slider from "rc-slider"
import "rc-slider/assets/index.css"

interface Message {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: string
  imageUrl?: string
}

interface Note {
  id: string
  title: string
  content: string
}

interface Conversation {
  id: string
  title: string
  deviceId?: string
  lastMessage: string
  timestamp: string
  messages: Message[]
}

export default function ChatPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params)
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
  const [sliderValue, setSliderValue] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const settingsRef = useRef<HTMLDivElement>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const [showShareModal, setShowShareModal] = useState(false)
  const [shareNoteId, setShareNoteId] = useState<string | null>(null)
  const [shareLink, setShareLink] = useState("")

  const images = [
    "https://via.placeholder.com/300x200?text=Image+1",
    "https://via.placeholder.com/300x200?text=Image+2",
    "https://via.placeholder.com/300x200?text=Image+3",
  ]

  useEffect(() => {
    const fetchConversation = async () => {
      try {
        const storedConversations = sessionStorage.getItem("conversations")
        let conversations: Conversation[] = []
        if (storedConversations) {
          conversations = JSON.parse(storedConversations).map((conv: any) => ({
            ...conv,
            timestamp: conv.timestamp,
            messages: conv.messages?.map((msg: any) => ({
              ...msg,
              timestamp: msg.timestamp,
            })) || [],
          }))
        }
        const currentConversation = conversations.find((conv: Conversation) => conv.id === id)
        if (currentConversation) {
          setDeviceName(currentConversation.title)
          setMessages(currentConversation.messages || [
            {
              id: `welcome-${Date.now()}`,
              content: `Welcome! How can I help you${currentConversation.title !== "New Conversation" ? ` with your ${currentConversation.title}` : ""}?`,
              sender: "ai",
              timestamp: new Date().toISOString(),
            },
          ])
        } else {
          setMessages([
            {
              id: `welcome-${Date.now()}`,
              content: "Welcome! How can I help you?",
              sender: "ai",
              timestamp: new Date().toISOString(),
            },
          ])
          setDeviceName("New Conversation")
        }
      } catch (error) {
        console.error("Error loading conversation from sessionStorage:", error)
        setMessages([
          {
            id: `welcome-${Date.now()}`,
            content: "Welcome! How can I help you?",
            sender: "ai",
            timestamp: new Date().toISOString(),
          },
        ])
        setDeviceName("New Conversation")
      }
    }

    fetchConversation()
    inputRef.current?.focus()
  }, [id])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

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

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    let aiMessage: Message
    if (inputValue.toLowerCase() === "send image") {
      aiMessage = {
        id: Date.now().toString(),
        content: "Please select an image using the slider below:",
        sender: "ai",
        timestamp: new Date().toISOString(),
        imageUrl: images[sliderValue],
      }
    } else {
      aiMessage = {
        id: Date.now().toString(),
        content: `This is a demo response to: "${inputValue}"`,
        sender: "ai",
        timestamp: new Date().toISOString(),
      }
    }
    setMessages((prev) => [...prev, aiMessage])

    try {
      const storedConversations = sessionStorage.getItem("conversations")
      let conversations: Conversation[] = storedConversations ? JSON.parse(storedConversations) : []
      const updatedConversations = conversations.map((conv: Conversation) =>
        conv.id === id
          ? { ...conv, messages: [...(conv.messages || []), userMessage, aiMessage], lastMessage: userMessage.content, timestamp: new Date().toISOString() }
          : conv
      )
      if (!conversations.some((conv) => conv.id === id)) {
        updatedConversations.push({
          id,
          title: deviceName || "New Conversation",
          deviceId: sessionStorage.getItem("selectedDevice") ? JSON.parse(sessionStorage.getItem("selectedDevice")!).id : undefined,
          lastMessage: userMessage.content,
          timestamp: new Date().toISOString(),
          messages: [userMessage, aiMessage],
        })
      }
      sessionStorage.setItem("conversations", JSON.stringify(updatedConversations))
    } catch (error) {
      console.error("Error saving conversation to sessionStorage:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && inputValue.trim()) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    if (isNaN(date.getTime())) {
      return "Invalid date"
    }
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const handleSaveNote = (message: Message) => {
    const newNote: Note = {
      id: `note-${Date.now()}`,
      title:
        message.sender === "user"
          ? message.content
          : messages.find((m) => m.sender === "user" && new Date(m.timestamp) < new Date(message.timestamp))?.content || "Untitled",
      content: message.content,
    }

    setNotes((prev) => [...prev, newNote])
    toast.success("Note saved successfully")
  }

  const handleCopyMessage = (content: string) => {
    navigator.clipboard
      .writeText(content)
      .then(() => {
        toast.success("Message copied to clipboard")
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err)
        toast.error("Failed to copy message")
      })
  }

  const handleDeleteNote = (id: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== id))
    setDeleteNoteId(null)
    toast.success("Note deleted successfully")
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
      toast.success("Share link generated")
    }
  }

  const handleCopyShareLink = () => {
    navigator.clipboard
      .writeText(shareLink)
      .then(() => {
        toast.success("Share link copied to clipboard")
      })
      .catch((err) => {
        console.error("Failed to copy link: ", err)
        toast.error("Failed to copy share link")
      })
  }

  const handleCloseShareModal = () => {
    setShowShareModal(false)
    setShareNoteId(null)
    setShareLink("")
    toast.info("Share modal closed")
  }

  return (
    <div className="flex h-full overflow-auto p-4 gap-4 bg-[#E6D9D9]">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover />
      <div className="flex-1 flex flex-col h-full relative bg-white overflow-hidden rounded-[10px] border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between p-4 border-b z-10 bg-white border-gray-200 text-[#2d336b] rounded-t-[10px]">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-medium">{deviceName || "New Conversation"}</h1>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-white">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`flex max-w-[80%] ${message.sender === "user" ? "flex-row-reverse" : "flex-row"}`}>
                <div
                  className={`flex items-center justify-center h-8 w-8 rounded-full flex-shrink-0 ${message.sender === "user" ? "ml-3 bg-[#4045ef]" : `mr-3 bg-gray-200`}`}
                >
                  {message.sender === "user" ? (
                    <User className="h-5 w-5 text-white" />
                  ) : (
                    <Bot className="h-5 w-5 text-[#4045ef]" />
                  )}
                </div>
                <div className="flex flex-col">
                  <div
                    className={`rounded-[10px] px-4 py-3 ${message.sender === "user"
                      ? "bg-[#4045ef] text-white"
                      : "bg-white text-[#2e3139] border border-gray-200"
                      }`}
                  >
                    <div className="text-sm whitespace-pre-line">
                      <ReactMarkdown>{message.content}</ReactMarkdown>
                    </div>
                    {message.imageUrl && (
                      <div className="mt-2 relative bg-gray-200 p-4 rounded-[10px]">
                        <div className="text-sm text-gray-600 mb-2"></div>
                        <img
                          src={message.imageUrl}
                          alt="Image"
                          className="rounded-[10px] border border-white-300 max-w-full h-auto mx-auto"
                        />
                        <div className="flex justify-between items-center mt-2">
                          <button
                            onClick={() => setSliderValue((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
                            className="text-[#2d336b] hover:text-[#4045ef]"
                          >
                            &lt;
                          </button>
                          <div className="flex space-x-1">
                            {images.map((_, idx) => (
                              <span
                                key={idx}
                                className={`w-2 h-2 rounded-full ${sliderValue === idx ? "bg-[#4045ef]" : "bg-gray-300"}`}
                              />
                            ))}
                          </div>
                          <button
                            onClick={() => setSliderValue((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
                            className="text-[#2d336b] hover:text-[#4045ef]"
                          >
                            &gt;
                          </button>
                        </div>
                      </div>
                    )}
                    <div
                      className={`text-xs mt-1 ${message.sender === "user" ? "text-blue-100" : "text-[#2e3139]/70"}`}
                    >
                      {formatTime(message.timestamp)}
                    </div>
                  </div>
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

      {notesCollapsed ? (
        <div className="w-12 h-full bg-white border border-gray-200 rounded-[10px] shadow-sm flex flex-col items-center py-4 space-y-4">
          <button onClick={toggleNotesPanel} className="p-2 text-[#2e3139] hover:bg-gray-100 rounded-md">
            <Menu className="h-5 w-5" />
          </button>
          {/* <button className="p-2 text-[#2e3139] hover:bg-gray-100 rounded-md">
            <FileText className="h-5 w-5" />
          </button> */}
        </div>
      ) : (
        <div
          className={cn(
            "h-full flex flex-col transition-all duration-300 ease-in-out",
            notesOpen ? "w-80" : "w-0 opacity-0 overflow-hidden",
            "bg-white border border-gray-200 rounded-[10px] shadow-sm",
          )}
        >
          <div className="p-4 border-b flex items-center justify-between bg-white border-gray-200 rounded-t-[10px]">
            <h2 className="font-bold text-[#2e3139]">YOUR NOTES</h2>
            <button onClick={toggleNotesPanel} className="text-[#2e3139] hover:bg-gray-100 p-1 rounded-md">
              <Menu className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
            <div className="p-4 space-y-4">
              {notes.map((note) => (
                <div key={note.id} className={`border-b pb-4 border-gray-200`}>
                  <div className="flex items-start gap-3">
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

          <div className="p-4 border-t bg-white border-gray-200 rounded-b-[10px]">
            <Button
              onClick={() =>
                handleSaveNote(
                  messages[messages.length - 1] || {
                    id: "new",
                    content: "New note",
                    sender: "ai",
                    timestamp: new Date().toISOString(),
                  }
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