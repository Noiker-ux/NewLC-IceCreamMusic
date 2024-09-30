import { PageTransitionProvider } from "@/providers/PageTransitionProvider";
import SendRelease from "@/widgets/SendRelize/SendRelease";

export default function CatalogPage() {
  return (
    <PageTransitionProvider>
      <div>
        <SendRelease />
      </div>
    </PageTransitionProvider>
  );
}
