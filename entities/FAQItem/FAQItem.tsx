"use client";
import MyText from "@/shared/MyText/MyText";
import style from "./FAQItem.module.css";
import IFAQItem from "./FAQItem.props";
import { useState } from "react";

const FAQItem = ({ answer, question }: IFAQItem) => {
  const [showAnswer, setShowAnswer] = useState<boolean>(false);

  return (
    <div className={style.wrapper} onClick={() => setShowAnswer(!showAnswer)}>
      <MyText className={style.question}>{question}</MyText>
      {showAnswer && (
        <>
          <hr className={style.separator} />
          <MyText className={style.answer}>{answer}</MyText>
        </>
      )}
    </div>
  );
};
export default FAQItem;
