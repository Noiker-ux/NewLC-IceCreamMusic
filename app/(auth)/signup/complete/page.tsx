import { PageTransitionProvider } from "@/providers/PageTransitionProvider";
import style from "./page.module.css";

export default function CompleteSignupPage() {
  return (
    <PageTransitionProvider className={style.form}>
      <div>
        На указанный адрес эл. почты выслано сообщение с дополнительными
        инструкциями.
      </div>
      <div>Вы можете закрыть эту вкладку.</div>
    </PageTransitionProvider>
  );
}
