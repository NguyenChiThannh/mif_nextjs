'use client'

import Link from 'next/link';

export const convertDeltaToHtml = (delta) => {
    if (typeof window !== 'undefined') {
        const Quill = require('quill').default;
        const quill = new Quill(document.createElement('div'));
        quill.setContents(delta);
        return quill.root.innerHTML;
    } else {
        return '';
    }
}

export const renderContent = (content) => {
  // Regex: match @[display](id) hoặc #[display](id)
  const parts = content.split(/(@\[[^\]]*?\]\([^\)]+\)|#\[[^\]]*?\]\([^\)]+\))/g);

  return parts.map((part, index) => {
    // Movie mention: @[title](id)
    const mentionMatch = part.match(/@\[(.*?)\]\((.*?)\)/);
    if (mentionMatch) {
      const [_, display, id] = mentionMatch;
      return (
        <Link
          key={`mention-${index}`}
          href={`/movies/${id}`}
          className="text-blue-500 hover:underline"
        >
          @{display}
        </Link>
      );
    }

    // Group mention: #[groupName](id)
    const groupMatch = part.match(/#\[(.*?)\]\((.*?)\)/);
    if (groupMatch) {
      const [_, display, id] = groupMatch;
      return (
        <Link
          key={`group-${index}`}
          href={`/groups/${id}`}
          className="text-green-600 hover:underline"
        >
          #{display}
        </Link>
      );
    }

    // Normal text
    return part;
  });
};