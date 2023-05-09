import axios from "axios";
import { observer } from "mobx-react-lite";
import { FC, useEffect, useState } from "react";
import { useQuery } from "react-query";

import { DBFriends } from "@/db/models";
import { userState } from "@/store/User";
import { UserItemProps } from "./models";

const UserItem: FC<UserItemProps> = observer(({ id }) => {
  const [isFriend, setIsFriend] = useState<boolean>(false);
  const { refetch, isFetching, isRefetching } = useQuery({
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
    <div className="w-full max-w-[500px] bg-slate-300 rounded-[20px] p-5 flex gap-4">
      <span>{id}</span>
      <button
        disabled={isFetching || isRefetching}
        className={`${isFriend
          ? 'hover:bg-red-600 active:bg-red-900 outline-red-400'
          : 'hover:bg-blue-hover active:bg-blue-active outline-[var(--blue)]'} disabled:bg-[#00000096] outline rounded-[10px] p-2 bg-white 
          duration-300 transition-all hover:text-white active:text-white`}
        onClick={async () => {
          if (!isFriend) {
            const a = await axios.post((process.env.NEXT_PUBLIC_BACKEND_URL ?? "") + '/friends/add', { userId: userState.info.id, friendId: id })
            console.log(a)
          }
          if (isFriend) {
            await axios.post((process.env.NEXT_PUBLIC_BACKEND_URL ?? "") + '/friends/remove', { userId: userState.info.id, friendId: id })
          }
          refetch();
        }}
      >
        {isFriend ? 'Remove friend' : 'Add to friends'}
      </button>
    </div>
  )
})

export default UserItem