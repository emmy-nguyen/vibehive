import { db, eq } from "@/db/index";
import { users } from "@/db/schema/users";
import React from "react";
import Profile from "./profile";

export default async function ProfilePage({
  params,
}: {
  params: { userId: string };
}) {
  const user = await db
    .select()
    .from(users)
    .where(eq(users.id, parseInt(params.userId)))
    .then((result) => result[0]);

  if (!user) {
    return <div>User not found</div>;
  }

  return <Profile user={user} />;
}
