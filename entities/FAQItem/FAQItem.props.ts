import { DetailedHTMLProps, HTMLAttributes } from "react";

export default interface IFAQItem
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  question: string;
  answer: string;
}
