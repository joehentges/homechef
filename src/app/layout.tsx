import type { Metadata } from "next"
import { Inter, Nova_Slim } from "next/font/google"
import { NuqsAdapter } from "nuqs/adapters/next/app"

import "@/styles/globals.css"

import { siteConfig } from "@/config/site"
import { Providers } from "@/providers"
import { cn } from "@/lib/utils"
import { Toaster } from "@/components/ui/toaster"
import { TailwindIndicator } from "@/components/tailwind-indicator"

const fontBase = Inter({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-base",
})

const fontHeader = Nova_Slim({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-header",
})

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: ["Minnesota", "Engineer", "Software Engineer", "Portfolio"],
  authors: [
    {
      name: "Joe Hentges",
      url: "joehentges.dev",
    },
  ],
  creator: "Joe Hentges",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [`${siteConfig.url}/og.jpg`],
    creator: "@joehentges",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: `${siteConfig.url}/site.webmanifest`,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "bg-background font-base antialiased",
          fontBase.variable,
          fontHeader.variable
        )}
      >
        <Providers>
          <NuqsAdapter>{children}</NuqsAdapter>
          <TailwindIndicator />
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
