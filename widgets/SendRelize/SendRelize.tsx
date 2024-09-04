"use client";
import classNames from "classnames";
import style from "./SendRelize.module.css";
import MyTitle from "@/shared/MyTitle/MyTitle";
import MyText from "@/shared/MyText/MyText";
import MyInpFile from "@/shared/MyInpFile/MyInpFile";
import MyInput from "@/shared/MyInput/MyInput";
import Popup from "reactjs-popup";
import { useState } from "react";
import ModalPopup from "../ModalPopup/ModalPopup";
import MyTextArea from "@/shared/MyTextArea/MyTextArea";
import MyButton from "@/shared/MyButton/MyButton";
import { tabsList } from "./tabsList";
import MySelect from "@/shared/MySelect/MySelect";
import { allLanguages } from "@/helpers/allLanguages";
import MyRadio from "@/shared/MyRadio/MyRadio";
import MyFile from "@/shared/MyFile/MyFile";

const SendRelize = () => {
  const [toggleState, setToggleState] = useState(1);
  const toggleTab = (index: number) => {
    setToggleState(index);
  };
  const getActiveClass = (index: number, className: string) =>
    toggleState === index ? className : "";

  return (
    <>
      <div className={style["tabwrap"]}>
        <ul className={style["tab-list"]}>
          {tabsList.map((t) => (
            <li
              key={t.num}
              className={classNames(
                style[`tabs`],
                `${getActiveClass(t.num, style["active-tabs"])}`
              )}
              onClick={() => toggleTab(t.num)}
            >
              {t.label}
            </li>
          ))}
        </ul>
      </div>

      <div className={style["container"]}>
        <div className={style["content-container"]}>
          <div
            className={classNames(
              style[`content`],
              `${getActiveClass(1, style["active-content"])}`
            )}
          >
            <div>
              <MyTitle Tag={"h2"}>Работа с релизом</MyTitle>
              <MyText>Заполните общую информацю по релизу</MyText>
            </div>
            <MySelect
              label="Язык метаданных"
              options={allLanguages}
              tooltip={{
                id: "languageMetadata",
                text: "Язык, на котором представленна основаная информация о релиизе",
              }}
            />
            <div className={style.row}>
              <MyInput
                className={style.inp}
                label={"Название релиза"}
                type={"text"}
                placeholder="Введите название"
                inpLk
                tooltip={{
                  id: "relizeNameData",
                  text: "Наименовани на языках, использующиих кириллицу, не должны быть представленны на транслиите, если вы планируете отгрузку в Apple Music",
                }}
              />
              <MyInput
                className={style.inp}
                label={"Подзаголовок"}
                type={"text"}
                placeholder="Введите подзаголовок"
                inpLk
                tooltip={{
                  id: "relizeSubNameData",
                  text: "Дополнительное название, например: Deluxe Edition, Remix, Acoustic Version. Если дополнительного названиия нет, оставьте поле пустым",
                }}
              />
            </div>
            <MyTitle Tag={"h3"}>Тип релиза</MyTitle>

            <div className={style.topRelizes}>
              <MyRadio
                id="type1"
                name="d"
                label={"Singl"}
                tooltip={{
                  id: "Singl",
                  text: "Содержит от 1 до 3 треков, каждый продолжительностью менее 10 минут",
                }}
              ></MyRadio>
              <MyRadio
                id="type2"
                name="d"
                label={"EP"}
                tooltip={{
                  id: "EP",
                  text: "Содержит от 1 до 3 треков, каждый продолжительностью менее 10 минут. Общая продолжительность должна быть не более 30 минут. Также релиз может содержать от 4 до 6 треков общей продолжительностью не более 30 минут",
                }}
              ></MyRadio>
              <MyRadio
                id="type3"
                name="d"
                label={"Album"}
                tooltip={{
                  id: "Album",
                  text: "Содержит 7 треков и/или более, общей продолжительностью более 30 минут",
                }}
              ></MyRadio>
            </div>
            <MyTitle Tag={"h3"}>Обложка</MyTitle>
            <MyInpFile />
            <MyText className={style.desc}>
              Минимальный размер изображения: 3000x3000px
              <br />
              Максимальный размер изображения: 6000x6000px
              <br />
              Максимальный размер файла: 30MB
            </MyText>
          </div>
          <div
            className={classNames(
              style[`content`],
              `${getActiveClass(2, style["active-content"])}`
            )}
          >
            <h2>Ipsum</h2>
          </div>
          <div
            className={classNames(
              style[`content`],
              `${getActiveClass(3, style["active-content"])}`
            )}
          >
            <h2>Dolor</h2>
          </div>
        </div>
      </div>
    </>
  );
};
export default SendRelize;
