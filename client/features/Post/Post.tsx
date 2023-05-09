import axios from "axios";
import { observer } from "mobx-react-lite";
import Image from "next/image";
import { FC, useEffect, useState } from "react";
import { useDebounce } from "usehooks-ts";

import avatarImage from '@/assets/avatarImage.png';
import { DBPost } from "@/db/models";
import { userState } from "@/store/User";
import styles from './styles.module.scss';

const Post: FC<DBPost> = observer((
  { id, imageUrl, likedBy, text, owner }
) => {
  const [isLiked, setIsLiked] = useState<boolean>(likedBy?.includes(userState.info.id) ?? []);
  const [currentLikedBy, setCurrentLikedBy] = useState<string[]>(likedBy ?? []);
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
      <h4 className="font-bold text-center w-full text-[1.2rem] flex justify-end items-start gap-6">
        {owner?.name?? 'User'}
        <Image
          src={owner?.avatarUrl ?? avatarImage} priority
          alt="avatar image"
          className="w-[50px] h-[50px] rounded-[50%] self-center"
          width={50}
          height={50}
        />
      </h4>
      <p className="mt-[20px] max-w-[90%] w-full text-left">
        {text}
      </p>
      {imageUrl
        ? <Image src={imageUrl} alt='post image' width={300} height={70} priority />
        : ''}
      <label htmlFor="like" className="place-self-end text-center flex justify-center gap-2 font-bold text-[1.2rem]">
        {currentLikedBy?.length ?? 0}
        <input
          type='checkbox'
          name="like"
          id="like"
          className={`appearance-none w-[30px] h-[30px] duration-300 transition-all 
            ${isLiked ? ` ${styles.likeBlue}` : `bg-none ${styles.likeBlack}`}`}
          checked={debouncedIsLiked}
          disabled={isLoading}
          onChange={() => setIsLiked(prev => !prev)}
        />
      </label>
    </div>
  )
})

export default Post