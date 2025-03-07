import Link from "next/link"
import { redirect } from "next/navigation"

import { afterSignInUrl, forgotPasswordUrl } from "@/config"
import { getCurrentUser } from "@/lib/session"
import { ResetPasswordForm } from "@/containers/reset-password-form"
import { Logo } from "@/components/logo"

interface ResetPasswordPageProps {
  searchParams: Promise<{ token?: string }>
}

export default async function ResetPasswordPage(props: ResetPasswordPageProps) {
  const user = await getCurrentUser()

  if (user) {
    redirect(afterSignInUrl)
  }

  const { token } = await props.searchParams

  if (!token) {
    redirect(forgotPasswordUrl)
  }

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
            Reset Your Password
          </h2>
          <p className="text-center text-base">
            Change your password to something more memorable
          </p>
        </div>
        <ResetPasswordForm token={token} />

        <div>
          <p className="text-center">
            Remember your password?{" "}
            <Link href="/sign-in" className="text-primary hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
