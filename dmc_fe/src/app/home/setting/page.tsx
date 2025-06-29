"use client"

import { useState } from "react"
import Link from "next/link"
import { Trash2, Download, UserIcon, MessageSquare } from "lucide-react"

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    autoSaveChats: true,
    dataSharing: false,
  })

  const handleToggle = (key: keyof typeof settings) => {
    setSettings({ ...settings, [key]: !settings[key] })
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    // Implement save logic (e.g., API call) here
    console.log("Settings updated:", settings)
  }

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-[#2d336b] mb-6">Settings</h1>
        <form onSubmit={handleSave} className="bg-white rounded-[10px] shadow-sm p-6 border border-gray-200 space-y-6">
          {/* Data Management */}
          <div>
            <h2 className="text-lg font-medium text-[#2d336b] mb-4">Data Management</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-[#2d336b]">
                  <MessageSquare className="h-5 w-5" />
                  Data Sharing for AI Improvement
                </label>
                <input
                  type="checkbox"
                  checked={settings.dataSharing}
                  onChange={() => handleToggle("dataSharing")}
                  className="h-4 w-4"
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-[#2d336b]">
                  <MessageSquare className="h-5 w-5" />
                  Auto-save Chats
                </label>
                <input
                  type="checkbox"
                  checked={settings.autoSaveChats}
                  onChange={() => handleToggle("autoSaveChats")}
                  className="h-4 w-4"
                />
              </div>
              <button
                type="button"
                className="flex items-center gap-2 rounded-[10px] bg-red-600 text-white px-4 py-2 hover:bg-red-700 transition-colors"
              >
                <Trash2 className="h-5 w-5" />
                Delete All Chats
              </button>
              <button
                type="button"
                className="flex items-center gap-2 rounded-[10px] bg-[#4045ef] text-white px-4 py-2 hover:bg-[#2d336b] transition-colors"
              >
                <Download className="h-5 w-5" />
                Export Chat History
              </button>
            </div>
          </div>

          {/* Account Management */}
          <div>
            <h2 className="text-lg font-medium text-[#2d336b] mb-4">Account Management</h2>
            <div className="space-y-4">
              <Link
                href="/home/profile"
                className="flex items-center gap-2 rounded-[10px] bg-[#4045ef] text-white px-4 py-2 hover:bg-[#2d336b] transition-colors"
              >
                <UserIcon className="h-5 w-5" />
                Edit Profile
              </Link>
              <button
                type="button"
                className="flex items-center gap-2 rounded-[10px] bg-red-600 text-white px-4 py-2 hover:bg-red-700 transition-colors"
              >
                <Trash2 className="h-5 w-5" />
                Delete Account
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="rounded-[10px] bg-[#4045ef] text-white px-4 py-2 hover:bg-[#2d336b] transition-colors"
          >
            Save Settings
          </button>
        </form>
      </div>
    </div>
  )
}