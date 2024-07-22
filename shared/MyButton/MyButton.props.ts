import { DetailedHTMLProps, HTMLAttributes } from "react";

export default interface IMyButtonProps
  extends DetailedHTMLProps<
    HTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  text: string;
  view: "primary" | "secondary";
}
