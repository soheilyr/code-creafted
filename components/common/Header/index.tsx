"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Logo from "../../../public/logo-light.svg";
import Image from "next/image";
import { LayoutDashboard, LogInIcon, LogOut, User } from "lucide-react";
import { useUserInfo } from "@/store/userInfoStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navItems = [
  { name: "Home", href: "/" },
  { name: "Explore", href: "/" },
  { name: "Faq", href: "/faq" },
  { name: "Blogs", href: "/blogs" },
  { name: "About Us", href: "/about" },
];

const Header = () => {
  const pathname = usePathname();
  const { userInfo, setUserinfo } = useUserInfo();
  const router = useRouter();

  const handleLogout = () => {
    // Clear user info from Zustand store
    setUserinfo(null);
    // Optionally clear token from localStorage (if used)
    localStorage.removeItem("authToken");
    // Redirect to login page
    router.push("/auth/login");
  };

  return (
    <header className="bg-[#212a35] text-[#f1f6f9] shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 text-xl font-bold text-[#f1f6f9]">
            <Link href="/">
              <Image width={150} src={Logo} alt="logo" />
            </Link>
          </div>

          {/* Nav */}
          <nav className="hidden md:flex space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "text-md font-medium hover:text-[#aab6c3] transition-colors",
                  pathname === item.href && "text-[#cbd5e1]"
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* User Actions */}
          <div className="hidden md:flex">
            {userInfo ? (
              <DropdownMenu>
                <DropdownMenuTrigger
                  className={buttonVariants({
                    variant: "outline",
                    className: "flex items-center gap-2 text-[#212a35]",
                  })}
                >
                  <User className="text-[#212a35]" />
                  {userInfo.name}
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="bg-background text-foreground border-border"
                >
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">
                      <LayoutDashboard />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-destructive hover:text-destructive/90 cursor-pointer"
                  >
                    <LogOut className="text-destructive" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                className={buttonVariants({
                  variant: "outline",
                  className: "flex items-center gap-2 text-[#212a35]",
                })}
                href="/auth/login"
              >
                <LogInIcon className="text-[#212a35]" />
                Login
              </Link>
            )}
          </div>

          {/* Mobile menu toggle - if needed later */}
        </div>
      </div>
    </header>
  );
};

export default Header;
