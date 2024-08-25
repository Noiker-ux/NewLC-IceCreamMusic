"use client";
import { useState, ChangeEvent } from "react";
import style from "./PreviewImage.module.css";
import Image from "next/image";
const PreviewImage = () => {
  const [preview, setPreview] = useState<string | ArrayBuffer | null>(null);

  const handleLoadAvatar = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setPreview(reader.result);
      };
    }
  };

  return (
    <label htmlFor="filePreview" className={style.labelFile}>
      <input
        type="file"
        id="filePreview"
        hidden
        accept="image/jpg"
        onChange={handleLoadAvatar}
      />
      <Image
        src={(preview as string) ?? "/assets/Preview/PreviewDark.png"}
        alt="Обложка"
        className={style.image}
        height={300}
        width={300}
      />
    </label>
  );
};
export default PreviewImage;
