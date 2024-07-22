import { DetailedHTMLProps, HTMLAttributes } from "react";

export default interface IMyTextProps
  extends DetailedHTMLProps<
    HTMLAttributes<HTMLParagraphElement>,
    HTMLParagraphElement
  > {}
