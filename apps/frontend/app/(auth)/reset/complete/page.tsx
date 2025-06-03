import Link from "next/link";
import style from "../[token]/page.module.css";

export default function VerificationComplete() {
  return (
    <div className={style.form}>
      <div>Пароль к Вашей учетной записи успешно изменён!</div>
      <div>
        Вы можете <Link href="/signin">войти</Link> в личный кабинет
      </div>
    </div>
  );
}
