"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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

      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, isBlocked: !currentStatus } : u))
      );
      toast.success(data.message ?? "User status updated");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="rounded-md border bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead className="w-[120px]">Status</TableHead>
            <TableHead className="text-right w-[150px]">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.name ?? "-"}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                {user.isBlocked ? (
                  <span className="rounded bg-red-100 px-2 py-1 text-xs font-semibold text-red-600">
                    Blocked
                  </span>
                ) : (
                  <span className="rounded bg-green-100 px-2 py-1 text-xs font-semibold text-green-600">
                    Active
                  </span>
                )}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant={user.isBlocked ? "secondary" : "destructive"}
                  size="sm"
                  onClick={() => toggleBlock(user.id, user.isBlocked)}
                >
                  {user.isBlocked ? "Unblock" : "Block"}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
