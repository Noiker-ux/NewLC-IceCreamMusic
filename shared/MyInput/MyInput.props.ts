import { DetailedHTMLProps, InputHTMLAttributes } from "react";

export default interface IMyInputProps
  extends DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  label: string;
  inpLk?: boolean;
  type: "text" | "password" | "email" | "date";
  tooltip?: {
    id: string;
    text: string;
  };
}
