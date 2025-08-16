import { Button } from "@/components/ui/button";
import Link from "next/link";
import BlogCard from "@/components/common/BlogCard";
import { getUserFromToken } from "@/server/auth/getUserFromToken";
import { notFound, redirect } from "next/navigation";
import { getUserBlogs } from "@/server/blogs/getUserBlogs";
import { cookies } from "next/headers";

export default async function ProfilePage() {
  const token = (await cookies()).get("token")?.value;
  if (!token) {
    redirect("/auth/login");
  }

  const user = await getUserFromToken(token); // e.g. from JWT middleware
  if (!user) {
    notFound();
  }
  const blogs = await getUserBlogs(user.id);

  return (
    <section className="min-h-screen px-4 py-8 bg-[#212a35] text-[#f1f6f9]">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="text-center">
          <h1 className="text-3xl font-bold mb-2">Welcome, {user.name} 👋</h1>
          {!user.isAdmin && (
            <>
              <p className="text-[#94a3b8]">
                Manage your blogs and create new ones!
              </p>
              <Link href="/dashboard/profile/blog/create">
                <Button className="mt-4 bg-[#ff7e29] text-white hover:bg-orange-500">
                  + New Blog
                </Button>
              </Link>
            </>
          )}
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {blogs.map((blog) => (
            <BlogCard key={blog.id} blog={blog} showEdit />
          ))}
        </div>
      </div>
    </section>
  );
}
