"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  getUserProfile,
  updateProfile,
  createBlog,
  getFollowers,
  getFollowing,
} from "@/services/user";
import Cookies from "js-cookie";
import { followUser } from "@/helper/user";

// Profile Form Schema
const profileSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be at most 20 characters"),
  avatar: z.string().url("Invalid URL").optional(),
});

// Blog Form Schema
const blogSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  content: z.string().min(20, "Content must be at least 20 characters"),
});

// Password Form Schema
const passwordSchema = z
  .object({
    currentPassword: z.string().min(8, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Confirm password is required"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const UserDashboard = () => {
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showCreateBlog, setShowCreateBlog] = useState(false);
  const [showUpdateProfile, setShowUpdateProfile] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // Fetch User Profile
  const {
    data: profile,
    isLoading: profileLoading,
    refetch,
  } = useQuery({
    queryKey: ["profile"],
    queryFn: () => getUserProfile(),
  });

  // Fetch Followers
  const { data: followers, isLoading: followersLoading } = useQuery({
    queryKey: ["followers"],
    queryFn: () => getFollowers(),
  });

  // Fetch Following
  const { data: following, isLoading: followingLoading } = useQuery({
    queryKey: ["following"],
    queryFn: () => getFollowing(),
  });

  // Profile Form
  const profileForm = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: profile?.name || "",
      avatar: profile?.avatar || "",
    },
  });

  // Blog Form
  const blogForm = useForm<z.infer<typeof blogSchema>>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  // Password Form
  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
  });

  // Update Profile Mutation
  const updateProfileMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      toast.success("Success", { description: "Profile updated successfully" });
      refetch();
      setShowUpdateProfile(false);
      setAvatarPreview(null);
      profileForm.reset();
    },
    onError: () => toast.error("Error"),
  });

  // Create Blog Mutation
  const createBlogMutation = useMutation({
    mutationFn: async ({
      file,
      ...data
    }: { file?: File } & z.infer<typeof blogSchema>) => {
      let imageUrl: string | undefined;
      if (file) {
        const token = Cookies.get("token");
        const formData = new FormData();
        formData.append("file", file);
        const uploadResponse = await fetch("/api/file", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` }, // Assuming token is available
          body: formData,
        });
        const uploadResult = await uploadResponse.json();
        if (uploadResult.status !== "success") {
          throw new Error(uploadResult.message || "Failed to upload image");
        }
        imageUrl = uploadResult.data.url;
      }
      return createBlog({ ...data, imageUrl });
    },
    onSuccess: () => {
      toast.success("Success", { description: "Blog created successfully" });
      setShowCreateBlog(false);
      blogForm.reset();
    },
    onError: () =>
      toast.error("Error", {
        description: "Failed to create blog",
      }),
  });

  // Handle Avatar Upload
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        profileForm.setValue("avatar", reader.result as string);
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onProfileSubmit = (data: z.infer<typeof profileSchema>) => {
    updateProfileMutation.mutate(data);
  };

  const onBlogSubmit = (data: z.infer<typeof blogSchema>) => {
    createBlogMutation.mutate(data);
  };

  const onPasswordSubmit = (data: z.infer<typeof passwordSchema>) => {
    // Implement password change logic here
    toast.success("Success", { description: "Password changed successfully" });
    setShowChangePassword(false);
    passwordForm.reset();
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row items-center gap-6">
          {profileLoading ? (
            <Loader2 className="animate-spin" />
          ) : (
            <>
              <Avatar className="w-32 h-32">
                <AvatarImage src={profile?.avatar} alt="Avatar" />
                <AvatarFallback>USER</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold">{profile?.name}</h2>
                <p className="text-gray-600">{profile?.email}</p>
                <div className="flex gap-4 mt-4">
                  <Button onClick={() => setShowUpdateProfile(true)}>
                    Edit Profile
                  </Button>
                  <Button onClick={() => setShowChangePassword(true)}>
                    Change Password
                  </Button>
                  <Button onClick={() => setShowCreateBlog(true)}>
                    Create Blog
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="followers" className="mb-6">
        <TabsList>
          <TabsTrigger value="followers">Followers</TabsTrigger>
          <TabsTrigger value="following">Following</TabsTrigger>
        </TabsList>
        <TabsContent value="followers">
          <Card>
            <CardHeader>
              <CardTitle>Followers</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Username</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {followersLoading ? (
                    <TableRow>
                      <TableCell className="text-center">
                        <Loader2 className="animate-spin" />
                      </TableCell>
                    </TableRow>
                  ) : followers?.length ? (
                    followers.map((follower) => (
                      <TableRow key={follower.id}>
                        <TableCell>{follower.username}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell className="text-center">
                        No followers
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="following">
          <Card>
            <CardHeader>
              <CardTitle>Following</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Username</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {followingLoading ? (
                    <TableRow>
                      <TableCell className="text-center">
                        <Loader2 className="animate-spin" />
                      </TableCell>
                    </TableRow>
                  ) : following?.length ? (
                    following.map((followed) => (
                      <TableRow key={followed.id}>
                        <TableCell>{followed.username}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell className="text-center">
                        No following
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Update Profile Dialog */}
      <Dialog open={showUpdateProfile} onOpenChange={setShowUpdateProfile}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={profileForm.handleSubmit((data) =>
              updateProfileMutation.mutate({
                avatar: profileForm.watch("avatar"),
                ...data,
              })
            )}
          >
            <div>
              <Label htmlFor="title">username</Label>
              <Input id="title" {...profileForm.register("username")} />
              {profileForm.formState.errors.username && (
                <p className="text-red-500 text-sm">
                  {profileForm.formState.errors.username.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="file">Avatar</Label>
              <Input
                id="file"
                type="file"
                accept="image/*"
                onChange={(e) => handleChangeProfileAvatar(e.target.files[0])}
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
        </DialogContent>
      </Dialog>

      {/* Create Blog Dialog */}
      <Dialog open={showCreateBlog} onOpenChange={setShowCreateBlog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Blog</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={blogForm.handleSubmit(onBlogSubmit)}
            className="space-y-4"
          >
            <div>
              <Label htmlFor="title">Title</Label>
              <Input id="title" {...blogForm.register("title")} />
              {blogForm.formState.errors.title && (
                <p className="text-red-500 text-sm">
                  {blogForm.formState.errors.title.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="content">Content</Label>
              <Textarea id="content" {...blogForm.register("content")} />
              {blogForm.formState.errors.content && (
                <p className="text-red-500 text-sm">
                  {blogForm.formState.errors.content.message}
                </p>
              )}
            </div>
            <Button type="submit" disabled={createBlogMutation.isPending}>
              {createBlogMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Create Blog"
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog open={showChangePassword} onOpenChange={setShowChangePassword}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
            className="space-y-4"
          >
            <div>
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                {...passwordForm.register("currentPassword")}
              />
              {passwordForm.formState.errors.currentPassword && (
                <p className="text-red-500 text-sm">
                  {passwordForm.formState.errors.currentPassword.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                {...passwordForm.register("newPassword")}
              />
              {passwordForm.formState.errors.newPassword && (
                <p className="text-red-500 text-sm">
                  {passwordForm.formState.errors.newPassword.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                {...passwordForm.register("confirmPassword")}
              />
              {passwordForm.formState.errors.confirmPassword && (
                <p className="text-red-500 text-sm">
                  {passwordForm.formState.errors.confirmPassword.message}
                </p>
              )}
            </div>
            <Button type="submit" disabled={true}>
              {" "}
              {/* Change Password Logic Not Implemented */}
              Change Password
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserDashboard;
