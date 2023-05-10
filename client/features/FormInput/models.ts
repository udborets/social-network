import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";

export type AuthInputProps = {
  required?: string;
  errors: FieldErrors<FieldValues>;
  register: UseFormRegister<FieldValues>;
  registerName: string;
  text: string;
  isPassword?: boolean;
};
