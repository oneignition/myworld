"use client"

import { useState } from "react"
import Image from "next/image"
import { FlowerIcon as Rose } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { theme } from "@/config/theme"
import { useMobile } from "@/components/mobile/useMobile"

interface SongDiscussionProps {
  song?: string
  artist?: string
  image?: string
  rank?: number
  roses?: number
  comments?: any[]
}

export function SongDiscussion({
  song = "",
  artist = "",
  image = "/placeholder.svg",
  rank = 0,
  roses = 0,
  comments = [],
}: SongDiscussionProps) {
  const [newMessage, setNewMessage] = useState("")
  const { isMobile } = useMobile()

  // Function to format date without causing hydration mismatch
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <div className={`flex ${isMobile ? "flex-col" : "items-start justify-between"} mb-6`}>
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-1">{song}</h2>
            <p className="text-gray-600 text-lg">{artist}</p>
          </div>
          <div className={`flex flex-col items-${isMobile ? "start" : "end"} space-y-3 ${isMobile ? "mt-4" : ""}`}>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-semibold">Rank: {rank}</span>
              <div className="flex items-center">
                <Rose className="h-5 w-5 mr-1" style={{ color: theme.colors.accent }} />
                <span className="text-lg font-semibold">{roses.toLocaleString()}</span>
              </div>
            </div>
            <Button className="bg-pink-400 hover:bg-pink-500 text-white px-4 py-2 rounded-full" size="sm">
              <Rose className="h-4 w-4 mr-2" />
              Send Rose
            </Button>
          </div>
        </div>
        <div className={`${isMobile ? "w-full h-64 relative" : ""} mb-6`}>
          <Image
            src={image || "/placeholder.svg"}
            alt={`${artist} - ${song}`}
            width={400}
            height={400}
            className={`${isMobile ? "object-contain" : "w-full"} rounded-lg`}
            layout={isMobile ? "fill" : undefined}
          />
        </div>
        <div className="mt-6 space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="flex space-x-4">
              <Avatar>
                <AvatarImage src={comment.avatar} alt={comment.username} />
                <AvatarFallback>{comment.username[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{comment.username}</h3>
                  <span className="text-sm text-gray-500">{formatDate(comment.timestamp)}</span>
                </div>
                <p className="mt-1">{comment.text}</p>
                <div className="mt-2 flex items-center space-x-2">
                  <Button variant="ghost" size="sm" className="text-pink-500 hover:text-pink-600">
                    <Rose className="h-4 w-4 mr-1" />
                    {comment.roses}
                  </Button>
                  <Button variant="ghost" size="sm">
                    Reply
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6">
          <Textarea
            placeholder="What do you think about this #1 ranked song? Share your thoughts!"
            className="w-full bg-white mb-3"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <Button className="w-full bg-pink-500 hover:bg-pink-600 text-white">Send Message</Button>
        </div>
      </div>
    </div>
  )
}

