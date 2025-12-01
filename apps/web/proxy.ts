import { auth } from "@workspace/auth";
import { cookies, headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

export const proxy = async (request: NextRequest) => {
  const cookieStore = await cookies();
  const pathname = request.nextUrl.pathname;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (pathname.startsWith("/invitation")) {
    if (!session) {
      const invitationId = pathname.split("/").filter(Boolean).pop();
      if (invitationId) {
        const redirectURL = `/invitation/${invitationId}`;
        cookieStore.set("better-auth.redirect", redirectURL, { maxAge: 3600 });
      }
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
    return NextResponse.next();
  }

  if (!session) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  const redirectCookie = cookieStore.get("better-auth.redirect");
  if (redirectCookie?.value) {
    cookieStore.delete("better-auth.redirect");
    return NextResponse.redirect(new URL(redirectCookie.value, request.url));
  }

  if (pathname === "/select-organization") {
    return NextResponse.next();
  }

  if (!session.session.activeOrganizationId) {
    return NextResponse.redirect(new URL("/select-organization", request.url));
  }

  return NextResponse.next();
};

export const config = {
  matcher: ["/hub/:path*", "/invitation/:path*", "/select-organization"],
};
