import { DetailedHTMLProps, InputHTMLAttributes } from "react";

export default interface IMyInputProps
  extends DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  label: string;
  type: "text" | "password" | "email" | "date";
}
