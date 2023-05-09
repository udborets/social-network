import { FC } from "react";
import { observer } from "mobx-react-lite";

import { UserItemProps } from "./models";

const UserItem: FC<UserItemProps> = observer(({ age, avatarUrl, city, email, id, name, posts, univ }) => {
  
  return (
    <div className="w-full max-w-[500px] bg-slate-300 rounded-[20px] p-5">
      {id}
      <button>
        
      </button>
    </div>
  )
})

export default UserItem