import { NextResponse } from "next/server";
import { revalidateCurrentPath } from "../../../../actions/revalidate";
import { getAuthSession } from "@/actions/auth";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
export async function GET(req: Request) {
  await revalidatePath(new URL(req.url).pathname);

  const session = await getAuthSession();

  // revalidateCurrentPath();
  return NextResponse.json({
    message: `session ${session.user ? "is" : "is not"} exists`,
    // cookies: JSON.stringify(cookies().getAll()),
  });
}
