"use client"

import { useState, useEffect } from "react"
import { FlowerIcon as Rose } from "lucide-react"
import { Button } from "@/components/ui/button"
import { theme } from "@/config/theme"

export function RoseCounter() {
  const [timeLeft, setTimeLeft] = useState("04:00:00")
  const [canClaim, setCanClaim] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      const nextRose = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() + 4)
      const diff = nextRose.getTime() - now.getTime()

      if (diff <= 0) {
        setCanClaim(true)
        clearInterval(timer)
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60))
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((diff % (1000 * 60)) / 1000)
        setTimeLeft(
          `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`,
        )
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleClaim = () => {
    alert("You claimed 1 rose!")
    setCanClaim(false)
    // Reset the timer
    setTimeLeft("04:00:00")
  }

  return (
    <div className="flex flex-col items-center space-y-4 p-4 bg-white rounded-lg shadow-md">
      <div className="flex items-center space-x-2">
        <Rose className="h-6 w-6" style={{ color: theme.colors.accent }} />
        {canClaim ? (
          <span className="text-lg font-semibold">Claim your rose!</span>
        ) : (
          <span className="text-lg font-semibold">{timeLeft}</span>
        )}
      </div>
      <Button
        variant="outline"
        size="sm"
        className="px-4 py-2 bg-pink-200 hover:bg-pink-300 text-pink-800 rounded-full transition-colors duration-200"
        onClick={canClaim ? handleClaim : () => {}}
      >
        {canClaim ? (
          <>
            Claim 1 <Rose className="ml-1 h-4 w-4" style={{ color: theme.colors.accent }} />
          </>
        ) : (
          <>
            Get 15 free <Rose className="ml-1 h-4 w-4" style={{ color: theme.colors.accent }} />
          </>
        )}
      </Button>
    </div>
  )
}

