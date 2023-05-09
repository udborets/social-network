import { FC } from "react"
import { AuthInputProps } from "./models"

const AuthInput: FC<AuthInputProps> = ({ errors, required, register, registerName, text }) => {
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
        type="text"
        {...register(registerName, {
          required: required ?? false,
        })}
      />
      <span className="min-h-[30px] text-red-600 text-[1rem]">
        {errors[registerName]?.message?.toString()}
      </span>
    </label>
  )
}

export default AuthInput