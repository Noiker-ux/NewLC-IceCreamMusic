import { DetailedHTMLProps, HTMLAttributes } from "react";

export default interface IMyTitleProps
  extends DetailedHTMLProps<
    HTMLAttributes<HTMLHeadingElement>,
    HTMLHeadingElement
  > {
  Tag: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}
