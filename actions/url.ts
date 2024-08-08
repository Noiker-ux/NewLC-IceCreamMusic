"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function getFullUrl() {
  const reqHeaders = headers();
  return reqHeaders.get("x-url")!;
}

export async function getPathname() {
  const url = await getFullUrl();
  return new URL(url).pathname;
}

export async function getSearchParams() {
  const url = await getFullUrl();
  return new URL(url).searchParams;
}

export async function setSearchParams(data: URLSearchParams) {
  const url = getFullUrl();
  redirect(url + data.toString());
}

export async function redirectAction(url: string) {
  return redirect(url);
}
