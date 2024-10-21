import { oswald } from "@/fonts";
import MyText from "@/shared/MyText/MyText";
import MyTitle from "@/shared/MyTitle/MyTitle";
import RegistrationWidget from "@/widgets/Registration/Registration";
import classNames from "classnames";
import Link from "next/link";
import style from "./page.module.css";

export default function Registraion() {
  return (
    <div className={style.form}>
      <MyTitle Tag="h2" className={classNames(oswald.className, style.title)}>
        Добро пожаловать!
      </MyTitle>
      <MyText className={style.desc}>
        Если у вас нет аккаунта - зарегистрируйте его здесь,
        <br /> после авторизуйтесь для доступа в систему
      </MyText>
      <RegistrationWidget />
      <MyText className={style.linkReg}>
        Или <Link href={"/signin"}>войдите здесь</Link>, если у Вас есть аккаунт
      </MyText>
    </div>
  );
}
