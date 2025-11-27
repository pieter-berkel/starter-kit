import { Card, CardContent } from "@workspace/ui/components/card";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { SocialSignInButtons } from "../_components/social-sign-in-buttons";
import { ForgotPasswordForm } from "./_components/forgot-password-form";

export default function Page() {
  return (
    <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Logo className="mx-auto w-10" />
        <h2 className="mt-6 text-center font-bold text-2xl tracking-tight">
          Forgot your password?
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <Card>
          <CardContent className="p-6 sm:px-12">
            <ForgotPasswordForm />
            <div>
              <div className="mt-10 flex items-center gap-x-6">
                <div className="w-full flex-1 border-t" />
                <p className="text-nowrap font-medium text-sm/6">Or continue with</p>
                <div className="w-full flex-1 border-t" />
              </div>
              <SocialSignInButtons className="mt-6" />
            </div>
          </CardContent>
        </Card>

        <p className="mt-10 text-center text-muted-foreground text-sm">
          Remember your password?{" "}
          <Link
            className="font-semibold text-primary text-sm hover:text-primary/80"
            href="/sign-in"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
