import axios from "axios";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/router";
import { FC } from "react";
import { useQuery } from "react-query";

import { DBUser } from "@/db/models";
import BackToMyPageButton from "@/features/BackToMyPageButton/BackToMyPageButton";
import PostField from "@/features/PostField/PostField";
import { userState } from "@/store/User";

const UserIdPage: FC = observer(() => {
  const router = useRouter();
  const { data: userInfo } = useQuery({
    queryFn: async () => {
      const id = router.query.id as string;
      try {
        const url = process.env.NEXT_PUBLIC_BACKEND_URL ?? ""
        const fetchedUser = await axios.post<{ user: DBUser, OK: boolean }>(url + `/users/id`, { id })
        if (fetchedUser.data.OK) {
          return fetchedUser.data.user;
        }
      }
      catch (e) {
        console.error(e);
      }
    },
    queryKey: [`${router.query.id}`]
  })
  if (!userInfo?.id) {
    return (
      <main className="w-full h-full grid place-items-center font-bold text-[1.5rem]">
        <div className="flex flex-col justify-center items-center gap-4">
        <h2>
          User not found
        </h2>
        <BackToMyPageButton />
        </div>
      </main>
    )
  }
  return (
    <main className="w-full h-full flex flex-col justify-center items-center">
      {userInfo.name}
      {userInfo.id === userState.info.id
        ? <PostField />
        : ''}
    </main>
  )
})

export default UserIdPage;