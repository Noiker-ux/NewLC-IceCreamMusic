"use client";

import { recoverPassword } from "@/actions/auth";
import { PageTransitionProvider } from "@/providers/PageTransitionProvider";
import MyButton from "@/shared/MyButton/MyButton";
import MyInput from "@/shared/MyInput/MyInput";
import { useState } from "react";

export default function RecoverPage() {
  const [email, setEmail] = useState("");

  return (
    <PageTransitionProvider>
      <div>Введите адрес эл. почты, привязанный к Вашей учетной записи.</div>
      <MyInput
        label="Email"
        type="text"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <MyButton
        text="отправить"
        view="secondary"
        onClick={() => {
          recoverPassword(email);
        }}
      />
    </PageTransitionProvider>
  );
}
