import { DBPost } from "@/db/models";
import Post from "@/features/Posts/Post/Post";
import axios from "axios";
import { useQuery } from "react-query";

const PostsPage = () => {
  const { data: posts } = useQuery({
    queryFn: async () => {
      try {
        const fetchedPosts = await axios.post<{ OK: boolean, posts: DBPost[] }>((process.env.NEXT_PUBLIC_BACKEND_URL ?? "") + '/posts');
        if (fetchedPosts.data)
          return fetchedPosts.data.posts;
      }
      catch (e) {
        console.error(e);
      }
    }
  })
  return (
    <main className="w-full h-full flex flex-col gap-4">
      {posts ? posts.map((postProps) => (
        <Post {...postProps} key={postProps.id} />
      ))
        : ''}
    </main>
  )
}

export default PostsPage;