import { DetailedHTMLProps, HTMLAttributes } from "react";

export default interface IMyCheckboxProps
  extends DetailedHTMLProps<
    HTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  label: string;
  checked?: boolean;
  tooltip?: {
    id: string;
    text: string;
  };
}
