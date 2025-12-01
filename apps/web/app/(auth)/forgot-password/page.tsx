import Link from "next/link";
import { ForgotPasswordForm } from "./_components/forgot-password-form";

export default function Page() {
  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-6 text-center font-bold text-3xl tracking-tight">Forgot password?</h2>
        <p className="mt-2 text-center text-muted-foreground text-sm">
          Please enter your email address to reset your password
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <ForgotPasswordForm />

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
