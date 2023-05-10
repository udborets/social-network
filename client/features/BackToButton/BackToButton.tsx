import { observer } from "mobx-react-lite";
import Link from "next/link";
import { FC } from "react";

import { BackToButtonProps } from "./models";

const BackToButton: FC<BackToButtonProps> = observer(({ className, href, text }) => {
  return (
    <Link
      className={`text-white w-fit h-fit bg-blue hover:bg-blue-hover active:bg-blue-active transition-all duration-300 p-3 rounded-[15px] ${className}`}
      href={href}
    >
      {text}
    </Link>
  )
})

export default BackToButton