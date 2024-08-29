import style from "./PromotionCard.module.css";
import MyTitle from "@/shared/MyTitle/MyTitle";
import MyText from "@/shared/MyText/MyText";
import Link from "next/link";
import classNames from "classnames";
import IPromotionCard from "./PromotionCard.props";
import moneyFormatter from "@/utils/moneyFormatter";
import SuccessIcon from "../../public/InfoIcon/Success.svg";
import MyButton from "@/shared/MyButton/MyButton";

const PromotionCard = ({
  bgColor,
  bgImage,
  name,
  newPrice,
  oldPrice,
  promotionList,
}: IPromotionCard) => {
  return (
    <div
      className={style.wrapper}
      style={{
        backgroundColor: `${bgColor}`,
      }}
    >
      <div
        className={style.top}
        style={{
          backgroundImage: `url(/PromotionPhotos/${bgImage})`,
          boxShadow: `1px 14px 0px red;`,
        }}
      >
        <MyTitle Tag={"h2"} className={style.name}>
          {name}
        </MyTitle>
        <div className={style.price}>
          <MyText className={style.newPrice}>{moneyFormatter(newPrice)}</MyText>
          {oldPrice && (
            <MyText className={style.oldPrice}>
              {moneyFormatter(oldPrice)}
            </MyText>
          )}
        </div>
      </div>
      <div className={style.body}>
        <MyText className={style.title}>В план включено:</MyText>
        <ul className={style.listPromotion}>
          {promotionList.map((p) => (
            <li className={style.itemPromotion} key={p}>
              <SuccessIcon className={style.SuccessIcon} />
              <MyText className={style.itemPromotion_text}>{p}</MyText>
            </li>
          ))}
        </ul>
      </div>
      <MyButton
        className={style.btn}
        text={"Ознакомиться"}
        view={"secondary"}
      />
    </div>
  );
};
export default PromotionCard;
