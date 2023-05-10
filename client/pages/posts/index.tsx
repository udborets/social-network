import axios from "axios";
import { observer } from "mobx-react-lite";
import { FC } from "react";
import { useQuery } from "react-query";

import { DBFriends, DBPost } from "@/db/models";
import Post from "@/features/UserPosts/Post/Post";
import UserPosts from "@/features/UserPosts/UserPosts";
import { userState } from "@/store/User";

const PostsPage: FC = observer(() => {
  const { data: friendsIds } = useQuery({
    queryFn: async () => {
      try {
        const fetchedFriends = await axios.post<{ OK: boolean; friends: DBFriends[] }>((process.env.NEXT_PUBLIC_BACKEND_URL ?? "") + "/friends");
        if (fetchedFriends.data) {
          const allFriends = fetchedFriends.data.friends
            .filter(({ friendId, userId }) => [friendId, userId].includes(userState.info.id))
            .map(({ friendId, userId }) => friendId === userState.info.id ? userId : friendId);
          return allFriends;
        }
      }
      catch (e) {
        console.error(e);
      }
    },
    queryKey: [`postPageFriends${userState.info.id}`],
  })
  const { data: posts } = useQuery({
    queryFn: async () => {
      try {
        const fetchedPosts = await axios.post<{ OK: boolean, posts: DBPost[] }>((process.env.NEXT_PUBLIC_BACKEND_URL ?? "") + '/posts');
        if (fetchedPosts.data)
          return fetchedPosts.data.posts;
      }
      catch (e) {
        console.error(e);
        return [];
      }
    },
    queryKey: ['allPosts'],
  })
  return (
    <main className="w-full h-full sm:p-[100px] flex flex-col gap-4 justify-start items-center flex-grow">
      {(posts && posts.length !== 0 &&
        posts.filter((post) => {
          if (friendsIds) {
            return friendsIds.includes(post.ownerId)
          }
        })
          .sort((b, a) => (new Date(a.createdAt ?? Date.now())).getTime()
            - (new Date(b.createdAt ?? Date.now())).getTime())
          .length !== 0)
        ? <UserPosts posts={posts.filter((post) => {
          if (friendsIds) {
            return friendsIds.includes(post.ownerId)
          }
        })} />
        : (
          <div className="flex flex-grow justify-center items-center">
            <p className="">
              Your friends did not post anything yet
            </p>
          </div>)}
    </main>
  )
})

export default PostsPage;