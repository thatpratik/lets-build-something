/**
 * Car photos are hotlinked from Wikimedia Commons at full original resolution
 * (often several MB, well beyond what a card or thumbnail needs). Commons'
 * Special:FilePath endpoint accepts a `width` param and redirects to a
 * pre-rendered thumbnail of that width, so request one instead of the original.
 */
export function thumbnail(url: string, width: number): string {
  if (!url.includes('/Special:FilePath/')) {
    return url;
  }
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}width=${width}`;
}
