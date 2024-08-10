import { PageTransitionProvider } from "@/providers/PageTransitionProvider";
import Link from "next/link";

export default function VerificationComplete() {
  return (
    <PageTransitionProvider>
      <div>Пароль к Вашей учетной записи успешно изменён!</div>
      <div>
        Вы можете <Link href="/signin">войти</Link> в личный кабинет
      </div>
    </PageTransitionProvider>
  );
}
