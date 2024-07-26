import { db } from "@/db";
import { users } from "@/db/schema";
import { PageTransitionProvider } from "@/providers/PageTransitionProvider";

export default async function NewsPage() {
  const data = await db.select().from(users);
  return (
    <PageTransitionProvider>{JSON.stringify(data)}</PageTransitionProvider>
  );
}
