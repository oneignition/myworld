"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Home, Menu, X } from "lucide-react"

interface MobileLayoutProps {
  children: React.ReactNode
  title?: string
  showBackButton?: boolean
  showHomeButton?: boolean
}

export function MobileLayout({ children, title, showBackButton = false, showHomeButton = false }: MobileLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const router = useRouter()

  // Detect if we're running in a mobile environment
  useEffect(() => {
    const checkMobile = () => {
      // Check if we're in a Capacitor environment
      const isCapacitor = typeof (window as any).Capacitor !== "undefined"
      // Or check if it's a mobile browser
      const isMobileBrowser = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      setIsMobile(isCapacitor || isMobileBrowser)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const handleBack = () => {
    router.back()
  }

  const handleHome = () => {
    router.push("/")
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  // If not on mobile, just render children
  if (!isMobile) {
    return <>{children}</>
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Mobile Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center px-4">
          {showBackButton && (
            <Button variant="ghost" size="icon" onClick={handleBack} className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}

          {showHomeButton && (
            <Button variant="ghost" size="icon" onClick={handleHome} className="mr-2">
              <Home className="h-5 w-5" />
            </Button>
          )}

          <div className="flex-1 text-center font-semibold">{title || "Roses"}</div>

          <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-background pt-14">
          <div className="flex flex-col p-4 space-y-4">
            <Button
              variant="ghost"
              onClick={() => {
                router.push("/")
                setIsMobileMenuOpen(false)
              }}
            >
              Home
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                router.push("/rankings")
                setIsMobileMenuOpen(false)
              }}
            >
              Rankings
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                router.push("/community")
                setIsMobileMenuOpen(false)
              }}
            >
              Community
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                router.push("/world")
                setIsMobileMenuOpen(false)
              }}
            >
              World
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                router.push("/submit")
                setIsMobileMenuOpen(false)
              }}
            >
              Submit
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                router.push("/about")
                setIsMobileMenuOpen(false)
              }}
            >
              About
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                router.push("/influencers")
                setIsMobileMenuOpen(false)
              }}
            >
              Influencers
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                router.push("/profile")
                setIsMobileMenuOpen(false)
              }}
            >
              Profile
            </Button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Mobile Bottom Navigation */}
      <nav className="sticky bottom-0 z-50 w-full border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center justify-around px-4">
          <Button variant="ghost" size="sm" onClick={() => router.push("/")}>
            <Home className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => router.push("/rankings")}>
            Rankings
          </Button>
          <Button variant="ghost" size="sm" onClick={() => router.push("/community")}>
            Community
          </Button>
          <Button variant="ghost" size="sm" onClick={() => router.push("/profile")}>
            Profile
          </Button>
        </div>
      </nav>
    </div>
  )
}

