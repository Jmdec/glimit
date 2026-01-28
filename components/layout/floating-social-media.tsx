"use client"
import { useState } from "react"
import { Facebook, MessageCircle, Send, Mail, Phone, Share2, X } from "lucide-react"
import { useLockBodyScroll } from "@/hooks/use-scroll"

const FloatingSocialIcons = () => {
  const [isOpen, setIsOpen] = useState(false)
  useLockBodyScroll(isOpen)

const socialLinks = [
  {
    name: "Facebook",
    icon: Facebook,
    href: "https://www.facebook.com/people/Infinitech-Advertising-Corp/100080647808810/",
    bgColor: "bg-blue-600 hover:bg-blue-700",
    ariaLabel: "Visit our Facebook page",
  },
  {
    name: "WhatsApp",
    icon: MessageCircle,
    href: "https://wa.me/639456754591", // PH format (remove leading 0, add 63)
    bgColor: "bg-green-500 hover:bg-green-600",
    ariaLabel: "Chat with us on WhatsApp",
  },
  {
    name: "Telegram",
    icon: Send,
    href: "https://t.me/infinitech_justin",
    bgColor: "bg-sky-500 hover:bg-sky-600",
    ariaLabel: "Message us on Telegram",
  },
  {
    name: "Email",
    icon: Mail,
    href: "mailto:infinitechcorp.ph@gmail.com",
    bgColor: "bg-red-600 hover:bg-red-700",
    ariaLabel: "Send us an email",
  },
  {
    name: "Phone",
    icon: Phone,
    href: "tel:+639456754591",
    bgColor: "bg-blue-500 hover:bg-blue-600",
    ariaLabel: "Call us now",
  },
];

  return (
    <>
      {/* Desktop View - Right Side Vertical */}
      <div className="hidden md:flex fixed right-6 top-1/2 -translate-y-1/2 z-50 flex-col gap-3">
        {socialLinks.map((social) => {
          const Icon = social.icon
          return (
            <a
              key={social.name}
              href={social.href}
              target={social.name !== "Email" && social.name !== "Phone" ? "_blank" : undefined}
              rel={social.name !== "Email" && social.name !== "Phone" ? "noopener noreferrer" : undefined}
              aria-label={social.ariaLabel}
              className={`
                ${social.bgColor}
                w-12 h-12 rounded-full
                flex items-center justify-center
                text-white
                shadow-lg
                transition-all duration-300
                hover:scale-110 hover:shadow-xl
                active:scale-95
                group
              `}
            >
              <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </a>
          )
        })}
      </div>

      {/* Mobile View - Expandable Floating Button */}
      <div className="md:hidden fixed bottom-24 right-6 z-50">
        {/* Social Icons - Appear above the main button when open */}
        <div
          className={`
          flex flex-col-reverse gap-3 mb-3
          transition-all duration-300 origin-bottom
          ${isOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-0 translate-y-4 pointer-events-none"}
        `}
        >
          {socialLinks.map((social, index) => {
            const Icon = social.icon
            return (
              <a
                key={social.name}
                href={social.href}
                target={social.name !== "Email" && social.name !== "Phone" ? "_blank" : undefined}
                rel={social.name !== "Email" && social.name !== "Phone" ? "noopener noreferrer" : undefined}
                aria-label={social.ariaLabel}
                onClick={() => setIsOpen(false)}
                className={`
                  ${social.bgColor}
                  w-14 h-14 rounded-full
                  flex items-center justify-center
                  text-white
                  shadow-lg
                  transition-all duration-300
                  active:scale-95
                  animate-in slide-in-from-bottom-2
                `}
                style={{
                  animationDelay: `${index * 50}ms`,
                  animationFillMode: "backwards",
                }}
              >
                <Icon className="w-6 h-6" />
              </a>
            )
          })}
        </div>

        {/* Main Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close social menu" : "Open social menu"}
          className={`
            w-16 h-16 rounded-full
            flex items-center justify-center
            text-white
            shadow-xl
            transition-all duration-300
            active:scale-95
            ${isOpen ? "bg-yellow-400 hover:bg-yellow-200 rotate-0" : "gold-glow rotate-0"}
          `}
        >
          {isOpen ? <X className="w-7 h-7 transition-transform duration-300" /> : <Share2 className="w-7 h-7 transition-transform duration-300" />}
        </button>

        {/* Backdrop overlay when open */}
        {isOpen && <div className="fixed inset-0 bg-black/20 -z-10" onClick={() => setIsOpen(false)} />}
      </div>
    </>
  )
}

export default FloatingSocialIcons
