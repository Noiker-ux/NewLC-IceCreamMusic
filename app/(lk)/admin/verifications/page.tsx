import { db } from "@/db";
import { PageTransitionProvider } from "@/providers/PageTransitionProvider";
import Admin_Verification_Card from "@/widgets/Admin_Verification_Card/Admin_Verification_Card";
import MultiTable from "@/widgets/MultiTable/MultiTable";

export const dynamic = "force-dynamic";

export default async function AdminVerificationPage() {
  const data = await db.query.verification.findMany({
    where: (ver, { eq }) => eq(ver.status, "moderating"),
  });

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
