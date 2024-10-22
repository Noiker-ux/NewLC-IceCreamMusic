"use client";
import { resetPasswordSchema, TResetPassword } from "@/schema/reset.schema";
import MyButton from "@/shared/MyButton/MyButton";
import MyInput from "@/shared/MyInput/MyInput";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { resetPassword } from "@/actions/auth";

type TResetPasswordForm = {
  token: string;
};

export function ResetPasswordForm({ token }: TResetPasswordForm) {
  const {
    handleSubmit,
    formState: { errors },
  } = useForm<TResetPassword>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {},
  });

  return (
    <div>
      <form
        onSubmit={handleSubmit((data) => resetPassword(data.password, token))}
      >
        <MyInput label="Введите пароль" type="text" />
        <MyInput label="Повторите пароль" type="text" />
        <MyButton
          text="Изменить пароль"
          view="secondary"
          type="submit"
          disabled={!!errors.root || !!errors.confirm || !!errors.password}
        />
      </form>
    </div>
  );
}
