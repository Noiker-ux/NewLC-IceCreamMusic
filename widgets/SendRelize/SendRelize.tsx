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
import { allGenres } from "@/helpers/allGenres";
import { allAreasMusic } from "@/helpers/allAreasMusic";
import MyCheckbox from "@/shared/MyCheckbox/MyCheckbox";
import { allCountry } from "@/helpers/allCountry";

const SendRelize = () => {
  const [showAreasShop, setShowAreasShop] = useState<boolean>(false);
  const [showAreasLands, setShowAreasLands] = useState<boolean>(false);

  return (
    <div className={style["container"]}>
      <div className={style.row}>
        <div className={classNames(style.wrap, style.w30)}>
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
        <div className={classNames(style.wrap, style.full)}>
          <div>
            <MyTitle Tag={"h2"}>Работа с релизом</MyTitle>
            <MyText className={style.desc}>
              Заполните общую информацю по релизу
            </MyText>
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
        </div>
      </div>

      <div className={style.wrap}>
        <div className={style.wrap__title}>
          <MyTitle Tag={"h2"}>Персоны и роли</MyTitle>
          <MyText className={style.desc}>
            Для Исполнителей, Соисполнителей (feat.), Remixer необходимо указать
            псевдоним артиста, группы или проекта.
          </MyText>
        </div>
        <div className={style.row}>
          <MyInput
            className={style.inp}
            label={"Bведите исполнителя"}
            type={"text"}
            placeholder="Исполнитель"
            inpLk
            tooltip={{
              id: "ispolnitelName",
              text: "Введите исполнителей, через запятую",
            }}
          />
          <MyInput
            className={style.inp}
            label={"Bведите лиц со статусом feat"}
            type={"text"}
            placeholder="feat"
            inpLk
            tooltip={{
              id: "featName",
              text: "Bведите лиц со статусом feat, через запятую",
            }}
          />
          <MyInput
            className={style.inp}
            label={"Bведите лиц со статусом Remixer"}
            type={"text"}
            placeholder="Remixer"
            inpLk
            tooltip={{
              id: "RemixerName",
              text: "Bведите лиц со статусом Remixer, через запятую",
            }}
          />
        </div>
      </div>

      <div className={style.wrap}>
        <div>
          <MyTitle Tag={"h2"}>Жанр</MyTitle>
        </div>
        <MySelect
          label="Жанр"
          options={allGenres}
          tooltip={{
            id: "GenreData",
            text: "Основной жанр вашего релиза",
          }}
        />
      </div>

      <div className={style.wrap}>
        <div>
          <MyTitle Tag={"h2"}>Идентификация</MyTitle>
          <MyText className={classNames(style.desc, style.mb20)}>
            Укажите код, он необходим для точности в идентификации релиза на
            площадках и отчетности, если у вас нет UPC, код будет сгенерирован
            автоматически
          </MyText>
        </div>

        <MyInput
          className={style.inp}
          label={"UPC"}
          type={"text"}
          placeholder="Введите UPC"
          inpLk
          tooltip={{
            id: "UPCName",
            text: "Универсальный код продукта. Он нужен для идентификации релизов на различных площадках и для последующей отчетности. Если у вас его нет, оставьте поле пустым, мы присвоим код самостоятельно.",
          }}
        />
      </div>

      <div className={style.wrap}>
        <div>
          <MyTitle Tag={"h2"}>Название лейбла</MyTitle>
          <MyText className={classNames(style.desc, style.mb20)}>
            Укажите наименование лейбла, данная информация будет отображена на
            площадках
          </MyText>
        </div>

        <MyInput
          className={style.inp}
          label={"Лейбл"}
          type={"text"}
          placeholder="Введите название лейбла"
          inpLk
        />
      </div>

      <div className={style.wrap}>
        <div>
          <MyTitle Tag={"h2"}>Даты</MyTitle>
          <MyText className={classNames(style.desc, style.mb20)}>
            Укажите основные даты для релиза
          </MyText>
        </div>
        <div className={style.row}>
          <MyInput
            className={style.inp}
            label={"Дата релиза"}
            type={"date"}
            placeholder="ДД.ММ.ГГГГ"
            inpLk
            tooltip={{
              id: "dateRelize",
              text: "Дата, когда релиз был впервые опубликован, независимо от того, был ли он выпущен в физическом или цифром формате",
            }}
          />
          <MyInput
            className={style.inp}
            label={"Дата старта"}
            type={"date"}
            placeholder="ДД.ММ.ГГГГ"
            inpLk
            tooltip={{
              id: "dateStart",
              text: "Дата, когда ваш релиз должен стать доступным на площадках",
            }}
          />
        </div>
        <div className={style.row}>
          <MyInput
            className={style.inp}
            label={"Дата предзаказа"}
            type={"date"}
            placeholder="ДД.ММ.ГГГГ"
            inpLk
            tooltip={{
              id: "datePreRelize",
              text: "Дата для предзаказа альбома на iTunes и Apple Music. Если релиз выпускается без предзаказа, укажите дату старта",
            }}
          />
        </div>
      </div>

      <div className={style.wrap}>
        <div>
          <MyTitle Tag={"h2"}>Площадки </MyTitle>
          <MyText className={classNames(style.desc, style.mb20)}>
            Укажите основные площадки для релиза
          </MyText>
        </div>
        <div className={style.col}>
          <MyRadio
            label={"На всех площадках"}
            onChange={() => setShowAreasShop(false)}
            name={"areaShop"}
          />
          <MyRadio
            label={"Только на некоторых"}
            onChange={() => setShowAreasShop(true)}
            name={"areaShop"}
          />
        </div>
      </div>

      {showAreasShop && (
        <div className={style.wrap}>
          <div>
            <MyTitle Tag={"h2"}>Список площадок с которыми мы работаем</MyTitle>
            <MyText className={classNames(style.desc, style.mb20)}>
              Выберте из списка те площадки, на которых будет распространяться
              релиз
            </MyText>
          </div>
          <div className={style.areaShop}>
            {allAreasMusic.map((a) => (
              <MyCheckbox
                className={style.areaShopCheckbox}
                key={a.value}
                label={a.label}
              />
            ))}
          </div>
        </div>
      )}

      <div className={style.wrap}>
        <div>
          <MyTitle Tag={"h2"}>Территории </MyTitle>
          <MyText className={classNames(style.desc, style.mb20)}>
            Укажите территории распространения для релиза
          </MyText>
        </div>
        <div className={style.col}>
          <MyRadio
            label={"Во всех странах"}
            name={"areaLand"}
            onChange={() => setShowAreasLands(false)}
          />
          <MyRadio
            label={"Только в определенных странах"}
            onChange={() => setShowAreasLands(true)}
            name={"areaLand"}
          />
          <MyRadio
            label={"Во всех кроме"}
            onChange={() => setShowAreasLands(true)}
            name={"areaLand"}
          />
          <MyRadio
            label={"В СНГ"}
            name={"areaLand"}
            onChange={() => setShowAreasLands(false)}
          />
        </div>
      </div>

      {showAreasLands && (
        <div className={style.wrap}>
          <div>
            <MyTitle Tag={"h2"}>Список площадок с которыми мы работаем</MyTitle>
            <MyText className={classNames(style.desc, style.mb20)}>
              Выберте из списка те площадки, на которых будет распространяться
              релиз
            </MyText>
          </div>
          <div className={style.areaShop}>
            {allCountry.map((a) => (
              <MyCheckbox
                className={style.areaLandCheckbox}
                key={a.value}
                label={a.label}
              />
            ))}
          </div>
        </div>
      )}

      {/* end */}
    </div>
  );
};
export default SendRelize;
