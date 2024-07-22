import { dataNews } from "@/data/dataNews";
import NewsCard from "@/entities/NewsCard/NewsCard";
import MyTitle from "@/shared/MyTitle/MyTitle";
import styles from "./page.module.css";

export default function Home() {
  return (
    <>
      <MyTitle Tag={"h3"}>Новости</MyTitle>
      <div className={styles.news}>
        {dataNews.map((newsItem) => (
          <NewsCard
            id={newsItem.id}
            anons={newsItem.anons}
            dateCreate={newsItem.dateCreate}
            preview={newsItem.preview}
            title={newsItem.title}
            view={newsItem.view}
            key={newsItem.id}
          />
        ))}
      </div>
    </>
  );
}
