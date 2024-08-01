"use server";

import { authOptions, defaultAuthRedirect, signOut } from "@/config/auth";
import { getFullUrl, getSearchParams } from "./url";
import {
  signInClientSchema,
  TSignInClientSchema,
} from "@/schema/signin.schema";
import NextAuth, { NextAuthConfig } from "next-auth";

export async function signInAction(data: TSignInClientSchema) {
  const res = signInClientSchema.safeParse(data);

  if (!res.success) return {};

  const oneDaySeconds = 24 * 60 * 60;

  const params: Pick<NextAuthConfig, "cookies"> = {
    cookies: {
      sessionToken: {
        name: "icecream-auth",
        options: {
          httpOnly: true,
          sameSite: true,
          maxAge: res.data.rememberMe ? oneDaySeconds * 30 : oneDaySeconds,
        },
      },
    },
  };

  const authConfig = Object.assign(authOptions, params);

  const { signIn } = await NextAuth(authConfig);

  const searchParams = await getSearchParams();

  const callbackUrl = searchParams.get("callbackUrl") ?? defaultAuthRedirect;

  return signIn("credentials", {
    redirect: true,
    redirectTo: callbackUrl,
    ...res.data,
  });
}

export async function signOutAction() {
  const callbackUrl = await getFullUrl();

  return signOut({ redirectTo: callbackUrl!, redirect: true });
}
