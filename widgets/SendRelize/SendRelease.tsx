"use client";

// TODO огромный тех. долг необходимо поправить как можно скорее

import { allAreasMusic } from "@/helpers/allAreasMusic";
import { allCountry } from "@/helpers/allCountry";
import { allGenres } from "@/helpers/allGenres";
import { allLanguages } from "@/helpers/allLanguages";
import CloseIcon from "@/public/InfoIcon/close.svg";
import {
  releaseFormSchema,
  TReleaseForm,
  TTrackForm,
} from "@/schema/release.schema";
import MyButton from "@/shared/MyButton/MyButton";
import MyCheckbox from "@/shared/MyCheckbox/MyCheckbox";
import MyInpFile from "@/shared/MyInpFile/MyInpFile";
import MyInput from "@/shared/MyInput/MyInput";
import MyRadio from "@/shared/MyRadio/MyRadio";
import MySelect from "@/shared/MySelect/MySelect";
import MyText from "@/shared/MyText/MyText";
import MyTitle from "@/shared/MyTitle/MyTitle";
import DragAndDropFile from "@/widgets/SendRelize/DragAndDropFile/DragAndDropFile";
import { zodResolver } from "@hookform/resolvers/zod";
import classNames from "classnames";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import IMySelectProps from "../../shared/MySelect/MySelect.props";
import style from "./SendRelease.module.css";
import { TrackItem } from "./TrackItem/TrackItem";
import FormDataUtils from "formdata-object-utils";
import { uploadRelease } from "@/actions/release";
import { objectToFormData } from "@/utils/formDataTobject";

const SendRelease = () => {
  const [showPlatforms, setShowPlatforms] = useState<boolean>(false);
  const [showAreasLands, setShowAreasLands] = useState<boolean>(false);
  const [languageValue, setLanguageValue] = useState<IMySelectProps["value"]>();
  const [genreValue, setGenreValue] = useState<IMySelectProps["value"]>();
  const [tracks, setTracks] = useState<FileList | null>(null);
  const [changeLabel, setChangeLabel] = useState(false);

  const formMethods = useForm<TReleaseForm>({
    resolver: zodResolver(releaseFormSchema),
    defaultValues: { labelName: "icecreammusic" },
    progressive: true,
  });

  const { handleSubmit, setValue, register, watch, getValues } = formMethods;

  const areas = watch("area");

  const platforms = watch("platforms");

  const tracksData = watch("tracks");

  const handleDeleteTrack = (index: number) => {
    const oldTracks = Array.from(tracksData ?? []);

    const newTracks = [
      ...oldTracks.slice(0, index),
      ...oldTracks.slice(index + 1),
    ];

    setValue("tracks", newTracks);
  };

  return (
    <div className={style["container"]}>
      <FormProvider {...formMethods}>
        <form
          className={style.form}
          onSubmit={handleSubmit(
            (data) => {
              const { tracks, ...release } = data;

              const releaseData = {
                ...release,
                area: JSON.stringify(release.area),
                platforms: JSON.stringify(release.platforms),
              };

              const releaseFormData = objectToFormData(releaseData);

              const tracksFormData = tracks.map((t: TTrackForm) => {
                const trackData: Omit<typeof t, "roles"> & { roles: string } = {
                  ...t,
                  roles: JSON.stringify(t.roles),
                };

                return objectToFormData(trackData);
              });

              uploadRelease(releaseFormData, ...tracksFormData).then(
                console.log
              );
            },
            (e) => console.log(e)
          )}
        >
          <div className={style.row}>
            <div className={classNames(style.wrap, style.w30)}>
              <MyTitle Tag={"h3"}>Обложка</MyTitle>
              <MyInpFile
                onFileChange={(files) => setValue("preview", files?.item(0))}
              />
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
                value={languageValue}
                onValueChange={(data) => {
                  setValue("language", data.value);
                  setLanguageValue(data);
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
                  {...register("title")}
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
                  {...register("subtitle")}
                />
              </div>
              <MyTitle Tag={"h3"}>Тип релиза</MyTitle>
              <div className={style.topRelizes}>
                <MyRadio
                  id="type1"
                  label={"Single"}
                  tooltip={{
                    id: "Single",
                    text: "Содержит от 1 до 3 треков, каждый продолжительностью менее 10 минут",
                  }}
                  value="single"
                  {...register("type")}
                />
                <MyRadio
                  id="type2"
                  label={"EP"}
                  tooltip={{
                    id: "EP",
                    text: "Содержит от 1 до 3 треков, каждый продолжительностью менее 10 минут. Общая продолжительность должна быть не более 30 минут. Также релиз может содержать от 4 до 6 треков общей продолжительностью не более 30 минут",
                  }}
                  value="ep"
                  {...register("type")}
                />
                <MyRadio
                  id="type3"
                  label={"Album"}
                  tooltip={{
                    id: "Album",
                    text: "Содержит 7 треков и/или более, общей продолжительностью более 30 минут",
                  }}
                  value="album"
                  {...register("type")}
                />
              </div>
            </div>
          </div>

          <div className={style.wrap}>
            <div className={style.wrap__title}>
              <MyTitle Tag={"h2"}>Персоны и роли</MyTitle>
              <MyText className={style.desc}>
                Для Исполнителей, Соисполнителей (feat.), Remixer необходимо
                указать псевдоним артиста, группы или проекта.
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
                {...register("performer")}
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
                {...register("feat")}
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
                {...register("remixer")}
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
              value={genreValue}
              onValueChange={(data) => {
                setValue("genre", data.value);
                setGenreValue(data);
              }}
            />
          </div>

          <div className={style.wrap}>
            <div>
              <MyTitle Tag={"h2"}>Идентификация</MyTitle>
              <MyText className={classNames(style.desc, style.mb20)}>
                Укажите код, он необходим для точности в идентификации релиза на
                площадках и отчетности, если у вас нет UPC, код будет
                сгенерирован автоматически
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
              {...register("upc")}
            />
          </div>

          <div className={style.wrap}>
            <div>
              <MyTitle Tag={"h2"}>Название лейбла</MyTitle>
              <MyText className={classNames(style.desc, style.mb20)}>
                Укажите наименование лейбла, данная информация будет отображена
                на площадках
              </MyText>
              <MyCheckbox
                label={"изменить лейбл"}
                onChange={() => {
                  if (changeLabel) setValue("labelName", "icecreammusic");
                  setChangeLabel(!changeLabel);
                }}
                checked={changeLabel}
              />
            </div>

            <MyInput
              className={style.inp}
              label={"Лейбл"}
              type={"text"}
              placeholder="Введите название лейбла"
              inpLk
              disabled={!changeLabel}
              {...register("labelName")}
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
                {...register("releaseDate")}
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
                {...register("startDate")}
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
                {...register("preorderDate")}
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
                onChange={() => {
                  setShowPlatforms(false);
                  setValue("platforms", ["all"]);
                }}
                name={"areaShop"}
              />
              <MyRadio
                label={"Только на некоторых"}
                onChange={() => {
                  setShowPlatforms(true);
                  setValue("platforms", []);
                }}
                name={"areaShop"}
              />
            </div>
          </div>

          {showPlatforms && (
            <div className={style.wrap}>
              <div>
                <MyTitle Tag={"h2"}>
                  Список площадок с которыми мы работаем
                </MyTitle>
                <MyText className={classNames(style.desc, style.mb20)}>
                  Выберте из списка те площадки, на которых будет
                  распространяться релиз
                </MyText>
              </div>
              <div className={style.areaShop}>
                {allAreasMusic.map((p) => (
                  <MyCheckbox
                    className={style.areaShopCheckbox}
                    key={p.value}
                    label={p.label}
                    name={p.label}
                    checked={platforms.includes(p.value)}
                    onChange={(e: any) => {
                      if (!platforms) {
                        setValue("platforms", [p.value]);
                        return;
                      }

                      const platforms_set = new Set(platforms as string[]);

                      if (e.target.checked) {
                        platforms_set.add(p.value);
                      } else {
                        platforms_set.delete(p.value);
                      }

                      setValue("platforms", Array.from(platforms_set));
                    }}
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
                onChange={() => {
                  setShowAreasLands(false);
                  setValue("area", { negate: false, data: ["all"] });
                }}
              />
              <MyRadio
                label={"Только в определенных странах"}
                onChange={() => {
                  setShowAreasLands(true);
                  setValue("area", { negate: false, data: [] });
                }}
                name={"areaLand"}
              />
              <MyRadio
                label={"Во всех кроме"}
                onChange={() => {
                  setShowAreasLands(true);
                  setValue("area", { negate: true, data: [] });
                }}
                name={"areaLand"}
              />
              <MyRadio
                label={"В СНГ"}
                name={"areaLand"}
                onChange={() => {
                  setShowAreasLands(false);
                  setValue("area", { negate: false, data: ["sng"] });
                }}
              />
            </div>
          </div>

          {showAreasLands && (
            <div className={style.wrap}>
              <div>
                <MyTitle Tag={"h2"}>
                  Список площадок с которыми мы работаем
                </MyTitle>
                <MyText className={classNames(style.desc, style.mb20)}>
                  Выберте из списка те площадки, на которых будет
                  распространяться релиз
                </MyText>
              </div>
              <div className={style.areaShop}>
                {allCountry.map((a) => (
                  <MyCheckbox
                    className={style.areaLandCheckbox}
                    key={a.value}
                    label={a.label}
                    name={a.label}
                    checked={
                      areas && areas.data && areas.data.includes(a.value)
                    }
                    onChange={(e: any) => {
                      console.log("qwe");
                      if (!areas.data) {
                        setValue("area", {
                          data: [a.value],
                          negate: areas.negate,
                        });
                        return;
                      }

                      const areas_set = new Set(areas.data);

                      if (e.target.checked) {
                        areas_set.add(a.value);
                      } else {
                        areas_set.delete(a.value);
                      }

                      setValue("area", {
                        negate: areas.negate,
                        data: Array.from(areas_set),
                      });
                    }}
                  />
                ))}
              </div>
            </div>
          )}
          <div className={style.wrap}>
            <DragAndDropFile setTracks={setTracks} tracks={tracks} />
          </div>

          {Array.isArray(tracksData) &&
            tracksData.map((trackData, index) => (
              <div className={style.wrap_track} key={trackData.track.name}>
                <TrackItem fileName={trackData.track.name} trackIndex={index} />
                <div
                  className={style.close}
                  onClick={() => handleDeleteTrack(index)}
                >
                  <CloseIcon className={style.deleteTrack} />
                </div>
              </div>
            ))}

          <div className={style.wrap}>
            <MyButton text="Отправить релиз" view="secondary" type="submit" />
          </div>
        </form>
      </FormProvider>
      {/* end */}
    </div>
  );
};
export default SendRelease;
