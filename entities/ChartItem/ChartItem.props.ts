import { DetailedHTMLProps, HTMLAttributes } from "react";

export default interface IChartItem
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  preview: string;
  position: number;
  songName: string;
  artist: string;
  link: string;
}
