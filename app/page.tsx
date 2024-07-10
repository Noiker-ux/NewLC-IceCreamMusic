import Image from "next/image";
import styles from "./page.module.css";
import MyInput from "@/shared/MyInput/MyInput";
import MyTitle from "@/shared/MyTitle/MyTitle";
import Logo from "@/shared/Logo/Logo";
import NewsCard from "@/entities/NewsCard/ui/NewsCard";

export default function Home() {
  return (
    <main className={styles.main}>
      <Logo />
      <div style={{ display: "flex", gap: "20px", justifyContent: "flex-end" }}>
        <NewsCard
          id={1}
          title={"PHARAOH - PHREQUENCY"}
          anons={
            "Ни одной зря потраченной минуты, ни одного солганного слова, ни одного даже крохотного сожаления, ни одного разочарования от первого до сиюминутного вздоха. каждой душе чудо, каждому в руки выбор. каждый, кто захочет найти - найдет."
          }
          dateCreate={new Date()}
          preview={"/Test.jpg"}
          view={"MeetTheFounder"}
        />
        <NewsCard
          id={1}
          title={"PHARAOH - PHREQUENCY"}
          anons={
            "Ни одной зря потраченной минуты, ни одного солганного слова, ни одного даже крохотного сожаления, ни одного разочарования от первого до сиюминутного вздоха. каждой душе чудо, каждому в руки выбор. каждый, кто захочет найти - найдет."
          }
          dateCreate={new Date()}
          preview={"/Test.jpg"}
          view={"StrategyCard"}
        />
        <NewsCard
          id={1}
          title={"PHARAOH - PHREQUENCY"}
          anons={
            "Ни одной зря потраченной минуты, ни одного солганного слова, ни одного даже крохотного сожаления, ни одного разочарования от первого до сиюминутного вздоха. каждой душе чудо, каждому в руки выбор. каждый, кто захочет найти - найдет."
          }
          dateCreate={new Date()}
          preview={"/Test.jpg"}
          view={"MeetTheFounder"}
        />
      </div>
    </main>
  );
}
