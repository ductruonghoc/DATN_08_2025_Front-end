"use client"
//React
import React from "react"
import { useState, useRef, useEffect } from "react"
//Next.js
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { User, Bot, Paperclip, Copy, Save, FileText, Trash2, Menu } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast, ToastContainer } from "react-toastify"
import ReactMarkdown from "react-markdown"
import BASEURL from "@/src/app/api/backend/dmc_api_gateway/baseurl"
import Loader from "@/components/loader/loader"
import MessageImageSlider from "@/components/slider/messege"
import { useConversations } from "@/context/conversation"

interface Message {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: string // Store as ISO string
  images_ids?: number[]
}

interface Note {
  id: string
  title: string
  content: string
}

export default function ChatPage({ params }: { params: Promise<{ id: string }> }) {
  //Next.js router
  const router = useRouter()
  const searchParams = useSearchParams()
  //Params retrieval
  const { id } = React.use(params)
  //State management
  const [inputValue, setInputValue] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      id: `welcome-${Date.now()}`,
      content: "Hello! I'm your device manual assistant. I can help you with any questions about how to use your devices. Just ask me anything about setup, troubleshooting, or features!",
      sender: "ai",
      timestamp: new Date().toISOString(),
    },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [notesOpen, setNotesOpen] = useState(true)
  const [notesCollapsed, setNotesCollapsed] = useState(false)
  const [showSettingsMenu, setShowSettingsMenu] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [deleteNoteId, setDeleteNoteId] = useState<string | null>(null)
  const [notes, setNotes] = useState<Note[]>([])
  const [deviceName, setDeviceName] = useState("")
  const [deviceId, setDeviceId] = useState<number | null>(null)
  const [isFetchingConversation, setIsFetchingConversation] = useState(false)
  const [firstMsgState, setFirstMsgState] = useState<{ ready: boolean, value: string }>({ ready: false, value: "" })

  const inputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const settingsRef = useRef<HTMLDivElement>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)

  const [showShareModal, setShowShareModal] = useState(false)
  const [shareNoteId, setShareNoteId] = useState<string | null>(null)
  const [shareLink, setShareLink] = useState("")
  const noteMenuRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

  //Context for conversations
  const { conversations, setConversations } = useConversations()

  useEffect(() => {
    let isMounted = true
    const storedDeviceId = sessionStorage.getItem("selectedDeviceId")
    setDeviceId(storedDeviceId ? parseInt(storedDeviceId, 10) : null)
    const fetchConversation = async () => {
      if (id === "new") {
        if (isMounted) {
          setDeviceName("New Conversation")
        }
        return
      }
      try {
        setIsFetchingConversation(true)
        const token = localStorage.getItem("dmc_api_gateway_token")
        const res = await fetch(`${BASEURL}/conversation/${id}`, {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        })
        const json = await res.json()
        if (!json.success) throw new Error(json.message)
        const loadedMessages: Message[] = []
        const pairs = json.data.pairs
        if (!pairs || !Array.isArray(pairs) || pairs.length === 0) {
          return
        }
        pairs.forEach((pair: any) => {
          loadedMessages.push({
            id: `req-${pair.id}`,
            content: pair.request,
            sender: "user",
            timestamp: pair.created_time,
          })
          loadedMessages.push({
            id: `res-${pair.id}`,
            content: pair.response,
            sender: "ai",
            timestamp: pair.created_time,
            images_ids: pair.images || [],
          })
        })
        if (isMounted) {
          setDeviceId(json.data.device_id ?? null)
          setMessages((prev) => [...prev, ...loadedMessages])
          setDeviceName(json.data.title || "Conversation")
        }
      } catch (error: any) {
      } finally {
        if (isMounted) setIsFetchingConversation(false)
      }
    }
    fetchConversation()
    inputRef.current?.focus()
    return () => {
      isMounted = false
    }
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
      if (deleteNoteId && !Object.values(noteMenuRefs.current).some(ref => ref?.contains(event.target as Node))) {
        setDeleteNoteId(null)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [deleteNoteId])

  useEffect(() => {
    if (id !== "new") {
      const firstMsg = searchParams.get("firstMsg")
      const title = searchParams.get("title")
      if (firstMsg) {
        setFirstMsgState({ ready: true, value: firstMsg })
        setInputValue(firstMsg)
        const url = new URL(window.location.href)
        url.searchParams.delete("firstMsg")
        window.history.replaceState({}, document.title, url.pathname)
      }
      if (title) {
        setDeviceName(title)
        const url = new URL(window.location.href)
        url.searchParams.delete("title")
        window.history.replaceState({}, document.title, url.pathname)
      }
    }
  }, [id, searchParams])

  useEffect(() => {
    if (firstMsgState.ready && firstMsgState.value.trim()) {
      handleSendMessage()
      setFirstMsgState({ ready: false, value: "" })
    }
  }, [firstMsgState])

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
    if (id === "new") {
      try {
        const token = localStorage.getItem("dmc_api_gateway_token")
        const res = await fetch(`${BASEURL}/conversation/storing`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            ...(deviceId ? { device_id: deviceId } : {}),
            query: userMessage.content,
          }),
        })
        const json = await res.json()
        if (!json.success || !json.data.conversation_id) throw new Error(json.message || "Failed to create conversation")
        setConversations((prev) => [
          {
            id: json.data.conversation_id,
            title: json.data.title || "Untitled",
            deviceName: json.data.device_name || "",
            timestamp: new Date(json.data.conversation_updated_time),
          },
          ...prev,
        ])
        router.replace(
          `/client/features/conversation/chat/${json.data.conversation_id}?firstMsg=${encodeURIComponent(
            userMessage.content
          )}&title=${encodeURIComponent(json.data.title)}`
        )
        return
      } catch (err: any) {
        toast.error("Failed to create conversation: " + err.message)
        setIsLoading(false)
        return
      }
    }

    try {
      const token = localStorage.getItem("dmc_api_gateway_token")
      const res = await fetch(`${BASEURL}/conversation/rag_query`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          query: userMessage.content,
          ...(token ? { conversation_id: id } : {}),
          ...(deviceId ? { device_id: deviceId } : {}),
        }),
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.message || "Failed to get response")
      // Streaming response effect
      const aiMessage: Message = {
        id: json.data.pair_id,
        content: "",
        sender: "ai",
        timestamp: new Date().toISOString(),
        images_ids: [],
      };

      setMessages((prev) => [...prev, aiMessage]);

      const words = json.data.response.split(" ");
      const maxDuration = 10000; // Maximum duration in milliseconds (5 seconds)
      const delay = Math.min(maxDuration / words.length, 5); // Calculate delay per word, capped at 50ms

      let currentContent = "";
      let wordIndex = 0;

      const interval = setInterval(() => {
        if (wordIndex < words.length) {
          currentContent += (wordIndex === 0 ? "" : " ") + words[wordIndex];
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === aiMessage.id ? { ...msg, content: currentContent } : msg
            )
          );
          wordIndex++;
        } else {
          clearInterval(interval); // Stop the interval when all words are displayed
        }
      }, delay);
      // Ensure the interval is cleared after the maximum duration
      // Ensure the interval is cleared after the maximum duration
      setTimeout(() => {
        clearInterval(interval);
        if (wordIndex < words.length) {
          // If the effect is incomplete, display the full response immediately
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === aiMessage.id
                ? { ...msg, content: json.data.response, images_ids: json.data.images_ids || [] }
                : msg
            )
          );
        } else {
          // Show images after the full response is displayed
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === aiMessage.id
                ? { ...msg, images_ids: json.data.images_ids || [] }
                : msg
            )
          );
        }
        setIsLoading(false); // Allow user input after the response is fully displayed
      }, maxDuration);
    } catch (err: any) {
      toast.error("Failed to get response: " + err.message)
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
          : messages.find((m) => m.sender === "user" && new Date(m.timestamp) < new Date(message.timestamp))?.content ||
          "Untitled",
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

  const components = {
    li: ({ node, ...props }: any) => (
      <li
        style={{
          overflowWrap: "normal",
          wordBreak: "normal",
          paddingLeft: "1.5rem", // Add indentation for list items
          marginBottom: "0.5rem", // Add spacing between list items
        }}
        {...props}
      />
    ),
    h2: ({ node, ...props }: any) => (
      <h2
        style={{
          fontSize: "1.5rem", // Larger font size for h2
          fontWeight: "bold",
          marginBottom: "1rem", // Add spacing below h2
          color: "#2d336b", // Consistent color
        }}
        {...props}
      />
    ),
    h3: ({ node, ...props }: any) => (
      <h3
        style={{
          fontSize: "1.25rem", // Slightly smaller than h2
          fontWeight: "bold",
          marginBottom: "0.75rem", // Add spacing below h3
          color: "#4045ef", // Different color for distinction
        }}
        {...props}
      />
    ),
    p: ({ node, ...props }: any) => (
      <div
        style={{
          overflowWrap: "normal",
          wordBreak: "normal",
          marginBottom: "1rem", // Add spacing between paragraphs
          lineHeight: "1.6", // Improve readability with line height
        }}
        {...props}
      />
    ),
    code: ({ node, inline, className, children, ...props }: any) => {
      if (inline) {
        return (
          <code
            style={{
              overflowWrap: "normal",
              wordBreak: "normal",
              backgroundColor: "#f5f5f5", // Add background for inline code
              padding: "0.2rem 0.4rem", // Add padding for inline code
              borderRadius: "4px", // Rounded corners
              fontSize: "0.9rem", // Slightly smaller font size
            }}
            className={className}
            {...props}
          >
            {children}
          </code>
        );
      }
      return (
        <pre
          style={{
            whiteSpace: "pre-wrap",
            overflowWrap: "normal",
            wordBreak: "normal",
            backgroundColor: "#f5f5f5", // Add background for code blocks
            padding: "1rem", // Add padding for code blocks
            borderRadius: "6px", // Rounded corners
            fontSize: "0.9rem", // Slightly smaller font size
            overflowX: "auto", // Allow horizontal scrolling for long code
          }}
          className={className}
          {...props}
        >
          <code>{children}</code>
        </pre>
      );
    },
    a: ({ node, ...props }: any) => (
      <a
        style={{
          color: "#4045ef", // Highlight links with a distinct color
          textDecoration: "underline", // Underline for links
          cursor: "pointer", // Pointer cursor for links
        }}
        {...props}
      />
    ),
    table: ({ node, ...props }: any) => (
      <table
        style={{
          width: "100%", // Full width for tables
          borderCollapse: "collapse", // Remove gaps between table cells
          marginBottom: "1rem", // Add spacing below tables
        }}
        {...props}
      />
    ),
    th: ({ node, ...props }: any) => (
      <th
        style={{
          border: "1px solid #ddd", // Add borders to table headers
          padding: "0.5rem", // Add padding for table headers
          backgroundColor: "#f9f9f9", // Light background for headers
          textAlign: "left", // Align text to the left
          fontWeight: "bold", // Bold text for headers
        }}
        {...props}
      />
    ),
    td: ({ node, ...props }: any) => (
      <td
        style={{
          border: "1px solid #ddd", // Add borders to table cells
          padding: "0.5rem", // Add padding for table cells
          textAlign: "left", // Align text to the left
        }}
        {...props}
      />
    ),
  };

  return (
    <div className="flex h-full overflow-auto p-4 gap-4 bg-[#E6D9D9] w-full overflow-x-hidden">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover />
      {isFetchingConversation ? (
        <div className="flex flex-1 items-center justify-center h-full bg-white rounded-[10px] border border-gray-200 shadow-sm">
          <Loader />
        </div>
      ) : (
        <>
          <div className="flex-1 flex flex-col h-full relative bg-white overflow-hidden rounded-[10px] border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between p-4 border-b z-10 bg-white border-gray-200 text-[#2d336b] rounded-t-[10px]">
              <div className="flex items-center gap-3">
                <h1 className="text-lg font-medium">{deviceName || "New Conversation"}</h1>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-white max-w-[calc(100% - 16px)] overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-300">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"} transition-all duration-300 ease-in-out`}
                >
                  <div className={`flex ${message.sender === "user" ? "flex-row-reverse max-w-[700px]" : "flex-row w-full"} overflow-x-hidden`}>
                    <div
                      className={`flex items-center justify-center h-8 w-8 rounded-full flex-shrink-0 ${message.sender === "user" ? "ml-3 bg-[#4045ef]" : "mr-3 bg-gray-200"
                        } transition-transform duration-300 ease-in-out hover:scale-110`}
                    >
                      {message.sender === "user" ? (
                        <User className="h-5 w-5 text-white" />
                      ) : (
                        <Bot className="h-5 w-5 text-[#4045ef]" />
                      )}
                    </div>
                    <div className="flex flex-col w-full">
                      <div
                        className={`rounded-[10px] px-4 py-3 ${message.sender === "user"
                          ? "bg-[#4045ef] text-white"
                          : "bg-inherit text-[#2e3139]"
                          } transition-all duration-300 ease-in-out hover:shadow-md`}
                      >
                        <div className={`whitespace-normal break-words break-all w-full 
                                                                 
                          ${message.sender === "user" ? "text-sm" : "text-lg"}`}>
                          <ReactMarkdown components={components}>{message.content}</ReactMarkdown>
                        </div>
                        {message.images_ids && message.images_ids.length > 0 && (
                          <div className="relative mt-2 overflow-hidden rounded-[10px] shadow-sm">
                            <MessageImageSlider images_ids={message.images_ids} />
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
                          {/* <Button
                            variant="ghost"
                            size="sm"
                            className="flex items-center gap-1 text-xs text-gray-500 hover:text-[#4045ef] transition-colors duration-200"
                            onClick={() => handleSaveNote(message)}
                          >
                            <Save className="h-3.5 w-3.5" />
                            <span>Save as note</span>
                          </Button> */}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="flex items-center gap-1 text-xs text-gray-500 hover:text-[#4045ef] transition-colors duration-200"
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
                    <div className="flex items-center justify-center h-8 w-8 rounded-full mr-3 bg-gray-200">
                      <Bot className="h-5 w-5 text-[#4045ef]" />
                    </div>
                    <div className="rounded-[10px] px-4 py-3 bg-white border border-gray-200">
                      <div className="flex space-x-2">
                        <div
                          className="w-2 h-2 rounded-full animate-bounce bg-gray-300"
                          style={{ animationDelay: "0ms", animationDuration: "0.6s" }}
                        />
                        <div
                          className="w-2 h-2 rounded-full animate-bounce bg-gray-300"
                          style={{ animationDelay: "200ms", animationDuration: "0.6s" }}
                        />
                        <div
                          className="w-2 h-2 rounded-full animate-bounce bg-gray-300"
                          style={{ animationDelay: "400ms", animationDuration: "0.6s" }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <div className="border-t p-5 bg-white border-gray-200 rounded-b-[10px]">
              <div className="flex items-center border rounded-[10px] overflow-hidden pr-2 bg-white border-gray-300">
                {/* <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-[#2d336b] hover:text-[#4045ef] transition-colors duration-200"
                  aria-label="Attach file"
                >
                  <Paperclip className="h-5 w-5" />
                </Button> */}
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Ask me anything"
                  className="flex-1 border-0 focus:outline-none px-2 py-2 bg-white text-[#2d336b] placeholder-gray-400 transition-all duration-200"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isLoading} // Disable input when loading
                />
                <Button
                  type="button"
                  size="icon"
                  className={cn(
                    "rounded-full h-8 w-8 flex items-center justify-center transition-all duration-200",
                    inputValue.trim() && !isLoading
                      ? "bg-[#4045ef] text-white hover:bg-[#3035df]"
                      : "bg-transparent text-[#2d336b]/50"
                  )}
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading} // Disable button when loading
                  aria-label="Send message"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 5v14l11-7-11-7z" fill="currentColor" />
                  </svg>
                </Button>
              </div>
            </div>
          </div>

          {/* {notesCollapsed ? (
            <div className="w-12 h-full bg-white border border-gray-200 rounded-[10px] shadow-sm flex flex-col items-center py-4 space-y-4 transition-all duration-300 ease-in-out">
              <button
                onClick={toggleNotesPanel}
                className="p-2 text-[#2e3139] hover:bg-gray-100 rounded-md transition-colors duration-200"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>  
          ) : (
            <div
              className={cn(
                "h-full flex flex-col transition-all duration-300 ease-in-out",
                notesOpen ? "w-80" : "w-0 opacity-0 overflow-hidden",
                "bg-white border border-gray-200 rounded-[10px] shadow-sm"
              )}
            >
              <div className="p-4 border-b flex items-center justify-between bg-white border-gray-200 rounded-t-[10px]">
                <h2 className="font-bold text-[#2e3139]">YOUR NOTES</h2>
                <button
                  onClick={toggleNotesPanel}
                  className="text-[#2e3139] hover:bg-gray-100 p-1 rounded-md transition-colors duration-200"
                >
                  <Menu className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
                <div className="p-4 space-y-4">
                  {notes.map((note) => (
                    <div
                      key={note.id}
                      className="border-b pb-4 border-gray-200 transition-all duration-200 ease-in-out hover:bg-gray-50"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-1">
                          <div className="flex items-start justify-between relative">
                            <h3 className="font-bold text-[#2e3139]">{note.title}</h3>
                            <button
                              onClick={() => setDeleteNoteId(deleteNoteId === note.id ? null : note.id)}
                              className="text-gray-500 hover:text-[#4045ef] transition-colors duration-200"
                            >
                              <svg
                                className="h-4 w-4"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <circle cx="12" cy="12" r="1" />
                                <circle cx="12" cy="5" r="1" />
                                <circle cx="12" cy="19" r="1" />
                              </svg>
                            </button>
                            {deleteNoteId === note.id && (
                              <div
                                ref={(el) => {noteMenuRefs.current[note.id] = el}}
                                className="absolute right-0 top-6 z-10 mt-2 p-2 bg-white rounded-[10px] border border-gray-200 shadow-lg transition-all duration-200 ease-in-out"
                              >
                                <button
                                  onClick={() => handleShareNote(note.id)}
                                  className="flex items-center gap-2 w-full text-left px-2 py-1 text-xs text-gray-700 hover:bg-gray-100 rounded transition-colors duration-200"
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
                                  className="flex items-center gap-2 w-full text-left px-2 py-1 text-xs text-red-600 hover:bg-gray-100 rounded transition-colors duration-200"
                                >
                                  <Trash2 className="h-3 w-3" />
                                  Delete this note
                                </button>
                              </div>
                            )}
                          </div>
                          <p className="text-sm mt-1 text-[#2e3139]">{note.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* <div className="p-4 border-t bg-white border-gray-200 rounded-b-[10px]">
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
                  className="flex items-center gap-2 w-full justify-start px-3 py-2 rounded-[10px] bg-white border border-[#4045ef] hover:bg-[#f1f6ff] transition-colors duration-200"
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
              </div> */}
          {/* </div>
          )} */}

          {showShareModal && shareNoteId && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300 ease-in-out">
              <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md transform transition-all duration-300 ease-in-out scale-100">
                <h2 className="text-lg font-medium mb-4 text-[#2e3139]">
                  "{notes.find((n) => n.id === shareNoteId)?.title}"
                </h2>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Share link:</label>
                  <input
                    type="text"
                    value={shareLink}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm transition-all duration-200"
                  />
                </div>
                <div className="flex justify-between">
                  <button
                    onClick={handleCopyShareLink}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors duration-200"
                  >
                    Copy
                  </button>
                  <button
                    onClick={handleCloseShareModal}
                    className="px-4 py-2 bg-[#2d336b] text-white rounded-md hover:bg-[#1e2347] transition-colors duration-200"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}