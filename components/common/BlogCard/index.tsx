import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface BlogType {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  createdAt: Date;
  author: {
    id: string;
    name: string | null;
    avatar: string | null;
  };
}

export default function BlogCard({
  blog,
  showEdit = false,
}: {
  blog: Partial<BlogType>;
  showEdit?: boolean;
}) {
  console.log(blog);
  return (
    <Card className="bg-[#fff] max-w-[400px] min-h-[422px] text-[#212a3e] hover:shadow-lg transition-shadow duration-300 rounded-2xl overflow-hidden">
      <Link href={`/blogs/${blog.id}`}>
        <div className="relative w-full h-48 rounded-2xl">
          <Image
            src={`${blog?.imageUrl ?? "/Uploads/avatar.jpg"}`}
            alt={blog.title ?? ""}
            fill
            className="object-cover"
          />
        </div>
      </Link>
      <CardContent className="pb-4 space-y-3">
        <Link href={`/blogs/${blog.id}`}>
          <h2 className="!text-xl font-bold line-clamp-2 transition-colors duration-200">
            {blog.title}
          </h2>
        </Link>
        <p className="text-sm line-clamp-3 text-[#29344d]">
          {blog.description?.replace(/[#_*`>]/g, "").slice(0, 160)}...
        </p>
        <div className="flex items-center justify-between text-xs text-[#94a3b8] pt-2">
          <span>{new Date(blog.createdAt ?? "").toLocaleDateString()}</span>
          <Link
            href={`/blogs/${blog.id}`}
            className="text-[#ff7e29] font-medium"
          >
            Read more →
          </Link>
        </div>
        <Link
          href={`/users/${blog.author?.id}/blogs`}
          className="flex items-center gap-2 pt-2"
        >
          <div className="relative w-8 h-8 rounded-full overflow-hidden">
            <Image
              src={blog.author?.avatar ?? "/Uploads/avatar.jpg"}
              alt={blog.author?.name ?? "Author"}
              fill
              className="object-cover"
            />
          </div>
          <span className="text-sm font-medium text-[#212a3e] hover:text-[#ff7e29] transition-colors">
            {blog.author?.name ?? "Unknown Author"}
          </span>
        </Link>
        {showEdit && (
          <div className="flex justify-end gap-2 pt-2">
            <Link href={`/dashboard/blogs/edit/${blog.id}`}>
              <Button size="sm" variant="outline">
                Edit
              </Button>
            </Link>
            <form action={`/api/blog/delete`} method="POST">
              <input type="hidden" name="id" value={blog.id} />
              <Button size="sm" variant="destructive">
                Delete
              </Button>
            </form>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
