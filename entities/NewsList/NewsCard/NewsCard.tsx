import INewsCard from "./NewsCard.props";
import style from "./NewsCard.module.css";
import classNames from "classnames";
import MyText from "@/shared/MyText/MyText";
import dateFormatter from "@/utils/dateFormatter";

const NewsCard = ({
  dateCreate,
  title,
  anons,
  className,
  ...props
}: INewsCard) => {
  return (
    <div className={classNames(style.wrapper, className)} {...props}>
      <MyText className={style.dateCreate}>{dateFormatter(dateCreate)}</MyText>
      <MyText className={style.title}>{title}</MyText>
      <MyText className={style.anons}>{anons}</MyText>
    </div>
  );
};
export default NewsCard;
