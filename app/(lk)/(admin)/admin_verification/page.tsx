import { db } from "@/db";
import { verification } from "@/db/schema";
import { PageTransitionProvider } from "@/providers/PageTransitionProvider";
import MultiTable from "@/widgets/MultiTable/MultiTable";
import { eq } from "drizzle-orm";
import MyText from "@/shared/MyText/MyText";
import MyTitle from "@/shared/MyTitle/MyTitle";
import dateFormatter from "@/utils/dateFormatter";
import Admin_Verification_Card from "@/widgets/Admin_Verification_Card/Admin_Verification_Card";

export default async function AdminVerificationPage() {
  const data = await db
    .select()
    .from(verification)
    .where(eq(verification.status, "moderating"));

  return (
    <PageTransitionProvider>
      <div>Верификация</div>
      {data.map((e) => (
        <Admin_Verification_Card key={e.id} data={e} />
      ))}
      <MultiTable />
    </PageTransitionProvider>
  );
}
