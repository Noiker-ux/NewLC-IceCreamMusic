import { db } from "@/db";

export const dynamic = "force-dynamic";

export default async function AdminReleasesPage() {
  const data = await db.query.release.findMany({
    where: (rel, { eq }) => eq(rel.status, "moderating"),
  });

  return (
    <div>
      {AdminReleasesPage.name}
      <p>
        {data.map((e) => (
          <p key={e.language}>{e.language}</p>
        ))}
      </p>
    </div>
  );
}
