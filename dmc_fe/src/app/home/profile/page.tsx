"use client"

import { useState, useRef } from "react"
import { Upload, UserIcon, Bell } from "lucide-react"

export default function ProfilePage() {
  const [user, setUser] = useState({
    avatar: "/default-avatar.png",
    displayName: "John Doe",
    notifications: true,
  })
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setUser({ ...user, avatar: url })
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setUser({ ...user, [name]: value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Implement save logic (e.g., API call) here
    console.log("Profile updated:", user)
  }

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-[#2d336b] mb-6">User Profile</h1>
        <form onSubmit={handleSubmit} className="bg-white rounded-[10px] shadow-sm p-6 border border-gray-200 space-y-6">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <img src={user.avatar} alt="Avatar" className="h-16 w-16 rounded-full object-cover" />
            <div>
              <label className="flex items-center gap-2 text-sm text-[#2d336b] cursor-pointer">
                <Upload className="h-5 w-5" />
                Change Avatar
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleAvatarUpload}
                />
              </label>
            </div>
          </div>

          {/* Display Name */}
          <div>
            <label className="flex items-center gap-2 text-sm text-[#2d336b] mb-1">
              <UserIcon className="h-5 w-5" />
              Display Name
            </label>
            <input
              type="text"
              name="displayName"
              value={user.displayName}
              onChange={handleInputChange}
              className="w-full rounded-[10px] border border-gray-300 p-2 text-sm"
            />
          </div>

          {/* Notification Sound */}
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 text-sm text-[#2d336b]">
              <Bell className="h-5 w-5" />
              Notification Sound
            </label>
            <input
              type="checkbox"
              name="notifications"
              checked={user.notifications}
              onChange={() => setUser({ ...user, notifications: !user.notifications })}
              className="h-4 w-4"
            />
          </div>

          <button
            type="submit"
            className="rounded-[10px] bg-[#4045ef] text-white px-4 py-2 hover:bg-[#2d336b] transition-colors"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  )
}
