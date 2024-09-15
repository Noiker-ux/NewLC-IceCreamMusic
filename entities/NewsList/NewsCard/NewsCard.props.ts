import { DetailedHTMLProps, HTMLAttributes } from "react";

export default interface INewsCard
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  dateCreate: Date;
  title: string;
  anons: string;
}
