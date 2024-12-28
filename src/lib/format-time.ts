export function formatTime(mins: number) {
  const h = Math.floor(mins / 60)
  const m = mins % 60
  const hours = h !== 0 ? `${h}h ` : ""
  const minutes = m !== 0 ? `${m}m ` : ""
  return `${hours}${minutes}`
}
