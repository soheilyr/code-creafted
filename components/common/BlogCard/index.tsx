import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function BlogCard({
  blog,
  showEdit = false,
}: {
  blog: Partial<BlogType>;
  showEdit: boolean;
}) {
  return (
    <Card className="bg-[#fff] max-w-[400px] text-[#212a3e] hover:shadow-lg transition-shadow duration-300 rounded-2xl overflow-hidden">
      <Link href={`/blog/${blog.id}`}>
        <div className="relative w-full h-48 rounded-2xl">
          <Image
            src={blog.imageUrl || "/placeholder.jpg"}
            alt={blog.title}
            fill
            className="object-cover"
          />
        </div>
      </Link>
      <CardContent className="pb-4 space-y-3">
        <Link href={`/blog/${blog.id}`}>
          <h2 className="text-xl font-bold  transition-colors duration-200">
            {blog.title}
          </h2>
        </Link>
        <p className="text-sm  line-clamp-3 text-[#29344d]">
          {blog.content?.replace(/[#_*`>]/g, "").slice(0, 160)}...
        </p>
        <Link
          href={`/blog/${blog.id}`}
          className="flex items-center justify-between text-xs text-[#94a3b8] pt-2"
        >
          <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
          <span className="text-[#ff7e29] font-medium">Read more →</span>
        </Link>
        {showEdit && (
          <div className="flex justify-end gap-2 pt-2">
            <Link href={`/profile/edit/${blog.id}`}>
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
