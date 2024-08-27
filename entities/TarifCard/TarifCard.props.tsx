import { DetailedHTMLProps, HtmlHTMLAttributes, ReactNode } from "react";

export default interface ITarifCard
  extends DetailedHTMLProps<
    HtmlHTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  border: boolean;
  name: string;
  icon: ReactNode;
  desc: string;
  price: number;
  markers: string[];
}
