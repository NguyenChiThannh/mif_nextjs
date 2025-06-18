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
    const parts = content.split(/(@\[.*?\]\(.*?\))/g);
    return parts.map((part, index) => {
      const match = part.match(/@\[(.*?)\]\((.*?)\)/);
      if (match) {
        const [_, display, id] = match;
        return (
          <Link
            key={index}
            href={`/movies/${id}`}
            className="text-blue-500 hover:underline"
          >
            {display}
          </Link>
        );
      }
      return part;
    });
  };