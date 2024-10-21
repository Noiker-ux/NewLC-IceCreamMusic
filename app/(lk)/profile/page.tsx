import MyInpFile from "@/shared/MyInpFile/MyInpFile";
import style from "./page.module.css";
import MyInput from "@/shared/MyInput/MyInput";
import MyTextArea from "@/shared/MyTextArea/MyTextArea";
import MyTitle from "@/shared/MyTitle/MyTitle";
import classNames from "classnames";
import RelizeItem from "@/widgets/RelizeItem/RelizeItem";
import { getAuthSession } from "@/actions/auth";
import { db } from "@/db";
import MyButton from "@/shared/MyButton/MyButton";
import Image from "next/image";
import MyText from "@/shared/MyText/MyText";
import Link from "next/link";

export default async function ProfilePage() {
  const session = await getAuthSession();

  // if (!session || !session.user) {
  //   return <Error statusCode={404} />;
  // }

  const releasesData = await db.query.release.findMany({
    where: (release, { eq }) => eq(release.authorId, session.user!.id),
  });

  return (
    <div className={style.profile}>
      <div className={classNames("row", "gap50")}>
        <div className={classNames("col", "gap30")}>
          <Image
            src={"/assets/avatar.jpg"}
            alt={"Avatar"}
            width={250}
            height={250}
            className="rounded"
          />
          <Link href={"/profile/edit/"} className="linkButton">
            Редактировать
          </Link>
        </div>
        <div>
          <MyTitle Tag={"h2"} className="fs36">
            Noiker666
          </MyTitle>
          <MyText className="fs20">Super User</MyText>
          <MyText className={style.description}>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Omnis id
            dignissimos, illo voluptatibus quis in fugit sint, iusto dicta
            quisquam, consectetur excepturi facilis veritatis voluptatum
            consequuntur odit debitis ullam nesciunt.
          </MyText>
          <div>
            <MyTitle Tag={"h3"} className="mt30">
              Мои соцсети
            </MyTitle>
            <ul className={classNames("mt10", "ml20", "col", "gap5")}>
              <li>
                https://yandex.ru/search/?text=photoshop+%D0%BE%D0%BDA%D1%82%D0%BE%D1%80&lr=22&clid=2411725&src=suggest_B
              </li>
              <li>
                https://yandex.ru/search/?text=photoshop%D0%B4%D0%B0%D0%BA%D1%82%D0%BE%D1%80&lr=22&clid=2411725&src=suggest_B
              </li>
              <li>
                https://yandex.ru/search/?text=0%BA%D1%82%D0%BE%D1%80&lr=22&clid=2411725&src=suggest_B
              </li>
            </ul>
          </div>
          <div>
            <MyTitle Tag={"h3"} className="mt30">
              Дополнительная информация
            </MyTitle>
            <div className={classNames("col", "gap5", "mt10")}>
              <MyText>Дата рождения: 05.04.2005</MyText>
              <MyText>Страна: Россия</MyText>
              <MyText>Лейбл: DeadDynasty</MyText>
              <MyText>Личный сайт: https://yandex.ru/search/?</MyText>
            </div>
          </div>
        </div>
      </div>
      <div className={classNames(style.myRelizes, "w100")}>
        <MyTitle Tag={"h3"} className="mb20">
          Мои релизы
        </MyTitle>
        {releasesData.map((release) => {
          return (
            <RelizeItem
              key={release.id}
              srcPreview="/assets/avatar.jpg"
              relizeName={release.title}
              upc={release.upc}
              labelName={release.labelName}
              genre={release.genre}
              artistsName={release.performer}
              typeRelize={release.type}
              status={release.status}
              moderatorComment={release.rejectReason}
              dateCreate={release.preorderDate}
              dateRelize={release.releaseDate}
              dateStart={release.startDate}
            />
          );
        })}
      </div>
    </div>
  );
}
