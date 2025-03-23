"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Mail } from "lucide-react"
import Link from "next/link"

export default function OTPVerificationPage() {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""))
  const [activeInput, setActiveInput] = useState(0)
  const [timeLeft, setTimeLeft] = useState(59)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const router = useRouter() 

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
    if (value.length > 1) return 

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    if (value && index < 5) {
      setActiveInput(index + 1)
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      setActiveInput(index - 1)
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Verifying OTP:", otp.join(""))

    router.push("/reset-success")
  }

  const handleResend = () => {
    setTimeLeft(59)
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="flex items-center justify-between p-4 md:p-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="text-[#2e3139] text-xl font-semibold">DMC</div>
        </Link>
        <Link href="/log-in" className="text-[#4045ef] hover:text-[#2d336b] transition-colors">
          Log in
        </Link>
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
                    value={otp[index]}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className={`w-12 h-12 text-center text-lg font-semibold border rounded-full text-black
                    ${index === activeInput ? "border-[#4045ef] ring-2 ring-[#4045ef]/20" : "border-[#a9b5df]"}
                    focus:outline-none focus:border-[#4045ef] focus:ring-2 focus:ring-[#4045ef]/20`}
                  />
                ))}
            </div>

            <Button type="submit" className="w-full bg-[#2D336B] hover:bg-[#2d336b]/90 text-white rounded-full py-6">
              Verify
            </Button>
          </form>

          <div className="text-center">
            <button
              onClick={handleResend}
              disabled={timeLeft > 0}
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
