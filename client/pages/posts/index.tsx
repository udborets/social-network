import axios from "axios";
import { observer } from "mobx-react-lite";
import { FC } from "react";
import { useQuery } from "react-query";

import { DBFriends, DBPost } from "@/db/models";
import Post from "@/features/UserPosts/Post/Post";
import { userState } from "@/store/User";

const PostsPage: FC = observer(() => {
  const { data: friendsIds } = useQuery({
    queryFn: async () => {
      try {
        const fetchedFriends = await axios.post<{ OK: boolean; friends: DBFriends[] }>((process.env.NEXT_PUBLIC_BACKEND_URL ?? "") + "/friends");
        if (fetchedFriends.data) {
          const allFriends = fetchedFriends.data.friends
            .filter(({ friendId, userId }) => [friendId, userId].includes(userState.info.id))
            .map(({ friendId, userId }) => [friendId, userId]);
          const allIds: string[] = [];
          allFriends.forEach((idsArr) => allIds.push(...idsArr));
          return allIds;
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
    <main className="w-full h-full flex flex-col gap-4 justify-start items-center">
      {(posts && posts.length !== 0 && posts.filter((post) => {
        if (friendsIds) {
          if (friendsIds.includes(post.ownerId)) {
            return true;
          }
          return false;
        }
        return true;
      })
        .sort((b, a) => (new Date(a.createdAt ?? Date.now())).getTime()
          - (new Date(b.createdAt ?? Date.now())).getTime())
        .map((postProps) => (
          <Post {...postProps} key={postProps.id} />
        )).length !== 0)
        ? posts.filter((post) => {
          if (friendsIds) {
            if (friendsIds.includes(post.ownerId)) {
              return true;
            }
            return false;
          }
          return true;
        })
          .sort((b, a) => (new Date(a.createdAt ?? Date.now())).getTime()
            - (new Date(b.createdAt ?? Date.now())).getTime())
          .map((postProps) => (
            <Post {...postProps} key={postProps.id} />
          ))
        : `Your friends did not post anything yet`}
    </main>
  )
})

export default PostsPage;