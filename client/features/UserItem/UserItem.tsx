import axios from "axios";
import { observer } from "mobx-react-lite";
import Image from "next/image";
import { useRouter } from "next/router";
import { FC, useEffect, useState } from "react";
import { useQuery } from "react-query";

import avatarImage from '@/assets/avatarImage.png';
import { DBFriends } from "@/db/models";
import { userState } from "@/store/User";
import { UserItemProps } from "./models";
import SpinnerModalWindow from "../SpinnerModalWindow/SpinnerModalWindow";

const UserItem: FC<UserItemProps> = observer(({ id, name, avatarUrl }) => {
  const [isFriend, setIsFriend] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const { refetch } = useQuery({
    queryFn: async () => {
      try {
        const fetchedFriends = await axios.post<{ friends: DBFriends[] }>((process.env.NEXT_PUBLIC_BACKEND_URL ?? "") + '/friends');
        if (fetchedFriends.data) {
          setIsFriend(fetchedFriends.data.friends.filter(({ friendId, userId }) => (
            (id === friendId && userId === userState.info.id) || (id === userState.info.id && friendId === userId)
          )).length !== 0);
        }
      }
      catch (e) {
        console.error(e);
      }
    },
    queryKey: [`isFriend${id}`]
  })
  useEffect(() => {
    refetch();
  }, [])
  return (
    <>
      <div
        className="max-w-[500px] min-w-fit w-full max-h-[100px] h-full bg-slate-300 rounded-[20px] p-5 flex gap-4 justify-between items-center"
        onClick={() => router.push(`/users/${id}`)}
      >
        <Image
          src={avatarUrl ?? avatarImage}
          alt="avatar image"
          width={70}
          height={70}
          className="w-[70px] h-[70px] rounded-[50%]"
        />
        <span className="font-bold text-[1.4rem] w-full text-center">
          {name}
        </span>
        <button
          disabled={isLoading}
          className={`${isFriend
            ? 'hover:bg-red-600 active:bg-red-900 outline-red-400'
            : 'hover:bg-blue-hover active:bg-blue-active outline-[var(--blue)]'} disabled:bg-[#00000096] outline rounded-[10px] p-2 bg-white 
          duration-300 transition-all hover:text-white active:text-white min-h-[50px] w-full max-w-[150px]`}
          onClick={async (e) => {
            e.stopPropagation();
            if (!isFriend) {
              setIsLoading(true);
              await axios.post((process.env.NEXT_PUBLIC_BACKEND_URL ?? "") + '/friends/add', { userId: userState.info.id, friendId: id });
              setIsLoading(false);
            }
            if (isFriend) {
              setIsLoading(true);
              await axios.post((process.env.NEXT_PUBLIC_BACKEND_URL ?? "") + '/friends/remove', { userId: userState.info.id, friendId: id });
              setIsLoading(false);
            }
            refetch();
          }}
        >
          {isFriend ? 'Remove friend' : 'Add to friends'}
        </button>
      </div>
      {isLoading
        ? <SpinnerModalWindow />
        : ''}
    </>
  )
})

export default UserItem