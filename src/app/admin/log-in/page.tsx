"use client";
import { User, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/form/input";
import { useState } from "react";
import BASEURL from "../../api/backend/dmc_api_gateway/baseurl"; // Adjust the import path as necessary

export default function SignInPage() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await fetch(`${BASEURL}/auth/admin_login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Store the token in local storage
        localStorage.setItem("dmc_api_gateway_token", result.data.token);
        alert("Login successful!");
      } else {
        alert(result.message || "Login failed!");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div
      className="min-h-screen bg-black text-white flex flex-col"
      style={{
        backgroundImage: "url('/admin.gif')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}>
      {/* Blur and opacity overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm"></div>
      <div className="relative z-10 flex flex-col min-h-screen">
        <header className="container mx-auto p-4 flex justify-between items-center">
          <div className="text-2xl font-bold">DMC</div>
        </header>

        <main className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-md space-y-8">
            <div className="text-center">
              <h1 className="text-3xl font-semibold">Welcome Back</h1>
              <p className="mt-2">Hi admin, let login with your account</p>
            </div>

            <form className="space-y-6 text-black">
              <div className="space-y-2">
                <label htmlFor="username" className="block text-sm font-medium">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <Input
                    id="username"
                    name="username"
                    placeholder="example"
                    onChange={(e) => setUsername(e.target.value)}
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
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 rounded-full border-2 border-[#a9b5df] focus:border-[#4045ef] w-full placeholder:text-gray-300 py-[22px] "
                    required     
                  />
                </div>
              </div>

              <Button
                onClick={handleLogin}        
                className="w-full bg-[#2e3470] text-white hover:bg-[#232759] rounded-full py-[22px]">
                Log in
              </Button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
