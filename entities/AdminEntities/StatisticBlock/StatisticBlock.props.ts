import { DetailedHTMLProps, HTMLAttributes } from "react";

export default interface IStatisticBlock
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  Meaning: number;
  Difference: number;
}
