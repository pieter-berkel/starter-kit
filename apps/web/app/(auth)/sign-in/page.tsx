import Link from "next/link";
import { CredentialsForm } from "./_components/credentials-form";
import { SocialSignInButtons } from "./_components/social-sign-in-buttons";

export default function Page() {
  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-6 text-center font-bold text-3xl tracking-tight">Welcome back</h2>
        <p className="mt-2 text-center text-muted-foreground text-sm">
          Please sign in to your account to continue
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <CredentialsForm />
        <div>
          <div className="mt-10 flex items-center gap-x-6">
            <div className="w-full flex-1 border-t" />
            <p className="text-nowrap font-medium text-sm/6">Or continue with</p>
            <div className="w-full flex-1 border-t" />
          </div>
          <SocialSignInButtons className="mt-6" />
        </div>

        <p className="mt-10 text-center text-muted-foreground text-sm">
          Not a member?{" "}
          <Link
            className="font-semibold text-primary text-sm hover:text-primary/80"
            href="/sign-up"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
