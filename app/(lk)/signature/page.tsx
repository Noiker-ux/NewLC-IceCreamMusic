import MyTitle from "@/shared/MyTitle/MyTitle";
import { PageTransitionProvider } from "@/providers/PageTransitionProvider";
import style from "./page.module.css";
import classNames from "classnames";
import SignatureWidget from "@/widgets/SignatureWidget/SignatureWidget";

export default function Profile() {
  return (
    <PageTransitionProvider>
      <MyTitle Tag={"h3"}>Личный кабинет</MyTitle>
      <SignatureWidget />
    </PageTransitionProvider>
  );
}
