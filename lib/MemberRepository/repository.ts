import { iBook, iBookBase, iMember, iMemberBase, iTransaction } from "../types";
import { booksTable, membersTable, transactionsTable } from "@/db/schema";
import { z } from "zod";
import { db } from "@/db";
import { eq, like, and, count } from "drizzle-orm";
import bcrypt from "bcrypt";
import { Request, RequestStatistics } from "../types";
const iMemberBaseSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().min(10, "Phone number is required"),
  address: z.string().min(1, "Address is required"),
  password: z.string().min(1, "Password is required"),
});
export async function create(
  member: iMemberBase
): Promise<{ message: string; user?: iMember }> {
  const validatedMember = iMemberBaseSchema.parse(member);
  const existingMembers = await db
    .select()
    .from(membersTable)
    .where(eq(membersTable.email, member.email))
    .execute();

  if (existingMembers.length > 0) {
    return {
      message: "Member Already exists",
      user: undefined,
    };
  } else {
    const hashedPassword = await bcrypt.hash(validatedMember.password, 10);
    const newMemberData: iMember = {
      ...validatedMember,
      password: hashedPassword,
      membershipStatus: "active",
      id: 0,
      role: "user",
    };

    await db.insert(membersTable).values(newMemberData).execute();
    return {
      message: "Member added successfully",
      user: newMemberData,
    };
  }
}
export async function fetchUsers(
    searchTerm: string,
    currentPage: number,
    usersPerPage: number
  ) {
    const limit = usersPerPage;
    const offset = (currentPage - 1) * limit;
  
    const usersQuery = db
      .select()
      .from(membersTable)
      .where(
        searchTerm
          ? and(like(membersTable.firstName, `%${searchTerm}%`))
          : undefined
      )
      .limit(limit)
      .offset(offset)
      .execute();
  
    const totalUsersQuery = db
      .select()
      .from(membersTable)
      .where(
        searchTerm
          ? and(like(membersTable.firstName, `%${searchTerm}%`))
          : undefined
      )
      .execute();
  
    const totalUsers = await totalUsersQuery;
  
    return {
      users: await usersQuery,
      totalPages: Math.ceil(totalUsers.length / limit),
    };
  }
  export async function getUserByEmail(email: string): Promise<iMember | null> {
    try {
      const [member] = await db
        .select()
        .from(membersTable)
        .where(eq(membersTable.email, email));
      return member || null;
    } catch (error) {
      throw new Error("Error while getting user by email");
    }
  }
  export async function getUserById(id: number): Promise<iMember | null> {
    try {
      const [member] = await db
        .select()
        .from(membersTable)
        .where(eq(membersTable.id, id));
      return member || null;
    } catch (error) {
      throw new Error("Error while getting user by id");
    }
  }
  export async function updateMember(
    id: number,
    data: iMemberBase
  ): Promise<iMember | null> {
    const existingMembers = await db
      .select()
      .from(membersTable)
      .where(eq(membersTable.id, id))
      .execute();
  
    if (existingMembers.length === 0) {
      console.log("NO MEMBERS FOUND");
      return null;
    }
  
    const existingMember = existingMembers[0];
    const updatedMember = {
      ...existingMember,
      ...data,
    };
  
    await db
      .update(membersTable)
      .set(updatedMember)
      .where(eq(membersTable.id, id))
      .execute();
  
    return updatedMember as iMember;
  }
  export async function deleteMember(id: number): Promise<iMember | undefined> {
    try {
      const existingMembers = await db
        .select()
        .from(membersTable)
        .where(eq(membersTable.id, id))
        .execute();
  
      if (existingMembers.length > 0) {
        const memberToDelete = existingMembers[0];
  
        await db.delete(membersTable).where(eq(membersTable.id, id)).execute();
  
        return memberToDelete as iMember;
      }
    } catch (error) {
      throw new Error("Member not found");
    }
  }
  export async function getUserId(email: string): Promise<number | null> {
    try {
      
      const [user] = await db
        .select({
          id: membersTable.id, 
        })
        .from(membersTable)
        .where(eq(membersTable.email, email))
        .execute();
  
      
      return user?.id ?? null;
    } catch (error) {
      console.error("Error fetching user ID:", error);
      return null; 
    }
  }
  