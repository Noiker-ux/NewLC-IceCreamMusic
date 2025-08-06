import IAdvantage from '@/data/site/Advantages/Advantages.inteface';
import { DetailedHTMLProps, HTMLAttributes } from "react";


export default interface IСardAdvantage
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  data: IAdvantage;
}
