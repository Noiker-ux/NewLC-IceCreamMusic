import { DetailedHTMLProps, HTMLAttributes } from "react";

export default interface IMyTextArea
  extends DetailedHTMLProps<
    HTMLAttributes<HTMLTextAreaElement>,
    HTMLTextAreaElement
  > {
  label: string;
}
