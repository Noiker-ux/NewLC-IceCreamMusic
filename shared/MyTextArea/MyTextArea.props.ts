import { DetailedHTMLProps, TextareaHTMLAttributes } from "react";

export default interface IMyTextArea
  extends DetailedHTMLProps<
    TextareaHTMLAttributes<HTMLTextAreaElement>,
    HTMLTextAreaElement
  > {
  label: string;
}
