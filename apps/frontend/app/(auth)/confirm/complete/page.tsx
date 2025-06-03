import style from "../wrong/page.module.css";
import Link from "next/link";

export default function VerificationComplete() {
  return (
    <div className={style.form}>
      <div>Подтверждение регистрации учетной записи завершено!</div>
      <div>
        Вы можете <Link href="/signin">войти</Link> в личный кабинет
      </div>
    </div>
  );
}
