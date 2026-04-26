import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { checkSession } from "./lib/api/serverApi";

const PRIVATE_ROUTES = ["/notes", "/profile"];
const AUTH_ROUTES = ["/sign-in", "/sign-up"];

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

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
          const nextResponse = NextResponse.next();
          const setCookie = response.headers["set-cookie"] as
            | string
            | string[]
            | undefined;
          if (setCookie) {
            const list = Array.isArray(setCookie) ? setCookie : [setCookie];
            list.forEach((c) => nextResponse.headers.append("set-cookie", c));
          }
          return nextResponse;
        } catch {
          return NextResponse.redirect(new URL("/sign-in", req.url));
        }
      } else {
        return NextResponse.redirect(new URL("/sign-in", req.url));
      }
    }
  }

  if (isAuth && accessToken) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}
