import MyTitle from "@/shared/MyTitle/MyTitle";
import style from "./page.module.css";
import Authorization from "@/widgets/Auth/Auth";
import MyText from "@/shared/MyText/MyText";
import Link from "next/link";
import { oswald } from "@/fonts";
import classNames from "classnames";
import { PageTransitionProvider } from "@/providers/PageTransitionProvider";

export default function Auth() {
  return (
    <PageTransitionProvider className={style.form}>
      <MyTitle Tag="h2" className={classNames(oswald.className, style.title)}>
        Авторизация
      </MyTitle>
      <MyText className={style.desc}>
        Вы должны быть авторизованы, чтобы получить доступ к сайту
      </MyText>
      <Authorization />
      <MyText className={style.linkReg}>
        Или <Link href="/signup">зарегистрируйте</Link> новый, если у Вас нет
        аккаунта
      </MyText>
    </PageTransitionProvider>
  );
}
