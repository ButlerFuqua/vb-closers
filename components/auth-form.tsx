"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { Loader2, Eye, EyeOff } from "lucide-react"

type AuthMode = "login" | "register"

export function AuthForm() {
  const [mode, setMode] = useState<AuthMode>("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    try {
      if (mode === "register") {
        if (password !== confirmPassword) {
          setMessage("Passwords don't match")
          return
        }

        console.log("Attempting to register user...")
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        })

        if (error) {
          console.error("Registration error:", error)
          throw error
        }

        console.log("Registration successful, attempting auto-login...")
        const { data: loginData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (signInError) {
          console.error("Auto-login error:", signInError)
          throw signInError
        }

        console.log("Auto-login successful, redirecting...")
        window.location.href = "/dashboard"
      } else if (mode === "login") {
        console.log("Attempting to login user...")
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) {
          console.error("Login error:", error)
          throw error
        }

        console.log("Login successful, checking session...")
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session) {
          console.log("Session confirmed, redirecting to dashboard...")
          window.location.href = "/dashboard"
        } else {
          console.error("No session found after login")
          setMessage("Login failed - no session created")
        }
      }
    } catch (error: any) {
      console.error("Auth error:", error)
      setMessage(error.message)
    } finally {
      setLoading(false)
    }
  }

  const getTitle = () => {
    switch (mode) {
      case "register":
        return "Create Account"
      default:
        return "Welcome Back"
    }
  }

  const getDescription = () => {
    switch (mode) {
      case "register":
        return "Join VB Closers and start tracking your sales"
      default:
        return "Sign in to your VB Closers account"
    }
  }

  return (
    <div className="text-white">
      <div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="sr-only">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-white/10 border-0 border-l-2 border-b-2 border-l-white/80 border-b-white/80 dark:border-l-white/80 dark:border-b-white/80 text-white placeholder:text-white/60 focus:border-red-400 rounded-full"
              placeholder="Enter your email"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="sr-only">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-white/10 border-0 border-l-2 border-b-2 border-l-white/80 border-b-white/80 dark:border-l-white/80 dark:border-b-white/80 text-white placeholder:text-white/60 focus:border-red-400 pr-10 rounded-full"
                placeholder="Enter your password"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 text-white/60 hover:text-white hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {mode === "register" && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="sr-only">
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="bg-white/10 border-0 border-l-2 border-b-2 border-l-white/80 border-b-white/80 dark:border-l-white/80 dark:border-b-white/80 text-white placeholder:text-white/60 focus:border-red-400 rounded-full"
                placeholder="Confirm your password"
              />
            </div>
          )}

          {message && (
            <div className="bg-red-500/20 text-red-300 border border-red-500/30 text-sm p-3 rounded-full">
              {message}
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-full"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {mode === "register" ? "Create Account" : "Sign In"}
          </Button>

          <div className="text-center space-y-2">
            {mode === "login" && (
              <div className="text-white/60">
                Don't have an account?{" "}
                <Button
                  type="button"
                  variant="link"
                  className="text-blue-300 hover:text-blue-200 p-0 h-auto"
                  onClick={() => setMode("register")}
                >
                  Sign up
                </Button>
              </div>
            )}

            {mode === "register" && (
              <div className="text-white/60">
                Already have an account?{" "}
                <Button
                  type="button"
                  variant="link"
                  className="text-blue-300 hover:text-blue-200 p-0 h-auto"
                  onClick={() => setMode("login")}
                >
                  Sign in
                </Button>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
