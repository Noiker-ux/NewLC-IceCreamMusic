"use client";

import classNames from "classnames";
import Image from "next/image";
import { ChangeEvent, forwardRef, MouseEvent, useRef, useState } from "react";
import { mergeRefs } from "react-merge-refs";
import MyText from "../MyText/MyText";
import MyTitle from "../MyTitle/MyTitle";
import style from "./MyInpFile.module.css";
import IMyInpFile from "./MyInpFile.props";

const MyInpFile = forwardRef<HTMLInputElement, IMyInpFile>(function Input(
  { className, onFileChange, ...props },
  ref
) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showClose, setShowClose] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleLoadFile = (e: ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    onFileChange && onFileChange(e.target.files);
    if (e.target.files && e.target.files[0])
      setPreviewUrl(URL.createObjectURL(e.target.files[0]));
  };

  const handleLeaveFile = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();

    const dataTransfer = new DataTransfer();

    if (inputRef.current) {
      inputRef.current.files = dataTransfer.files;
    }

    onFileChange && onFileChange(null);

    setPreviewUrl(null);
  };

  return (
    <div className={style.wrap}>
      <label htmlFor="preview">
        <div
          className={classNames(style.previewWrapper, {
            [style.noBorder]: previewUrl,
          })}
        >
          {!previewUrl && (
            <>
              <MyTitle className={style.title} Tag="h4">
                Выберите обложку
              </MyTitle>
              <MyText className={style.desc}>Формат: .jpg или .png</MyText>
            </>
          )}

          {previewUrl && (
            <div
              onMouseEnter={() => setShowClose(true)}
              onMouseLeave={() => setShowClose(false)}
            >
              <Image
                className={style.previewImage}
                src={previewUrl}
                alt="Превью"
                width={225}
                height={225}
              />
            </div>
          )}
        </div>
        <input
          accept=".jpg, .png"
          {...props}
          onChange={handleLoadFile}
          ref={mergeRefs([ref, inputRef])}
          className={style.input}
          id="preview"
          type="file"
        />
      </label>

      {previewUrl && (
        <div
          className={classNames(style.lines, { [style.show]: showClose })}
          onClick={handleLeaveFile}
          onMouseEnter={() => setShowClose(true)}
          onMouseLeave={() => setShowClose(false)}
        >
          <div className={classNames(style.line, style.line1)}></div>
          <div className={classNames(style.line, style.line2)}></div>
        </div>
      )}
    </div>
  );
});

export default MyInpFile;
