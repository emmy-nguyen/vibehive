import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import { db, eq } from "@/db/index";
import { z } from "zod";
import { users } from "@/db/schema/users";

const handler = NextAuth({
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      credentials: {
        email: {},
        password: {},
      },

      async authorize(credentials, req) {
        // set the validation
        const userSchema = z.object({
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

        // check validatedData matching the requirements
        const validatedData = userSchema.safeParse(credentials);
        if (!validatedData.success) {
          throw new Error("Invalid credentials");
        }

        // if yes, check if Email is existing
        const { email, password } = validatedData.data;
        const response = await db
          .select()
          .from(users)
          .where(eq(users.email, email));

        if (response.length < 0) {
          throw new Error("Email not found");
        }
        const user = response[0];
        console.log("login user", user);

        // check if password is matching
        const isPasswordValid = await compare(password || "", user.password);
        console.log(isPasswordValid);
        if (!isPasswordValid) {
          throw new Error("Incorrect password");
        }
        return {
          id: String(user.id),
          email: user.email,
        };
      },
    }),
  ],
});

export { handler as GET, handler as POST };
