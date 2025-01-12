export function pathIsUrl(path: string) {
  const pattern =
    /^(?:[a-z]+:\/\/)?(?:(?:[a-z\d](?:[a-z\d-]*[a-z\d])*\.)+[a-z]{2,}|(?:\d{1,3}\.){3}\d{1,3})(?::\d+)?(?:\/[-a-z\d%_.~+]*)?(?:\?[;&a-z\d%_.~+=-]*)?(?:#[-a-z\d_]*)?$/i
  return pattern.test(path)
}
