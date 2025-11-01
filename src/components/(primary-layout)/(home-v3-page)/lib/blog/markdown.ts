import { marked } from 'marked';
import DOMPurify from 'isomorphic-dompurify';

// Configure marked options
marked.setOptions({
  gfm: true,
  breaks: true,
});

export function markdownToHtml(markdown: string): string {
  const rawHtml = marked(markdown) as string;
  // Sanitize HTML to prevent XSS attacks (works in both Node and browser)
  return DOMPurify.sanitize(rawHtml, {
    ALLOWED_TAGS: [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'p', 'br', 'hr',
      'strong', 'em', 'u', 's', 'code', 'pre',
      'ul', 'ol', 'li',
      'a', 'blockquote',
      'table', 'thead', 'tbody', 'tr', 'th', 'td',
      'img', 'div', 'span',
    ],
    ALLOWED_ATTR: ['href', 'title', 'alt', 'src', 'class', 'id'],
  });
}
