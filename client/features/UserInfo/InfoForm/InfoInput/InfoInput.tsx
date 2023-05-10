import { FC } from "react";

import { InfoInputProps } from "./models";

const InfoInput: FC<InfoInputProps> = ({ name, registerFn, text, placeholder, type }) => {
  return (
    <label
      className="flex flex-col gap-1 font-bold"
      htmlFor={name}
    >
      {text}
      <input
        placeholder={placeholder}
        className="p-1 rounded-[10px] outline outline-1 font-normal"
        {...registerFn(name)}
        type={type}
      />
    </label>
  )
}

export default InfoInput