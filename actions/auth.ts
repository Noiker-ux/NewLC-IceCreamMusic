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

  const oneMonthSeconds = 30 * oneDaySeconds;

  // const cookie;

  // if (!!res.data.rememberMe) console.log(oneMonthSeconds);

  // if (!!!res.data.rememberMe) console.log(oneDaySeconds);

  const params: Pick<NextAuthConfig, "cookies"> = {
    cookies: {
      ...authOptions.cookies,
      sessionToken: {
        name: "icecream-auth",
        options: {
          httpOnly: true,
          sameSite: true,
          maxAge: !!res.data.rememberMe ? oneMonthSeconds : oneDaySeconds,
        },
      },
    },
  };

  console.log(JSON.stringify(params));

  const newAuthConfig = Object.assign(authOptions, params);

  const { signIn } = await NextAuth(newAuthConfig);

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
