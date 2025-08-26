import { Separator } from "@/components/ui/separator";
import { FileText, Heart, LayoutDashboard, Users } from "lucide-react";
import Link from "next/link";

export default function Sidebar() {
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

          <Link
            href="/dashboard/blogs"
            className="flex items-center gap-2 p-2 rounded-md hover:bg-sidebar-accent text-sidebar-foreground"
          >
            <FileText className="h-5 w-5" />
            My Blogs
          </Link>
          <Link
            href="/dashboard/followers"
            className="flex items-center gap-2 p-2 rounded-md hover:bg-sidebar-accent text-sidebar-foreground"
          >
            <Users className="h-5 w-5" />
            Followers
          </Link>
          <Link
            href="/dashboard/following"
            className="flex items-center gap-2 p-2 rounded-md hover:bg-sidebar-accent text-sidebar-foreground"
          >
            <Heart className="h-5 w-5" />
            Following
          </Link>
        </nav>
      </div>
    </aside>
  );
}
