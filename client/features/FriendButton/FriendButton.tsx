import axios from "axios";
import { FC, useEffect, useState } from "react";
import { useQuery } from "react-query";

import { DBFriends } from "@/db/models";
import SpinnerModalWindow from "@/features/SpinnerModalWindow/SpinnerModalWindow";
import { userState } from "@/store/User";
import { FriendButtonProps } from "./models";

const FriendButton: FC<FriendButtonProps> = ({ friendId }) => {
  const [isFriend, setIsFriend] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  useEffect(() => {
    refetch();
  }, [])
  const { refetch } = useQuery({
    queryFn: async () => {
      try {
        const fetchedFriends = await axios.post<{ friends: DBFriends[] }>((process.env.NEXT_PUBLIC_BACKEND_URL ?? "") + '/friends');
        if (fetchedFriends.data) {
          setIsFriend(fetchedFriends.data.friends.filter(({ friendId, userId }) => (
            (friendId === friendId && userId === userState.info.id) || (friendId === userState.info.id && friendId === userId)
          )).length !== 0);
        }
      }
      catch (e) {
        console.error(e);
      }
    },
    queryKey: [`isFriend${friendId}`]
  })
  return (
    <>
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
            await axios.post((process.env.NEXT_PUBLIC_BACKEND_URL ?? "") + '/friends/add', { userId: userState.info.id, friendId: friendId });
            setIsLoading(false);
          }
          if (isFriend) {
            setIsLoading(true);
            await axios.post((process.env.NEXT_PUBLIC_BACKEND_URL ?? "") + '/friends/remove', { userId: userState.info.id, friendId: friendId });
            setIsLoading(false);
          }
          refetch();
        }}
      >
        {isFriend ? 'Remove friend' : 'Add to friends'}
      </button>
      {isLoading
        ? <SpinnerModalWindow />
        : ''}
    </>
  )
}

export default FriendButton