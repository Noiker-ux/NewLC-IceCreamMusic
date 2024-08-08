import MyTitle from "@/shared/MyTitle/MyTitle";
import { PageTransitionProvider } from "@/providers/PageTransitionProvider";
import style from "./page.module.css";
import ProfileWidget from "@/widgets/ProfileWidget/ProfileWidget";
import classNames from "classnames";

export default function Profile() {
  return (
    <PageTransitionProvider>
      <MyTitle Tag={"h3"}>Личный кабинет</MyTitle>
      <div className={style.wrap}>
        <ProfileWidget />
        <div className={classNames("backdor", style.main)}>
          <div className={style.statistic}>
            <MyTitle Tag={"h3"}>Статистика</MyTitle>
            <div>Статистика от максима</div>
          </div>
        </div>
      </div>
    </PageTransitionProvider>
  );
}
