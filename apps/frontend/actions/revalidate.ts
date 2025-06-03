"use server";
import { revalidatePath, revalidateTag } from "next/cache";
import { getPathname } from "./url";

export const revalidateTagAction = async (tag: string) => revalidateTag(tag);

export const revalidatePathAction = async (path: string) =>
  revalidatePath(path);

export const revalidateCurrentPath = async () =>
  revalidatePathAction(await getPathname());
