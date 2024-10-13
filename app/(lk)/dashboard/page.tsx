import { getAuthSession } from "@/actions/auth";
import { db } from "@/db";
import { PageTransitionProvider } from "@/providers/PageTransitionProvider";
import MyText from "@/shared/MyText/MyText";
import RelizeItem from "@/widgets/RelizeItem/RelizeItem";

export default async function MainPage() {
  const session = await getAuthSession();

  // if (!session || !session.user) {
  //   return <Error statusCode={404} />;
  // }

  const releasesData = await db.query.release.findMany({
    where: (release, { eq }) => eq(release.authorId, session.user!.id),
  });

  return (
    <PageTransitionProvider>
      {releasesData.map((release) => {
        return (
          <RelizeItem
            key={release.id}
            srcPreview="/assets/avatar.jpg"
            relizeName={"moves"}
            upc={12453633244}
            labelName="ICECREAMMUSIC"
            genre="Rap/Hip-Hop"
            artistsName={"Bless Panther"}
            typeRelize="Singl"
            status="В обработке"
            moderatorComment="Данный релиз содержит ненормативную лексику"
            dateCreate={new Date()}
            dateRelize={new Date()}
            dateStart={new Date()}
          />
        );
      })}

      {releasesData.length === 0 && <MyText>Тут пока ничего нет</MyText>}
    </PageTransitionProvider>
  );
}
