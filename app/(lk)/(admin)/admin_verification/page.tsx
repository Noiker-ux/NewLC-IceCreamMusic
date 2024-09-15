import StatisticBlock from "@/entities/AdminEntities/StatisticBlock/StatisticBlock";
import { PageTransitionProvider } from "@/providers/PageTransitionProvider";
import style from "./page.module.css";
import MultiTable from "@/widgets/MultiTable/MultiTable";

export default function adminVerificationPage() {
  // const data = await db.select().from(users);

  return (
    <PageTransitionProvider>
      <div>Верификация</div>
      <MultiTable />
    </PageTransitionProvider>
  );
}
