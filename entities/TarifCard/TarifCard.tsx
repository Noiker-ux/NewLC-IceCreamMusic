import style from "./TarifCard.module.css";
import MyTitle from "@/shared/MyTitle/MyTitle";
import MyText from "@/shared/MyText/MyText";
import Link from "next/link";
import ITarifCard from "./TarifCard.props";
import classNames from "classnames";

const TarifCard = ({
  name,
  desc,
  markers,
  price,
  icon,
  border,
}: ITarifCard) => {
  return (
    <div className={classNames(style.TarifCard, { [style.border]: border })}>
      {icon}
      <MyTitle Tag={"h3"} className={style.title}>
        {name}
      </MyTitle>
      <MyText className={style.desc}>{desc}</MyText>
      <div className={style.price_wrapper}>
        <MyTitle className={style.price} Tag={"h4"}>
          {price} ₽
        </MyTitle>
        <MyText className={style.intoMonth}>В месяц</MyText>
      </div>
      <ul className={style.markerList}>
        {markers.map((m) => (
          <li key={m} className={style.marker}>
            {m}
          </li>
        ))}
      </ul>
      <button className={style.btn}>Оформить за {price} ₽</button>
      <MyText className={style.yourSuccess}>
        Совершая покупку вы ознакомились и принимаете условия{" "}
        <Link href={"#"} className={style.href}>
          публичной оферты
        </Link>
      </MyText>
    </div>
  );
};
export default TarifCard;
