import { PageTransitionProvider } from "@/providers/PageTransitionProvider";

export default function WrongToken() {
  return (
    <PageTransitionProvider>
      Время действия ссылки-подтверждения истекло, либо ссылка содержит неверный
      токен. Попробуйте повторить операцию.
    </PageTransitionProvider>
  );
}
