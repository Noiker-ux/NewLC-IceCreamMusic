"use client";

import { useState } from "react";
import style from "./MyFile.module.css";

const MyFile = () => {
  const [file, setFile] = useState<FileList | null>(null);
  return (
    <label className={style.wrap} id="dropcontainer">
      <div className={style.btn}>Загрузить файл</div>
      <input
        className={style.input}
        type="file"
        onChange={(e) => setFile(e.currentTarget.files)}
      />
      {file && Array.from(file).map((f) => <p>{f.name}</p>)}
    </label>
  );
};
export default MyFile;
