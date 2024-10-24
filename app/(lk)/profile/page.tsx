import { getAuthSession } from "@/actions/auth";
import { db } from "@/db";
import { Error } from "@/entities/Error";
import MyText from "@/shared/MyText/MyText";
import MyTitle from "@/shared/MyTitle/MyTitle";
import RelizeItem from "@/widgets/RelizeItem/RelizeItem";
import classNames from "classnames";
import Image from "next/image";
import Link from "next/link";
import style from "./page.module.css";

export default async function ProfilePage() {
  const session = await getAuthSession();

  if (!session || !session.user || !session.user.id) {
    return <Error statusCode={404} />;
  }

  const userData = await db.query.users.findFirst({
    where: (us, { eq }) => eq(us.id, session.user!.id),
    with: {
      releases: { limit: 3, orderBy: (rel, { desc }) => desc(rel.startDate) },
    },
  });

  return (
    <div className={style.profile}>
      <div className={classNames("row", "gap50")}>
        <div className={classNames("col", "gap30")}>
          <Image
            src={`/avatars/${userData!.id}.${userData!.avatar}`}
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
            {userData?.name}
          </MyTitle>
          <MyText className="fs20">
            {userData?.isAdmin ? "Admin" : "User"}
          </MyText>
          {/* <MyText className={style.description}>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Omnis id
            dignissimos, illo voluptatibus quis in fugit sint, iusto dicta
            quisquam, consectetur excepturi facilis veritatis voluptatum
            consequuntur odit debitis ullam nesciunt.
          </MyText> */}
          {/* <div>
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
          </div> */}
          {/* <div>
            <MyTitle Tag={"h3"} className="mt30">
              Дополнительная информация
            </MyTitle>
            <div className={classNames("col", "gap5", "mt10")}>
              <MyText>Дата рождения: 05.04.2005</MyText>
              <MyText>Страна: Россия</MyText>
              <MyText>Лейбл: DeadDynasty</MyText>
              <MyText>Личный сайт: https://yandex.ru/search/?</MyText>
            </div>
          </div> */}
        </div>
      </div>
      <div className={classNames(style.myRelizes, "w100")}>
        <MyTitle Tag={"h3"} className="mb20">
          Мои релизы
        </MyTitle>
        {userData?.releases.map((release) => {
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
