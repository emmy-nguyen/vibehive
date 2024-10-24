import NextAuth, { DefaultSession, SessionStrategy } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import { db, eq } from "@/db/index";
import { z } from "zod";
import { users } from "@/db/schema/users";
import { JWT } from "next-auth/jwt";
import { Session } from "next-auth";

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  }
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    } & DefaultSession["user"];
  }
}
export const authOptions = {
  session: {
    strategy: "jwt" as SessionStrategy,
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
          name: user.username,
        };
      },
    }),
  ],

  // extend id, name key saving in tokens and session
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: any }) {
      if (user) {
        token.id = String(user.id);
        token.name = user.username;
        token.email = user.email;
        console.log("token", token);
      }
      return token;
    },

    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email;
        session.user.name = token.name;
      }
      console.log("auth", session.user);
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
