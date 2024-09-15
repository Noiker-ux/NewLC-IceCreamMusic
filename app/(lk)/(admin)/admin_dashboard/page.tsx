import StatisticBlock from "@/entities/AdminEntities/StatisticBlock/StatisticBlock";
import { PageTransitionProvider } from "@/providers/PageTransitionProvider";
import style from "./page.module.css";
export default function adminDashboardPage() {
  // const data = await db.select().from(users);

  return (
    <PageTransitionProvider>
      <div>Админ панель</div>
      <div className={style.rowStatistic}>
        <StatisticBlock Meaning={32} Difference={30} />
        <StatisticBlock Meaning={-32} Difference={-30} />{" "}
        <StatisticBlock Meaning={32} Difference={30} />
        <StatisticBlock Meaning={-32} Difference={-30} />
      </div>
    </PageTransitionProvider>
  );
}
