import MyButton from "@/shared/MyButton/MyButton";
import MyInpFile from "@/shared/MyInpFile/MyInpFile";
import MyInput from "@/shared/MyInput/MyInput";
import MyTextArea from "@/shared/MyTextArea/MyTextArea";
import MyTitle from "@/shared/MyTitle/MyTitle";
import classNames from "classnames";
import style from "./page.module.css";
import { db } from "@/db";
import { getAuthSession } from "@/actions/auth";

export default async function EditProfilePage() {
  const session = await getAuthSession();

  const userData = await db.query.users.findFirst({
    where: (us, { eq }) => eq(us.id, session.user!.id),
  });

  return (
    <div className={style.myProfile}>
      <div className="row">
        <div className={classNames("wrap", "center")}>
          <MyInpFile className={style.avatar} />
        </div>
        <div className={classNames("wrap", "w100")}>
          <MyTitle Tag={"h4"} className="mb30">
            Личные ланные
          </MyTitle>
          <MyInput
            type={"text"}
            label={"Имя"}
            inpLk
            className="w100"
            defaultValue={userData?.name}
          />
          {/* <MyTextArea label={"Обо мне"} /> */}
        </div>
      </div>
      <div className={classNames("mt20")}>
        <div className="row">
          <div className={classNames(style.social, "w50", "wrap")}>
            <MyTitle Tag={"h4"} className="mb30">
              Социальные ссылки
            </MyTitle>
            <MyInput type={"text"} label={"Telegramm"} inpLk className="w100" />
            <MyInput type={"text"} label={"VK"} inpLk className="w100" />
            <MyInput type={"text"} label={"WhatsApp"} inpLk className="w100" />
            <MyInput type={"text"} label={"Viber"} inpLk className="w100" />
          </div>
          <div className={classNames(style.pronous, "w50", "wrap")}>
            <MyTitle Tag={"h4"} className="mb30">
              Прочие данные
            </MyTitle>
            <MyInput
              type={"date"}
              label={"Дата рождения"}
              inpLk
              className="w100"
            />
            <MyInput type={"text"} label={"Страна"} inpLk className="w100" />
            <MyInput type={"text"} label={"Лейбл"} inpLk className="w100" />
            <MyInput
              type={"text"}
              label={"Личный сайт"}
              inpLk
              className="w100"
            />
          </div>
        </div>
      </div>
      <MyButton text={"Сохранить"} view={"secondary"} className="mt20" />
    </div>
  );
}
