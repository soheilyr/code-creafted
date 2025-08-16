"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useUserInfo } from "@/store/userInfoStore";
import { FileText, LayoutDashboard, Menu, Tag, Users } from "lucide-react";
import Link from "next/link";

export default function MobileSidebar() {
  const { userInfo } = useUserInfo();
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden m-4">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-64 bg-sidebar text-sidebar-foreground"
      >
        <div className="p-4">
          <h2 className="text-xl font-semibold text-sidebar-primary">
            Dashboard
          </h2>
          <Separator className="my-4 bg-sidebar-border" />
          <nav className="space-y-2">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 p-2 rounded-md hover:bg-sidebar-accent text-sidebar-foreground"
            >
              <LayoutDashboard className="h-5 w-5" />
              Overview
            </Link>
            {userInfo?.isAdmin && (
              <>
                <Link
                  href="/dashboard/users"
                  className="flex items-center gap-2 p-2 rounded-md hover:bg-sidebar-accent text-sidebar-foreground"
                >
                  <Users className="h-5 w-5" />
                  Manage Users
                </Link>
                <Link
                  href="/dashboard/blogs"
                  className="flex items-center gap-2 p-2 rounded-md hover:bg-sidebar-accent text-sidebar-foreground"
                >
                  <FileText className="h-5 w-5" />
                  Manage Blogs
                </Link>
                <Link
                  href="/dashboard/categories"
                  className="flex items-center gap-2 p-2 rounded-md hover:bg-sidebar-accent text-sidebar-foreground"
                >
                  <Tag className="h-5 w-5" />
                  Manage Categories
                </Link>
              </>
            )}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
}
