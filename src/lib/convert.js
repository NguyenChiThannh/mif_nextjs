'use client'

import Link from 'next/link'

export const convertDeltaToHtml = (delta) => {
  if (typeof window !== 'undefined') {
    const Quill = require('quill').default
    const quill = new Quill(document.createElement('div'))
    quill.setContents(delta)
    return quill.root.innerHTML
  } else {
    return ''
  }
}

export const renderContent = (content, type = 'post') => {
  var colorGroup = 'text-green-500'
  var colorMovie = 'text-blue-500'
  var prefixGroup = ''
  var prefixMovie = ''
  if (type === 'chat') {
    colorGroup = 'text-white'
    colorMovie = 'text-white'
    prefixGroup = '#'
    prefixMovie = '@'
  }

  // Regex: match @[display](id) hoặc #[display](id)
  const parts = content.split(
    /(@\[[^\]]*?\]\([^\)]+\)|#\[[^\]]*?\]\([^\)]+\))/g,
  )

  return parts.map((part, index) => {
    // Movie mention: @[title](id)
    const mentionMatch = part.match(/@\[(.*?)\]\((.*?)\)/)
    if (mentionMatch) {
      const [_, display, id] = mentionMatch
      return (
        <Link
          key={`mention-${index}`}
          href={`/movies/${id}`}
          className={`${colorMovie} font-bold hover:underline`}
        >
          {`${prefixMovie}${display}`}
        </Link>
      )
    }

    // Group mention: #[groupName](id)
    const groupMatch = part.match(/#\[(.*?)\]\((.*?)\)/)
    if (groupMatch) {
      const [_, display, id] = groupMatch
      return (
        <Link
          key={`group-${index}`}
          href={`/groups/${id}`}
          className={`${colorGroup} font-bold hover:underline`}
        >
          {`${prefixGroup}${display}`}
        </Link>
      )
    }

    // Normal text
    return part
  })
}
