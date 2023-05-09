import { FC } from "react";

import { useUserState } from "@/hooks/useUserState";
import { LogoutButtonProps } from "./models";

const LogoutButton: FC<LogoutButtonProps> = ({ className, fn }) => {
  const { setUser } = useUserState();
  return (
    <button
      onClick={() => {
        setUser({
          age: null, avatarUrl: null, city: null, email: '', id: '', name: '', posts: [], univ: null
        });
        if (fn) {
          fn();
        }
      }}
      className={`bg-red-600 hover:bg-red-800 active:bg-red-950 duration-300 transition-all text-white p-4 text-[1.2rem] rounded-[15px] ${className}`}
    >
      Logout
    </button>
  )
}

export default LogoutButton