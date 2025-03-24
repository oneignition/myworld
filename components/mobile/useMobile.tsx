"use client"

import { useState, useEffect } from "react"

export function useMobile() {
  const [isMobile, setIsMobile] = useState(false)
  const [platform, setPlatform] = useState<"web" | "ios" | "android">("web")

  useEffect(() => {
    const checkMobile = () => {
      // Check if we're in a Capacitor environment
      const isCapacitor = typeof (window as any).Capacitor !== "undefined"

      // Check platform
      if (isCapacitor) {
        const capacitorPlatform = (window as any).Capacitor.getPlatform()
        if (capacitorPlatform === "ios") setPlatform("ios")
        else if (capacitorPlatform === "android") setPlatform("android")
      }

      // Or check if it's a mobile browser
      const isMobileBrowser = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

      setIsMobile(isCapacitor || isMobileBrowser)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  return { isMobile, platform }
}

