import classNames from "classnames";
import style from "./RelizeItem.module.css";
import Image from "next/image";
import IRelizeItem from "./RelizeItem.props";
import MyText from "@/shared/MyText/MyText";
import dateFormatter from "@/utils/dateFormatter";

const RelizeItem = ({
  srcPreview,
  artistsName,
  relizeName,
  className,
  upc,
  labelName,
  typeRelize,
  dateCreate,
  dateRelize,
  dateStart,
  genre,
  status,
  moderatorComment,
  ...props
}: IRelizeItem) => {
  return (
    <div className={classNames(style.wrapper, className)} {...props}>
      <div className={style.top}>
        <Image
          className={style.preview}
          alt="Превью"
          src={srcPreview}
          height={90}
          width={90}
        />
        <div className={style.top__info}>
          <div>
            <MyText className={style.title}>{relizeName}</MyText>
            <MyText className={style.value}>{artistsName}</MyText>
          </div>

          <div className={style.top__info_down}>
            {upc && (
              <div>
                <MyText className={style.title}>UPC</MyText>
                <MyText className={style.value}>{upc}</MyText>
              </div>
            )}

            {labelName && (
              <div>
                <MyText className={style.title}>Название лейбла</MyText>
                <MyText className={style.value}>{labelName}</MyText>
              </div>
            )}
          </div>
        </div>
        <div className={style.status}>
          <div
            className={classNames(style.point, {
              [style.red]: status === "Отказано в релизе",
              [style.green]: status === "Отгружено",
              [style.blue]: status === "В обработке",
            })}
          ></div>
          <MyText className={style.statusTitle}>{status}</MyText>
        </div>
      </div>
      <div className={style.body}>
        <div>
          <MyText className={style.title}>Дата создания</MyText>
          <MyText className={style.value}>{dateFormatter(dateCreate)}</MyText>
        </div>

        <div>
          <MyText className={style.title}>Дата релиза</MyText>
          <MyText className={style.value}>{dateFormatter(dateRelize)}</MyText>
        </div>

        <div>
          <MyText className={style.title}>Дата старта</MyText>
          <MyText className={style.value}>{dateFormatter(dateStart)}</MyText>
        </div>

        <div>
          <MyText className={style.title}>Тип релиза</MyText>
          <MyText className={style.value}>{typeRelize}</MyText>
        </div>

        <div>
          <MyText className={style.title}>Жанр</MyText>
          <MyText className={style.value}>{genre}</MyText>
        </div>
      </div>
      <div className={style.bottom}>
        {moderatorComment && (
          <div>
            <MyText className={style.title}>Комментарий от модератора:</MyText>
            <MyText className={style.value}>{moderatorComment}</MyText>
          </div>
        )}
      </div>
    </div>
  );
};
export default RelizeItem;
