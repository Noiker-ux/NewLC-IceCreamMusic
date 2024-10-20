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

      {releasesData.length === 0 && <MyText>Тут пока ничего нет</MyText>}
    </PageTransitionProvider>
  );
}
