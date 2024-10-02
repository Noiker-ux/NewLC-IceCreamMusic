// @ts-nocheck
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
"use client";

import { ChangeEvent, ChangeEventHandler, useEffect, useState } from "react";
import style from "./DragAndDropFile.module.css";
import classNames from "classnames";
import MyText from "../../../shared/MyText/MyText";
import { useFormContext } from "react-hook-form";
import { TReleaseForm, TTrackForm } from "@/schema/release.schema";

const DragAndDropFile = ({ setTracks, tracks }) => {
  const [drag, setDrag] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const { setValue, getValues } = useFormContext<TReleaseForm>();

  const dragStartHandler = (e: DragEvent) => {
    e.preventDefault();
    setDrag(true);
  };

  const dragLeaveHandler = (e: DragEvent) => {
    e.preventDefault();
    setDrag(false);
  };

  const handleLoadFile = (e: ChangeEvent<HTMLInputElement>) => {
    setDrag(false);

    let newFiles = Array.from(e.target.files ?? []);

    const tracks = getValues("tracks");

    let newTracks = [
      ...Array.from(tracks ?? []),
      ...newFiles.map(
        (f) =>
          ({
            language: "",
            partner_code: "",
            preview_start: "",
            roles: [],
            sibtitle: "",
            title: "",
            track: f,
          } as TTrackForm)
      ),
    ];

    setValue("tracks", newTracks);
  };

  const onDropHandler = (e: DragEvent) => {
    e.preventDefault();

    let withoutErrors = false;

    setError(false);

    setDrag(false);

    const newFiles = Array.from(e.dataTransfer?.files ?? []);

    withoutErrors = newFiles.every((track) => {
      const typeTrack = track.type.split("/")[1];
      return typeTrack == "wav" || typeTrack == "flac";
    });

    if (withoutErrors) {
      const tracks = getValues("tracks");

      const newTracks = [
        ...Array.from(tracks ?? []),
        ...newFiles.map(
          (f) =>
            ({
              language: "",
              partner_code: "",
              preview_start: new Date().toISOString(),
              roles: [],
              sibtitle: "",
              title: "",
              track: f,
            } as TTrackForm)
        ),
      ];

      setValue("tracks", newTracks);
    } else {
      setError(true);
    }
  };

  return (
    <div>
      <label htmlFor="file">
        <input
          className={style.none}
          accept=".wav,.flac"
          id="file"
          type="file"
          multiple
          onChange={(e) => handleLoadFile(e)}
        />
        {drag ? (
          <div
            className={classNames(style.dropArea, { [style.active]: drag })}
            onDragStart={(e) => dragStartHandler(e)}
            onDragLeave={(e) => dragLeaveHandler(e)}
            onDragOver={(e) => dragStartHandler(e)}
            onDrop={(e) => onDropHandler(e)}
          >
            <MyText>Отпустите файлы, чтобы загрузить их</MyText>
            <MyText className={style.sub}>Формат: .wav, .flac</MyText>
            <MyText className={style.sub}>Максимальный размер: 1Гб</MyText>
          </div>
        ) : (
          <div
            className={style.dropArea}
            onDragStart={(e) => dragStartHandler(e)}
            onDragLeave={(e) => dragLeaveHandler(e)}
            onDragOver={(e) => dragStartHandler(e)}
          >
            <MyText>Перетащите файлы, чтобы загрузить их</MyText>
            <MyText className={style.sub}>Формат: .wav, .flac</MyText>
            <MyText className={style.sub}>Максимальный размер: 1Гб</MyText>
          </div>
        )}
      </label>
      {error && (
        <MyText className={style.error}>
          Ошибка: среди загруженных файлов, присутствуют некорректные форматы
        </MyText>
      )}
    </div>
  );
};
export default DragAndDropFile;
