import { FC } from "react"
import { InfoItemProps } from "./models"

const InfoItem: FC<InfoItemProps> = ({ info, text }) => {
  if (!text || !info) {
    return (
      <></>
    )
  }
  return (
    <label className="flex flex-col font-bold text-[1.1rem]">
      {text}:
      <span className="font-normal">
        {info}
      </span>
    </label>
  )
}

export default InfoItem