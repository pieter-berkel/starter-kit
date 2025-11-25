"use client";

import { Button, buttonVariants } from "@workspace/ui/components/button";
import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="grid min-h-full place-items-center px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        <p className="font-semibold text-base text-primary">500</p>
        <h1 className="mt-4 text-balance font-semibold text-5xl tracking-tight sm:text-7xl">
          Something went wrong!
        </h1>
        <p className="mt-6 text-pretty font-medium text-lg text-muted-foreground sm:text-xl/8">
          An unexpected error occurred. Please try again.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Button onClick={reset} size="lg">
            Try again
          </Button>
          <Link
            className={buttonVariants({ size: "lg", variant: "ghost" })}
            href="/"
          >
            Go back home <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
