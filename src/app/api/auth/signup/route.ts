import { NextResponse } from "next/server";
import { hash } from "bcrypt";
import { db } from "@/db/index";
import { users } from "@/db/schema/users";
import { z } from "zod";
import { eq } from "@/db/index";

export async function POST(request: Request) {
  try {
    const { username, email, password } = await request.json();
    const userSchema = z.object({
      username: z
        .string()
        .min(5, "Username must be at least 5 characters long")
        .max(15, "Username must be 15 characters long")
        .regex(
          /^[a-zA-Z0-9]+$/,
          "Username can only contain alphanumeric characters"
        ),
      email: z.string().email("Please enter your valid email address"),
      password: z
        .string()
        .min(5, "Password must be at least 5 characters long")
        .max(15, "Password must be at least 15 characters long")
        .regex(
          /^[a-zA-Z0-9]+$/,
          "Password can only contain alphanumeric characters"
        ),
    });

    const validatedData = userSchema.safeParse({ username, email, password });
    if (!validatedData.success) {
      const error = validatedData.error.errors[0].code;
      if (error === "invalid_string") {
        console.log(
          "Your input is invalid. Username & password must be alphanumeric character and email should be email@example.com"
        );
        return NextResponse.json({
          message:
            "Your input is invalid. Username & password must be alphanumeric character and email should be email@example.com",
        });
      } else if (error === "too_small" || error === "too_big") {
        console.log(
          "Your username or password should be between 5 and 15 and alphanumeric characters"
        );
        return NextResponse.json({
          message:
            "Your username or password should be between 5 and 15 and alphanumeric characters",
        });
      }
    } else {
      const {
        username: validUsername,
        email: validEmail,
        password: validPassword,
      } = validatedData.data;

      // check username and email are unique or not
      const existingUser = await db
        .select()
        .from(users)
        .where(eq(username, validUsername));
      if (existingUser.length > 0) {
        console.log("Username is already taken");
        return NextResponse.json({ message: "Username is already taken" });
      }

      const existingEmail = await db
        .select()
        .from(users)
        .where(eq(email, validEmail));
      if (existingEmail.length > 0) {
        console.log("Email is already taken");
        return NextResponse.json({ message: "Email is already taken" });
      }

      // insert data to users table
      const hashedPassword = await hash(password, 10);

      const response = await db.insert(users).values({
        username: username,
        email: email,
        password: hashedPassword,
      });
    }
  } catch (e) {
    console.log({ e });
  }
  return NextResponse.json({ message: "success" });
}
