import MyTitle from "@/shared/MyTitle/MyTitle";
import style from "./page.module.css";
import MyText from "@/shared/MyText/MyText";
import Link from "next/link";
import { oswald } from "@/fonts";
import classNames from "classnames";
import RegistraionWidget from "@/widgets/Registration/Registration";
import { PageTransitionProvider } from "@/providers/PageTransitionProvider";

export default function Registraion() {
  return (
    <PageTransitionProvider className={style.form}>
      <MyTitle Tag="h2" className={classNames(oswald.className, style.title)}>
        Добро пожаловать!
      </MyTitle>
      <MyText className={style.desc}>
        Если у вас нет аккаунта - зарегистрируйте его здесь,
        <br /> после авторизуйтесь для доступа в систему
      </MyText>
      <RegistraionWidget />
      <MyText className={style.linkReg}>
        Или <Link href={"/signin"}>войдите здесь</Link>, если у Вас есть аккаунт
      </MyText>
    </PageTransitionProvider>
  );
}
