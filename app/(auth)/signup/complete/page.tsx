import { PageTransitionProvider } from "@/providers/PageTransitionProvider";
import style from "./page.module.css";
import Link from "next/link";

export default function CompleteSignupPage() {
  return (
    <PageTransitionProvider className={style.form}>
      <div>
        На указанный адрес эл. почты выслано сообщение с дополнительными
        инструкциями.
      </div>
      <div>
        Вы можете закрыть эту вкладку или перейти на страницу
        <Link href="/auth/signin">входа в систему</Link>
      </div>
    </PageTransitionProvider>
  );
}
