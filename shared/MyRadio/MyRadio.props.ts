import { DetailedHTMLProps, HTMLAttributes } from "react";

export default interface IMyRadioProps
  extends DetailedHTMLProps<
    HTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  label: string;
}
