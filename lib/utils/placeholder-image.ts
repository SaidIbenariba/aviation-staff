/**
 * Generate a placeholder image URL
 * @param width - Image width in pixels (default: 400)
 * @param height - Image height in pixels (default: 300)
 * @param text - Optional text to display on placeholder
 * @returns Placeholder image URL
 */
export function getPlaceholderImage(
  width: number = 400,
  height: number = 300,
  text?: string
): string {
  if (text) {
    // Use placeholder.com for text-based placeholders
    const encodedText = encodeURIComponent(text);
    return `https://via.placeholder.com/${width}x${height}?text=${encodedText}`;
  }
  // Use placekitten.com for default placeholders
  return `https://placekitten.com/${width}/${height}`;
}

/**
 * Get a placeholder image URL or return the provided URL if it exists
 * @param url - Existing image URL (can be null/undefined)
 * @param width - Placeholder width (default: 400)
 * @param height - Placeholder height (default: 300)
 * @param text - Optional text for placeholder
 * @returns Image URL (existing or placeholder)
 */
export function getImageUrl(
  url: string | null | undefined,
  width: number = 400,
  height: number = 300,
  text?: string
): string {
  if (url) {
    return url;
  }
  return getPlaceholderImage(width, height, text);
}

