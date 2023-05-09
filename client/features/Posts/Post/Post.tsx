import axios from "axios";
import Image from "next/image";
import { ChangeEvent, FC, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useDebounce } from "usehooks-ts";

import avatarImage from '@/assets/avatarImage.png';
import { DBPost } from "@/db/models";
import { userState } from "@/store/User";
import { observer } from "mobx-react-lite";

const Post: FC<DBPost> = observer((
  { id, imageUrl, likedBy, text, owner }
) => {
  const [isLiked, setIsLiked] = useState<boolean>(likedBy.includes(userState.info.id));
  const [currentLikedBy, setCurrentLikedBy] = useState<string[]>(likedBy);
  const debouncedIsLiked = useDebounce(isLiked, 500);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const updatePost = async () => {
    try {
      setIsLoading(true);
      const updatedList = currentLikedBy
        .filter((userId) => userId !== userState.info.id);
      if (debouncedIsLiked) updatedList.push(userState.info.id);
      const updatedPost = await axios.post<{ post: DBPost }>((process.env.NEXT_PUBLIC_BACKEND_URL ?? "") + "/posts/update",
        { id: id, likedBy: updatedList });
      setIsLoading(false);
      if (updatedPost.data && updatedPost.data.post) {
        setCurrentLikedBy(updatedPost.data.post.likedBy);
        return updatedPost.data.post.likedBy;
      }
    }
    catch (e) {
      console.error(e);
      return [];
    }
  }

  useEffect(() => {
    if (!isLoading)
      updatePost();
  }, [debouncedIsLiked])
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
            checked={debouncedIsLiked}
            disabled={isLoading}
            onChange={() => setIsLiked(prev => !prev)}
          />
        </label>
        {currentLikedBy?.length ?? 0}
      </div>
    </div>
  )
})

export default Post