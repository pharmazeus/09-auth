import { NextRequest, NextResponse } from "next/server";
import { checkSession } from "./lib/api/serverApi";

const PRIVATE_ROUTES = ["/notes", "/profile"];
const AUTH_ROUTES = ["/sign-in", "/sign-up"];

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const accessToken = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;

  const isPrivate = PRIVATE_ROUTES.some((p) => pathname.startsWith(p));
  const isAuth = AUTH_ROUTES.some((p) => pathname.startsWith(p));

  if (isPrivate) {
    if (!accessToken) {
      if (refreshToken) {
        try {
          const response = await checkSession();
          if (!response.data.success) {
            return NextResponse.redirect(new URL("/sign-in", req.url));
          }
        } catch {
          return NextResponse.redirect(new URL("/sign-in", req.url));
        }
      } else {
        return NextResponse.redirect(new URL("/sign-in", req.url));
      }
    }
  }

  if (isAuth && accessToken) {
    return NextResponse.redirect(new URL("/profile", req.url));
  }

  return NextResponse.next();
}
