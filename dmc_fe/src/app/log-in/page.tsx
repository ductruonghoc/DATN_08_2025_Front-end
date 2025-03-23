import Link from "next/link"
import Image from "next/image"
import { Mail, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function LogInPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="container mx-auto p-4 flex justify-between items-center">
      <div className="flex items-center">
      <Image src="/logo.svg" alt="Logo" width={40} height={40} className="mr-2" />
        <div className="text-2xl font-bold">DMC</div>
      </div>
        <Link href="/sign-up" className="text-[#2e3470] font-medium hover:underline">
          Sign up
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-semibold">Welcome Back</h1>
            <p className="text-muted-foreground mt-2">Enter your email and password to log in</p>
          </div>

          <form className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                </div>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="domat@example.com"
                  className="pl-10 rounded-full border-2 border-[#a9b5df] focus:border-[#4045ef] w-full placeholder:text-gray-300 py-[22px]"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-muted-foreground" />
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  className="pl-10 rounded-full border-2 border-[#a9b5df] focus:border-[#4045ef] w-full placeholder:text-gray-300 py-[22px] "
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full bg-[#2e3470] text-white hover:bg-[#232759] rounded-full py-[22px]" >
              Log in
            </Button>
          </form>


          <div className="text-center ">
            <div className="flex justify-between text-sm">
              <div>
                <span>Don't have an account? </span>
                <Link href="/sign-up" className="text-[#2e3470] font-medium hover:underline">
                  Sign up
                </Link>
              </div>
              
              <Link href="/forgot-password" className="text-[#2e3470] font-medium hover:underline">
                Forgot password?
              </Link>
            </div>

            <div className="mt-4 flex items-center justify-center">
              <div className="border-t border-gray-300 flex-grow mr-3"></div>
              <span className="text-sm text-muted-foreground">OR</span>
              <div className="border-t border-gray-300 flex-grow ml-3"></div>
            </div>

            <Button
              variant="outline"
              className="mt-4 w-full flex items-center justify-center gap-2 border border-[#a9b5df] focus:border-[#4045ef] rounded-full py-[22px] "
            >
              <Image src="/google-icon.svg" alt="Google" width={20} height={20} />
              Continue with Google
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}

