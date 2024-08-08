"use client";
import { useState } from "react";
import style from "./FAQItem.module.css";
import IFAQItemProps from "./FAQItem.props";
import { TiChevronRight } from "react-icons/ti";
import { motion } from "framer-motion";
import classNames from "classnames";

const FAQItem = ({ question, answer }: IFAQItemProps) => {
  const [showFAQ, setShowFAQ] = useState<boolean>(false);

  const handleToggleFAQ = () => {
    setShowFAQ(!showFAQ);
  };

  return (
    <motion.div className={style.faqItem} onClick={handleToggleFAQ}>
      <div className={style.faqQuestion}>
        {question}
        <TiChevronRight
          className={classNames(style.arrow, { [style.arrowActive]: showFAQ })}
        />
      </div>
      {showFAQ && <motion.div className={style.faqAnswer}>{answer}</motion.div>}
    </motion.div>
  );
};
export default FAQItem;
