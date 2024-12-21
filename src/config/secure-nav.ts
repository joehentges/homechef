type Link = {
  label: string
  href: string
}

type UserNav = Link & {
  mobileOnly?: boolean
}

interface SecureNav {
  userNav: UserNav[]
  nav: Link[]
  footer: {
    right: Link[]
  }
}

export const secureNav: SecureNav = {
  userNav: [
    {
      label: "Profile",
      href: "/profile",
    },
    {
      label: "Settings",
      href: "/settings",
    },
    {
      label: "Messages",
      href: "/messages",
      mobileOnly: true,
    },
    {
      label: "Notifications",
      href: "/notifications",
      mobileOnly: true,
    },
  ],
  nav: [
    {
      label: "Home",
      href: "/home",
    },
    {
      label: "Recipes",
      href: "/recipes",
    },
    {
      label: "Learning",
      href: "/learning",
    },
    {
      label: "Essentials",
      href: "/essentials",
    },
    {
      label: "My Cookbook",
      href: "/my-cookbook",
    },
  ],
  footer: {
    right: [
      {
        label: "Marketing",
        href: "/",
      },
      {
        label: "Blog",
        href: "/blog",
      },
    ],
  },
}
