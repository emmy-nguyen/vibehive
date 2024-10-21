import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";
import { z } from "zod";

dotenv.config({
  path: ".env.local",
});

const PostgresEnv = z.object({
  MIGRATION_DATABASE_URL: z.string().url(),
});
const ProcessEnv = PostgresEnv.parse(process.env);

export default defineConfig({
  schema: "./src/db/schema/*",
  dialect: "postgresql",
  dbCredentials: {
    url: ProcessEnv.MIGRATION_DATABASE_URL!,
  },
  verbose: true,
  strict: true,
  out: "./drizzle",
});
