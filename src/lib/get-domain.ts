export function getDomain(url: string): string {
  const urlObj = new URL(url)
  let hostname = urlObj.hostname

  // Remove "www." if present
  if (hostname.startsWith("www.")) {
    hostname = hostname.substring(4)
  }
  return hostname
}
