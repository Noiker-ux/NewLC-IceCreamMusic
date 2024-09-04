import { PageTransitionProvider } from "@/providers/PageTransitionProvider";
import SendRelize from "@/widgets/SendRelize/SendRelize";

export default function CatalogPage() {
  return (
    <PageTransitionProvider>
      <div>
        <SendRelize />
      </div>
    </PageTransitionProvider>
  );
}
