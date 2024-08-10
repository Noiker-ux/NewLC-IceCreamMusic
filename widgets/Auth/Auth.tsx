"use client";

import { credentialsSignIn } from "@/actions/auth";
import { TSignInClientSchema } from "@/schema/signin.schema";
import MyButton from "@/shared/MyButton/MyButton";
import MyCheckbox from "@/shared/MyCheckbox/MyCheckbox";
import MyInput from "@/shared/MyInput/MyInput";
import { useForm } from "react-hook-form";
import style from "./Auth.module.css";

const Authorization = () => {
  const { handleSubmit, register } = useForm<TSignInClientSchema>({
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  return (
    <form
      className={style.form}
      onSubmit={handleSubmit((data) => credentialsSignIn(data))}
    >
      <MyInput {...register("email")} label="Email" type="text" />
      <MyInput {...register("password")} label="Пароль" type="password" />
      <MyCheckbox
        {...register("rememberMe")}
        label="Запомнить пароль"
        className={style.checkbox}
      />
      <MyButton text="Войти" view="primary" type="submit" />
    </form>
  );
};

export default Authorization;
