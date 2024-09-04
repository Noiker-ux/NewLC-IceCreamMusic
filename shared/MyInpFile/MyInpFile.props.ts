import { DetailedHTMLProps, InputHTMLAttributes } from "react";

export default interface IMyInpFile
  extends DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {}
