import { FC } from "react"
import { UserPostsProps } from "./models"
import Post from "./Post/Post"

const UserPosts: FC<UserPostsProps> = ({ posts }) => {
  return (
    <ul className="flex flex-col gap-8 px-[300px] py-[50px] rounded-[10px] bg-slate-50">
      {posts
        .sort((b, a) => (new Date(a.createdAt ?? Date.now())).getTime()
          - (new Date(b.createdAt ?? Date.now())).getTime())
        .map((postProps) => (
          <li
            className="w-fit h-fit"
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