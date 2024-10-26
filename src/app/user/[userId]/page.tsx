import { db, eq } from "@/db/index";
import { users } from "@/db/schema/users";
import React from "react";
import Profile from "./profile";
import { songs } from "@/db/schema/songs";
import { getSongsByUser } from "@/app/_action/get-songs-by-user-action";

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

  const songsByUser = await getSongsByUser();

  return <Profile user={user} songs={songsByUser || []} />;
}
