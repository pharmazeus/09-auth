"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { checkSession, logout } from "@/lib/api/clientApi";
import { getMe } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";

const PRIVATE_PATHS = ["/notes", "/profile"];

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isChecking, setIsChecking] = useState(true);
  const { setUser, clearIsAuthenticated, isAuthenticated } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();

  const isPrivate = PRIVATE_PATHS.some((p) => pathname.startsWith(p));

  useEffect(() => {
    async function check() {
      setIsChecking(true);
      try {
        const session = await checkSession();
        if (session.success) {
          const user = await getMe();
          setUser(user);
        } else if (isPrivate) {
          await logout().catch(() => {});
          clearIsAuthenticated();
          router.push("/sign-in");
        }
      } catch {
        if (isPrivate) {
          clearIsAuthenticated();
          router.push("/sign-in");
        }
      } finally {
        setIsChecking(false);
      }
    }
    check();
  }, [pathname]);

  if (isChecking) {
    return <div style={{ padding: "24px", textAlign: "center" }}>Loading...</div>;
  }

  if (isPrivate && !isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
