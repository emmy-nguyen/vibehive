import {
  pgTable,
  text,
  varchar,
  integer,
  timestamp,
  serial,
} from "drizzle-orm/pg-core";
import { users } from "./users";

export const songs = pgTable("songs", {
  id: serial("id").primaryKey().notNull(),
  title: varchar("title", { length: 500 }).notNull(),
  artist: varchar("artist", { length: 500 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  songPath: varchar("song_path", { length: 1024 }).notNull(),
  imagePath: varchar("image_path", { length: 1024 }),
  userId: serial("user_id").references(() => users.id),
});

export type Song = typeof songs.$inferSelect;
export type NewSong = typeof songs.$inferInsert;
