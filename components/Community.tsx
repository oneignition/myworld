"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { FlowerIcon as Rose, ImageIcon, ChevronDown } from "lucide-react"
import Image from "next/image"

interface Reply {
  id: number
  username: string
  avatar: string
  content: string
  timestamp: string
  roses: number
  image?: string
  topContribution?: {
    song: string
    artist: string
    roses: number
  }
}

interface Post {
  id: number
  username: string
  avatar: string
  content: string
  timestamp: string
  roses: number
  replies: Reply[]
  topContribution: {
    song: string
    artist: string
    roses: number
  }
  image?: string
}

const initialPosts: Post[] = [
  {
    id: 1,
    username: "kpopfan1",
    avatar: "/placeholder.svg",
    content: "Just discovered an amazing new K-pop group! Their vocals are incredible!",
    timestamp: "2 hours ago",
    roses: 42,
    replies: Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      username: `user${i + 1}`,
      avatar: "/placeholder.svg",
      content: `Reply ${i + 1}`,
      timestamp: "1 hour ago",
      roses: 5,
      topContribution: {
        song: `Reply Song ${i + 1}`,
        artist: `Reply Artist ${i + 1}`,
        roses: 25,
      },
    })),
    topContribution: {
      song: "Lose My Breath",
      artist: "Stray Kids",
      roses: 100,
    },
  },
  {
    id: 2,
    username: "musiclover",
    avatar: "/placeholder.svg",
    content: "What's everyone's favorite song right now? I need new music recommendations!",
    timestamp: "4 hours ago",
    roses: 28,
    replies: [],
    topContribution: {
      song: "Dynamite",
      artist: "BTS",
      roses: 75,
    },
  },
]

export function Community() {
  const [posts, setPosts] = useState<Post[]>(initialPosts)
  const [newPost, setNewPost] = useState("")
  const [replyingTo, setReplyingTo] = useState<number | null>(null)
  const [replyContent, setReplyContent] = useState("")
  const [image, setImage] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [visibleReplies, setVisibleReplies] = useState<{ [key: number]: number }>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPost.trim() || image) {
      let imageUrl = ""
      if (image) {
        imageUrl = await uploadAndModerateImage(image)
      }
      const post: Post = {
        id: Date.now(),
        username: "currentUser",
        avatar: "/placeholder.svg",
        content: newPost,
        timestamp: "Just now",
        roses: 0,
        replies: [],
        topContribution: {
          song: "New Song",
          artist: "New Artist",
          roses: 50,
        },
        image: imageUrl,
      }
      setPosts([post, ...posts])
      setNewPost("")
      setImage(null)
    }
  }

  const handleReply = async (postId: number) => {
    if (replyContent.trim() || image) {
      let imageUrl = ""
      if (image) {
        imageUrl = await uploadAndModerateImage(image)
      }
      const reply: Reply = {
        id: Date.now(),
        username: "currentUser",
        avatar: "/placeholder.svg",
        content: replyContent,
        timestamp: "Just now",
        roses: 0,
        image: imageUrl,
        topContribution: {
          song: "Reply Song",
          artist: "Reply Artist",
          roses: 25,
        },
      }
      setPosts(posts.map((post) => (post.id === postId ? { ...post, replies: [...post.replies, reply] } : post)))
      setReplyingTo(null)
      setReplyContent("")
      setImage(null)
      setVisibleReplies((prev) => ({ ...prev, [postId]: (prev[postId] || 3) + 1 }))
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0])
    }
  }

  const uploadAndModerateImage = async (file: File): Promise<string> => {
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be 5MB or less. Please choose a smaller image.")
      return ""
    }
    // Here you would typically send the image to a backend service for moderation
    // For this example, we'll use a placeholder moderation check
    return new Promise((resolve) => {
      setTimeout(() => {
        const passesModeration = Math.random() > 0.1 // 90% pass rate for example
        if (passesModeration) {
          resolve(URL.createObjectURL(file))
        } else {
          alert("The uploaded image didn't pass our content guidelines. Please try another image.")
          resolve("")
        }
      }, 1000)
    })
  }

  const loadMoreReplies = (postId: number) => {
    setVisibleReplies((prev) => ({ ...prev, [postId]: (prev[postId] || 3) + 5 }))
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="mb-6 bg-gradient-to-r from-pink-100 to-purple-100">
        <CardContent className="p-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="Your favorite song this week?"
              className="w-full bg-white"
              maxLength={280}
            />
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">{newPost.length}/280</span>
                <Button type="button" onClick={() => fileInputRef.current?.click()} variant="outline">
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Add Image
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
              </div>
              <Button type="submit" className="bg-pink-500 hover:bg-pink-600 text-white">
                Post
              </Button>
            </div>
            {image && (
              <div className="mt-2">
                <Image
                  src={URL.createObjectURL(image)}
                  alt="Uploaded image"
                  width={200}
                  height={200}
                  className="rounded-md"
                />
              </div>
            )}
          </form>
        </CardContent>
      </Card>

      {posts.map((post, index) => (
        <Card key={post.id} className={`mb-4 ${index % 2 === 0 ? "bg-pink-50" : "bg-purple-50"}`}>
          <CardContent className="p-4">
            <div className="flex items-start space-x-4">
              <Avatar>
                <AvatarImage src={post.avatar} alt={post.username} />
                <AvatarFallback>{post.username[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-grow">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold">{post.username}</span>
                    <span className="text-sm text-gray-600 ml-2">
                      Loves "{post.topContribution.song}" by {post.topContribution.artist}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">{post.timestamp}</span>
                </div>
                <p className="mt-1">{post.content}</p>
                {post.image && (
                  <div className="mt-2">
                    <Image src={post.image} alt="Posted image" width={200} height={200} className="rounded-md" />
                  </div>
                )}
                <div className="mt-2 flex items-center justify-between">
                  <Button variant="ghost" size="sm" className="text-pink-500 hover:text-pink-600">
                    <Rose className="h-4 w-4 mr-1" />
                    {post.roses}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setReplyingTo(post.id)}>
                    Reply
                  </Button>
                </div>
                {replyingTo === post.id && (
                  <div className="mt-2">
                    <Textarea
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder="Write a reply..."
                      className="w-full mb-2 bg-white"
                    />
                    <div className="flex justify-between items-center">
                      <Button onClick={() => fileInputRef.current?.click()} variant="outline">
                        <ImageIcon className="h-4 w-4 mr-2" />
                        Add Image
                      </Button>
                      <Button onClick={() => handleReply(post.id)} className="bg-pink-500 hover:bg-pink-600 text-white">
                        Send Reply
                      </Button>
                    </div>
                    {image && (
                      <div className="mt-2">
                        <Image
                          src={URL.createObjectURL(image)}
                          alt="Uploaded image"
                          width={200}
                          height={200}
                          className="rounded-md"
                        />
                      </div>
                    )}
                  </div>
                )}
                {post.replies.slice(0, visibleReplies[post.id] || 3).map((reply, replyIndex) => (
                  <div
                    key={reply.id}
                    className={`mt-4 ml-8 p-3 rounded-lg ${replyIndex % 2 === 0 ? "bg-pink-100" : "bg-purple-100"}`}
                  >
                    <div className="flex items-start space-x-2">
                      <Avatar>
                        <AvatarImage src={reply.avatar} alt={reply.username} />
                        <AvatarFallback>{reply.username[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-bold">{reply.username}</span>
                            {reply.topContribution && (
                              <span className="text-sm text-gray-600 ml-2">
                                Loves "{reply.topContribution.song}" by {reply.topContribution.artist}
                              </span>
                            )}
                          </div>
                          <span className="text-sm text-gray-500">{reply.timestamp}</span>
                        </div>
                        <p className="mt-1">{reply.content}</p>
                        {reply.image && (
                          <div className="mt-2">
                            <Image
                              src={reply.image}
                              alt="Reply image"
                              width={200}
                              height={200}
                              className="rounded-md"
                            />
                          </div>
                        )}
                        <Button variant="ghost" size="sm" className="text-pink-500 hover:text-pink-600 mt-1">
                          <Rose className="h-4 w-4 mr-1" />
                          {reply.roses}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                {post.replies.length > (visibleReplies[post.id] || 3) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2 text-pink-500 hover:text-pink-600"
                    onClick={() => loadMoreReplies(post.id)}
                  >
                    <ChevronDown className="h-4 w-4 mr-1" />
                    View more replies
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

