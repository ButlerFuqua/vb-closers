"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { AuthForm } from "@/components/auth-form"
import { ParticleBackground } from "@/components/particle-background"
import { useAuth } from "@/hooks/use-auth"
import Image from "next/image"

export default function LoginPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    )
  }

  // Don't render login form if user is authenticated
  if (user) {
    return null
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      {/* Particle Background */}
      <ParticleBackground />

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-6">
            <div className="inline-block mb-4">
              <Image
                src="/vb-closers-logo.png"
                alt="VB Closers Logo"
                width={200}
                height={200}
                className="mx-auto"
                priority
              />
            </div>

            {/* Graffiti-style Title */}
            <h1 className="text-4xl md:text-5xl font-bold mb-2 relative">
              <span className="bg-gradient-to-r from-red-500 via-white to-blue-500 bg-clip-text text-transparent drop-shadow-2xl font-black tracking-wider transform -skew-x-12 inline-block">
                VB CLOSERS
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-gray-300 to-blue-600 bg-clip-text text-transparent opacity-30 blur-sm font-black tracking-wider transform -skew-x-12">
                VB CLOSERS
              </div>
            </h1>
          </div>

          {/* Auth Form */}
          <AuthForm />
        </div>
      </div>
    </div>
  )
}
