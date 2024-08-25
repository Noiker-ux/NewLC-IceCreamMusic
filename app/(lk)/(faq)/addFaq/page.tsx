import { dataNews } from "@/db/dataNews";
import NewsCard from "@/entities/NewsCard/NewsCard";
import MyTitle from "@/shared/MyTitle/MyTitle";
import styles from "./page.module.css";
import { PageTransitionProvider } from "@/providers/PageTransitionProvider";
import FAQList from "@/entities/FAQ/FAQList";

export default function FAQ() {
  return (
    <PageTransitionProvider>
      <MyTitle Tag={"h3"}>Форма редактрованя FAQ</MyTitle>
      <FAQList />
    </PageTransitionProvider>
  );
}
