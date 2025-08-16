"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import RichTextEditor from "@/components/ReachTextEditor";
import { createBlog } from "@/services/user";
import { useUserInfo } from "@/store/userInfoStore";
import { uploadFileService } from "@/services/file/upload";

// Form Schema
const blogSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  content: z.string().min(20, "Content must be at least 20 characters"),
  image: z.string().optional(),
  published: z.boolean().default(false),
  categoryId: z.string().optional(),
});

const CreateBlogPage = () => {
  const router = useRouter();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { userInfo } = useUserInfo();
  // Fetch Categories
  // const { data: categories, isLoading: categoriesLoading } = useQuery({
  //   queryKey: ["categories"],
  //   queryFn: getCategories,
  // });

  // Form Setup
  const form = useForm<z.infer<typeof blogSchema>>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: "",
      description: "",
      content: "",
      published: false,
      categoryId: "",
    },
  });

  // Blog Creation Mutation
  const createBlogMutation = useMutation({
    mutationFn: async (data: z.infer<typeof blogSchema>) =>
      createBlog({ ...data, content: data.content }), // Replace 'userId' with actual user ID from token
    onSuccess: () => {
      toast.success("Success", { description: "Blog created successfully" });
    },
    onError: () =>
      toast.error("Error", { description: "Failed to create blog" }),
  });
  const uploadFileMutation = useMutation({
    mutationFn: (data: FormData) => uploadFileService(data),
    onSuccess: (data) => {
      toast.success("Success", { description: "Blog created successfully" });
      setImagePreview(data.data.url);
      form.setValue("image", data.data.url);
    },
    onError: () =>
      toast.error("Error", { description: "Failed to create blog" }),
  });

  // Handle Image Change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("handler");
    const formData = new FormData();
    if (e.target.files && e.target?.files[0]) {
      formData.append("file", e.target.files[0]);
      uploadFileMutation.mutate(formData);
    }
  };

  // Form Submit
  const onSubmit = (data: z.infer<typeof blogSchema>) => {
    createBlogMutation.mutate(data);
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Create Blog</h1>
        <Link href="/user/dashboard">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input id="title" {...form.register("title")} />
          {form.formState.errors.title && (
            <p className="text-red-500 text-sm">
              {form.formState.errors.title.message}
            </p>
          )}
          {console.log(form.formState.errors)}
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" {...form.register("description")} />
          {form.formState.errors.description && (
            <p className="text-red-500 text-sm">
              {form.formState.errors.description.message}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="content">Content</Label>
          <RichTextEditor
            content={form.watch("content")}
            onChange={(content) => form.setValue("content", content)}
          />
          {form.formState.errors.content && (
            <p className="text-red-500 text-sm">
              {form.formState.errors.content.message}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="image">Image</Label>
          <Input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="mt-2 w-64 h-64 object-cover rounded-md"
            />
          )}
          {form.formState.errors.image && (
            <p className="text-red-500 text-sm">
              {form.formState.errors.image.message}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="categoryId">Category</Label>
          {/* <Select
            onValueChange={(value) => form.setValue("categoryId", value)}
            defaultValue={form.watch("categoryId")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categoriesLoading ? (
                <SelectItem value="loading">Loading...</SelectItem>
              ) : (
                categories?.map((category: Category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select> */}
          {form.formState.errors.categoryId && (
            <p className="text-red-500 text-sm">
              {form.formState.errors.categoryId.message}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="published">Publish</Label>
          <input
            type="checkbox"
            id="published"
            {...form.register("published")}
            className="ml-2"
          />
        </div>
        <Button type="submit" disabled={createBlogMutation.isPending}>
          {createBlogMutation.isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            "Create Blog"
          )}
        </Button>
      </form>
    </div>
  );
};

export default CreateBlogPage;
