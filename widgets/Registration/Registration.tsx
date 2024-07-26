"use client";

import { TSignUpSchema } from "@/schema/signup.schema";
import MyButton from "@/shared/MyButton/MyButton";
import MyInput from "@/shared/MyInput/MyInput";
import { useForm } from "react-hook-form";
import style from "./Registration.module.css";

const RegistrationWidget = () => {
  const { handleSubmit, register } = useForm<TSignUpSchema>({
    defaultValues: {
      confirmPassword: "",
      email: "",
      name: "",
      password: "",
    },
    progressive: true,
  });

  return (
    <form
      className={style.form}
      onSubmit={handleSubmit((data) => console.log(data))}
    >
      <MyInput {...register("email")} label="Email" type="email" />
      <MyInput {...register("name")} label="Имя" type="text" />
      <MyInput {...register("password")} label="Пароль" type="password" />
      <MyInput
        {...register("confirmPassword")}
        label="Подтвердите пароль"
        type="password"
      />
      <MyButton text="Регистрация" view="primary" type="submit" />
    </form>
  );
};
export default RegistrationWidget;
