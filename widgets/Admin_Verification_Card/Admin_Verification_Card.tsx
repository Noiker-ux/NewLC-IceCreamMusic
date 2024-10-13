"use client";

import MyText from "@/shared/MyText/MyText";
import style from "./Admin_Verification_Card.module.css";
import MyTitle from "@/shared/MyTitle/MyTitle";
import dateFormatter from "@/utils/dateFormatter";
import IAdmin_Verification_Card from "./Admin_Verification_Card.props";
import MyButton from "@/shared/MyButton/MyButton";
import {
  approveVerification,
  rejectVerification,
} from "@/actions/verification";

const Admin_Verification_Card = ({ data }: IAdmin_Verification_Card) => {
  const {
    accountNumber,
    bankName,
    birthDate,
    birthPlace,
    firstName,
    getDate,
    givenBy,
    id,
    lastName,
    middleName,
    passNumber,
    passSeries,
    registrationAddress,
    subunitCode,
    tel,
    status,
  } = data;

  return (
    <div className={style.wrap} key={id}>
      <MyTitle Tag={"h4"} className={style.top}>
        Основная информация <span className={style.status}>{status}</span>
      </MyTitle>
      <div className={style.row}>
        <div className={style.col}>
          <MyText className={style.title}>Имя</MyText>
          <MyText className={style.value}>{firstName}</MyText>
        </div>

        <div className={style.col}>
          <MyText className={style.title}>Фамилия</MyText>
          <MyText className={style.value}>{lastName}</MyText>
        </div>

        <div className={style.col}>
          <MyText className={style.title}>Отчество</MyText>
          <MyText className={style.value}>{middleName}</MyText>
        </div>
      </div>
      <div className={style.row}>
        <div className={style.col}>
          <MyText className={style.title}>Дата рождения</MyText>
          <MyText className={style.value}>{dateFormatter(birthDate)}</MyText>
        </div>

        <div className={style.col}>
          <MyText className={style.title}>Место рождения</MyText>
          <MyText className={style.value}>{birthPlace}</MyText>
        </div>

        <div className={style.col}>
          <MyText className={style.title}>Номер телефона</MyText>
          <MyText className={style.value}>{tel}</MyText>
        </div>
      </div>

      <div className={style.separator}></div>

      <MyTitle Tag={"h4"}>Идентификационные данные</MyTitle>
      <div className={style.row}>
        <div className={style.col}>
          <MyText className={style.title}>Серия паспорта</MyText>
          <MyText className={style.value}>{passSeries}</MyText>
        </div>
        <div className={style.col}>
          <MyText className={style.title}>Номер паспорта</MyText>
          <MyText className={style.value}>{passNumber}</MyText>
        </div>
        <div className={style.col}>
          <MyText className={style.title}>Дата получения</MyText>
          <MyText className={style.value}>{dateFormatter(getDate)}</MyText>
        </div>
      </div>
      <div className={style.row}>
        <div className={style.col}>
          <MyText className={style.title}>Кем выдан</MyText>
          <MyText className={style.value}>{givenBy}</MyText>
        </div>

        <div className={style.col}>
          <MyText className={style.title}>Код подразделения</MyText>
          <MyText className={style.value}>{subunitCode}</MyText>
        </div>

        <div className={style.col}>
          <MyText className={style.title}>Адрес регистрации</MyText>
          <MyText className={style.value}>{registrationAddress}</MyText>
        </div>
      </div>

      <div className={style.separator}></div>

      <MyTitle Tag={"h4"}>Банковские реквизиты</MyTitle>
      <div className={style.row}>
        <div className={style.col}>
          <MyText className={style.title}>Наименование банка</MyText>
          <MyText className={style.value}>{bankName}</MyText>
        </div>
        <div className={style.col}>
          <MyText className={style.title}>Номер счета</MyText>
          <MyText className={style.value}>{accountNumber}</MyText>
        </div>
      </div>

      <div className={style.separator}></div>

      <div className={style.row}>
        <button
          className={style.success}
          onClick={() => approveVerification(id)}
        >
          Подтвердить
        </button>
        <button
          className={style.badSuccess}
          onClick={() => rejectVerification(id)}
        >
          Отказать
        </button>
      </div>
    </div>
  );
};
export default Admin_Verification_Card;
