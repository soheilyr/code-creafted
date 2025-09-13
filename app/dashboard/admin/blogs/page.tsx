"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface Blog {
  id: string;
  title: string;
  description: string;
  content?: string;
  imageUrl?: string;
  createdAt: string;
  published: boolean;
  author: { id: string; name: string; email: string; isBlocked: boolean };
  category?: { id: string; name: string };
}

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [pageSize] = useState(5);

  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);

  const fetchBlogs = async () => {
    const res = await fetch(
      `/api/admin/blogs?search=${search}&page=${page}&pageSize=${pageSize}`
    );
    const data = await res.json();
    setBlogs(data.blogs);
    setTotal(data.total);
  };

  useEffect(() => {
    fetchBlogs();
  }, [search, page]);

  const deleteBlog = async (id: string) => {
    try {
      await fetch(`/api/admin/blogs/${id}`, { method: "DELETE" });
      toast.success("Blog deleted");
      fetchBlogs();
    } catch {
      toast.error("Failed to delete blog");
    }
  };

  const banAuthor = async (id: string) => {
    try {
      await fetch(`/api/admin/users/${id}/block`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ block: true }),
      });
      toast.success("Author banned");
      fetchBlogs();
    } catch {
      toast.error("Failed to ban author");
    }
  };

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="flex items-center justify-between">
        <Input
          placeholder="Search blogs by title, description, or author..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {/* Blogs Table */}
      <div className="rounded-md border bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Published</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {blogs.map((blog) => (
              <TableRow
                key={blog.id}
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => setSelectedBlog(blog)}
              >
                <TableCell className="font-medium">{blog.title}</TableCell>
                <TableCell>{blog.author?.name ?? "-"}</TableCell>
                <TableCell>{blog.category?.name ?? "-"}</TableCell>
                <TableCell>
                  {blog.published ? (
                    <span className="rounded bg-green-100 px-2 py-1 text-xs font-semibold text-green-600">
                      Published
                    </span>
                  ) : (
                    <span className="rounded bg-yellow-100 px-2 py-1 text-xs font-semibold text-yellow-600">
                      Draft
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  {new Date(blog.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteBlog(blog.id);
                    }}
                  >
                    Delete
                  </Button>
                  {!blog.author.isBlocked && (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        banAuthor(blog.author.id);
                      }}
                    >
                      Ban Author
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex justify-end gap-2">
        <Button
          size="sm"
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
        >
          Prev
        </Button>
        <Button
          size="sm"
          disabled={page * pageSize >= total}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </Button>
      </div>

      {/* Blog Detail Modal */}
      <Dialog open={!!selectedBlog} onOpenChange={() => setSelectedBlog(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{selectedBlog?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedBlog?.imageUrl && (
              <img
                src={selectedBlog.imageUrl}
                alt={selectedBlog.title}
                className="w-full rounded-md"
              />
            )}
            <p className="text-sm text-gray-500">
              Author: {selectedBlog?.author?.name} (
              {selectedBlog?.author?.email})
            </p>
            <p className="text-sm text-gray-500">
              Category: {selectedBlog?.category?.name ?? "—"}
            </p>
            <p className="text-sm text-gray-500">
              Status:{" "}
              {selectedBlog?.published ? "Published" : "Draft"}
            </p>
            <div className="prose max-w-none">
              <h4>Description</h4>
              <p>{selectedBlog?.description}</p>
              {selectedBlog?.content && (
                <>
                  <h4>Content</h4>
                  <p>{selectedBlog.content}</p>
                </>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
