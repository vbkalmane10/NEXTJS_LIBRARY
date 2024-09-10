// /app/api/auth/signup/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { db } from "@/db";
import { membersTable } from "@/db/schema";

export async function POST(request: Request) {
  const { firstName, lastName, email, password, phoneNumber, address } =
    await request.json();

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    
    await db
      .insert(membersTable)
      .values({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        phoneNumber,
        address,
        membershipStatus: "active",
        role: "member", 
      })
      .execute();

    return NextResponse.json(
      { message: "User created successfully" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error: "Error creating user" }, { status: 500 });
  }
}
