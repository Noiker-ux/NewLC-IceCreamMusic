import { PageTransitionProvider } from "@/providers/PageTransitionProvider";
import SendRelease from "@/widgets/SendRelize/SendRelize";

export default function CatalogPage() {
  return (
    <PageTransitionProvider>
      <div>
        <SendRelease />
      </div>
    </PageTransitionProvider>
  );
}
