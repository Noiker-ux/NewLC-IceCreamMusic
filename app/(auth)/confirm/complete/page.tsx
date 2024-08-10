import { PageTransitionProvider } from "@/providers/PageTransitionProvider";
import Link from "next/link";

export default function VerificationComplete() {
  return (
    <PageTransitionProvider>
      <div>Подтверждение регистрации учетной записи завершено!</div>
      <div>
        Вы можете <Link href="/signin">войти</Link> в личный кабинет
      </div>
    </PageTransitionProvider>
  );
}
