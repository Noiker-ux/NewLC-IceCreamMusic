import MyText from "@/shared/MyText/MyText";
import style from "./BreadCrumbs.module.css";
import MyTitle from "@/shared/MyTitle/MyTitle";

const BreadCrumbs = () => {
  return (
    <div className={style.wrapper}>
      <MyText className={style.breadCrumbs}>Панель управления / Чарты</MyText>
      <MyTitle Tag={"h1"} className={style.title}>
        Чарты
      </MyTitle>
    </div>
  );
};
export default BreadCrumbs;
