import { HTMLInputTypeAttribute } from "react";
import { FieldValues, UseFormRegister } from "react-hook-form";

export type InfoInputProps = {
  registerFn: UseFormRegister<FieldValues>;
  name: string;
  text: string;
  placeholder: string;
  type?: HTMLInputTypeAttribute;
};
