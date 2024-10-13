import { db } from "@/db";

export default async function AdminReleasesPage() {
  const data = await db.query.release.findMany({
    where: (rel, { eq }) => eq(rel.status, "moderating"),
  });

  return <div>{AdminReleasesPage.name}</div>;
}
