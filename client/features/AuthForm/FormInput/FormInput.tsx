import { FC } from "react";

import { AuthInputProps } from "./models";

const FormInput: FC<AuthInputProps> = ({ errors, required, register, registerName, text, isPassword }) => {
  return (
    <label className="flex flex-col text-[1.2rem] font-bold">
      <span>
        {required
          ? <span className="text-red-700">
            *
          </span>
          : ''}
        {text}
      </span>
      <input
        className="rounded-[8px] outline outline-1 outline-[var(--blue)] px-2 py-1 text-[1rem] font-normal"
        type={isPassword ? "password" : "text"}
        {...register(registerName, {
          validate: (value: string) => (value.trim().length <= 20 && value.trim().length >= 5),
          required: required ?? false,
          pattern: registerName === 'email' ? /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g : /[^\>]*/,
        })}
      />
      <span className="min-h-[30px] text-red-600 text-[1rem]">
        {errors[registerName]?.message !== ''
          ? errors[registerName]?.message?.toString()
          : registerName === 'email' ? 'Pass valid email' : "Pass value from 5 to 20 symbols"}
      </span>
    </label>
  )
}

export default FormInput;