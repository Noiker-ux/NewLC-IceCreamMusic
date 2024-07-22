"use client";

import MyButton from "@/shared/MyButton/MyButton";
import MyCheckbox from "@/shared/MyCheckbox/MyCheckbox";
import MyInput from "@/shared/MyInput/MyInput";
import style from "./Auth.module.css";
import { signInAction } from "@/actions/auth";

const Authtorization = () => {
  return (
    <form className={style.form}>
      <MyInput label={"Email"} type="text" />
      <MyInput label={"Пароль"} type="password" />
      <MyCheckbox label={"Запомнить пароль"} className={style.checkbox} />
      <MyButton
        text={"Войти"}
        view={"primary"}
        onClick={() => {
          signInAction();
        }}
      />
    </form>
  );
};
export default Authtorization;
