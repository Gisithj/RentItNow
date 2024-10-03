"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "../components/sidebar";
import router from "next/router";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { usePathname, useRouter } from "next/navigation";
import { Spinner } from "@nextui-org/react";

function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname()
  const sideBarTab = useSelector(
    (state: RootState) => state.sidebar.activeSideBarTab
  );
  const user = useSelector((state: RootState) => state.auth.user);
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push(`/auth/sign-in?redirect=${encodeURIComponent(pathname)}`);
    } else if (user && !user.userRoles.includes("Renter")) {
      router.push("/not-found");
    } else {
      setIsLoading(false);    
    }
  }, [user, isLoggedIn]);

  if (isLoading) {
    return <Spinner />; // Show loader while verifying
  }

  return (
    <div className="flex flex-row px-4 md:px-32 py-4 md:py-20 gap-10">
      <Sidebar />
      {children}
    </div>
  );
}

export default DashboardLayout;
