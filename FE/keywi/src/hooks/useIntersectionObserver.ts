import { useState, useEffect, useRef, RefObject } from 'react'

interface IntersectionObserverOptions {
  root?: Element | null
  rootMargin?: string
  threshold?: number | number[]
}

interface UseIntersectionObserverReturn {
  ref: RefObject<HTMLDivElement | null>
  inView: boolean
}

// 기본 IntersectionObserver 훅 구현
export function useIntersectionObserver(
  options: IntersectionObserverOptions = {},
  enabled = true,
): UseIntersectionObserverReturn {
  const { root = null, rootMargin = '0px', threshold = 0 } = options

  const [inView, setInView] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!enabled || !window.IntersectionObserver) {
      return
    }

    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting)
      },
      { root, rootMargin, threshold },
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [ref, root, rootMargin, threshold, enabled])

  return { ref, inView }
}
