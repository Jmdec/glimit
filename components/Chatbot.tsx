"use client"

import React, { useState, useRef, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { X, MessageCircle, Send } from 'lucide-react'

interface Message {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
}

interface QuickReply {
  label: string
  message: string
}

const quickReplies: QuickReply[] = [
  { label: "Our Services", message: "What services do you offer?" },
  { label: "Pricing Info", message: "What are your pricing options?" },
  { label: "Book Session", message: "How can I book a photography session?" },
  { label: "Portfolio", message: "Can I see your portfolio?" },
  { label: "Studio Location", message: "Where is your studio located?" },
  { label: "Contact Info", message: "How can I contact you?" },
]

const studioInfo = {
  about: "Founded with a passion for capturing life's most meaningful moments, our studio has grown into a trusted destination for professional photography. Every project begins with a simple belief: moments deserve to be preserved with care, intention, and beauty. We don't just take photos—we craft visual stories meant to last generations.",
  values: [
    { title: "Artistic Excellence", description: "Unique artistic vision creating meaningful, beautiful images." },
    { title: "Professional Quality", description: "Highest standards of professional photography guaranteed." },
    { title: "Personal Connection", description: "Understanding your story, creating collaborative experiences." },
    { title: "Client Commitment", description: "Your satisfaction is priority. Expectations exceeded." }
  ],
  experience: {
    years: "10+ Years of Creative excellence",
    clients: "500+ Trusted partnerships",
    photos: "50K+ Moments preserved"
  },
  studio: {
    name: "The G-Limit Studio",
    description: "A thoughtfully designed environment that empowers creativity, precision, and artistic freedom.",
    features: [
      "Professional Equipment: Industry-leading cameras and lighting",
      "Production Capabilities: High-end editing and workflows",
      "Creative Environment: Natural light, backdrops, and freedom"
    ]
  }
}

const getBotResponse = (userMessage: string): string => {
  const message = userMessage.toLowerCase()
  
  if (message.includes('service') || message.includes('offer')) {
    return "We offer a wide range of professional photography services including portraits, events, weddings, commercial photography, and creative shoots. Each service is tailored to capture your unique story with artistic excellence. With 10+ years of experience and 500+ satisfied clients, we ensure the highest standards of professional quality."
  }
  
  if (message.includes('book') || message.includes('appointment') || message.includes('schedule') || message.includes('session')) {
    return "Booking a session is easy! Contact us to discuss your vision, and we'll schedule a time that works best for you. Every project begins with understanding your story and creating a collaborative experience. We're committed to making your session comfortable and memorable."
  }
  
  if (message.includes('price') || message.includes('pricing') || message.includes('cost')) {
    return "Our pricing varies based on the type of session, duration, and deliverables. We offer flexible packages designed to suit different needs and budgets. Contact us for a detailed, personalized quote. Your satisfaction is our priority, and we're committed to exceeding your expectations."
  }
  
  if (message.includes('portfolio') || message.includes('work') || message.includes('examples') || message.includes('photos')) {
    return "We've preserved over 50,000 moments for 500+ clients! Our portfolio showcases diverse photography styles across portraits, events, weddings, and commercial work. Each image reflects our artistic vision and professional quality. We'd love to show you examples relevant to your needs!"
  }
  
  if (message.includes('contact') || message.includes('reach') || message.includes('phone') || message.includes('email')) {
    return "You can reach us through our website contact form, by phone, or by visiting The G-Limit Studio in person. We're here to answer all your questions and help bring your creative vision to life. Let us know how we can help!"
  }
  
  if (message.includes('location') || message.includes('where') || message.includes('address') || message.includes('studio')) {
    return "The G-Limit Studio is our thoughtfully designed creative space that empowers creativity, precision, and artistic freedom. Visit us to experience our professional equipment, production capabilities, and inspiring creative environment with natural light and versatile backdrops."
  }
  
  if (message.includes('about') || message.includes('who') || message.includes('values')) {
    return studioInfo.about + " Our values include Artistic Excellence, Professional Quality, Personal Connection, and Client Commitment. We believe in creating meaningful, beautiful images that last generations."
  }
  
  if (message.includes('experience') || message.includes('years')) {
    return `With ${studioInfo.experience.years}, we've built ${studioInfo.experience.clients} and preserved ${studioInfo.experience.photos}. Our experience speaks to our commitment to excellence and our clients' trust in us.`
  }
  
  if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
    return "Hello! Welcome to G-Limit Studio. 👋 How can we help you today? Feel free to ask about our services, pricing, or use the quick replies below!"
  }
  
  if (message.includes('thank')) {
    return "You're welcome! If you have any other questions about our photography services or would like to book a session, just let us know. We're here to help!"
  }
  
  return "Thank you for your message! I'd be happy to help you with information about our photography services, pricing, booking, or anything else. You can also use the quick reply buttons below for common questions!"
}

export default function Chatbot() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! Welcome to G-Limit Studio. 👋 How can we help you capture your special moments today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Hide chatbot on admin pages
  const isAdminPage = pathname?.startsWith('/admin')

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const handleSendMessage = (text?: string) => {
    const messageText = text || inputValue.trim()
    if (!messageText) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')

    // Simulate bot response
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(messageText),
        sender: 'bot',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, botMessage])
    }, 800)
  }

  const handleQuickReply = (reply: QuickReply) => {
    handleSendMessage(reply.message)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // Don't render chatbot on admin pages
  if (isAdminPage) {
    return null
  }

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-50"
          aria-label="Open chat"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-[380px] h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-gray-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-base">G-Limit Studio</h3>
                <p className="text-xs text-orange-100">Always here to help</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/20 rounded-full p-1 transition-colors"
              aria-label="Close chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-br-none'
                      : 'bg-white text-gray-800 rounded-bl-none shadow-sm border border-gray-200'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  <span
                    className={`text-xs mt-1 block ${
                      message.sender === 'user' ? 'text-orange-100' : 'text-gray-400'
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          <div className="px-4 py-3 bg-white border-t border-gray-200">
            <p className="text-xs text-gray-500 mb-2 font-medium">Quick replies:</p>
            <div className="flex flex-wrap gap-2">
              {quickReplies.map((reply, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickReply(reply)}
                  className="text-xs px-3 py-1.5 rounded-full border-2 border-orange-500 text-orange-600 hover:bg-orange-50 transition-colors font-medium"
                >
                  {reply.label}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t border-gray-200 rounded-b-2xl">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2.5 border-2 border-gray-200 rounded-full focus:outline-none focus:border-orange-500 text-sm transition-colors"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputValue.trim()}
                className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full p-2.5 hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Send message"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}