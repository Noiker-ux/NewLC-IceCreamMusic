import { PageTransitionProvider } from "@/providers/PageTransitionProvider";
import NewsList from "@/entities/NewsList/NewsList";

export default function NewsPage() {
  return (
    <PageTransitionProvider>
      <NewsList />
    </PageTransitionProvider>
  );
}
