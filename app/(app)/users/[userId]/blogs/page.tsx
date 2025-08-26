"use client";

import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { motion } from "framer-motion";
import BlogCard from "@/components/common/BlogCard";
import { useQuery } from "@tanstack/react-query";
import { getUserBlogs } from "@/services/user";

export default function UserBlogsPage() {
  const params = useParams();
  const userId = params.userId as string;

  const { data, isError, isLoading } = useQuery({
    queryFn: () => getUserBlogs(userId),
    queryKey: ["userId", userId],
  });
  console.log("data", data);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-foreground">Loading...</p>
      </div>
    );
  }

  if (isError) {
    return null; // Redirect handled in useEffect
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* User Header */}
        <div className="max-w-4xl mx-auto mb-8 text-center">
          <div className="relative w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden">
            {data.data.blogs.avatar && (
              <Image
                src={data.data.blogs.avatar}
                alt={data.data.blogs ?? "User"}
                fill
                className="object-cover"
              />
            )}
          </div>
          <h1 className="text-3xl font-semibold text-primary">
            {data.data.blogs.name
              ? `${data.data.blogs.name}'s Blogs`
              : "User Blogs"}
          </h1>
        </div>

        {/* Blogs Grid */}
        <div className="max-w-7xl mx-auto">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-foreground">
                Published Blogs
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data.data.blogs.writtenBlogs.length === 0 ? (
                <p className="text-muted-foreground text-center">
                  No published blogs found.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {data.data.blogs.writtenBlogs.map((blog) => (
                    <BlogCard key={blog.id} blog={blog} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}
