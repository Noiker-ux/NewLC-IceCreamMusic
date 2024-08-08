"use client";

import { qwe } from "@/actions/qwe";
import SignUpConfirm from "@/emails/SignUpConfirm";
import { PageTransitionProvider } from "@/providers/PageTransitionProvider";
import { renderAsync } from "@react-email/render";

export default async function NewsPage() {
  // const data = await db.select().from(users);
  // const emailString = await renderAsync(<SignUpConfirm />);
  return (
    <PageTransitionProvider>
      <button onClick={() => qwe().then(console.log)}>qwe</button>
    </PageTransitionProvider>
  );
}
