import style from "../[token]/page.module.css";
export default function WrongToken() {
  return (
    <div className={style.form}>
      Время действия ссылки-подтверждения истекло,
      <br /> либо ссылка содержит неверный токен. Попробуйте повторить операцию.
    </div>
  );
}
