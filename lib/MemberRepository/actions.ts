"use server";
import { db } from "@/db";
import { membersTable, booksTable } from "@/drizzle/schema";
import { eq, like, and, gt } from "drizzle-orm";
import {
  iBook,
  iBookBase,
  iMember,
  iMemberBase,
  Request,
  RequestStatistics,
} from "../types";
import {
  create,
  deleteMember,
  fetchUsers,
  getUserById,
  updateMember,
} from "./repository";

export async function getUsers(
  searchTerm: string,
  currentPage: number,
  usersPerPage: number
) {
  const { users, totalPages } = await fetchUsers(
    searchTerm,
    currentPage,
    usersPerPage
  );
  if (users) {
    return { users, totalPages };
  } else {
    throw new Error("Error while fetching users");
  }
}
export async function createMember(member: iMemberBase) {
  try {
    console.log("Creating member with data:", member);
    const newMember = await create(member);
    return newMember;
  } catch (error) {
    console.error("Error creating member:", error);
    throw new Error("Failed to create member");
  }
}
export const handleUserUpdate = async (id: number, updatedUser: iMember) => {
  try {
    await updateMember(id, updatedUser);
    return { success: true, message: "User updated successfully!" };
  } catch (error) {
    console.error("Error updating user:", error);
    return { success: false, message: "Failed to update the user." };
  }
};
export const handleUserDelete = async (id: number) => {
  try {
    await deleteMember(id);

    return { success: true, message: "User deleted successfully!" };
  } catch (error) {
    console.error("Error deleting user:", error);
    return { success: false, message: "Failed to delete the user." };
  }
};
export const fetchUserDetails = async (id: number): Promise<iMember | null> => {
  return await getUserById(id);
};
