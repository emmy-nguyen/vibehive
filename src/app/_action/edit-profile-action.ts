import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { db, eq } from "@/db";
import { users } from "@/db/schema/users";

export async function editProfile(newUsername: string) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return { failure: true, message: "Not authenticated" };
  }
  try {
    const userId = session.user.id;
    const result = await db
      .update(users)
      .set({ username: newUsername })
      .where(eq(users.id, parseInt(userId)))
      .returning();
    if (result.length === 0) {
      console.log("Failed to update username");
      return { failure: true, message: "Failed to update username" };
    }
    console.log("Username updated successfully");
    return { success: "Username updated successfully" };
  } catch (err) {
    console.error("Error updating username", err);
    return { failure: true, message: "Error updating username" };
  }
}
