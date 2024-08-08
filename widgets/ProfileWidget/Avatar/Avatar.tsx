"use client";
import classNames from "classnames";
import { ChangeEvent, useState } from "react";
import style from "./Avatar.module.css";
import Image from "next/image";

const Avatar = () => {
  const [avatar, setAvatar] = useState<string | ArrayBuffer | null>(null);
  const [hoverAvatar, setHoverAvatar] = useState<boolean>(false);

  const handleLoadAvatar = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setAvatar(reader.result);
      };
    }
  };

  return (
    <label htmlFor="file" className={style.labelFile}>
      <input
        type="file"
        id="file"
        hidden
        accept="image/*"
        onChange={handleLoadAvatar}
      />
      <Image
        className={classNames(style.avatar, {
          [style.avatarHover]: hoverAvatar,
        })}
        src={(avatar as string) ?? "/assets/userAvaStandart.png"}
        alt="Аватар"
        height={350}
        width={350}
        onMouseEnter={() => {
          setHoverAvatar(true);
        }}
        onMouseLeave={() => {
          setHoverAvatar(false);
        }}
      />
      {hoverAvatar && (
        <div className={style.uploadText}>Загрузить изображение</div>
      )}
    </label>
  );
};

export default Avatar;
