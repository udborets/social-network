import axios from "axios";
import { FC } from "react";
import { useQuery } from "react-query";

import { DBPost } from "@/db/models";
import Post from "@/features/Post/Post";

const PostsPage: FC = () => {
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
  })
  return (
    <main className="w-full h-full flex flex-col gap-4 justify-start items-center">
      {(posts && posts.length !== 0) ? posts
        .sort((b, a) => (new Date(a.createdAt ?? Date.now())).getTime()
          - (new Date(b.createdAt ?? Date.now())).getTime())
        .map((postProps) => (
          <Post {...postProps} key={postProps.id} />
        ))
        : ''}
    </main>
  )
}

export default PostsPage;