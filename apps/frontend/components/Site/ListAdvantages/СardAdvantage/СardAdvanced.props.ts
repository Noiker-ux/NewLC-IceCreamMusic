import { DetailedHTMLProps, HTMLAttributes } from "react";
import IAdvantage from "../../../data/site/Advantages/Advantages.inteface";

export default interface IСardAdvantage
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  data: IAdvantage;
}
