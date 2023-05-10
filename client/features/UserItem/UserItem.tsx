import { observer } from "mobx-react-lite";
import Image from "next/image";
import { useRouter } from "next/router";
import { FC } from "react";

import avatarImage from '@/assets/avatarImage.png';
import FriendButton from "@/features/FriendButton/FriendButton";
import { UserItemProps } from "./models";

const UserItem: FC<UserItemProps> = observer(({ id, name, avatarUrl }) => {
  const router = useRouter();

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
        <FriendButton friendId={id} />
      </div>
    </>
  )
})

export default UserItem