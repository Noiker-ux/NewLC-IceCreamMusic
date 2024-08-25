import PreviewImage from "./PreviewImage/PreviewImage";
import style from "./SignatureWidget.module.css";
const SignatureWidget = () => {
  return (
    <form>
      <div className={style.topForm}>
        <PreviewImage />
        <div></div>
      </div>
    </form>
  );
};
export default SignatureWidget;
