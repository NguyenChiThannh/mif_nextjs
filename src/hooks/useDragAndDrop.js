import { useState, useRef, useCallback } from 'react'

export const useDragAndDrop = () => {
  const [isDragging, setIsDragging] = useState(false)
  const [dragData, setDragData] = useState(null)
  const dragImageRef = useRef(null)

  const createDragImage = useCallback((text, type = 'group') => {
    // Tạo element tạm thời để làm drag image
    const dragElement = document.createElement('div')
    dragElement.className = `
      bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg shadow-lg 
      font-medium text-sm backdrop-blur-sm border border-primary/20
      flex items-center gap-2 max-w-xs
    `
    dragElement.innerHTML = `
      <span class="text-xs">@</span>
      <span class="truncate">${text}</span>
    `
    dragElement.style.position = 'absolute'
    dragElement.style.top = '-1000px'
    dragElement.style.left = '-1000px'
    dragElement.style.pointerEvents = 'none'
    dragElement.style.zIndex = '9999'

    document.body.appendChild(dragElement)
    return dragElement
  }, [])

  const handleDragStart = useCallback(
    (e, data) => {
      setIsDragging(true)
      setDragData(data)

      // Tạo custom drag image
      const dragImage = createDragImage(data.name, data.type)
      dragImageRef.current = dragImage

      // Set drag image với offset đẹp
      e.dataTransfer.setDragImage(dragImage, 50, 20)

      // Set data cho drag
      e.dataTransfer.setData('application/json', JSON.stringify(data))
      e.dataTransfer.effectAllowed = 'copy'

      // Cleanup drag image sau một chút
      setTimeout(() => {
        if (dragImageRef.current) {
          document.body.removeChild(dragImageRef.current)
          dragImageRef.current = null
        }
      }, 100)
    },
    [createDragImage],
  )

  const handleDragEnd = useCallback(() => {
    setIsDragging(false)
    setDragData(null)

    // Cleanup drag image nếu còn
    if (dragImageRef.current) {
      document.body.removeChild(dragImageRef.current)
      dragImageRef.current = null
    }
  }, [])

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
  }, [])

  const handleDrop = useCallback((e, onDrop) => {
    e.preventDefault()

    try {
      const data = JSON.parse(e.dataTransfer.getData('application/json'))
      if (data && onDrop) {
        onDrop(data)
      }
    } catch (error) {
      console.error('Error parsing drag data:', error)
    }
  }, [])

  return {
    isDragging,
    dragData,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDrop,
  }
}

export default useDragAndDrop
