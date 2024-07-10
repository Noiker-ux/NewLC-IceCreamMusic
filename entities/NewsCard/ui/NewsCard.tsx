import MyText from "@/shared/MyText/MyText";
import style from "./NewsCard.module.css";
import dateFormatter from "@/utils/dateFormatter";
import { useState } from "react";
import classNames from "classnames";
import INewsCardProps from "./NewsCard.props";
import MyTitle from "@/shared/MyTitle/MyTitle";
import Image from "next/image";

const NewsCard = ({
  id,
  dateCreate,
  title,
  anons,
  preview,
  view,
}: INewsCardProps) => {
  const formatterDate = dateFormatter(dateCreate);

  return (
    <div className={classNames(style.newsCard, style[`newsCard-${view}`])}>
      <MyTitle className={style[`title-${view}`]} Tag="h2">
        {title}
      </MyTitle>
      <div className={style[`body-${view}`]}>
        <MyText className={style[`anons-${view}`]}>{anons}</MyText>
        <Image
          className={style[`preview-${view}`]}
          alt="Превью картинка"
          src={preview}
          width={150}
          height={150}
        />
      </div>
      <MyText className={style[`date-${view}`]}>{formatterDate}</MyText>
    </div>
  );
};
export default NewsCard;
