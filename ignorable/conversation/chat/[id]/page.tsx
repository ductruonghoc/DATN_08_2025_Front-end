"use client"
//React
import React from "react"
import { useState, useRef, useEffect, useCallback, useLayoutEffect } from "react"
//Next.js
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Bot, Paperclip, FileText, Menu } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast, ToastContainer } from "react-toastify"
import BASEURL from "@/src/app/api/backend/dmc_api_gateway/baseurl"
import Loader from "@/components/loader/loader"
import { useConversations } from "@/context/conversation"
import MessageItem from "@/components/messages/item"
import ChatList from "@/components/messages/chatlist"

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

// interface Conversation {
//   id: string
//   title: string
//   deviceId?: string
//   lastMessage: string
//   timestamp: string
//   messages: Message[]
// }

// Add this function near the top of your file or in a utils/actions file
async function takeNote(requestresponsepairid: number, title?: string) {
  const token = localStorage.getItem("dmc_api_gateway_token")
  const res = await fetch(`${BASEURL}/conversation/note/take`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({
      requestresponsepairid,
      ...(title ? { title } : {}),
    }),
  })
  return res.ok
}

async function fetchNotes(conversation_id: string) {
  const token = localStorage.getItem("dmc_api_gateway_token")
  const res = await fetch(`${BASEURL}/conversation/note/list`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ conversation_id }),
  })
  if (!res.ok) return null
  const data = await res.json()
  return data.data?.notes || []
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
  const [notes, setNotes] = useState<Note[]>([
  ])
  const [deviceName, setDeviceName] = useState("")
  const [deviceId, setDeviceId] = useState<number | null>(null)
  const [isFetchingConversation, setIsFetchingConversation] = useState(false)
  const [firstMsgState, setFirstMsgState] = useState<{ ready: boolean, value: string }>({ ready: false, value: "" });

  const inputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const settingsRef = useRef<HTMLDivElement>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<any>(null)

  const [showShareModal, setShowShareModal] = useState(false)
  const [shareNoteId, setShareNoteId] = useState<string | null>(null)
  const [shareLink, setShareLink] = useState("")
  const [showNoteModal, setShowNoteModal] = useState(false)
  const [noteModalMessage, setNoteModalMessage] = useState<Message | null>(null)
  const [noteTitleInput, setNoteTitleInput] = useState("")

  //Context for conversations
  const { conversations, setConversations } = useConversations()

  const listHeight = window.innerHeight * 0.7; // Example
  const itemHeights = useRef(new Map());
  // Add at the top of your component
  const sizeMap = useRef<{ [key: number]: number }>({});


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
    if (!id || id === "new") return
    const fetchInitialNotes = async () => {
      const notesData = await fetchNotes(id)
      if (notesData && isMounted) {
        setNotes(
          notesData.map((n: any) => ({
            id: n.note_id.toString(),
            title: n.title,
            content: n.response_context,
          }))
        )
      }
    }
    fetchInitialNotes()
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
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  useEffect(() => {
    if (id !== "new") {
      const firstMsg = searchParams.get("firstMsg");
      const title = searchParams.get("title");
      if (firstMsg) {
        setFirstMsgState({ ready: true, value: firstMsg });
        setInputValue(firstMsg); // Set input value to firstMsg
        // Remove firstMsg from URL after sending
        const url = new URL(window.location.href);
        url.searchParams.delete("firstMsg");
        window.history.replaceState({}, document.title, url.pathname);
      }
      if (title) {
        setDeviceName(title)
        const url = new URL(window.location.href);
        url.searchParams.delete("title");
        window.history.replaceState({}, document.title, url.pathname);
      }
    }
  }, [id, searchParams]);

  useEffect(() => {

    if (firstMsgState.ready && firstMsgState.value.trim()) {
      handleSendMessage() // Send first message silently
      setFirstMsgState({ ready: false, value: "" });
    }
  }, [firstMsgState])

  //memo
  //memo
  const NoteModal = React.memo(function NoteModal({
    open,
    message,
    value,
    onChange,
    onCancel,
    onSave,
  }: {
    open: boolean
    message: Message | null
    value: string
    onChange: (v: string) => void
    onCancel: () => void
    onSave: () => void
  }) {
    if (!open || !message) return null
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
          <h2 className="text-lg font-medium mb-4 text-[#2e3139]">Save Note</h2>
          <label className="block text-sm font-medium text-gray-700 mb-2">Note Title:</label>
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm mb-4"
            placeholder="Enter note title"
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onSave}
              className="px-4 py-2 bg-[#2d336b] text-white rounded-md hover:bg-[#1e2347] transition-colors"
              disabled={!value.trim()}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    )
  })

  // Memoize the components object if it's always the same
  const memoizedMarkdownComponents = React.useMemo(() => ({
    li: ({ node, ...props }: any) => (
      <li style={{ overflowWrap: 'anywhere', wordBreak: 'break-word' }} {...props} />
    ),
    code: ({ node, inline, className, children, ...props }: any) => {
      if (inline) {
        return (
          <code style={{ overflowWrap: 'anywhere', wordBreak: 'break-word' }} className={className} {...props}>
            {children}
          </code>
        );
      }
      return (
        <code style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere', wordBreak: 'break-word' }} className={className} {...props}>
          <code>{children}</code>
        </code>
      );
    },
  }), []); // Empty dependency array means it's created once



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
    // If this is a new conversation, create it and redirect
    if (id === "new") {
      try {
        const token = localStorage.getItem("dmc_api_gateway_token") // Adjust if you store token elsewhere
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
        setConversations(prev => [
          {
            id: json.data.conversation_id,
            title: json.data.title || "Untitled",
            deviceName: json.data.device_name || "",
            timestamp: new Date(json.data.conversation_updated_time),
          },
          ...prev,
        ]);
        // Redirect to new conversation page and send the message after navigation
        router.replace(`/admin/features/conversation/chat/${json.data.conversation_id}?firstMsg=${encodeURIComponent(userMessage.content)}&title=${encodeURIComponent(json.data.title)}`)
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
      const aiMessage: Message = {
        id: json.data.pair_id,
        content: json.data.response,
        sender: "ai",
        timestamp: new Date().toISOString(),
        images_ids: json.data.images_ids || [], // <-- Add this line
      }

      setMessages((prev) => [...prev, aiMessage])
    } catch (err: any) {
      toast.error("Failed to get response: " + err.message)
    }
    finally {
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
  const handleSaveNote = async (message: Message, customTitle?: string) => {
    const pairId = Number(message.id.slice(4))
    const title = customTitle || "Untitled Note"
    const ok = await takeNote(pairId, title)
    if (ok && id) {
      const notesData = await fetchNotes(id)
      if (notesData) {
        setNotes(
          notesData.map((n: any) => ({
            id: n.note_id.toString(),
            title: n.title,
            content: n.response_context,
          }))
        )
        toast.success("Note saved and fetched successfully")
      } else {
        toast.error("Failed to fetch notes")
      }
    } else {
      toast.error("Failed to save note")
    }
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

  const itemData = React.useMemo(() => ({
    messages,
    itemHeights,
    listRef,
    // Pass down all necessary functions/props that MessageItem or Row logic needs
    formatTime,
    handleCopyMessage,
    setNoteModalMessage,
    setNoteTitleInput,
    setShowNoteModal,
    memoizedMarkdownComponents,
  }), [messages, setNoteModalMessage, setNoteTitleInput, setShowNoteModal]); // Include dependencies that change


  const Row = ({ index, style, data }: any) => {
    // Destructure data for clarity and direct access to props needed by MessageItem
    const {
      messages,
      itemHeights,
      listRef,
      formatTime,
      handleCopyMessage,
      setNoteModalMessage,
      setNoteTitleInput,
      setShowNoteModal,
      memoizedMarkdownComponents,
    } = data;

    const rowRef = useRef<HTMLDivElement>(null);

    // useLayoutEffect is critical for measuring DOM elements before the browser paints.
    useLayoutEffect(() => {
      if (!rowRef.current) return; // Ensure the ref is attached to the DOM node

      const observer = new ResizeObserver(([entry]) => {
        // contentRect.height gives the height of the content box.
        // If you added padding/border to rowRef, use offsetHeight for total height.
        // For margin, contentRect.height is still usually sufficient if margin is on inner div.
        const newHeight = entry.contentRect.height;
        const oldHeight = itemHeights.current.get(index);

        // Only update if the height has truly changed.
        // Math.round is used to mitigate potential sub-pixel discrepancies.
        if (Math.round(newHeight) !== Math.round(oldHeight)) {
          itemHeights.current.set(index, newHeight);
          // This tells the virtualized list to re-measure and re-position
          // all items from this index onwards.
          listRef.current.resetAfterIndex(index);
        }
      });

      observer.observe(rowRef.current);

      // Clean up the observer when the component unmounts or its dependencies change
      return () => {
        observer.disconnect();
      };
    }, [index, itemHeights, listRef]); // Dependencies are index, itemHeights, and listRef.
    // messages[index] removed because ResizeObserver handles content-driven height changes.

    // Optional: A separate useEffect to ensure initial height is set,
    // especially if the MessageItem content loads asynchronously or causes initial layout shifts
    useEffect(() => {
      if (rowRef.current) {
        const currentHeight = rowRef.current.offsetHeight; // Use offsetHeight for total element height including padding and border
        const storedHeight = itemHeights.current.get(index);

        if (!storedHeight || Math.round(currentHeight) !== Math.round(storedHeight)) {
          itemHeights.current.set(index, currentHeight);
          listRef.current.resetAfterIndex(index);
        }
      }
    }, [index, messages[index], itemHeights, listRef]); // Include messages[index] here to react to content changes that might alter initial height

    return (
      // The 'style' prop from react-window MUST be applied to the outermost element.
      // This div's height will be measured by ResizeObserver.
      <div style={style} ref={rowRef}>
        {/* Apply the margin-bottom to an inner div which wraps the MessageItem.
          The ResizeObserver on `rowRef` will correctly measure the total height
          of this outer div, including the margin of its child. */}
        <div style={{ marginBottom: '50px' }}> {/* Inline style for demo, prefer a CSS class for production */}
          <MessageItem
            message={messages[index]}
            formatTime={formatTime}
            onCopyMessage={handleCopyMessage}
            onSaveNote={(msg) => {
              setNoteModalMessage(msg);
              setNoteTitleInput("");
              setShowNoteModal(true);
            }}
            components={memoizedMarkdownComponents}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-full overflow-auto p-4 gap-4 bg-[#E6D9D9] w-full">
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

            <div className={`flex-1 overflow-y-hidden bg-white max-w-[calc(100% - 16px)]`}>
              <ChatList
                messages={messages}
                formatTime={formatTime}
                onCopyMessage={handleCopyMessage}
                onSaveNote={handleSaveNote}
                markdownComponents={memoizedMarkdownComponents}
              />
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
                            <h3 className="font-bold text-[#2e3139]">
                              {note.title.length > 30
                                ? note.title.slice(0, 30) + "..."
                                : note.title}
                            </h3>
                            <button
                              onClick={() => setDeleteNoteId(deleteNoteId === note.id ? null : note.id)}
                              className="text-gray-500 hover:text-[#4045ef]"
                            >
                              <FileText className="h-4 w-4" />
                            </button>
                          </div>
                          <p className="text-sm mt-1 text-[#2e3139]">
                            {note.content.length > 210
                              ? note.content.slice(0, 210) + "..."
                              : note.content}
                          </p>
                          {/* ...existing code for delete/share actions... */}
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

          {showNoteModal && noteModalMessage && (
            <NoteModal
              open={showNoteModal}
              message={noteModalMessage}
              value={noteTitleInput}
              onChange={setNoteTitleInput}
              onCancel={() => {
                setShowNoteModal(false)
                setNoteModalMessage(null)
              }}
              onSave={async () => {
                if (!noteModalMessage) return
                await handleSaveNote(noteModalMessage, noteTitleInput)
                setShowNoteModal(false)
                setNoteModalMessage(null)
              }}
            />
          )}
        </>
      )}
    </div>
  )
}