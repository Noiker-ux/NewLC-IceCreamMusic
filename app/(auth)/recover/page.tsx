"use client";

import { recoverPassword } from "@/actions/auth";
import { PageTransitionProvider } from "@/providers/PageTransitionProvider";

export default function RecoverPage() {
  return (
    <PageTransitionProvider>
      <div>Введите адрес эл. почты, привязанный к Вашей учетной записи.</div>
      <button
        onClick={() => {
          recoverPassword("maks.christmas2001@gmail.com");
        }}
      >
        отправить
      </button>
    </PageTransitionProvider>
  );
}
