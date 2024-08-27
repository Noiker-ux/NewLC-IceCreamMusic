import style from "./LicenseeCard.module.css";
import classNames from "classnames";
import ILicenseeCard from "./LicenseeCard.props";
import MyTitle from "@/shared/MyTitle/MyTitle";
import MyText from "@/shared/MyText/MyText";

const LicenseeCard = ({
  icon,
  title,
  desc,
  view = "small",
  className,
  ...props
}: ILicenseeCard) => {
  return (
    <div
      className={classNames(style.wrapper, className, {
        [style.big_wrapper]: view === "big",
      })}
      {...props}
    >
      {icon}
      <div className={style.info}>
        <MyTitle
          Tag={"h2"}
          className={classNames(style.title, {
            [style.title_big]: view === "big",
          })}
        >
          {title}
        </MyTitle>
        <MyText
          className={classNames(style.desc, {
            [style.desc_big]: view === "big",
          })}
        >
          {desc}
        </MyText>
      </div>
    </div>
  );
};
export default LicenseeCard;
