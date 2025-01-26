export function pathIsValid(path: string) {
  try {
    new URL(path)
    return false
  } catch {
    if (path === "" || path === undefined || path === "undefined") {
      return false
    }
    return true
  }
}
