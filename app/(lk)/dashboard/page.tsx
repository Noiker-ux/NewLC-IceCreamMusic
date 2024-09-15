import { PageTransitionProvider } from "@/providers/PageTransitionProvider";
import RelizeItem from "@/widgets/RelizeItem/RelizeItem";

export default function MainPage() {
  // const data = await db.select().from(users);

  return (
    <PageTransitionProvider>
      <RelizeItem
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
      <RelizeItem
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
    </PageTransitionProvider>
  );
}
