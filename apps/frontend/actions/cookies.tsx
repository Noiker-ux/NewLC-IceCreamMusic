"use server";

import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { cookies } from "next/headers";

export async function getCookie(key: string) {
  const cookieStore = cookies();

  return cookieStore.get(key);
}

export async function setCookie(
  key: string,
  value: string,
  opts?: Partial<ResponseCookie>
) {
  const cookieStore = cookies();

  cookieStore.set(key, value, opts);
}
