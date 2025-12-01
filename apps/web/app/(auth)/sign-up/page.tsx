import Link from "next/link";
import { SignUpForm } from "./_components/sign-up-form";

export default function Page() {
  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-6 text-center font-bold text-3xl tracking-tight">Welcome, sign up</h2>
        <p className="mt-2 text-center text-muted-foreground text-sm">
          Please sign up for an account to continue
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <SignUpForm />

        <p className="mt-10 text-center text-muted-foreground text-sm">
          Already have an account?{" "}
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
