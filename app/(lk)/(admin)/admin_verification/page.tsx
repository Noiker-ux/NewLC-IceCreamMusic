import { db } from "@/db";
import { verification } from "@/db/schema";
import { PageTransitionProvider } from "@/providers/PageTransitionProvider";
import MultiTable from "@/widgets/MultiTable/MultiTable";
import { eq } from "drizzle-orm";

export default async function AdminVerificationPage() {
  const data = await db
    .select()
    .from(verification)
    .where(eq(verification.status, "moderating"));

  return (
    <PageTransitionProvider>
      <div>Верификация</div>
      <MultiTable />
    </PageTransitionProvider>
  );
}
