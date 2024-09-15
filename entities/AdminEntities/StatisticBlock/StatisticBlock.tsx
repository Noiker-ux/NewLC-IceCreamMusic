import MyText from "@/shared/MyText/MyText";
import style from "./StatisticBlock.module.css";
import classNames from "classnames";
import IStatisticBlock from "./StatisticBlock.props";
import MyTitle from "@/shared/MyTitle/MyTitle";
import StatisticUpIcon from "../../../public/InfoIcon/statistic-up.svg";
import StatisticDownIcon from "../../../public/InfoIcon/statistic-down.svg";

const StatisticBlock = ({
  Meaning,
  Difference,
  className,
  ...props
}: IStatisticBlock) => {
  return (
    <div className={style.statistic}>
      <div className={style.row}>
        <MyTitle Tag="h3" className={style.meaning}>
          {Meaning}
        </MyTitle>
        <MyText
          className={classNames(
            style.difference,
            Difference > 0 ? style.green : style.red
          )}
        >
          {Difference > 0 && "+"}
          {Difference}%
        </MyText>
        <div
          className={classNames(style.icon, {
            [style.green_icon]: Difference > 0,
            [style.red_icon]: Difference < 0,
          })}
        >
          {Difference > 0 ? <StatisticUpIcon /> : <StatisticDownIcon />}
        </div>
      </div>
      <MyText className={style.desc}>Новых пользователей</MyText>
    </div>
  );
};
export default StatisticBlock;
