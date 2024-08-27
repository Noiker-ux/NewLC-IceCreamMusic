"use client";
import { sendSignUpConfirmEmail } from "@/actions/email";
import { db } from "@/db";
import { users } from "@/db/schema";
import LicenseeCard from "@/entities/LicenseeCard/LicenseeCard";
import { PageTransitionProvider } from "@/providers/PageTransitionProvider";
import style from "./page.module.css";
import PassportIcon from "../../../../public/License/Passport.svg";
import BlockIcon from "../../../../public/License/Block.svg";
import GDPR from "../../../../public/License/GDPR.svg";
import DPA from "../../../../public/License/DPA.svg";
import classNames from "classnames";
import VerificationForm from "@/widgets/VerificationForm/VerificationForm";

export default function VerificationPage() {
  return (
    <PageTransitionProvider>
      <LicenseeCard
        view="big"
        icon={
          <PassportIcon
            style={{ width: "30%", height: "112px" }}
            className={classNames(style.big, style.iconL)}
          />
        }
        title="Почему нам нужны паспортные данные?"
        desc="Когда вы вместе с нами выпускаете свою музыку, мы должны быть уверены, что работаем с правильным человеком. Ваши паспортные данные - это своеобразный идентификатор, который помогает нам установить вашу личность и удостовериться, что вы действительно тот человек, кем себя представляете. Запрос паспортных данных - это стандартная практика в нашей отрасли, которая помогает предотвратить мошенничество и защитить наших пользователей, включая вас. Мы хотим убедиться, что музыка представляется законно и в соответствии с правилами."
      />
      <div className={style.licensee}>
        <LicenseeCard
          view="small"
          icon={
            <BlockIcon
              style={{ width: "10%", height: "35px" }}
              className={classNames(style.small, style.iconL)}
            />
          }
          title="Защищено"
          desc="Полученные данные надежно защищены и зашифрованы."
        />
        <LicenseeCard
          view="small"
          icon={
            <GDPR
              style={{ width: "10%", height: "35px" }}
              className={classNames(style.small, style.iconL)}
            />
          }
          title="GDPR Стандарт"
          desc="Мы работаем в соответствии с Европейским стандартом о защите личных данных"
        />
        <LicenseeCard
          view="small"
          icon={
            <DPA
              style={{ width: "10%", height: "35px" }}
              className={classNames(style.small, style.iconL)}
            />
          }
          title="DPA Стандарт"
          desc="Данные шифруются в соответствии со стандартом DPA"
        />
      </div>
      <VerificationForm />
    </PageTransitionProvider>
  );
}
