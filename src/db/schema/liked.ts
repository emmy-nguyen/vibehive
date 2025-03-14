import {
  pgTable,
  text,
  varchar,
  integer,
  timestamp,
  serial,
} from "drizzle-orm/pg-core";
import { users } from "./users";
import { songs } from "./songs";

export const liked = pgTable("liked", {
  userId: integer("user_id").references(() => users.id),
  songId: integer("song_id").references(() => songs.id, {
    onDelete: "cascade",
  }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type Liked = typeof liked.$inferSelect;
