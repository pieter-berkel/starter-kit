"use client";

import { Button } from "@workspace/ui/components/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  {
    label: "Account",
    href: "/hub/settings/account",
  },
  {
    label: "Organization",
    href: "/hub/settings/organization",
  },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 p-6 sm:px-12 sm:py-8">
      <div className="flex flex-col gap-4">
        <h1 className="font-bold text-3xl">Settings</h1>
        <div className="flex flex-wrap gap-3">
          {items.map((item) => (
            <Button
              className={pathname === item.href ? "bg-accent text-accent-foreground" : ""}
              key={item.href}
              nativeButton={false}
              render={<Link href={item.href} />}
              size="sm"
              variant="ghost"
            >
              {item.label}
            </Button>
          ))}
        </div>
      </div>
      {children}
    </div>
  );
}
