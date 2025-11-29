import { auth } from "@workspace/auth";
import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

export const proxy = async (request: NextRequest) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (!session.session.activeOrganizationId) {
    return NextResponse.redirect(new URL("/onboarding", request.url));
  }

  return NextResponse.next();
};

export const config = {
  matcher: ["/hub/:path*"],
};
