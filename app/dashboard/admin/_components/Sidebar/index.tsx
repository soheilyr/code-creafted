"use client";
import { Separator } from "@/components/ui/separator";
import { useUserInfo } from "@/store/userInfoStore";
import { FileText, LayoutDashboard, Tag, Users } from "lucide-react";
import Link from "next/link";

export default function SideBar() {
  const { userInfo } = useUserInfo();
  return (
    <aside className="hidden md:block w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
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
                href="/dashboard/admin/users"
                className="flex items-center gap-2 p-2 rounded-md hover:bg-sidebar-accent text-sidebar-foreground"
              >
                <Users className="h-5 w-5" />
                Manage Users
              </Link>
              <Link
                href="/dashboard/admin/blogs"
                className="flex items-center gap-2 p-2 rounded-md hover:bg-sidebar-accent text-sidebar-foreground"
              >
                <FileText className="h-5 w-5" />
                Manage Blogs
              </Link>
              <Link
                href="/dashboard/admin/categories"
                className="flex items-center gap-2 p-2 rounded-md hover:bg-sidebar-accent text-sidebar-foreground"
              >
                <Tag className="h-5 w-5" />
                Manage Categories
              </Link>
            </>
          )}
        </nav>
      </div>
    </aside>
  );
}
