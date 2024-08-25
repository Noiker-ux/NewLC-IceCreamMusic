"use client";
import { sendSignUpConfirmEmail } from "@/actions/email";
import { db } from "@/db";
import { users } from "@/db/schema";
import { PageTransitionProvider } from "@/providers/PageTransitionProvider";

export default function NewsPage() {
  // const data = await db.select().from(users);

  return (
    <PageTransitionProvider>
      {/* <div>{JSON.stringify(data)}</div> */}
      <div>
        <button onClick={() => {}}>qwe</button>
      </div>
    </PageTransitionProvider>
  );
}
