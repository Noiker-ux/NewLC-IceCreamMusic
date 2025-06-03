import style from "../page.module.css";
export default function SignUpComplete() {
  return (
    <div className={style.form}>
      <div>
        На указанный адрес эл. почты выслано сообщение с дополнительными
        инструкциями.
      </div>
      <div>Вы можете закрыть эту вкладку.</div>
    </div>
  );
}
