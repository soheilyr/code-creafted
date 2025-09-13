"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface User {
  id: string;
  name?: string;
  email: string;
  isBlocked: boolean;
}

interface Props {
  users: User[];
}

export default function UsersTable({ users: initialUsers }: Props) {
  const [users, setUsers] = useState<User[]>(initialUsers);

  const toggleBlock = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/users/${id}/block`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ block: !currentStatus }),
      });

      if (!res.ok) throw new Error("Failed to update");

      const data = await res.json();

      setUsers(
        users.map((u) =>
          u.id === id ? { ...u, isBlocked: !currentStatus } : u
        )
      );
      toast.success(data.message ?? "User status updated");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  return (
    <table className="min-w-full border">
      <thead>
        <tr className="bg-gray-100">
          <th className="px-4 py-2">Name</th>
          <th className="px-4 py-2">Email</th>
          <th className="px-4 py-2">Status</th>
          <th className="px-4 py-2">Action</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id} className="border-t">
            <td className="px-4 py-2">{user.name ?? "-"}</td>
            <td className="px-4 py-2">{user.email}</td>
            <td className="px-4 py-2">
              {user.isBlocked ? (
                <span className="text-red-500 font-medium">Blocked</span>
              ) : (
                <span className="text-green-600 font-medium">Active</span>
              )}
            </td>
            <td className="px-4 py-2">
              <Button
                variant={user.isBlocked ? "secondary" : "destructive"}
                onClick={() => toggleBlock(user.id, user.isBlocked)}
              >
                {user.isBlocked ? "Unblock" : "Block"}
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
