import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const routeTypes = ["guest", "public"] as const;

export type RouteType = (typeof routeTypes)[number];

export const routes: Record<RouteType, string[]> = {
  guest: ["/signin", "/signup"],
  public: ["/signout"],
};

export const defaultAuthRedirect = "/account";

export const {
  auth,
  handlers: { GET, POST },
  signIn,
  signOut,
} = NextAuth({
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    authorized: ({ auth }) => {
      return !!auth;
    },
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize({ email, password }) {
        // console.log({ email, password });

        return {
          id: "1",
          email: "email1@qwe.qwe",
          image: "/image.jpg",
          name: "User 1",
        };
      },
    }),
  ],
});
