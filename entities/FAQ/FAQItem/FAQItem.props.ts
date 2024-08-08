import { DetailedHTMLProps, HTMLAttributes } from "react";

export default interface IFAQItemProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  question: string;
  answer: string;
}
