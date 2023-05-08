import axios from "axios";
import Image from "next/image";
import { ChangeEvent, FC, useEffect, useState } from "react";
import { useDebounce } from "usehooks-ts";

import avatarImage from '@/assets/avatarImage.png';
import { DBPost } from "@/db/models";
import { userState } from "@/store/User";

const Post: FC<DBPost> = (
  { id, imageUrl, likedBy, text, owner }
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
      axios
        .post<{ post: DBPost }>((process.env.NEXT_PUBLIC_BACKEND_URL ?? "") + '/posts/update', { likedBy: newLikedByList, id: id })
        .then(({ data }) => setCurrentLikedBy(data.post.likedBy));
    }
    if (init) {
      setInit(false);
    }
  }, [debouncedValue])
  return (
    <div className="rounded-[20px] p-4 w-full max-w-[300px] outline text-black outline-[var(--blue)] flex flex-col gap-4 items-center">
      <h4 className="font-bold text-center w-full text-[1.2rem]">{owner.name}</h4>
      <Image
        src={owner.avatarUrl ?? avatarImage}
        alt="avatar image"
        className="w-[70px] h-[70px] rounded-[50%] self-center"
        width={70}
        height={70}
      />
      <p className="mt-[20px] max-w-[90%] text-center">{text}</p>
      {imageUrl
        ? <Image src={imageUrl} alt='post image' width={70} height={70} />
        : ''}
      <div className="flex gap-4">
        <label htmlFor="like" className="checked:bg-blue">
          <input
            type='checkbox'
            name="like"
            className="checked:bg-blue"
            checked={value}
            onChange={() => setValue(prev => !prev)}
          />
        </label>
        {currentLikedBy?.length ?? 0}
      </div>
    </div>
  )
}

export default Post