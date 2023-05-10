import { FC } from "react";

import { UserPostsProps } from "./models";
import Post from "./Post/Post";

const UserPosts: FC<UserPostsProps> = ({ posts }) => {
  return (
    <ul className="flex flex-col gap-8 max-w-[700px] w-full rounded-[10px] bg-slate-50 p-[10px]">
      {posts
        .sort((b, a) => (new Date(a.createdAt ?? Date.now())).getTime()
          - (new Date(b.createdAt ?? Date.now())).getTime())
        .map((postProps) => (
          <li
            key={postProps.id}
          >
            <Post
              {...postProps}
            />
          </li>
        ))}
    </ul>
  )
}

export default UserPosts