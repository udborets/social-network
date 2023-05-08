import { useLocalStorage } from "usehooks-ts";

import { DBUser } from "@/db/models";
import { userState } from "@/store/User";

export const useUserState = () => {
  const [localStorageUser, setLocalStorageUser] = useLocalStorage<DBUser>(
    "user",
    {
      age: null,
      avatarUrl: null,
      city: null,
      email: "",
      id: "",
      name: "",
      posts: [],
      univ: null,
    }
  );
  const setUser = (userInfo: DBUser) => {
    userState.setState(userInfo);
    setLocalStorageUser(userInfo);
  };
  return {
    localStorageUser,
    setUser,
  };
};
