import Link from "next/link";
import style from "./page.module.css";

export default function CompleteSignupPage() {
  return (
    <div className={style.form}>
      <div>
        На указанный адрес эл. почты выслано сообщение с дополнительными
        инструкциями.
      </div>
      <div>
        Вы можете закрыть эту вкладку или перейти на страницу
        <Link href="/auth/signin">входа в систему</Link>
      </div>
    </div>
  );
}
