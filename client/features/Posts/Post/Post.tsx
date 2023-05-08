import { DBPost } from "@/db/models"
import { userState } from "@/store/User";
import axios from "axios";
import { ChangeEvent, FC, useEffect, useState } from "react"
import { useDebounce } from "usehooks-ts"
import Image from "next/image";
const Post: FC<DBPost> = (
  { id, likes, ownerId, imageUrl, likedBy, text }
) => {
  const [value, setValue] = useState<boolean>(likedBy.includes(userState.info.id));
  const debouncedValue = useDebounce<boolean>(value, 500)
  const [currentLikedBy, setCurrentLikedBy] = useState<string[]>(likedBy);
  const [init, setInit] = useState<boolean>(true);
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.checked)
  }

  useEffect(() => {
    if (!init) {
      const newLikedByList: string[] = likedBy
        .filter((userId) => userId !== userState.info.id);
      if (debouncedValue) {
        newLikedByList.push(userState.info.id);
      }
      setCurrentLikedBy(newLikedByList);
      axios.post<{ post: DBPost }>(
        (process.env.NEXT_PUBLIC_BACKEND_URL ?? "") + '/posts/update',
        { likedBy: newLikedByList, id: id }).then(({ data }) => {
          console.log(data)
          setCurrentLikedBy(data.post.likedBy);
        });
    }
    if (init) {
      setInit(false);
    }
  }, [debouncedValue])
  return (
    <div className="w-full max-w-[300px] bg-grey outline text-white outline-[var(--blue)]">
      <label htmlFor="like" className="checked:bg-blue">
        haha
        <input
          type='checkbox'
          name="like"
          className="checked:bg-blue"
          checked={value}
          onChange={() => setValue(prev => !prev)}
        />
      </label>
      {currentLikedBy?.length ?? 0}
      {imageUrl
        ? <Image src={imageUrl} alt='post image' width={70} height={70} />
        : ''}
    </div>
  )
}

export default Post