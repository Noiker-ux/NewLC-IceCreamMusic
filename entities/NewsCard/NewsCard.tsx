import MyText from "@/shared/MyText/MyText";

import dateFormatter from "@/utils/dateFormatter";
import { useState } from "react";
import classNames from "classnames";
import INewsCardProps from "./NewsCard.props";
import MyTitle from "@/shared/MyTitle/MyTitle";

import Image from "next/image";
// Styles
import style from "./NewsCard.module.css";
import mtf from "./designs/MeetTheFounder.module.css";
import strtg from "./designs/StrategyCard.module.css";
import coom from "./designs/CoomingCard.module.css";

const NewsCard = ({
  id,
  dateCreate,
  title,
  anons,
  preview,
  view,
}: INewsCardProps) => {
  const formatterDate = dateFormatter(dateCreate);

  switch (view) {
    case "StrategyCard":
      return (
        <div className={classNames(style.newsCard, strtg[`newsCard-${view}`])}>
          <div className={strtg["relative"]}>
            <Image
              className={strtg[`preview-${view}`]}
              alt="Превью картинка"
              src={preview}
              width={150}
              height={150}
            />
            <span className={strtg[`date-${view}`]}>{formatterDate}</span>
          </div>
          <MyTitle className={strtg[`title-${view}`]} Tag="h2">
            {title}
          </MyTitle>
          <MyText className={strtg[`anons-${view}`]}>{anons}</MyText>
        </div>
      );
    default:
      break;
  }
};
export default NewsCard;
