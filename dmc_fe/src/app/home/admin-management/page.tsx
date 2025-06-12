"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Search, MoreVertical, Pen, Trash2, Plus } from "lucide-react"
import { Input } from "@/components/form/input"
import { Button } from "@/components/ui/button"
import { toast, ToastContainer } from "react-toastify"

interface User {
  id: string
  staffName: string
  username: string
  password: string
}

export default function AdminManagementPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [users, setUsers] = useState<User[]>([
    { id: "1", staffName: "Ogoter", username: "Ogot12er", password: "mypassword1" }, // Giả sử mật khẩu thật
    { id: "2", staffName: "O'sulotus", username: "Ogot12er", password: "mypassword2" },
    { id: "3", staffName: "Hartswimmer", username: "Ogot12er.pdf", password: "mypassword3" },
    { id: "4", staffName: "Herbert", username: "Ogot12er", password: "mypassword4" },
    { id: "5", staffName: "Shawn", username: "Ogot12er", password: "mypassword5" },
    { id: "6", staffName: "Leah", username: "Ogot12er", password: "mypassword6" },
  ])
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [editFormData, setEditFormData] = useState({
    staffName: "",
    username: "",
    password: "",
  })
  const [addFormData, setAddFormData] = useState({
    staffName: "",
    username: "",
    password: "",
  })

  const menuRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

  // Update filteredUsers and show toast if no results
  const filteredUsers = users.filter((user) => {
    if (searchQuery) {
      return (
        user.staffName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.username.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    return true
  })

  useEffect(() => {
    if (searchQuery && filteredUsers.length === 0) {
      toast.info("No users found matching your search")
    }
  }, [searchQuery, filteredUsers])

  const toggleMenu = (userId: string) => {
    setActiveMenu(activeMenu === userId ? null : userId)
  }

  const handleEditUser = (userId: string) => {
    const user = users.find((u) => u.id === userId)
    if (user) {
      setSelectedUser(user)
      setEditFormData({
        staffName: user.staffName,
        username: user.username,
        password: user.password,
      })
      setShowEditModal(true)
    }
    setActiveMenu(null)
  }

  const handleDeleteUser = (userId: string) => {
    const user = users.find((u) => u.id === userId)
    if (user) {
      setSelectedUser(user)
      setShowDeleteModal(true)
    }
    setActiveMenu(null)
  }

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEditFormData({
      ...editFormData,
      [name]: value,
    })
  }

  const handleAddFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setAddFormData({
      ...addFormData,
      [name]: value,
    })
  }

  const handleEditFormSubmit = () => {
    if (
      !editFormData.staffName.trim() ||
      !editFormData.username.trim() ||
      !editFormData.password.trim()
    ) {
      toast.error("All fields are required")
      return
    }
    if (selectedUser) {
      setUsers(
        users.map((user) =>
          user.id === selectedUser.id
            ? {
                ...user,
                staffName: editFormData.staffName,
                username: editFormData.username,
                password: editFormData.password,
              }
            : user,
        ),
      )
      toast.success("User updated successfully")
      setShowEditModal(false)
      setSelectedUser(null)
    }
  }

  const handleAddFormSubmit = () => {
    if (
      !addFormData.staffName.trim() ||
      !addFormData.username.trim() ||
      !addFormData.password.trim()
    ) {
      toast.error("All fields are required")
      return
    }
    const newUser: User = {
      id: Date.now().toString(),
      staffName: addFormData.staffName,
      username: addFormData.username,
      password: addFormData.password,
    }
    setUsers([...users, newUser])
    toast.success("New admin added successfully")
    setShowAddModal(false)
    setAddFormData({ staffName: "", username: "", password: "" })
  }

  const handleConfirmDelete = () => {
    if (selectedUser) {
      setUsers(users.filter((user) => user.id !== selectedUser.id))
      toast.success("User deleted successfully")
      setShowDeleteModal(false)
      setSelectedUser(null)
    }
  }

  const handleClickOutside = (event: React.MouseEvent) => {
    if (activeMenu && !menuRefs.current[activeMenu]?.contains(event.target as Node)) {
      setActiveMenu(null)
      toast.info("Menu closed")
    }
  }

  const handleCancelEdit = () => {
    setShowEditModal(false)
    setSelectedUser(null)
    toast.info("Edit cancelled")
  }

  const handleCancelAdd = () => {
    setShowAddModal(false)
    setAddFormData({ staffName: "", username: "", password: "" })
    toast.info("Add new admin cancelled")
  }

  const handleCancelDelete = () => {
    setShowDeleteModal(false)
    setSelectedUser(null)
    toast.info("Delete cancelled")
  }

  return (
    <div className="bg-white rounded-[10px] shadow-sm p-6 h-full overflow-auto" onClick={handleClickOutside}>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#2e3139]">Admin Management</h1>
        <div className="flex items-center gap-4">
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search"
              className="pl-9 pr-4 py-2 rounded-[10px] border-gray-200 bg-[#f5f6fa]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button
            onClick={() => setShowAddModal(true)}
            className="bg-[#4045ef] hover:bg-[#3035df] text-white px-4 py-2 rounded-[10px] flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add New Admin
          </Button>
        </div>
      </div>

      {/* Users Table */}
      <div className="border border-gray-200 rounded-[10px] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-medium text-[#2e3139]">Staff Name</th>
              <th className="text-left py-3 px-4 font-medium text-[#2e3139]">Username</th>
              <th className="text-left py-3 px-4 font-medium text-[#2e3139]">Password</th>
              <th className="w-10"></th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className="border-b border-gray-200 last:border-b-0 hover:bg-gray-50">
                <td className="py-4 px-4 text-[#2e3139]">{user.staffName}</td>
                <td className="py-4 px-4 text-[#2e3139]">{user.username}</td>
                <td className="py-4 px-4 text-[#2e3139]">********</td> {/* Thay đổi tại đây */}
                <td className="py-4 px-4 relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleMenu(user.id)
                    }}
                    className="text-gray-500 hover:text-[#4045ef]"
                  >
                    <MoreVertical className="h-5 w-5" />
                  </button>

                  {activeMenu === user.id && (
                    <div
                      ref={(el) => { menuRefs.current[user.id] = el }}
                      className="absolute right-10 z-10 bg-white border border-gray-200 rounded-[10px] shadow-lg py-1 w-40"
                      style={{
                        top: users.indexOf(user) >= users.length - 2 ? "auto" : "100%",
                        bottom: users.indexOf(user) >= users.length - 2 ? "100%" : "auto",
                      }}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleEditUser(user.id)
                        }}
                        className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-[#2e3139] hover:bg-gray-100"
                      >
                        <Pen className="h-4 w-4 text-[#4045ef]" />
                        <span>Edit this user</span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteUser(user.id)
                        }}
                        className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>Delete this user</span>
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit User Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-[#2e3139]">Edit user</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="staffName" className="block text-sm font-medium text-[#2e3139] mb-1">
                  Staff Name
                </label>
                <input
                  type="text"
                  id="staffName"
                  name="staffName"
                  value={editFormData.staffName}
                  onChange={handleEditFormChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-[#2e3139] mb-1">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={editFormData.username}
                  onChange={handleEditFormChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-[#2e3139] mb-1">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={editFormData.password}
                  onChange={handleEditFormChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
            <div className="flex justify-between mt-6">
              <Button
                onClick={handleCancelEdit}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
              >
                Cancel
              </Button>
              <Button
                onClick={handleEditFormSubmit}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
              >
                Confirm
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-[#2e3139]">Add new admin</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="addStaffName" className="block text-sm font-medium text-[#2e3139] mb-1">
                  Staff Name
                </label>
                <input
                  type="text"
                  id="addStaffName"
                  name="staffName"
                  value={addFormData.staffName}
                  onChange={handleAddFormChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label htmlFor="addUsername" className="block text-sm font-medium text-[#2e3139] mb-1">
                  Username
                </label>
                <input
                  type="text"
                  id="addUsername"
                  name="username"
                  value={addFormData.username}
                  onChange={handleAddFormChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label htmlFor="addPassword" className="block text-sm font-medium text-[#2e3139] mb-1">
                  Password
                </label>
                <input
                  type="password"
                  id="addPassword"
                  name="password"
                  value={addFormData.password}
                  onChange={handleAddFormChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
            <div className="flex justify-between mt-6">
              <Button
                onClick={handleCancelAdd}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddFormSubmit}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
              >
                Add
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete User Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-medium mb-4 text-[#2e3139]">Are you sure you want to delete this user?</h2>
            <div className="flex justify-between">
              <Button
                onClick={handleCancelDelete}
                className="bg-[#6c63ff] hover:bg-[#5a52e0] text-white px-4 py-2 rounded-md"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmDelete}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}