import { DetailedHTMLProps, HTMLAttributes } from "react";

export default interface IRelizeItem
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  srcPreview: string;
  relizeName: string;
  artistsName: string;
  genre: string;
  typeRelize: string;
  upc?: number;
  labelName?: string;
  dateCreate: Date;
  dateRelize: Date;
  status: "В обработке" | "Отказано в релизе" | "Отгружено";
  dateStart: Date;
  moderatorComment?: string;
}
