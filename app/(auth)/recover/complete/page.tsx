import { PageTransitionProvider } from "@/providers/PageTransitionProvider";

export default function SignUpComplete() {
  return (
    <PageTransitionProvider>
      <div>
        На указанный адрес эл. почты выслано сообщение с дополнительными
        инструкциями.
      </div>
      <div>Вы можете закрыть эту вкладку.</div>
    </PageTransitionProvider>
  );
}
