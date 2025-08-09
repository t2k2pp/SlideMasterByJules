/**
 * A simple sanitizer that uses the browser's own parser to prevent XSS.
 * It escapes HTML content by setting it as textContent and then reading innerHTML.
 * @param input The potentially unsafe string.
 * @returns A sanitized string with HTML characters escaped.
 */
export const sanitizeHTML = (input: string): string => {
  const temp = document.createElement('div');
  temp.textContent = input;
  return temp.innerHTML;
};

/**
 * A placeholder for a more robust markdown sanitizer that might be needed later.
 * For now, we rely on React's automatic escaping for content rendered in JSX.
 * If we were to use a library like 'marked' to render HTML from markdown,
 * we would need to configure it to sanitize the output.
 *
 * @param markdown The markdown string.
 * @returns The sanitized markdown string.
 */
export const sanitizeMarkdown = (markdown: string): string => {
  // A real implementation would use a library like DOMPurify after rendering markdown to HTML.
  // For now, we'll just do basic escaping of script tags as a precaution.
  return markdown
    .replace(/<script.*?>/gi, '&lt;script&gt;')
    .replace(/<\/script>/gi, '&lt;/script&gt;');
};
