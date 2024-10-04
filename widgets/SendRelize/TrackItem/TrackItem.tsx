"use client";

// TODO ОГРОМНЫЙ ТЕХ. ДОЛГ НЕОБХОДИЫМЫ ПРАВКИ КАК МОЖНО СКОРЕЕ

import { allLanguages } from "@/helpers/allLanguages";
import { allRoles } from "@/helpers/allRoles";
import { TReleaseForm } from "@/schema/release.schema";
import MyCheckbox from "@/shared/MyCheckbox/MyCheckbox";
import MyFile from "@/shared/MyFile/MyFile";
import MyInput from "@/shared/MyInput/MyInput";
import MySelect from "@/shared/MySelect/MySelect";
import IMySelectProps from "@/shared/MySelect/MySelect.props";
import MyText from "@/shared/MyText/MyText";
import MyTextArea from "@/shared/MyTextArea/MyTextArea";
import MyTitle from "@/shared/MyTitle/MyTitle";
import classNames from "classnames";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import style from "./TrackItem.module.css";
import ITrackItem from "./TrackItem.props";

export function TrackItem({ fileName, trackIndex }: ITrackItem) {
  const [detail, setDetail] = useState(false);
  const [persons, setPersons] = useState([{ id: 1, person: "", role: "" }]);
  const [language, setLanguage] = useState<IMySelectProps["value"]>();
  const [addVideo, setAddVideo] = useState(false);
  const [addVideoShot, setAddVideoShot] = useState(false);
  const [addTextSync, setAddTextSync] = useState(false);
  const [addText, setAddText] = useState(false);

  const [showInstantGratification, setShowInstantGratification] =
    useState<boolean>(false);

  const { getValues, setValue, watch } = useFormContext<TReleaseForm>();

  const handleDeleteRole = (idx: number) => {
    setPersons([...persons.slice(0, idx), ...persons.slice(idx + 1)]);
  };

  const track = watch("tracks")[trackIndex];

  const handleChangeRole = (
    idx: number,
    newValue: Partial<{ person: string; role: string }>
  ) => {
    handleTrackChange({
      roles: [
        ...track.roles.slice(0, idx),
        {
          ...(track.roles.at(idx) as { person: string; role: string }),
          ...newValue,
        },
        ...track.roles.slice(idx + 1),
      ],
    });
  };

  const handleTrackChange = (
    partialTrack: Partial<TReleaseForm["tracks"][number]>
  ) => {
    const oldTracks = Array.from(getValues("tracks"));

    const newTrack: TReleaseForm["tracks"][number] = {
      ...track,
      ...partialTrack,
    };

    setValue("tracks", [
      ...oldTracks.slice(0, trackIndex),
      newTrack,
      ...oldTracks.slice(trackIndex + 1),
    ]);
  };

  return (
    <div className={style.wrap}>
      <div className={style.header} onClick={() => setDetail(!detail)}>
        <div
          className={classNames(style.arrow, { [style.arrow_open]: detail })}
        ></div>
        {track.track.name}
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
              value={track.title}
              onChange={(e) => handleTrackChange({ title: e.target.value })}
              tooltip={{
                id: `trackName-${fileName}`,
                text: "Наименование на языках, использующих кириллицу, не должны быть представлены на транслите, если вы планируете отгрузку в Apple Music",
              }}
              type={"text"}
            />
            <MyInput
              label={"Подзаголовок"}
              inpLk
              value={track.subtitle}
              onChange={(e) => handleTrackChange({ subtitle: e.target.value })}
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
              value={String(track.isrc ?? "")}
              onChange={(e) => handleTrackChange({ isrc: e.target.value })}
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
              value={String(track.partner_code ?? "")}
              onChange={(e) =>
                handleTrackChange({ partner_code: e.target.value })
              }
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
            persons.map((p, i) => (
              <div key={p.id} className={style.row}>
                <MyInput
                  label={"Имя персоны"}
                  placeholder="Введите имя персоны"
                  inpLk
                  type={"text"}
                  value={Array.from(track.roles).at(i)?.person}
                  onChange={(e) =>
                    handleChangeRole(i, { person: e.target.value })
                  }
                />
                <div className={style.w30}>
                  <MySelect
                    className={style.select}
                    label={"Выберите роль"}
                    options={allRoles}
                    onValueChange={({ value }) => {
                      handleChangeRole(i, { role: value });
                    }}
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
              value={track.author_rights}
              onChange={(e) =>
                handleTrackChange({ author_rights: e.target.value })
              }
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
            value={track.preview_start}
            onChange={(e) =>
              handleTrackChange({ preview_start: e.target.value })
            }
          />
          <MyCheckbox
            className={style.check}
            name={`InstantGratification-${fileName}`}
            label={"Instant Gratification"}
            tooltip={{
              id: "InstantGratification",
              text: "Дата, когда открывается возможность прослушать часть треков с альбома (до 50%). Указанная дата должна быть позже даты предзаказа, но не ранее даты старта на площадках. Поддерживают площадки: iTunes, Apple Music, Яндекс Музыка и YouTube Music",
            }}
            checked={showInstantGratification}
            onChange={() => {
              if (showInstantGratification) {
                handleTrackChange({ instant_gratification: undefined });
              }
              setShowInstantGratification(!showInstantGratification);
            }}
          />
          {showInstantGratification && (
            <MyInput
              className={style.mt30}
              label={"Выберите дату"}
              inpLk
              type={"date"}
              value={track.instant_gratification}
              onChange={(e) =>
                handleTrackChange({ instant_gratification: e.target.value })
              }
            />
          )}
          <MyCheckbox
            name={`Focus-track-${fileName}`}
            label={"Focus track"}
            checked={!!track.focus}
            onChange={() => {
              handleTrackChange({ focus: !!!track.focus });
            }}
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
            name={`Explicit-Content-${fileName}`}
            checked={!!track.explicit}
            onChange={() => handleTrackChange({ explicit: !!!track.explicit })}
            tooltip={{
              id: "Explicit Content",
              text: "Версия трека, содержащая ненормативную и потенциально оскорбительную лексику",
            }}
          />
          <MyCheckbox
            label={"Live"}
            name={`Live-${fileName}`}
            checked={!!track.live}
            onChange={() => handleTrackChange({ live: !!!track.live })}
            tooltip={{
              id: "Live",
              text: "Запись живого выступления, если в названии трека вы уже указали Live, можете не выбирать этот параметр",
            }}
          />
          <MyCheckbox
            label={"Cover"}
            name={`Cover-${fileName}`}
            checked={!!track.cover}
            onChange={() => handleTrackChange({ cover: !!!track.cover })}
            tooltip={{
              id: "Cover",
              text: "Версия трека, исполненная другим артистом",
            }}
          />
          <MyCheckbox
            label={"Remix"}
            name={`Remix-${fileName}`}
            checked={!!track.remix}
            onChange={() => handleTrackChange({ remix: !!!track.remix })}
            tooltip={{
              id: "Remix",
              text: "Альтернативная версия выпущенного ранее трека",
            }}
          />
          <MyCheckbox
            label={"Instrumental"}
            name={`Instrumental-${fileName}`}
            checked={!!track.instrumental}
            onChange={() =>
              handleTrackChange({ instrumental: !!!track.instrumental })
            }
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
              value={language}
              onValueChange={(newLang) => {
                handleTrackChange({ language: newLang.value });
                setLanguage(newLang);
              }}
              options={[
                { value: "Без слов", label: "Без слов" },
                ...allLanguages,
              ]}
            />
            <MyCheckbox
              label="Добавить текст трека"
              checked={addText}
              onChange={() => {
                if (addText) {
                  handleTrackChange({ text: null });
                }
                setAddText(!addText);
              }}
              name="addText"
            />
            {addText && (
              <>
                <MyTitle className={style.mt10} Tag={"h4"}>
                  Текст трека
                </MyTitle>
                <MyText className={classNames(style.subText, style.mb10)}>
                  Ознакомьтесь с рекомендациями по подготовке и загрузке этого
                  типа контента.
                </MyText>
                <MyTextArea
                  label={"Введите текст трека"}
                  value={String(track.text ?? "")}
                  onChange={(e) => handleTrackChange({ text: e.target.value })}
                />
              </>
            )}
            <MyCheckbox
              label="Добавить текст трека"
              checked={addTextSync}
              onChange={() => {
                if (addTextSync) {
                  handleTrackChange({ text_sync: null });
                }
                setAddTextSync(!addTextSync);
              }}
              name="addTextSync"
            />
            {addTextSync && (
              <>
                <MyTitle className={style.mt10} Tag={"h4"}>
                  Синхронизированный текст трека
                </MyTitle>
                <MyText className={classNames(style.subText, style.mb10)}>
                  Получите дополнительный доход и ещё больше внимания на
                  площадках. Формат: .ttml
                </MyText>
                <MyFile
                  onChange={(e) =>
                    handleTrackChange({
                      text_sync: Array.from(e.target.files ?? []).at(0),
                    })
                  }
                />
              </>
            )}
            <MyTitle className={style.mt10} Tag={"h4"}>
              Добавление рингтона
            </MyTitle>
            <MyText className={classNames(style.subText, style.mb10)}>
              Формат: .wav, .flac. <br />
              Длина: от 5 до 29.99 сек.
            </MyText>
            <MyFile
              onChange={(e) =>
                handleTrackChange({
                  ringtone: Array.from(e.target.files ?? []).at(0),
                })
              }
            />
            <MyCheckbox
              label="Добавить текст трека"
              checked={addVideo}
              onChange={() => {
                if (addVideo) {
                  handleTrackChange({ video: null });
                }
                setAddVideo(!addVideo);
              }}
              name="addVideo"
            />
            {addVideo && (
              <>
                <MyTitle className={style.mt10} Tag={"h4"}>
                  Загрузка видео
                </MyTitle>
                <MyText className={classNames(style.subText, style.mb10)}>
                  Формат: .mov, .mp4, .avi
                  <br />
                  Максимальный размер: не более 6 ГБ
                </MyText>
                <MyFile
                  onChange={(e) =>
                    handleTrackChange({
                      video: Array.from(e.target.files ?? []).at(0),
                    })
                  }
                />
              </>
            )}
            <MyCheckbox
              label="Добавить текст трека"
              checked={addVideoShot}
              onChange={() => {
                console.log("qweqweqwe");
                if (addVideoShot) {
                  handleTrackChange({ video_shot: null });
                }
                setAddVideoShot(!addVideoShot);
              }}
              name="addVideoShot"
            />
            {addVideoShot && (
              <>
                <MyTitle className={style.mt10} Tag={"h4"}>
                  Загрузка видео-шота
                </MyTitle>
                <MyText className={classNames(style.subText, style.mb10)}>
                  Формат: .mov, .mp4, .avi
                  <br />
                  Максимальный размер: не более 6 ГБ
                </MyText>
                <MyFile
                  onChange={(e) =>
                    handleTrackChange({
                      video_shot: Array.from(e.target.files ?? []).at(0),
                    })
                  }
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
