"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageCircle, X, Send, Bot, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

interface Message {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
}

interface ChatStatus {
  status: "online" | "offline"
  model: string
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [chatStatus, setChatStatus] = useState<ChatStatus>({ status: "offline", model: "" })
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Check chatbot status
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/status/")
        if (response.ok) {
          const data = await response.json()
          setChatStatus({ status: "online", model: data.model || "ChatBot" })
        }
      } catch (error) {
        setChatStatus({ status: "offline", model: "" })
      }
    }

    checkStatus()
    const interval = setInterval(checkStatus, 30000) // Check every 30 seconds
    return () => clearInterval(interval)
  }, [])

  // Load chat history when opening
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      loadChatHistory()
    }
  }, [isOpen])

  const loadChatHistory = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/chat-history/")
      if (response.ok) {
        const history = await response.json()
        const formattedMessages = history.map((msg: any, index: number) => ({
          id: `${index}`,
          content: msg.message || msg.content,
          sender: msg.sender || (index % 2 === 0 ? "user" : "bot"),
          timestamp: new Date(msg.timestamp || Date.now()),
        }))
        setMessages(formattedMessages)
      }
    } catch (error) {
      console.error("Failed to load chat history:", error)
    }
  }

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    try {
      const response = await fetch("http://localhost:8000/api/chat/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: inputValue,
          user_id: "anonymous", // You can replace with actual user ID
        }),
      })

      if (response.ok) {
        const data = await response.json()
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: data.response || "Sorry, I could not process your request.",
          sender: "bot",
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, botMessage])
      } else {
        throw new Error("Failed to get response")
      }
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, I'm having trouble connecting. Please try again later.",
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.div className="fixed bottom-6 right-6 z-50" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          size="lg"
          className="rounded-full h-14 w-14 shadow-lg bg-blue-600 hover:bg-blue-700"
          onClick={() => setIsOpen(!isOpen)}
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="h-6 w-6" />
              </motion.div>
            ) : (
              <motion.div
                key="chat"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <MessageCircle className="h-6 w-6" />
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            transition={{ duration: 0.3, type: "spring" }}
            className="fixed bottom-24 right-6 z-40 w-96 max-w-[calc(100vw-3rem)]"
          >
            <Card className="shadow-2xl border-0">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Bot className="h-5 w-5" />
                    <span>Security Assistant</span>
                  </CardTitle>
                  <Badge variant={chatStatus.status === "online" ? "default" : "destructive"} className="text-xs">
                    {chatStatus.status}
                  </Badge>
                </div>
                <p className="text-sm opacity-90">Ask me about our security products!</p>
              </CardHeader>

              <CardContent className="p-0">
                <ScrollArea className="h-80 p-4">
                  <div className="space-y-4">
                    {messages.length === 0 && (
                      <div className="text-center text-muted-foreground py-8">
                        <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Hi! I'm here to help you find the perfect security solution.</p>
                      </div>
                    )}

                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`flex items-start space-x-2 max-w-[80%] ${
                            message.sender === "user" ? "flex-row-reverse space-x-reverse" : ""
                          }`}
                        >
                          <div
                            className={`rounded-full p-2 ${
                              message.sender === "user" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
                            }`}
                          >
                            {message.sender === "user" ? <User className="h-3 w-3" /> : <Bot className="h-3 w-3" />}
                          </div>
                          <div
                            className={`rounded-lg px-3 py-2 ${
                              message.sender === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                            <p className="text-xs opacity-70 mt-1">
                              {message.timestamp.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}

                    {isLoading && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                        <div className="flex items-center space-x-2">
                          <div className="rounded-full p-2 bg-gray-200">
                            <Bot className="h-3 w-3" />
                          </div>
                          <div className="bg-gray-100 rounded-lg px-3 py-2">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                              <div
                                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                style={{ animationDelay: "0.1s" }}
                              />
                              <div
                                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                style={{ animationDelay: "0.2s" }}
                              />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                <div className="border-t p-4">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Type your message..."
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      disabled={isLoading || chatStatus.status === "offline"}
                      className="flex-1"
                    />
                    <Button
                      onClick={sendMessage}
                      disabled={!inputValue.trim() || isLoading || chatStatus.status === "offline"}
                      size="icon"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
