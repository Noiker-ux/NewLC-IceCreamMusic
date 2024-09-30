"use client";

import { forwardRef, useState } from "react";
import style from "./MyFile.module.css";
import { TMyFileProps } from "./MyFile.props";
import classNames from "classnames";

const MyFile = forwardRef<HTMLInputElement, TMyFileProps>(function FileInput(
  { className, onChange, ...props },
  ref
) {
  const [file, setFile] = useState<FileList | null>(null);

  return (
    <label className={style.wrap} id="dropcontainer">
      <div className={style.btn}>Загрузить файл</div>
      <input
        {...props}
        className={classNames(style.input, className)}
        type="file"
        onChange={(e) => {
          onChange && onChange(e);
          setFile(e.currentTarget.files);
        }}
        ref={ref}
      />
      {file && Array.from(file).map((f) => <p>{f.name}</p>)}
    </label>
  );
});
export default MyFile;
