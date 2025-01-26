interface SiteConfig {
  version: string
  name: string
  description: string
  url: string
  ogImage: string
  links: {
    github: string
  }
}

export const siteConfig: SiteConfig = {
  version: "v0.1.0",
  name: "Homechef",
  description:
    "An open source application built using the new router, server components and everything new in Next.js 15.",
  url: "https://homchef.joehentges.dev",
  ogImage: "https://homechef.joehentges.dev/og.png",
  links: {
    github: "https://github.com/joehentges/homechef",
  },
}
