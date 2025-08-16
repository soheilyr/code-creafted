// components/SiteInfoProvider.tsx
"use client";

const intervalTime = +(
  process.env?.NEXT_PUBLIC_FETCH_SITEINFO_INTERVAL ?? 30000
);

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useUserInfo } from "../store/userInfoStore";

export const UserInfoProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { userInfo, fetchUserInfo } = useUserInfo();
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    if (!userInfo) {
      fetchUserInfo();
    }
  }, [userInfo, fetchUserInfo, router, pathname]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchUserInfo();
    }, intervalTime); // Refresh every 60 seconds
    return () => clearInterval(interval);
  }, [fetchUserInfo]);

  return <>{children}</>;
};
