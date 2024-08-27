import MyText from "@/shared/MyText/MyText";
import style from "./ChartItem.module.css";
import classNames from "classnames";
import Image from "next/image";
import IChartItem from "./ChartItem.props";
import Link from "next/link";

const ChartItem = ({
  artist,
  link,
  position,
  preview,
  songName,
}: IChartItem) => {
  return (
    <Link href={link} className={style.link}>
      <div className={style.wrapper}>
        <Image
          className={style.albomPreview}
          src={preview}
          alt={songName}
          height={62}
          width={62}
        />
        <div className={style.status_block}>
          <MyText className={style.position}>{position}</MyText>
          <div className={style.bluePoint}></div>
        </div>
        <div className={style.info_block}>
          <MyText className={style.songName}>{songName}</MyText>
          <MyText className={style.artist}>{artist}</MyText>
        </div>
      </div>
    </Link>
  );
};
export default ChartItem;
