import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Lock } from "lucide-react"
import Link from "next/link"

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="flex items-center justify-between p-4 md:p-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="text-[#2e3139] text-2xl font-semibold">DMC</div>
        </Link>
        <Link href="/log-in" className="text-[#4045ef] hover:text-[#2d336b] transition-colors">
          Log in
        </Link>
      </header>

      <main className="flex flex-col items-center justify-center px-4 mt-20">
        <div className="w-full max-w-md space-y-6">
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#f1f6ff] mb-6">
              <Lock className="w-6 h-6 text-[#4045ef]" />
            </div>
            <h1 className="text-2xl font-semibold text-[#2e3139] mb-2">Forgot Password?</h1>
            <p className="text-[#425583] mb-8">Enter your email to reset your password</p>
          </div>

          <form className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm text-[#2e3139]">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="domat@example.com"
                className="w-full rounded-lg border border-[#a9b5df] px-4 py-2 focus:border-[#4045ef] focus:ring-2 focus:ring-[#4045ef]/20 text-black placeholder:text-gray-400"
                style={{ borderRadius: '9999px' }} 
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-[#2D336B] hover:bg-[#2d336b] text-white rounded-lg py-6"
              style={{ borderRadius: '9999px' }} 
            >
              Submit
            </Button>
          </form>
        </div>
      </main>
    </div>
  )
}
