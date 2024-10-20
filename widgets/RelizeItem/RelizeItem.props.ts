import { DetailedHTMLProps, HTMLAttributes } from "react";

export default interface IRelizeItem
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  srcPreview: string;
  relizeName: string;
  artistsName: string | null;
  genre: string;
  typeRelize: string;
  upc: string | null;
  labelName: string | null;
  dateCreate: Date;
  dateRelize: Date;
  status: string;
  dateStart: Date;
  moderatorComment: string | null;
}
