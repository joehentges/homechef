type NavItem = {
  label: string
  href: string
  disabled?: boolean
  authenticated?: boolean
}

interface Navigation {
  siteNav: NavItem[]
  userNav: NavItem[]
  siteFooter: NavItem[]
}

export const navigation: Navigation = {
  siteNav: [
    {
      label: "Featured",
      href: "/",
    },
    {
      label: "Recipes",
      href: "/recipes",
    },
    {
      label: "Learning",
      href: "/learning",
      disabled: true,
    },
    {
      label: "My Cookbook",
      href: "/cookbook",
      authenticated: true,
    },
  ],
  userNav: [
    {
      label: "Profile",
      href: "/profile",
    },
    {
      label: "Settings",
      href: "/settings",
    },
  ],
  siteFooter: [
    {
      label: "GitHub",
      href: "https://github.com/joeyhentges/home-chef",
    },
  ],
}
