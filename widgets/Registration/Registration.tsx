"use client";

import MyButton from "@/shared/MyButton/MyButton";
import MyInput from "@/shared/MyInput/MyInput";
import style from "./Registration.module.css";

const RegistraionWidget = () => {
  return (
    <form className={style.form}>
      <MyInput label="Email" type="text" />
      <MyInput label="Имя" type="text" />
      <MyInput label="Пароль" type="password" />
      <MyInput label="Пароль" type="password" />
      <MyButton text="Регистрация" view="primary" />
    </form>
  );
};
export default RegistraionWidget;
