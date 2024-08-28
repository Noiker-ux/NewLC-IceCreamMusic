import { PageTransitionProvider } from "@/providers/PageTransitionProvider";

export default function NewsPage() {
  // const data = await db.select().from(users);

  return (
    <PageTransitionProvider>
      {/* <div>{JSON.stringify(data)}</div> */}
      <div></div>
    </PageTransitionProvider>
  );
}
