"use client";

import {
  ChangeEvent,
  forwardRef,
  MouseEvent,
  MouseEventHandler,
  useState,
} from "react";
import style from "./MyInpFile.module.css";
import classNames from "classnames";
import IMyInpFile from "./MyInpFile.props";
import MyTitle from "../MyTitle/MyTitle";
import MyText from "../MyText/MyText";
import Image from "next/image";

const MyInpFile = forwardRef<HTMLInputElement, IMyInpFile>(function Input(
  { className, ...props },
  ref
) {
  const [previewFile, setPrviewFile] = useState<string | null>(null);
  const [showClose, setShowClose] = useState<boolean>(false);

  const handleLoadFile = (e: ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    if (e.target.files && e.target.files[0])
      setPrviewFile(URL.createObjectURL(e.target.files[0]));
  };

  const handleLeaveFile = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setPrviewFile(null);
  };

  return (
    <div className={style.wrap}>
      <label htmlFor="preview">
        <div
          className={classNames(style.previewWrapper, {
            [style.noBorder]: previewFile,
          })}
        >
          {!previewFile && (
            <>
              <MyTitle className={style.title} Tag="h4">
                Выберите обложку
              </MyTitle>
              <MyText className={style.desc}>Формат: .jpg или .png</MyText>
            </>
          )}

          {previewFile && (
            <div
              onMouseEnter={() => setShowClose(true)}
              onMouseLeave={() => setShowClose(false)}
            >
              <Image
                className={style.previewImage}
                src={previewFile}
                alt="Превью"
                width={225}
                height={225}
              />
            </div>
          )}
        </div>
        <input
          accept=".jpg, .png"
          onChange={handleLoadFile}
          {...props}
          ref={ref}
          className={style.input}
          id="preview"
          type="file"
        />
      </label>

      {previewFile && (
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
