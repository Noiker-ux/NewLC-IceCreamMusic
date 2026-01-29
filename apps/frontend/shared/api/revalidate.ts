'use server';

import { revalidatePath, revalidateTag } from 'next/cache';

export async function revalidateTagAction(tags: string){
  return await revalidateTag(tags)
}

export async function revalidatePathAction(...args: Parameters<typeof revalidatePath>){
  return revalidatePath(...args)
}