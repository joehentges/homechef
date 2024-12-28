export function formatTime(mins: number) {
  let h = Math.floor(mins / 60)
  let m = mins % 60
  const hours = h !== 0 ? `${h}h ` : ""
  const minutes = m !== 0 ? `${m}m ` : ""
  return `${hours}${minutes}`
}
