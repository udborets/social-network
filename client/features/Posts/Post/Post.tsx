import { DBPost } from "@/db/models"
import { userState } from "@/store/User";
import axios from "axios";
import { ChangeEvent, FC, useEffect, useState } from "react"
import { useDebounce } from "usehooks-ts"
import Image from "next/image";
const Post: FC<DBPost> = (
  { id, likes, ownerId, imageUrl, likedBy, text }
) => {
  const [value, setValue] = useState<boolean>(false);
  const debouncedValue = useDebounce<boolean>(value, 500)

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.checked)
  }

  useEffect(() => {
    const newLikedByList: string[] = likedBy
      .filter((userId) => userId !== userState.info.id);
    if (debouncedValue) {
      newLikedByList.push(userState.info.id);
    }
    axios.post(
      (process.env.NEXT_PUBLIC_BACKEND_URL ?? "") + '/posts/update',
      { likedBy: newLikedByList, id: id })
  }, [debouncedValue])
  return (
    <div className="w-full max-w-[300px] bg-blue">
      <input
        type='checkbox'
        className="appearance-none "
      >
      </input>
      {likes}
      {imageUrl
        ? <Image src={imageUrl} alt='post image' width={70} height={70}/>
        : ''}
    </div>
  )
}

export default Post