"use server";

import { getAuthSession } from "@/actions/auth";
import { db } from "db";
import { release, track } from "db/schema";
import { eq } from "drizzle-orm";

export async function deleteUserTrack(trackId: string) {
  const session = await getAuthSession();

  if (!session) {
    return { success: false as const, message: "Unauthorized" };
  }

  const user = await db.query.users.findFirst({
    where: (usr, { eq, and }) =>
      and(eq(usr.isVerifiedAuthor, true), eq(usr.id, session.id)),
  });

  if (!user) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  const trackDbData = await db.query.track.findFirst({
    where: (tr, { eq }) => eq(tr.id, trackId),
    with: { release: true },
  });

  if (!trackDbData || trackDbData.release.authorId !== user.id) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  await db.transaction(async (tx) => {
    await tx.delete(track).where(eq(track.id, trackDbData.id));

    await tx
      .update(release)
      .set({ status: "moderating" })
      .where(eq(release.id, trackDbData.releaseId));
  });
}
