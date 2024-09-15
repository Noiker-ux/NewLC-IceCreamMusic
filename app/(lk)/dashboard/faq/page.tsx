import FAQItem from "@/entities/FAQItem/FAQItem";
import { PageTransitionProvider } from "@/providers/PageTransitionProvider";
import RelizeItem from "@/widgets/RelizeItem/RelizeItem";

export default function FAQPage() {
  return (
    <PageTransitionProvider>
      <FAQItem
        question={"Cколько цветов"}
        answer={
          "Сложно дать точный ответ на вопрос о количестве видов цветов, так как это зависит от множества факторов, включая классификацию и определение. В мире насчитывается более 400 000 видов цветковых растений, которые относятся к различным семействам и родам. Каждый вид может иметь множество сортов и вариантов, что увеличивает общее число цветов."
        }
      />
    </PageTransitionProvider>
  );
}
