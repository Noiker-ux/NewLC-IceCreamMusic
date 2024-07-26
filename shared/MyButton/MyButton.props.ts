import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

export default interface IMyButtonProps
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  text: string;
  view: "primary" | "secondary";
}
