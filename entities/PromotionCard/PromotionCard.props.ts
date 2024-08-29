import { DetailedHTMLProps, HTMLAttributes } from "react";

export default interface IPromotionCard
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  bgImage: string;
  bgColor: string;
  name: string;
  newPrice: number;
  oldPrice?: number;
  promotionList: string[];
}
