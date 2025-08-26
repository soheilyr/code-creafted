"use client";

import * as React from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type User = {
  id: string;
  email: string;
  name: string;
  password: string;
  isAdmin: boolean;
  isBlocked: boolean;
  avatar: string | null;
};

interface UsersTableProps {
  data: User[];
}

export function UsersTable({ data }: UsersTableProps) {
  console.log("data", data);
  const [filter, setFilter] = React.useState("");

  return (
    <div className="w-full">
      <div className="flex items-center justify-between py-2">
        <Input
          placeholder="Search by name or email..."
          value={filter ?? ""}
          onChange={(e) => setFilter(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.email}</TableCell>
                <TableCell>{item.isBlocked ? "Blocked" : "Active"}</TableCell>
                <TableCell>{item.isAdmin ? "Admin" : "User"}</TableCell>
                <TableCell>
                  <Button variant="secondary" size="sm">
                    Block user
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
