import "server-only";
import { db } from "@/db";
import { users } from "@/db/schema";
import { signInSchema } from "@/schema/signin.schema";
import { compare } from "bcrypt-ts";
import { eq } from "drizzle-orm";
import NextAuth, { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const routeTypes = ["guest", "public"] as const;

export type RouteType = (typeof routeTypes)[number];

export const routes: Record<RouteType, string[]> = {
  guest: ["/signin", "/signup"],
  public: ["/signout"],
};

export const defaultAuthRedirect = "/account";

export const authOptions: NextAuthConfig = {
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    authorized: ({ auth }) => {
      return !!auth;
    },
  },
  cookies: {
    callbackUrl: {
      name: "icecream-callback",
      options: { httpOnly: true, sameSite: true },
    },
    csrfToken: {
      name: "icecream-csrf",
      options: { httpOnly: true, sameSite: true },
    },
    sessionToken: {
      name: "icecream-auth",
      options: { httpOnly: true, sameSite: true },
    },
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(userData) {
        const { success, data } = signInSchema.safeParse(userData);

        if (!success) {
          return null;
        }

        const { email, password } = data;

        const matchedUser = await db
          .select()
          .from(users)
          .where(eq(users.email, email))
          .limit(1);

        if (!matchedUser.length) {
          return null;
        }

        const user = matchedUser[0];

        const passwordVerified = await compare(password, user.password);

        if (passwordVerified) {
          return user;
        }

        return null;
      },
    }),
  ],
};

export const {
  auth,
  handlers: { GET, POST },
  signIn,
  signOut,
} = NextAuth(authOptions);
