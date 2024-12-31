import Link from "next/link"
import { redirect } from "next/navigation"

import { afterSignInUrl } from "@/config"
import { pathIsUrl } from "@/lib/path-is-url"
import { getCurrentUser } from "@/lib/session"
import { SignUpForm } from "@/containers/sign-up-form"
import { Logo } from "@/components/logo"

interface SignUpPageProps {
  searchParams: Promise<{ from?: string }>
}

export default async function SignUpPage(props: SignUpPageProps) {
  const user = await getCurrentUser()

  if (user) {
    redirect(afterSignInUrl)
  }

  const { from } = await props.searchParams
  const fromIsNotUrl = !pathIsUrl(from || "")

  return (
    <div className="flex h-full flex-col justify-between space-y-8 px-4 py-8">
      <Link href="/">
        <p className="text-center text-3xl font-bold">
          <Logo />
        </p>
      </Link>
      <div className="space-y-8">
        <div className="space-y-3">
          <h2 className="text-center text-2xl font-bold md:text-3xl">
            Get Started
          </h2>
          <p className="text-center text-base">
            Welcome to{" "}
            <span className="font-bold">
              <Logo />
            </span>{" "}
            - Let&apos;s create your account
          </p>
        </div>
        <SignUpForm from={fromIsNotUrl ? from : undefined} />
      </div>
      <div>
        <p className="text-center">
          Already have an account?{" "}
          <Link
            href={`/sign-in${fromIsNotUrl ? `?from=${from}` : ""}`}
            className="text-primary hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  )
}
