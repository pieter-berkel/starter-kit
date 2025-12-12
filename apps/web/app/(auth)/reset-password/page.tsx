import Link from "next/link";
import { ResetPasswordForm } from "./_components/reset-password-form";

export default async function Page(props: PageProps<"/reset-password">) {
  const { token } = await props.searchParams;

  if (typeof token !== "string") {
    throw new Error("Token is required");
  }

  return (
    <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-6 text-center font-bold text-3xl tracking-tight">Reset your password</h2>
        <p className="mt-2 text-center text-muted-foreground text-sm">
          Please enter your new password to reset your password
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <ResetPasswordForm token={token} />

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
