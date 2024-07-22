"use server";

import { signIn, signOut } from "@/config/auth";
import { getFullUrl, getSearchParams } from "./url";

export async function signInAction() {
  const searchParams = await getSearchParams();

  const callbackUrl = searchParams.get("callbackUrl") ?? "/";

  return await signIn("credentials", {
    redirect: true,
    redirectTo: callbackUrl,
    // ...data,
  });
}

export async function signOutAction() {
  const callbackUrl = await getFullUrl();

  return (await signOut({ redirectTo: callbackUrl!, redirect: false }))
    .redirect;
}
