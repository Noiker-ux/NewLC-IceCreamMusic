"use server";

import { defaultAuthRedirect, signIn, signOut } from "@/config/auth";
import { getFullUrl, getSearchParams } from "./url";
import { TSignInSchema } from "@/schema/signin.schema";

export async function signInAction(data: TSignInSchema) {
  const searchParams = await getSearchParams();

  const callbackUrl = searchParams.get("callbackUrl") ?? defaultAuthRedirect;

  return signIn("credentials", {
    redirect: true,
    redirectTo: callbackUrl,
    data,
  });
}

export async function signOutAction() {
  const callbackUrl = await getFullUrl();

  return signOut({ redirectTo: callbackUrl!, redirect: true });
}
