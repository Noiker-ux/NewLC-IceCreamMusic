import { DetailedHTMLProps, HTMLAttributes } from "react";

export default interface IMySelectProps
  extends DetailedHTMLProps<
    HTMLAttributes<HTMLSelectElement>,
    HTMLSelectElement
  > {
  options: { value: string; label: string }[];
  label: string;
  tooltip?: {
    id: string;
    text: string;
  };
}
