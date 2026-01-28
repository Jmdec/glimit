"use client"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"

interface TypewriterTextProps {
  text: string
  highlightText?: string
  className?: string
  highlightClassName?: string
  delay?: number
  speed?: number
}

export function TypewriterText({
  text,
  highlightText,
  className = "",
  highlightClassName = "text-gold",
  delay = 0,
  speed = 50,
}: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState("")
  const [displayedHighlight, setDisplayedHighlight] = useState("")
  const [showCursor, setShowCursor] = useState(true)
  const [phase, setPhase] = useState<"waiting" | "typing" | "highlight" | "done">("waiting")

  useEffect(() => {
    const startTimeout = setTimeout(() => {
      setPhase("typing")
    }, delay)
    return () => clearTimeout(startTimeout)
  }, [delay])

  useEffect(() => {
    if (phase === "typing") {
      if (displayedText.length < text.length) {
        const timeout = setTimeout(() => {
          setDisplayedText(text.slice(0, displayedText.length + 1))
        }, speed)
        return () => clearTimeout(timeout)
      } else if (highlightText) {
        setPhase("highlight")
      } else {
        setPhase("done")
      }
    }
  }, [phase, displayedText, text, highlightText, speed])

  useEffect(() => {
    if (phase === "highlight" && highlightText) {
      if (displayedHighlight.length < highlightText.length) {
        const timeout = setTimeout(() => {
          setDisplayedHighlight(highlightText.slice(0, displayedHighlight.length + 1))
        }, speed)
        return () => clearTimeout(timeout)
      } else {
        setPhase("done")
      }
    }
  }, [phase, displayedHighlight, highlightText, speed])

  // Blinking cursor
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor((prev) => !prev)
    }, 530)
    return () => clearInterval(interval)
  }, [])

  return (
    <span className={className}>
      {displayedText}
      {highlightText && <span className={highlightClassName}>{displayedHighlight}</span>}
      <motion.span
        className="inline-block w-0.5 h-[1em] bg-gold ml-1 align-middle"
        animate={{ opacity: showCursor ? 1 : 0 }}
        transition={{ duration: 0.1 }}
      />
    </span>
  )
}
