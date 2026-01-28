import { useState, useEffect } from "react"

const useScrollAnimation = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Create a ref for the observer
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        } else {
          setIsVisible(false) // Optionally reset on leaving viewport
        }
      })
    })

    const target = document.querySelector(".animatable") // Modify selector as needed
    if (target) {
      observer.observe(target)
    }

    return () => {
      if (target) {
        observer.unobserve(target) // Cleanup the observer
      }
    }
  }, [])

  return isVisible
}

export default useScrollAnimation
