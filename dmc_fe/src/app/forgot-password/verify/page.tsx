"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Mail } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { verifyOTP } from "../actions"

export default function OTPVerificationPage() {
  const router = useRouter()
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""))
  const [activeInput, setActiveInput] = useState(0)
  const [timeLeft, setTimeLeft] = useState(59)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [email, setEmail] = useState("")
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    // Get email from sessionStorage
    const storedEmail = sessionStorage.getItem("resetEmail")
    if (storedEmail) {
      setEmail(storedEmail)
    }

    // Focus on first input on page load
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }
  }, [])

  useEffect(() => {
    const timer =
      timeLeft > 0 &&
      setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    return () => {
      if (timer) clearInterval(timer)
    }
  }, [timeLeft])

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return // Prevent pasting multiple characters

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Move to next input if value is entered
    if (value && index < 5) {
      setActiveInput(index + 1)
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Move to previous input on backspace if current input is empty
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      setActiveInput(index - 1)
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const otpString = otp.join("")

      if (otpString.length !== 6) {
        setError("Please enter all 6 digits")
        setIsLoading(false)
        return
      }

      const formData = new FormData()
      formData.append("otp", otpString)

      const result = await verifyOTP(formData)

      if (result.success) {
        router.push("/forgot-password/reset-password")
      } else {
        setError(result.message || "Failed to verify OTP")
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = () => {
    setTimeLeft(59)
    // Handle resend logic here
    console.log("Resending OTP to:", email)
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="flex items-center justify-between p-4 md:p-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="text-[#2e3139] text-xl font-semibold">QueryPDF</div>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-[#4045ef] hover:text-[#2d336b] transition-colors">
            Log in
          </Link>
          <Link href="/sign-in" className="text-[#4045ef] hover:text-[#2d336b] transition-colors">
            Sign-in
          </Link>
        </div>
      </header>

      <main className="flex flex-col items-center justify-center px-4 mt-20">
        <div className="w-full max-w-md space-y-6">
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#f1f6ff] mb-6">
              <Mail className="w-6 h-6 text-[#4045ef]" />
            </div>
            <h1 className="text-2xl font-semibold text-[#2e3139] mb-2">OTP Verification</h1>
            <p className="text-[#425583] mb-8">Check your email to see the verification code</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center gap-2">
              {Array(6)
                .fill(null)
                .map((_, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    required={true}
                    value={otp[index]}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className={`w-12 h-12 text-center text-lg font-semibold border rounded-full
                    ${index === activeInput ? "border-[#4045ef] ring-2 ring-[#4045ef]/20" : "border-[#a9b5df]"}
                    focus:outline-none focus:border-[#4045ef] focus:ring-2 focus:ring-[#4045ef]/20`}
                  />
                ))}
            </div>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <Button
              type="submit"
              className="w-full bg-[#2D336B] hover:bg-[#2d336b]/90 text-white rounded-full py-6"
              disabled={isLoading}
            >
              {isLoading ? "Verifying..." : "Verify"}
            </Button>
          </form>

          <div className="text-center">
            <button
              onClick={handleResend}
              disabled={timeLeft > 0 || isLoading}
              className="text-[#4045ef] hover:text-[#2d336b] disabled:text-gray-400"
            >
              Resend code in {String(Math.floor(timeLeft / 60)).padStart(2, "0")}:
              {String(timeLeft % 60).padStart(2, "0")}
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

