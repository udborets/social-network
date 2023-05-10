import axios from "axios";
import { observer } from "mobx-react-lite";
import Head from "next/head";
import { useRouter } from "next/router";
import { FC } from "react";
import { useQuery } from "react-query";

import { DBUser } from "@/db/models";
import BackToMyPageButton from "@/features/BackToMyPageButton/BackToMyPageButton";
import FriendButton from "@/features/FriendButton/FriendButton";
import PostField from "@/features/PostField/PostField";
import UserInfo from "@/features/UserInfo/UserInfo";
import UserPosts from "@/features/UserPosts/UserPosts";
import { userState } from "@/store/User";

const UserIdPage: FC = observer(() => {
  const router = useRouter();
  const { data: userInfo } = useQuery({
    queryFn: async () => {
      const id = router.query.id as string;
      try {
        const url = process.env.NEXT_PUBLIC_BACKEND_URL ?? ""
        const fetchedUser = await axios.post<{ user: DBUser, OK: boolean }>(url + `/users/id`, { id: id ?? userState.info.id })
        if (fetchedUser.data.OK) {
          return fetchedUser.data.user;
        }
      }
      catch (e) {
        console.error(e);
      }
    },
    refetchInterval: 3000,
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
    <>
      <Head>
        <title>Friends | {userInfo?.name ?? "User"}</title>
      </Head>
      <main className="w-full h-fit flex flex-col sm:p-[100px] justify-start items-center gap-20">
        {userInfo
          ? <UserInfo userId={userInfo.id} />
          : ''}
        {userInfo.id === userState.info.id
          ? <PostField />
          : <FriendButton friendId={userInfo.id} />}
        {userInfo.posts.length !== 0
          ? <>
            <p className="font-bold text-[1.1rem] text-center max-w-[300px]">
              {userInfo.id === userState.info.id
                ? 'Your posts'
                : `${userInfo.name}'s posts`}
            </p>
            <UserPosts
              posts={userInfo.posts}
            />
          </>
          : (
            <p className="font-bold text-[1.1rem] text-center max-w-[300px]">
              {`${userInfo.id === userState.info.id ? 'You' : userInfo.name} did't post anything yet`}
            </p>)}
      </main>
    </>
  )
})

export default UserIdPage;