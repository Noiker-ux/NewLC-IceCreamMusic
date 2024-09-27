//@ts-nocheck
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
"use client";

import { useEffect, useState } from "react";
import style from "./DragAndDropFile.module.css";
import classNames from "classnames";
import MyText from "../MyText/MyText";

const DragAndDropFile = ({ setTracks, tracks }) => {
  const [drag, setDrag] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const dragStartHandler = (e: DragEvent) => {
    e.preventDefault();
    setDrag(true);
  };

  const dragLeaveHandler = (e: DragEvent) => {
    e.preventDefault();
    setDrag(false);
  };

  const handleLoadFile = (e: ChangeEventHandler<HTMLInputElement>) => {
    setDrag(false);
    let newFiles = [...e.target.files];
    if (tracks) {
      newFiles = [...tracks, ...newFiles];
    }
    setTracks([...newFiles]);
  };

  const onDropHandler = (e: DragEvent) => {
    e.preventDefault();
    let withoutErrors = false;
    setError(false);
    setDrag(false);

    withoutErrors = [...e.dataTransfer?.files].every((track) => {
      const typeTrack = track.type.split("/")[1];
      return typeTrack == "wav" || typeTrack == "flac";
    });

    if (withoutErrors) {
      let newFiles = [...e.dataTransfer?.files];
      if (tracks) {
        newFiles = [...tracks, ...newFiles];
      }
      setTracks([...newFiles]);
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
