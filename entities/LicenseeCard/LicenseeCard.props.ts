import { DetailedHTMLProps, HTMLAttributes, ReactNode } from "react";

export default interface ILicenseeCard
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  view: "small" | "big";
  icon: ReactNode;
  title: string;
  desc: string;
}
