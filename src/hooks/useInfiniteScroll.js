import { useEffect, useRef } from 'react'

const useInfiniteScroll = (hasNextPage, fetchNextPage) => {
  const observerElem = useRef()

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage()
        }
      },
      {
        threshold: 0.1, // Lower threshold to trigger earlier
        rootMargin: '150px 0px 0px 0px', // Add margin to the top to detect scroll near top
      },
    )

    if (observerElem.current) observer.observe(observerElem.current)

    return () => {
      // Clean up by unobserving the element
      if (observerElem.current) observer.unobserve(observerElem.current)
    }
  }, [hasNextPage, fetchNextPage])

  return observerElem
}

export default useInfiniteScroll
