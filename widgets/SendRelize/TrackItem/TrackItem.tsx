"use client";
import { useState } from "react";
import ITrackItem from "./TrackItem.props";
import style from "./TrackItem.module.css";
import ArrowIcon from "../../../public/InfoIcon/arrow.svg";
import classNames from "classnames";
import MyInput from "@/shared/MyInput/MyInput";
import MyTitle from "@/shared/MyTitle/MyTitle";
import MyText from "@/shared/MyText/MyText";
import MySelect from "@/shared/MySelect/MySelect";
import { allRoles } from "@/helpers/allRoles";
import MyCheckbox from "@/shared/MyCheckbox/MyCheckbox";
import { allLanguages } from "@/helpers/allLanguages";
import MyTextArea from "@/shared/MyTextArea/MyTextArea";
import MyInpFile from "@/shared/MyInpFile/MyInpFile";
import MyFile from "@/shared/MyFile/MyFile";

export function TrackItem({ fileName }: ITrackItem) {
  const [detail, setDetail] = useState<boolean>(false);
  const [persons, setPersons] = useState([{ id: 1, person: "", role: "" }]);
  const [showInstantGratification, setShowInstantGratification] =
    useState<boolean>(false);

  const handleDeleteRole = (idx: number) => {
    setPersons(() => {
      return persons.filter((e) => e.id != idx);
    });
  };

  return (
    <div className={style.wrap}>
      <div className={style.header} onClick={() => setDetail(!detail)}>
        <div
          className={classNames(style.arrow, { [style.arrow_open]: detail })}
        ></div>
        {fileName}
      </div>

      <div className={classNames(style.detail, { [style.open]: detail })}>
        <div className={style.infoItem}>
          <div className={style.desc}>
            <MyTitle Tag={"h3"}>Основная информация</MyTitle>
            <MyText className={style.subText}>
              Укажите название трека, для грамотного отображения на различных
              площадках
            </MyText>
          </div>
          <div className={style.row}>
            <MyInput
              label={"Название трека"}
              inpLk
              placeholder="Введите название трека"
              tooltip={{
                id: `trackName-${fileName}`,
                text: "Наименование на языках, использующих кириллицу, не должны быть представлены на транслите, если вы планируете отгрузку в Apple Music",
              }}
              type={"text"}
            />
            <MyInput
              label={"Подзаголовок"}
              inpLk
              tooltip={{
                id: `trackSubName-${fileName}`,
                text: "Дополнительное название, например: Deluxe Edition, Remix, Acoustic Version. Если дополнительного названия нет, оставьте поле пустым",
              }}
              placeholder="Введите подзаголовок"
              type={"text"}
            />
          </div>
        </div>
        <div className={style.infoItem}>
          <div className={style.desc}>
            <MyTitle Tag={"h3"}>Идентификация</MyTitle>
            <MyText className={style.subText}>
              Укажите код, он необходим для точности в идентификации релиза на
              площадках и отчетности, если у вас нет ISRC, код будет
              сгенерирован автоматически
            </MyText>
          </div>
          <div className={style.row}>
            <MyInput
              label={"ISRC"}
              inpLk
              placeholder="Введите ISRC"
              tooltip={{
                id: `trackName-${fileName}`,
                text: "Международный уникальный код. Его наличие упрощает управление правами, когда видео используется в разных форматах, каналах распространения или продуктах. Если у вас нет этого кода, мы присвоим его самостоятельно",
              }}
              type={"text"}
            />
            <MyInput
              label={"Код партнера"}
              inpLk
              tooltip={{
                id: `trackSubName-${fileName}`,
                text: "Ваш собственный код релиза. Укажите его для получения в финансовых отчетах",
              }}
              placeholder="Введите код партнера"
              type={"text"}
            />
          </div>
        </div>
        <div className={style.infoItem}>
          <div className={style.desc}>
            <MyTitle Tag={"h3"}>Персоны и роли</MyTitle>
            <MyText className={style.subText}>
              Для Исполнителей, Соисполнителей (feat.), Producer и Remixer
              необходимо указать псевдоним артиста, группы или проекта.
            </MyText>
            <MyText className={style.subText}>
              ДДля Авторов музыки и Авторов слов необходимо указать фактические
              имена и фамилии, не указывайте псевдонимы артистов, групп или
              проектов.
            </MyText>
          </div>
          {persons &&
            persons.map((p) => (
              <div key={p.id} className={style.row}>
                <MyInput
                  label={"Имя персоны"}
                  placeholder="Введите имя персоны"
                  inpLk
                  type={"text"}
                />
                <div className={style.w30}>
                  <MySelect
                    className={style.select}
                    label={"Выберите роль"}
                    options={allRoles}
                  />
                </div>
                <div
                  className={style.delete}
                  onClick={() => handleDeleteRole(p.id)}
                >
                  <div className={style.line1}></div>
                  <div className={style.line2}></div>
                </div>
              </div>
            ))}
          <div
            className={style.btn}
            onClick={() => {
              setPersons([
                ...persons,
                { person: "", role: "", id: persons.length + 1 },
              ]);
            }}
          >
            Добавить персону
          </div>
        </div>
        <div className={style.infoItem}>
          <div className={style.desc}>
            <MyTitle Tag={"h3"}>Права</MyTitle>
            <MyText className={style.subText}>
              Укажите долю, если авторов несколько, укажите сумму долей
            </MyText>
            <MyText className={style.subText}>
              Авторское вознаграждение выплачивается в соответствии с указанной
              долей и условиям договора
            </MyText>
          </div>
          <div className={style.row}>
            <MyInput
              label={"Авторские права"}
              inpLk
              tooltip={{
                id: `avtorPrava-${fileName}`,
                text: "Укажите долю. Если авторов несколько укажите сумму долей",
              }}
              type={"text"}
            />
            <MyInput
              label={"Смежные права"}
              value={100.0}
              inpLk
              tooltip={{
                id: `avtorPrava-${fileName}`,
                text: "Релиз может быть доставлен на площадки только при наличии 100%",
              }}
              type={"text"}
            />
          </div>
        </div>
        <div className={style.infoItem}>
          <div className={style.desc}>
            <MyTitle Tag={"h3"}>Дополнительные параметры</MyTitle>
            <MyText className={style.subText}>
              Укажите дополнительные параметры для трека
            </MyText>
          </div>

          <MyInput
            label={"Начало предпрослушивания (секунды)"}
            inpLk
            tooltip={{
              id: `startProsl-${fileName}`,
              text: "С выбранной секунды начинается воспроизведение фрагмента: который будет использован на сервисе VK Клипы, в качестве сниппета на VK музыка, проигрываться до покупки на ITunes, использоваться как сниппет на Apple Music и использоваться как официальный звук на TikTik, Likee",
            }}
            placeholder="20:00"
            type={"text"}
          />
          <MyCheckbox
            className={style.check}
            label={"Instant Gratification"}
            tooltip={{
              id: "InstantGratification",
              text: "Дата, когда открывается возможность прослушать часть треков с альбома (до 50%). Указанная дата должна быть позже даты предзаказа, но не ранее даты старта на площадках. Поддерживают площадки: iTunes, Apple Music, Яндекс Музыка и YouTube Music",
            }}
            onChange={() =>
              setShowInstantGratification(!showInstantGratification)
            }
          />
          {showInstantGratification && (
            <MyInput
              className={style.mt30}
              label={"Выберите дату"}
              inpLk
              type={"date"}
            />
          )}
          <MyCheckbox
            label={"Focus track"}
            tooltip={{
              id: "Focus track",
              text: "Простой способ выделить лучшее из лучшего. Отметьте трек, к которому хотите привлечь внимание слушателя. Поддерживает только VK Музыка",
            }}
          />
        </div>
        <div className={style.infoItem}>
          <div className={classNames(style.desc, style.mt30, style.mb20)}>
            <MyTitle Tag={"h3"}>Версия трека</MyTitle>
            <MyText className={style.subText}>
              Укажите версию трека, данный параметр участвует в системах
              рекомендаций площадок
            </MyText>
            <MyText className={style.subText}>
              Также редакции обращают внимание на версию, чтобы разместить трек
              в подходящий тематический плейлист
            </MyText>
          </div>
          <MyCheckbox
            label={"Explicit Content"}
            tooltip={{
              id: "Explicit Content",
              text: "Версия трека, содержащая ненормативную и потенциально оскорбительную лексику",
            }}
          />
          <MyCheckbox
            label={"Live"}
            tooltip={{
              id: "Live",
              text: "Запись живого выступления, если в названии трека вы уже указали Live, можете не выбирать этот параметр",
            }}
          />
          <MyCheckbox
            label={"Cover"}
            tooltip={{
              id: "Cover",
              text: "Версия трека, исполненная другим артистом",
            }}
          />
          <MyCheckbox
            label={"Remix"}
            tooltip={{
              id: "Remix",
              text: "Альтернативная версия выпущенного ранее трека",
            }}
          />
          <MyCheckbox
            label={"Instrumental"}
            tooltip={{
              id: "Instrumental",
              text: "Версия трека без вокальной партии",
            }}
          />
        </div>
        <div className={style.infoItem}>
          <div className={classNames(style.desc, style.mt30)}>
            <MyTitle Tag={"h3"}>Виды использования</MyTitle>
            <MyText className={style.subText}>
              Укажите дополнительные виды использования для трека
            </MyText>
            <MyTitle className={style.mt10} Tag={"h4"}>
              Язык трека
            </MyTitle>
            <MyText className={classNames(style.subText, style.mb10)}>
              Укажите язык, на котором исполняется трек, если трек без вокальной
              партии в списке выберите «Без слов»
            </MyText>
            <MySelect
              label={"Язык трека"}
              options={[
                { value: "Без слов", label: "Без слов" },
                ...allLanguages,
              ]}
            />
            <MyTitle className={style.mt10} Tag={"h4"}>
              Текст трека
            </MyTitle>
            <MyText className={classNames(style.subText, style.mb10)}>
              Ознакомьтесь с рекомендациями по подготовке и загрузке этого типа
              контента.
            </MyText>
            <MyTextArea label={"Введите текст трека"} />
            <MyTitle className={style.mt10} Tag={"h4"}>
              Синхронизированный текст трека
            </MyTitle>
            <MyText className={classNames(style.subText, style.mb10)}>
              Получите дополнительный доход и ещё больше внимания на площадках.
              Формат: .ttml
            </MyText>
            <MyFile />
            <MyTitle className={style.mt10} Tag={"h4"}>
              Добавление рингтона
            </MyTitle>
            <MyText className={classNames(style.subText, style.mb10)}>
              Формат: .wav, .flac. <br />
              Длина: от 5 до 29.99 сек.
            </MyText>
            <MyFile />
            <MyTitle className={style.mt10} Tag={"h4"}>
              Загрузка видео
            </MyTitle>
            <MyText className={classNames(style.subText, style.mb10)}>
              Формат: .mov, .mp4, .avi
              <br />
              Максимальный размер: не более 6 ГБ
            </MyText>
            <MyFile />
          </div>
        </div>
      </div>
    </div>
  );
}
