"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Menu,
  Upload,
  Plus,
  FileText,
  Settings,
  MoreHorizontal,
  ChevronDown,
  LogOut,
  UserIcon,
  Users,
  Trash2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"

interface Conversation {
  id: string
  title: string
  lastMessage: string
  timestamp: Date
}

type UserRole = "unlogged" | "logged" | "admin" | "super_admin"

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [activeConversationMenu, setActiveConversationMenu] = useState<string | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [conversationToDelete, setConversationToDelete] = useState<string | null>(null)
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: "chat-1685432789000-device-1",
      title: "Lenovo Thinkpad T570",
      lastMessage: "How to get the screen?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    },
    {
      id: "chat-1685346389000-device-4",
      title: "Cannon Camera EOS R5",
      lastMessage: "What's the best lens for portraits?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    },
  ])

  // User role state - you can change this to test different roles
  // In a real app, this would come from authentication context or props
  const [userRole, setUserRole] = useState<UserRole>("admin") // Change this to test different roles

  const pathname = usePathname()
  const router = useRouter()
  const userMenuRef = useRef<HTMLDivElement>(null)
  const conversationMenuRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

  const handleNewConversation = () => {
    router.push("/home/conversation")
  }

  const handleDeleteConversation = (conversationId: string) => {
    setConversationToDelete(conversationId)
    setShowDeleteModal(true)
    setActiveConversationMenu(null)
  }

  const confirmDeleteConversation = () => {
    if (conversationToDelete) {
      setConversations(conversations.filter((conv) => conv.id !== conversationToDelete))
      setShowDeleteModal(false)
      setConversationToDelete(null)

      // If currently viewing the deleted conversation, redirect to conversation page
      if (pathname.includes(`/home/conversation/chat/${conversationToDelete}`)) {
        router.push("/home/conversation")
      }
    }
  }

  const cancelDeleteConversation = () => {
    setShowDeleteModal(false)
    setConversationToDelete(null)
  }

  const toggleConversationMenu = (conversationId: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setActiveConversationMenu(activeConversationMenu === conversationId ? null : conversationId)
  }

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false)
      }

      // Close conversation menu if clicking outside
      if (
        activeConversationMenu &&
        !conversationMenuRefs.current[activeConversationMenu]?.contains(event.target as Node)
      ) {
        setActiveConversationMenu(null)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [activeConversationMenu])

  // Format relative time
  const formatRelativeTime = (date: Date) => {
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return "just now"
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`

    return date.toLocaleDateString()
  }

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu)
  }

  // Function to check if user has access to a specific feature
  const hasAccess = (feature: string): boolean => {
    switch (userRole) {
      case "unlogged":
        return feature === "new_conversation"
      case "logged":
        return ["new_conversation", "conversations"].includes(feature)
      case "admin":
        return ["new_conversation", "conversations", "upload_pdf", "device_management", "track_progress"].includes(
          feature,
        )
      case "super_admin":
        return ["new_conversation", "conversations", "admin_management"].includes(feature)
      default:
        return false
    }
  }

  // Get user display name based on role
  const getUserDisplayName = (): string => {
    switch (userRole) {
      case "unlogged":
        return "Guest"
      case "logged":
        return "User"
      case "admin":
        return "Admin"
      case "super_admin":
        return "Super Admin"
      default:
        return "Guest"
    }
  }

  return (
    <div className="flex h-full overflow-hidden bg-white">
      {/* Sidebar - collapses to icon-only mode */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col bg-[#fff2f2] transition-all duration-300 ease-in-out",
          sidebarOpen ? "w-64" : "w-16",
        )}
      >
        <div className={cn("flex h-16 items-center px-4", sidebarOpen ? "justify-between" : "justify-center")}>
          {sidebarOpen && (
            <Link href="/home" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#4045ef] text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
              </div>
              <span className="text-xl font-bold text-[#2d336b]">DMC</span>
            </Link>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={cn(
              "flex items-center justify-center rounded-[10px] p-2 hover:bg-white/50",
              sidebarOpen ? "" : "mx-auto",
            )}
            aria-label="Toggle sidebar"
          >
            <Menu className="h-5 w-5 text-[#2d336b]" />
          </button>
        </div>

        <div className="flex-1 overflow-auto py-4">
          {/* New Conversation Button - Available to all users */}
          {hasAccess("new_conversation") && (
            <div className={cn("px-4", sidebarOpen ? "" : "flex justify-center")}>
              <button
                onClick={handleNewConversation}
                className={cn(
                  "flex items-center gap-2 rounded-[10px] bg-white shadow-sm cursor-pointer hover:bg-gray-50 transition-colors",
                  sidebarOpen ? "w-full px-4 py-2 text-sm text-[#2d336b]" : "h-10 w-10 justify-center",
                  pathname.includes("/home/conversation") ? "ring-2 ring-[#4045ef]/20" : "",
                )}
              >
                <Plus className="h-4 w-4" />
                {sidebarOpen && <span>New conversation</span>}
              </button>
            </div>
          )}

          {/* Navigation Menu */}
          <nav className={cn("mt-6", sidebarOpen ? "px-2" : "flex flex-col items-center px-0")}>
            {/* Upload PDF - Admin only */}
            {hasAccess("upload_pdf") && (
              <Link
                href="/home/import"
                className={cn(
                  "flex items-center gap-3 rounded-[10px] hover:bg-white/50 relative",
                  sidebarOpen ? "px-3 py-2 text-[#2d336b]" : "h-10 w-10 justify-center my-2",
                  pathname.includes("/home/import")
                    ? "bg-white/50 before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-black"
                    : "",
                )}
              >
                <Upload className="h-5 w-5 text-[#2d336b]" />
                {sidebarOpen && <span>Upload PDF</span>}
              </Link>
            )}

            {/* Device Management - Admin only */}
            {hasAccess("device_management") && (
              <Link
                href="/home/device-management"
                className={cn(
                  "flex items-center gap-3 rounded-[10px] hover:bg-white/50 relative",
                  sidebarOpen ? "px-3 py-2 text-[#2d336b]" : "h-10 w-10 justify-center my-2",
                  pathname.includes("/home/device-management")
                    ? "bg-white/50 before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-black"
                    : "",
                )}
              >
                <Settings className="h-5 w-5 text-[#2d336b]" />
                {sidebarOpen && <span>Device Management</span>}
              </Link>
            )}

            {/* Track Progress - Admin only */}
            {hasAccess("track_progress") && (
              <Link
                href="/home/track-progress/tracking"
                className={cn(
                  "flex items-center gap-3 rounded-[10px] hover:bg-white/50 relative",
                  sidebarOpen ? "px-3 py-2 text-[#2d336b]" : "h-10 w-10 justify-center my-2",
                  pathname.includes("/home/track-progress")
                    ? "bg-white/50 before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-black"
                    : "",
                )}
              >
                <FileText className="h-5 w-5 text-[#2d336b]" />
                {sidebarOpen && <span>Track Progress</span>}
              </Link>
            )}

            {/* Admin Management - Super Admin only */}
            {hasAccess("admin_management") && (
              <Link
                href="/home/admin-management"
                className={cn(
                  "flex items-center gap-3 rounded-[10px] hover:bg-white/50 relative",
                  sidebarOpen ? "px-3 py-2 text-[#2d336b]" : "h-10 w-10 justify-center my-2",
                  pathname.includes("/home/admin-management")
                    ? "bg-white/50 before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-black"
                    : "",
                )}
              >
                <Users className="h-5 w-5 text-[#2d336b]" />
                {sidebarOpen && <span>Admin Management</span>}
              </Link>
            )}
          </nav>

          {/* Conversation history - Available to logged users, admin, and super admin */}
          {hasAccess("conversations") && sidebarOpen && (
            <div className="mt-8 px-2">
              <h3 className="px-3 text-xs font-semibold uppercase text-[#2d336b] mb-2">Your conversations</h3>
              <div className="space-y-1">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={cn(
                      "flex items-center justify-between rounded-[10px] px-3 py-2 hover:bg-white/50 relative",
                      pathname.includes(`/home/conversation/chat/${conversation.id}`) ? "bg-white/50" : "",
                    )}
                  >
                    <Link href={`/home/conversation/chat/${conversation.id}`} className="flex-1 min-w-0">
                      <div className="flex items-center">
                        <span className="font-medium text-sm truncate text-[#2d336b]">{conversation.title}</span>
                      </div>
                      <div className="flex items-center text-xs text-[#2d336b] mt-1">
                        <span className="truncate">{conversation.lastMessage}</span>
                      </div>
                    </Link>
                    <div className="flex items-center">
                      <span className="text-xs text-[#2d336b] ml-2">{formatRelativeTime(conversation.timestamp)}</span>
                      <div className="relative">
                        <button
                          className="ml-1 text-[#2d336b] hover:text-[#4045ef] p-1"
                          onClick={(e) => toggleConversationMenu(conversation.id, e)}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </button>

                        {activeConversationMenu === conversation.id && (
                          <div
                            ref={(el) => (conversationMenuRefs.current[conversation.id] = el)}
                            className="absolute right-0 top-full mt-1 w-48 rounded-[10px] shadow-lg bg-white border border-gray-200 z-50"
                          >
                            <div className="py-1">
                              <button
                                onClick={() => handleDeleteConversation(conversation.id)}
                                className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                              >
                                <Trash2 className="h-4 w-4" />
                                <span>Delete conversation</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Role Switcher (for testing - remove in production) */}
        {sidebarOpen && (
          <div className="px-4 py-2 border-t border-white/20">
            <div className="text-xs text-[#2d336b] mb-2">Current Role: {getUserDisplayName()}</div>
            <div className="text-xs text-[#2d336b] mb-1 opacity-75">Switching roles redirects to conversation</div>
            <select
              value={userRole}
              onChange={(e) => {
                setUserRole(e.target.value as UserRole)
                router.push("/home/conversation")
              }}
              className="w-full text-xs p-1 rounded border border-gray-300"
            >
              <option value="unlogged">Unlogged User</option>
              <option value="logged">Logged User</option>
              <option value="admin">Admin</option>
              <option value="super_admin">Super Admin</option>
            </select>
          </div>
        )}
      </div>

      {/* Main content area with top bar */}
      <div
        className={cn(
          "flex flex-1 flex-col transition-all duration-300 ease-in-out h-full",
          sidebarOpen ? "ml-64" : "ml-16",
        )}
      >
        {/* Top horizontal bar */}
        <div className="h-16 bg-white flex justify-end items-center px-4 sticky top-0 z-40">
          {userRole === "unlogged" ? (
            /* Unlogged user - show login and register */
            <div className="flex items-center gap-4">
              <Link href="/log-in" className="text-[#4045ef] hover:text-[#2d336b] transition-colors">
                Log in
              </Link>
              <Link href="/sign-up" className="text-[#4045ef] hover:text-[#2d336b] transition-colors">
                Register
              </Link>
            </div>
          ) : (
            /* Logged users - show user menu */
            <div className="flex items-center gap-4 relative" ref={userMenuRef}>
              <button onClick={toggleUserMenu} className="flex items-center gap-2 text-[#2d336b] hover:underline">
                <span>{getUserDisplayName()}</span>
                <ChevronDown className="h-4 w-4" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 top-full mt-1 w-48 rounded-[10px] shadow-lg bg-white border border-gray-200 z-50">
                  <div className="py-1">
                    <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                      <UserIcon className="h-4 w-4" />
                      <span>Profile</span>
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                      <Settings className="h-4 w-4" />
                      <span>Account Settings</span>
                    </button>
                    <div className="border-t border-gray-200 my-1"></div>
                    <button className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left">
                      <LogOut className="h-4 w-4" />
                      <span>Sign out</span>
                    </button>
                  </div>
                </div>
              )}

              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5 text-gray-700"
                >
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
            </div>
          )}
        </div>

        {/* Main content */}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-medium mb-4 text-[#2e3139]">Delete Conversation</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this conversation? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={cancelDeleteConversation}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteConversation}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
