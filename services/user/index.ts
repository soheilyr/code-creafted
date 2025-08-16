import { getToken } from "@/lib/utils";
import z from "zod";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

export const getUserProfile = async (): Promise<User> => {
  const token = getToken();
  if (!token) throw new Error("No token found");

  const response = await fetch(`${API_URL}/api/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch profile");
  }

  return response.json();
};

export const updateProfile = async (data: z.infer<typeof profileSchema>) => {
  const token = getToken();
  if (!token) throw new Error("No token found");

  const response = await fetch(`${API_URL}/api/profile`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update profile");
  }

  return response.json();
};

export const createBlog = async (data) => {
  const token = getToken();
  if (!token) throw new Error("No token found");

  const response = await fetch(`${API_URL}/api/blog`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      token: `${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to create blog");
  }

  return response.json();
};

export const getFollowers = async () => {
  const token = getToken();
  if (!token) throw new Error("No token found");

  const response = await fetch(`${API_URL}/api/user/follower`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch followers");
  }

  return response.json();
};

export const getFollowing = async () => {
  const token = getToken();
  if (!token) throw new Error("No token found");

  const response = await fetch(`${API_URL}/api/user/following`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch following");
  }

  return response.json();
};
