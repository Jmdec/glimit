import { useEffect, useState } from "react"

export function useMediaQuery(query: string) {
  const [value, setValue] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia(query)
    const updateValue = () => setValue(mediaQuery.matches)

    updateValue()
    mediaQuery.addEventListener("change", updateValue)

    return () => mediaQuery.removeEventListener("change", updateValue)
  }, [query])

  return value
}
