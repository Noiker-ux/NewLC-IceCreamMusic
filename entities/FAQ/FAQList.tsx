import FAQItem from "./FAQItem/FAQItem";
import IFAQItemProps from "./FAQItem/FAQItem.props";
import style from "./FAQList.module.css";

const dataFAQ: IFAQItemProps[] = [
  {
    question: "КАКОВЙ",
    answer: "Такой",
  },
  {
    question: "КАКОВЙ",
    answer: "Такой",
  },
  {
    question: "КАКОВЙ",
    answer: "Такой",
  },
];

const FAQList = () => {
  return (
    <>
      <div className={style.faqList}>
        {dataFAQ.map((faq) => (
          <FAQItem
            key={faq.question}
            question={faq.question}
            answer={faq.answer}
          />
        ))}
      </div>
    </>
  );
};
export default FAQList;
